import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serialize";
import { CARD_SELECT } from "@/lib/product-select";
import type { ShopFilters } from "./shop-params";
import { Prisma } from "../prisma/generated/prisma/client";

export const PAGE_SIZE = 12;

export const getShopProducts = unstable_cache(
  async (filters: ShopFilters) => {
    const where: Prisma.ProductWhereInput = { isActive: true };

    if (filters.categories.length) {
      where.category = { slug: { in: filters.categories } };
    }
    if (filters.brands.length) {
      where.brand = { slug: { in: filters.brands } };
    }
    if (filters.minPrice != null || filters.maxPrice != null) {
      where.price = {};
      if (filters.minPrice != null) where.price.gte = filters.minPrice;
      if (filters.maxPrice != null) where.price.lte = filters.maxPrice;
    }
    if (filters.minRating != null) {
      where.avgRating = { gte: filters.minRating };
    }
    if (filters.inStock) {
      where.stock = { gt: 0 };
    }
    if (filters.rxFree) {
      where.requiresPrescription = false;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput[] = (() => {
      switch (filters.sort) {
        case "price-asc": return [{ price: "asc" }];
        case "price-desc": return [{ price: "desc" }];
        case "rating": return [{ avgRating: "desc" }, { reviewCount: "desc" }];
        case "best-selling": return [{ totalSold: "desc" }];
        default: return [{ createdAt: "desc" }];
      }
    })();

    const skip = (filters.page - 1) * PAGE_SIZE;

    const [rows, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: PAGE_SIZE,
        select: CARD_SELECT,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products: rows.map(serializeProduct),
      total,
      totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
    };
  },
  ["shop-products"],
  { revalidate: 60, tags: ["products"] }
);

export const getFilterOptions = unstable_cache(
  async () => {
    const [categories, brands] = await Promise.all([
      prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
        select: { id: true, name: true, slug: true },
      }),
      prisma.brand.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, slug: true },
      }),
    ]);
    return { categories, brands };
  },
  ["filter-options"],
  { revalidate: 300, tags: ["categories"] }
);
