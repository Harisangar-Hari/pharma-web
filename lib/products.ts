import { prisma } from "@/lib/prisma";

const cardSelect = {
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
} as const;

type RawCard = {
  id: string;
  name: string;
  slug: string;
  price: unknown;
  mrp: unknown;
  images: string[];
  stock: number;
  requiresPrescription: boolean;
  avgRating: number;
  reviewCount: number;
};

function serialize(p: RawCard) {
  return {
    ...p,
    price: Number(p.price),
    mrp: Number(p.mrp),
  };
}

export async function getNewArrivals(limit = 8) {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: cardSelect,
  });
  return rows.map(serialize);
}

export async function getBestSelling(limit = 8) {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { totalSold: "desc" },
    take: limit,
    select: cardSelect,
  });
  return rows.map(serialize);
}

export async function getTopRated(limit = 8) {
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: [{ avgRating: "desc" }, { reviewCount: "desc" }],
    take: limit,
    select: cardSelect,
  });
  return rows.map(serialize);
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    select: { id: true, name: true, slug: true, image: true, description: true },
  });
}