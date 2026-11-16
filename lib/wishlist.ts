import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function getSavedProductIds(): Promise<Set<string>> {
    const session = await getSession();
    if (!session) return new Set();
    const rows = await prisma.wishlist.findMany({
        where: { userId: session.id },
        select: { productId: true },
    });
    return new Set(rows.map((r) => r.productId));
}