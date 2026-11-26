import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import { CARD_SELECT } from "@/lib/product-select";

export async function searchProducts(q: string, limit = 40) {
  const term = q.trim();
  if (!term) return { products: [], total: 0 };

  const where = {
    isActive: true,
    OR: [
      { name: { contains: term, mode: "insensitive" as const } },
      { shortDescription: { contains: term, mode: "insensitive" as const } },
      { description: { contains: term, mode: "insensitive" as const } },
      { manufacturer: { contains: term, mode: "insensitive" as const } },
      { brand: { name: { contains: term, mode: "insensitive" as const } } },
      { category: { name: { contains: term, mode: "insensitive" as const } } },
    ],
  };

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ totalSold: "desc" }, { avgRating: "desc" }],
      take: limit,
      select: CARD_SELECT,
    }),
    prisma.product.count({ where }),
  ]);

  return { products: rows.map(serializeProduct), total };
}

export async function suggestProducts(q: string, limit = 5) {
  const term = q.trim();
  if (term.length < 2) return [];
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: term, mode: "insensitive" } },
        { brand: { name: { contains: term, mode: "insensitive" } } },
      ],
    },
    take: limit,
    select: { id: true, name: true, slug: true, images: true, price: true },
  });
  return rows.map((r) => ({ ...r, price: Number(r.price) }));
}
