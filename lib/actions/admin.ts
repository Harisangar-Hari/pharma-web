"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStaff, requireAdmin } from "@/lib/auth-admin";
import { productSchema, type ProductInput } from "@/lib/validators/admin";
import { ORDER_TRANSITIONS } from "@/lib/order-transitions";
import type { OrderStatus } from "@/prisma/generated/prisma/client";

export async function approvePrescriptionAction(
  prescriptionId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await requireStaff();

  const rx = await prisma.prescription.findUnique({
    where: { id: prescriptionId },
  });
  if (!rx) return { success: false, error: "Prescription not found" };

  await prisma.prescription.update({
    where: { id: prescriptionId },
    data: {
      status: "APPROVED",
      reviewedById: session.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.order.updateMany({
    where: { prescriptionId, status: "PENDING_APPROVAL" },
    data: { status: "CONFIRMED" },
  });

  revalidatePath("/admin/prescriptions");
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function rejectPrescriptionAction(
  prescriptionId: string,
  note: string
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await requireStaff();
  if (!note.trim())
    return { success: false, error: "Rejection reason is required" };

  const rx = await prisma.prescription.findUnique({
    where: { id: prescriptionId },
  });
  if (!rx) return { success: false, error: "Prescription not found" };

  await prisma.prescription.update({
    where: { id: prescriptionId },
    data: {
      status: "REJECTED",
      pharmacistNote: note.trim(),
      reviewedById: session.id,
      reviewedAt: new Date(),
    },
  });

  await prisma.order.updateMany({
    where: { prescriptionId, status: "PENDING_APPROVAL" },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/admin/prescriptions");
  revalidatePath("/admin/orders");
  return { success: true };
}

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: string
): Promise<{ success: true } | { success: false; error: string }> {
  await requireStaff();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { success: false, error: "Order not found" };

  const allowed = ORDER_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(newStatus)) {
    return {
      success: false,
      error: `Cannot move from ${order.status} to ${newStatus}`,
    };
  }

  const statusEnum = newStatus as OrderStatus;

  if (newStatus === "CANCELLED") {
    const items = await prisma.orderItem.findMany({ where: { orderId } });
    await prisma.$transaction(async (tx) => {
      for (const it of items) {
        await tx.product.update({
          where: { id: it.productId },
          data: {
            stock: { increment: it.quantity },
            totalSold: { decrement: it.quantity },
          },
        });
      }
      await tx.order.update({
        where: { id: orderId },
        data: { status: statusEnum },
      });
    });
  } else {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: statusEnum },
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return { success: true };
}

export async function createProductAction(
  input: ProductInput
): Promise<
  { success: true; productId: string } | { success: false; error: string }
> {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  try {
    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        sku: parsed.data.sku,
        shortDescription: parsed.data.shortDescription || null,
        description: parsed.data.description || null,
        ingredients: parsed.data.ingredients || null,
        dosage: parsed.data.dosage || null,
        manufacturer: parsed.data.manufacturer || null,
        costPrice: parsed.data.costPrice,
        price: parsed.data.price,
        mrp: parsed.data.mrp,
        stock: parsed.data.stock,
        categoryId: parsed.data.categoryId,
        brandId: parsed.data.brandId || null,
        requiresPrescription: parsed.data.requiresPrescription,
        isActive: parsed.data.isActive,
        images: parsed.data.images,
        expiryDate: parsed.data.expiryDate
          ? new Date(parsed.data.expiryDate)
          : null,
        expiryAlertDays: parsed.data.expiryAlertDays,
        batchNumber: parsed.data.batchNumber || null,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true, productId: product.id };
  } catch (e: any) {
    if (e.code === "P2002")
      return { success: false, error: "Slug or SKU already exists" };
    return { success: false, error: "Failed to create product" };
  }
}

export async function updateProductAction(
  productId: string,
  input: ProductInput
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success)
    return { success: false, error: parsed.error.issues[0].message };

  try {
    await prisma.product.update({
      where: { id: productId },
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug,
        sku: parsed.data.sku,
        shortDescription: parsed.data.shortDescription || null,
        description: parsed.data.description || null,
        ingredients: parsed.data.ingredients || null,
        dosage: parsed.data.dosage || null,
        manufacturer: parsed.data.manufacturer || null,
        costPrice: parsed.data.costPrice,
        price: parsed.data.price,
        mrp: parsed.data.mrp,
        stock: parsed.data.stock,
        categoryId: parsed.data.categoryId,
        brandId: parsed.data.brandId || null,
        requiresPrescription: parsed.data.requiresPrescription,
        isActive: parsed.data.isActive,
        images: parsed.data.images,
        expiryDate: parsed.data.expiryDate
          ? new Date(parsed.data.expiryDate)
          : null,
        expiryAlertDays: parsed.data.expiryAlertDays,
        batchNumber: parsed.data.batchNumber || null,
      },
    });
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (e: any) {
    if (e.code === "P2002")
      return { success: false, error: "Slug or SKU already exists" };
    return { success: false, error: "Failed to update product" };
  }
}

export async function toggleProductActiveAction(
  productId: string
): Promise<{ success: true } | { success: false; error: string }> {
  await requireAdmin();
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (!product) return { success: false, error: "Product not found" };
  await prisma.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  });
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { success: true };
}