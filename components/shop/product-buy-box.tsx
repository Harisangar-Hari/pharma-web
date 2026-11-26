"use client";

import { useState } from "react";
import { ShoppingCart, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "./quantity-selector";
import { WishlistButton } from "./wishlist-button";
import { useCartStore } from "@/stores/cart-store";
import { daysUntil } from "@/lib/expiry";

export function ProductBuyBox({
  product,
  isSaved,
}: {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    images: string[];
    requiresPrescription: boolean;
    expiryDate: Date | string | null;
    expiryAlertDays?: number;
  };
  isSaved: boolean;
}) {
  const [qty, setQty] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 10;

  const daysLeft = daysUntil(product.expiryDate);
  const alertDays = product.expiryAlertDays ?? 90;

  const expiryBadge =
    daysLeft === null ? null : daysLeft < 0 ? (
      <span className="text-sm font-medium text-[color:var(--color-danger)]">
        Expired — do not use
      </span>
    ) : daysLeft < alertDays ? (
      <span className="text-sm font-medium text-[color:var(--color-warning)]">
        Expires in {daysLeft} days
      </span>
    ) : null;

  return (
    <div className="space-y-4">
      {product.requiresPrescription && (
        <div className="flex items-start gap-2 rounded-md border border-[color:var(--color-warning)] bg-yellow-50 p-3 text-sm">
          <ShieldCheck className="mt-0.5 h-4 w-4 text-[color:var(--color-warning)]" />
          <p>
            <strong>Prescription required.</strong> You&apos;ll need to upload a
            valid prescription during checkout before this item can be shipped.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 text-sm">
        {outOfStock ? (
          <span className="font-medium text-[color:var(--color-danger)]">
            Out of stock
          </span>
        ) : lowStock ? (
          <span className="font-medium text-[color:var(--color-warning)]">
            Only {product.stock} left in stock
          </span>
        ) : (
          <span className="font-medium text-[color:var(--color-primary)]">
            In stock
          </span>
        )}
        {expiryBadge}
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity</span>
        <QuantitySelector
          value={qty}
          onChange={setQty}
          max={Math.min(10, product.stock)}
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={outOfStock}
          onClick={() => {
            addItem(
              {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                image: product.images[0] ?? "",
              },
              qty
            );
            toast.success(`${product.name} × ${qty} added to cart`);
            setQty(1);
          }}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
        <WishlistButton
          productId={product.id}
          initialSaved={isSaved}
          variant="full"
        />
      </div>
    </div>
  );
}
