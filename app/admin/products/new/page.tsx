import { requireAdmin } from "@/lib/auth-admin";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
export const instant = false;
export default async function NewProductPage() {
  await requireAdmin();

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.brand.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Product</h1>
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}