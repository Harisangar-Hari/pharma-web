import Link from "next/link";
import { Heart } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/shop/product-card";
import { serializeProduct } from "@/lib/serialize";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Wishlist" };
export const instant = false;
export default async function WishlistPage() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Heart className="mx-auto mb-3 h-10 w-10 text-[color:var(--color-muted)]" />
        <h1 className="text-xl font-semibold">Save your favourites</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Log in to keep track of products you love.
        </p>
        <Link href="/login?redirect=/wishlist" className="mt-4 inline-block">
          <Button>Log in</Button>
        </Link>
      </div>
    );
  }

  const rows = await prisma.wishlist.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: {
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
        },
      },
    },
  });

  if (rows.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Heart className="mx-auto mb-3 h-10 w-10 text-[color:var(--color-muted)]" />
        <h1 className="text-xl font-semibold">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Tap the heart on any product to save it for later.
        </p>
        <Link href="/shop" className="mt-4 inline-block">
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">My Wishlist</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {rows.map(({ product }) => (
          <ProductCard
            key={product.id}
            product={serializeProduct(product)}
            isSaved
          />
        ))}
      </div>
    </div>
  );
}