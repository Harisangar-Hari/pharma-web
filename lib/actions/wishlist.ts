"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function toggleWishlistAction(
    productId: string
): Promise<{ success: true; added: boolean } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: "Please log in to save items" };

    const existing = await prisma.wishlist.findUnique({
        where: { userId_productId: { userId: session.id, productId } },
    });

    if (existing) {
        await prisma.wishlist.delete({ where: { id: existing.id } });
        revalidatePath("/wishlist");
        return { success: true, added: false };
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return { success: false, error: "Product not found" };

    await prisma.wishlist.create({
        data: { userId: session.id, productId },
    });
    revalidatePath("/wishlist");
    return { success: true, added: true };
}

export async function removeFromWishlistAction(
    productId: string
): Promise<{ success: true } | { success: false; error: string }> {
    const session = await getSession();
    if (!session) return { success: false, error: "Not authenticated" };

    await prisma.wishlist.deleteMany({
        where: { userId: session.id, productId },
    });
    revalidatePath("/wishlist");
    return { success: true };
}