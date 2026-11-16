import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { SortBar } from "@/components/shop/sort-bar";
import { Pagination } from "@/components/shop/pagination";
import { ProductCard } from "@/components/shop/product-card";
import { getFilterOptions, getShopProducts } from "@/lib/shop";
import { parseShopParams } from "@/lib/shop-params";
import { getSavedProductIds } from "@/lib/wishlist";

export const instant = false;

export const metadata = {
  title: "Shop All Products",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const filters = parseShopParams(sp);

  const [savedIds, { products, total, totalPages }, { categories, brands }] =
    await Promise.all([
      getSavedProductIds(),
      getShopProducts(filters),
      getFilterOptions(),
    ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">All Products</h1>
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <FilterSidebar categories={categories} brands={brands} />
        <div>
          <SortBar total={total} />
          {products.length === 0 ? (
            <p className="py-16 text-center text-[color:var(--color-muted)]">
              No products match your filters.
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
            basePath="/shop"
          />
        </div>
      </div>
    </div>
  );
}