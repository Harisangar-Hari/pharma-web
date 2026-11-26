import type { Prisma } from "@/prisma/generated/prisma/client";

/** Fields needed to render a product card, shared by every catalog query. */
export const CARD_SELECT = {
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
} satisfies Prisma.ProductSelect;
