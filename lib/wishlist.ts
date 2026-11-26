import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

/** Cached per request so every product section shares one query. */
export const getSavedProductIds = cache(async (): Promise<Set<string>> => {
  const session = await getSession();
  if (!session) return new Set();
  const rows = await prisma.wishlist.findMany({
    where: { userId: session.id },
    select: { productId: true },
  });
  return new Set(rows.map((r) => r.productId));
});
