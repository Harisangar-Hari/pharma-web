import Link from "next/link";
import { ProductCard } from "@/components/shop/product-card";
import { SearchBox } from "@/components/shop/search-box";
import { searchProducts } from "@/lib/search";
import { getSavedProductIds } from "@/lib/wishlist";

export const metadata = { title: "Search" };


export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const sp = await searchParams;
    const q = sp.q?.trim() ?? "";

    const [{ products, total }, savedIds] = await Promise.all([
        q ? searchProducts(q) : Promise.resolve({ products: [], total: 0 }),
        getSavedProductIds(),
    ]);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8">
            <h1 className="mb-4 text-2xl font-bold">Search</h1>

            <div className="mb-6 max-w-xl">
                <SearchBox defaultValue={q} autoFocus />
            </div>

            {!q ? (
                <p className="text-sm text-[color:var(--color-muted)]">
                    Type a product name, brand, or category to start searching.
                </p>
            ) : products.length === 0 ? (
                <div className="rounded-lg border border-[color:var(--color-border)] p-10 text-center">
                    <p className="text-sm text-[color:var(--color-muted)]">
                        No results for <strong>&quot;{q}&quot;</strong>.
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--color-muted)]">
                        Try a different spelling or browse{" "}
                        <Link href="/shop" className="text-[color:var(--color-primary)] hover:underline">
                            all products
                        </Link>
                        .
                    </p>
                </div>
            ) : (
                <>
                    <p className="mb-4 text-sm text-[color:var(--color-muted)]">
                        {total} {total === 1 ? "result" : "results"} for{" "}
                        <strong>&quot;{q}&quot;</strong>
                    </p>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((p) => (
                            <ProductCard key={p.id} product={p} isSaved={savedIds.has(p.id)} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}