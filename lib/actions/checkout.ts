"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { addressSchema, type AddressInput } from "@/lib/validators/checkout";
import { generateOrderNumber } from "@/lib/order-number";

type CartLine = { productId: string; quantity: number };

type PlaceOrderInput = {
  addressId: string;
  items: CartLine[];
  prescriptionId?: string | null;
  notes?: string;
};

type PlaceOrderResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

class OutOfStockError extends Error {}

function isUniqueViolation(e: unknown) {
  return (
    typeof e === "object" &&
    e !== null &&
    (e as { code?: unknown }).code === "P2002"
  );
}

export async function saveAddressAction(
  input: AddressInput
): Promise<
  { success: true; addressId: string } | { success: false; error: string }
> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const address = await prisma.address.create({
    data: {
      userId: session.id,
      label: parsed.data.label || null,
      line1: parsed.data.line1,
      line2: parsed.data.line2 || null,
      city: parsed.data.city,
      state: parsed.data.state,
      pincode: parsed.data.pincode,
      phone: parsed.data.phone,
    },
  });

  revalidatePath("/account/addresses");
  return { success: true, addressId: address.id };
}

export async function placeOrderAction(
  input: PlaceOrderInput
): Promise<PlaceOrderResult> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  if (!input.items.length) {
    return { success: false, error: "Your cart is empty" };
  }

  // 1. Validate address belongs to user
  const address = await prisma.address.findFirst({
    where: { id: input.addressId, userId: session.id },
  });
  if (!address) {
    return { success: false, error: "Invalid address" };
  }

  // 2. Fetch products from DB (never trust client prices)
  const productIds = input.items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  if (products.length !== productIds.length) {
    return { success: false, error: "Some items are no longer available" };
  }

  const productMap = new Map(products.map((p) => [p.id, p]));

  // 3. Validate stock, expiry and compute totals from DB
  let subtotal = 0;
  let hasRx = false;
  const orderItemsData: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[] = [];

  for (const line of input.items) {
    const product = productMap.get(line.productId);
    if (!product) {
      return { success: false, error: "Product not found" };
    }

    if (product.stock < line.quantity) {
      return {
        success: false,
        error: `Not enough stock for ${product.name}. Only ${product.stock} left.`,
      };
    }

    if (product.expiryDate) {
      const daysLeft = Math.floor(
        (product.expiryDate.getTime() - Date.now()) / 86_400_000
      );
      if (daysLeft < 0) {
        return {
          success: false,
          error: `${product.name} has expired and cannot be ordered.`,
        };
      }
      // Per-product warning window (defaults to 90 days in the schema).
      const alertDays = product.expiryAlertDays || 90;
      if (daysLeft < alertDays) {
        return {
          success: false,
          error: `${product.name} is expiring soon (${daysLeft} days left) and cannot be shipped. Please contact us.`,
        };
      }
    }

    if (product.requiresPrescription) hasRx = true;

    const price = Number(product.price);
    subtotal += price * line.quantity;
    orderItemsData.push({
      productId: product.id,
      name: product.name,
      price,
      quantity: line.quantity,
    });
  }

  // 4. Require prescription if any item needs one
  if (hasRx) {
    if (!input.prescriptionId) {
      return {
        success: false,
        error: "Prescription is required for one or more items",
      };
    }
    const rx = await prisma.prescription.findFirst({
      where: { id: input.prescriptionId, userId: session.id },
    });
    if (!rx) {
      return { success: false, error: "Invalid prescription" };
    }
  }

  // 5. Calculate tax, shipping, total
  const shipping = subtotal >= 499 ? 0 : 49;
  const tax = 0; // pharmacy GST handled at invoice stage; leave 0 for now
  const total = subtotal + shipping + tax;

  // 6. Create the order, decrement stock atomically and bump totalSold.
  //    Retries when the random order number collides with an existing one.
  let orderId: string | null = null;

  for (let attempt = 0; attempt < 3 && !orderId; attempt++) {
    try {
      const created = await prisma.$transaction(async (tx) => {
        for (const line of input.items) {
          const product = productMap.get(line.productId)!;
          const result = await tx.product.updateMany({
            where: { id: line.productId, stock: { gte: line.quantity } },
            data: {
              stock: { decrement: line.quantity },
              totalSold: { increment: line.quantity },
            },
          });
          if (result.count === 0) {
            throw new OutOfStockError(
              `Not enough stock for ${product.name}. Please update your cart.`
            );
          }
        }

        return tx.order.create({
          data: {
            orderNumber: generateOrderNumber(),
            userId: session.id,
            addressId: address.id,
            prescriptionId: hasRx ? input.prescriptionId : null,
            status: hasRx ? "PENDING_APPROVAL" : "PENDING",
            paymentStatus: "UNPAID",
            paymentMethod: "COD",
            subtotal,
            discount: 0,
            tax,
            shipping,
            total,
            notes: input.notes || null,
            items: {
              create: orderItemsData,
            },
          },
        });
      });

      orderId = created.id;
    } catch (e) {
      if (e instanceof OutOfStockError) {
        return { success: false, error: e.message };
      }
      if (isUniqueViolation(e)) continue;
      throw e;
    }
  }

  if (!orderId) {
    return {
      success: false,
      error: "Could not place the order right now. Please try again.",
    };
  }

  revalidatePath("/account/orders");
  revalidatePath("/admin/orders");
  revalidateTag("products", "max");
  return { success: true, orderId };
}
