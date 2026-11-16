"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
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

const SHORT_DATED_DAYS = 90;

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

    // Stock check
    if (product.stock < line.quantity) {
      return {
        success: false,
        error: `Not enough stock for ${product.name}. Only ${product.stock} left.`,
      };
    }

    // Expiry check
    if (product.expiryDate) {
      const daysLeft = Math.floor(
        (product.expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (daysLeft < 0) {
        return {
          success: false,
          error: `${product.name} has expired and cannot be ordered.`,
        };
      }
      if (daysLeft < SHORT_DATED_DAYS) {
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

  // 6. Create order + items + decrement stock + bump totalSold, in a transaction
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        userId: session.id,
        addressId: address.id,
        prescriptionId: hasRx ? input.prescriptionId : null,
        status: hasRx ? "PENDING_APPROVAL" : "PENDING",
        paymentStatus: "UNPAID",
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

    for (const line of input.items) {
      await tx.product.update({
        where: { id: line.productId },
        data: {
          stock: { decrement: line.quantity },
          totalSold: { increment: line.quantity },
        },
      });
    }

    return created;
  });

  revalidatePath("/account/orders");
  return { success: true, orderId: order.id };
}