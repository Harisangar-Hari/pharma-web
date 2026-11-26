import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import { CARD_SELECT } from "@/lib/product-select";

export const getNewArrivals = unstable_cache(
  async (limit = 8) => {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: CARD_SELECT,
    });
    return rows.map(serializeProduct);
  },
  ["new-arrivals"],
  { revalidate: 60, tags: ["products"] }
);

export const getBestSelling = unstable_cache(
  async (limit = 8) => {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { totalSold: "desc" },
      take: limit,
      select: CARD_SELECT,
    });
    return rows.map(serializeProduct);
  },
  ["best-selling"],
  { revalidate: 60, tags: ["products"] }
);

export const getTopRated = unstable_cache(
  async (limit = 8) => {
    const rows = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ avgRating: "desc" }, { reviewCount: "desc" }],
      take: limit,
      select: CARD_SELECT,
    });
    return rows.map(serializeProduct);
  },
  ["top-rated"],
  { revalidate: 60, tags: ["products"] }
);

export const getCategoryBySlug = unstable_cache(
  async (slug: string) =>
    prisma.category.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true, description: true, image: true },
    }),
  ["category-by-slug"],
  { revalidate: 300, tags: ["categories"] }
);

export const getCategories = unstable_cache(
  async () =>
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true, image: true, description: true },
    }),
  ["categories"],
  { revalidate: 300, tags: ["categories"] }
);
