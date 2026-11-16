export type ShopFilters = {
    categories: string[];
    brands: string[];
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    inStock: boolean;
    rxFree: boolean;
    sort: "newest" | "price-asc" | "price-desc" | "rating" | "best-selling";
    page: number;
};

const SORTS = ["newest", "price-asc", "price-desc", "rating", "best-selling"] as const;

export function parseShopParams(
    searchParams: Record<string, string | string[] | undefined>
): ShopFilters {
    const toArray = (v: string | string[] | undefined): string[] =>
        v == null ? [] : Array.isArray(v) ? v : v.split(",").filter(Boolean);

    const num = (v: string | string[] | undefined): number | undefined => {
        const s = Array.isArray(v) ? v[0] : v;
        if (s == null || s === "") return undefined;
        const n = Number(s);
        return Number.isFinite(n) ? n : undefined;
    };

    const sortRaw = Array.isArray(searchParams.sort)
        ? searchParams.sort[0]
        : searchParams.sort;
    const sort = (SORTS as readonly string[]).includes(sortRaw ?? "")
        ? (sortRaw as ShopFilters["sort"])
        : "newest";

    return {
        categories: toArray(searchParams.category),
        brands: toArray(searchParams.brand),
        minPrice: num(searchParams.min),
        maxPrice: num(searchParams.max),
        minRating: num(searchParams.rating),
        inStock: searchParams.stock === "1",
        rxFree: searchParams.rxfree === "1",
        sort,
        page: Math.max(1, num(searchParams.page) ?? 1),
    };
}