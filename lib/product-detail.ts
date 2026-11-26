import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import { CARD_SELECT } from "@/lib/product-select";

export const getProductBySlug = unstable_cache(
  async (slug: string) => {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: { select: { name: true, slug: true } },
        category: { select: { name: true, slug: true } },
        reviews: {
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    if (!product || !product.isActive) return null;

    return {
      ...serializeProduct(product),
      categoryId: product.categoryId,
      description: product.description,
      shortDescription: product.shortDescription,
      ingredients: product.ingredients,
      dosage: product.dosage,
      manufacturer: product.manufacturer,
      expiryDate: product.expiryDate,
      expiryAlertDays: product.expiryAlertDays,
      batchNumber: product.batchNumber,
      sku: product.sku,
      totalSold: product.totalSold,
      brand: product.brand,
      category: product.category,
      reviews: product.reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        title: r.title,
        body: r.body,
        isVerified: r.isVerified,
        createdAt: r.createdAt.toISOString(),
        userName: r.user.name,
      })),
    };
  },
  ["product-by-slug"],
  { revalidate: 60, tags: ["products"] }
);

export const getRelatedProducts = unstable_cache(
  async (productId: string, categoryId: string, limit = 4) => {
    const rows = await prisma.product.findMany({
      where: {
        isActive: true,
        categoryId,
        id: { not: productId },
      },
      orderBy: [{ avgRating: "desc" }, { totalSold: "desc" }],
      take: limit,
      select: CARD_SELECT,
    });
    return rows.map(serializeProduct);
  },
  ["related-products"],
  { revalidate: 60, tags: ["products"] }
);
