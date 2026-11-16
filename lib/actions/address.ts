"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function deleteAddressAction(
  addressId: string
): Promise<{ success: true } | { success: false; error: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Not authenticated" };

  const address = await prisma.address.findFirst({
    where: { id: addressId, userId: session.id },
  });
  if (!address) return { success: false, error: "Address not found" };

  // Prevent deletion if referenced by an order — Prisma will throw due to FK
  const orderCount = await prisma.order.count({ where: { addressId } });
  if (orderCount > 0) {
    return {
      success: false,
      error: "This address is linked to past orders and cannot be deleted",
    };
  }

  await prisma.address.delete({ where: { id: addressId } });
  return { success: true };
}