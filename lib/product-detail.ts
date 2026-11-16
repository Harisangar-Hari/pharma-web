import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";

export async function getProductBySlug(slug: string) {
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
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit = 4
) {
  const rows = await prisma.product.findMany({
    where: {
      isActive: true,
      categoryId,
      id: { not: productId },
    },
    orderBy: [{ avgRating: "desc" }, { totalSold: "desc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      mrp: true,
      images: true,
      stock: true,
      requiresPrescription: true,
      avgRating: true,
      reviewCount: true,
    },
  });
  return rows.map(serializeProduct);
}