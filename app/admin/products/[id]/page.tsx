import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth-admin";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
export const instant = false;
export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const [product, categories, brands] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <ProductForm
        productId={product.id}
        categories={categories}
        brands={brands}
        initialImages={product.images}
        initial={{
          name: product.name,
          slug: product.slug,
          sku: product.sku,
          shortDescription: product.shortDescription ?? "",
          description: product.description ?? "",
          ingredients: product.ingredients ?? "",
          dosage: product.dosage ?? "",
          manufacturer: product.manufacturer ?? "",
          costPrice: Number(product.costPrice),
          price: Number(product.price),
          mrp: Number(product.mrp),
          stock: product.stock,
          categoryId: product.categoryId,
          brandId: product.brandId ?? "",
          requiresPrescription: product.requiresPrescription,
          isActive: product.isActive,
          images: product.images,
          expiryDate: product.expiryDate
            ? product.expiryDate.toISOString().split("T")[0]
            : "",
          expiryAlertDays: product.expiryAlertDays,
          batchNumber: product.batchNumber ?? "",
        }}
      />
    </div>
  );
}