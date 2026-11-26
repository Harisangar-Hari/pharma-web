"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional().or(z.literal("")),
  body: z.string().min(5, "Review is too short").max(2000),
});

export async function submitReviewAction(input: {
  productId: string;
  rating: number;
  title: string;
  body: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  const session = await getSession();
  if (!session) return { success: false, error: "Please log in to write a review" };

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  const { productId, rating, title, body } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { slug: true },
  });
  if (!product) return { success: false, error: "Product not found" };

  // A purchase makes the review "verified"; anyone signed in may review once.
  const purchased = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId: session.id, status: "DELIVERED" },
    },
  });

  const existing = await prisma.review.findUnique({
    where: { productId_userId: { productId, userId: session.id } },
  });

  if (existing) {
    return { success: false, error: "You've already reviewed this product" };
  }

  await prisma.$transaction(async (tx) => {
    await tx.review.create({
      data: {
        productId,
        userId: session.id,
        rating,
        title: title || null,
        body,
        isVerified: Boolean(purchased),
      },
    });

    // Recompute product aggregates in the same transaction.
    const agg = await tx.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: true,
    });

    await tx.product.update({
      where: { id: productId },
      data: {
        avgRating: agg._avg.rating ?? 0,
        reviewCount: agg._count,
      },
    });
  });

  revalidatePath(`/product/${product.slug}`);
  revalidateTag("products", "max");
  return { success: true };
}

export async function canReviewProduct(productId: string): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const [purchased, existing] = await Promise.all([
    prisma.orderItem.findFirst({
      where: {
        productId,
        order: { userId: session.id, status: "DELIVERED" },
      },
    }),
    prisma.review.findUnique({
      where: { productId_userId: { productId, userId: session.id } },
    }),
  ]);

  return Boolean(purchased) && !existing;
}
