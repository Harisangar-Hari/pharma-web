import { notFound } from "next/navigation";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { SortBar } from "@/components/shop/sort-bar";
import { Pagination } from "@/components/shop/pagination";
import { ProductCard } from "@/components/shop/product-card";
import { getFilterOptions, getShopProducts } from "@/lib/shop";
import { parseShopParams } from "@/lib/shop-params";
import { getSavedProductIds } from "@/lib/wishlist";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const instant = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "Category Not Found" };
  return {
    title: category.name,
    description:
      category.description ??
      `Shop ${category.name} products at PharmaCare.`,
    alternates: { canonical: `/shop/${slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { category: categorySlug } = await params;
  const sp = await searchParams;

  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
  });
  if (!category) notFound();

  const filters = parseShopParams(sp);
  filters.categories = [categorySlug];

  const [savedIds, { products, total, totalPages }, { categories, brands }] =
    await Promise.all([
      getSavedProductIds(),
      getShopProducts(filters),
      getFilterOptions(),
    ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">{category.name}</h1>
      {category.description && (
        <p className="mb-6 text-sm text-[color:var(--color-muted)]">
          {category.description}
        </p>
      )}
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <FilterSidebar
          categories={categories}
          brands={brands}
          lockedCategory={categorySlug}
        />
        <div>
          <SortBar total={total} />
          {products.length === 0 ? (
            <p className="py-16 text-center text-[color:var(--color-muted)]">
              No products in this category.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} isSaved={savedIds.has(p.id)} />
              ))}
            </div>
          )}
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            basePath={`/shop/${categorySlug}`}
          />
        </div>
      </div>
    </div>
  );
}