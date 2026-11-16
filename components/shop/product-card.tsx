import Link from "next/link";
import { Star } from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";
import { WishlistButton } from "./wishlist-button";
import type { SerializedProduct } from "@/lib/serialize";

export function ProductCard({
  product,
  isSaved = false,
}: {
  product: SerializedProduct;
  isSaved?: boolean;
}) {
  const price = product.price;
  const mrp = product.mrp;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white transition duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <WishlistButton productId={product.id} initialSaved={isSaved} />

      <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
        {discount > 0 && (
          <span className="rounded bg-[color:var(--color-danger)] px-1.5 py-0.5 text-[10px] font-bold text-white">
            {discount}% OFF
          </span>
        )}
        {product.requiresPrescription && (
          <span className="rounded bg-[color:var(--color-warning)] px-1.5 py-0.5 text-[10px] font-bold text-white">
            Rx
          </span>
        )}
      </div>

      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square bg-[color:var(--color-surface)]">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 text-sm font-medium hover:text-[color:var(--color-primary)]">
            {product.name}
          </h3>
        </Link>

        <div className="mt-1 flex items-center gap-1 text-xs text-[color:var(--color-muted)]">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span>{product.avgRating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-[color:var(--color-foreground)]">
              (Rs){price.toFixed(0)}
            </span>
            {discount > 0 && (
              <span className="text-xs text-[color:var(--color-muted)] line-through">
                (Rs){mrp.toFixed(0)}
              </span>
            )}
          </div>
        </div>

        <div className="mt-2">
          <AddToCartButton
            product={{
              productId: product.id,
              name: product.name,
              slug: product.slug,
              price,
              image: product.images[0] ?? "",
            }}
            disabled={product.stock <= 0}
          />
        </div>
      </div>
    </div>
  );
}