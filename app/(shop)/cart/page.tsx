"use client";

import Link from "next/link";
import Image from "next/image";
import { Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/shop/quantity-selector";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/lib/use-hydrated";

export default function CartPage() {
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);

  // Avoid hydration mismatch — Zustand persist reads localStorage on client only
  if (!hydrated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h1 className="mb-6 text-2xl font-bold">Your Cart</h1>
        <div className="h-64 animate-pulse rounded-lg bg-[color:var(--color-surface)]" />
      </div>
    );
  }

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center">
        <ShoppingBag className="mb-4 h-12 w-12 text-[color:var(--color-muted)]" />
        <h1 className="text-xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-[color:var(--color-muted)]">
          Browse our products and add something you like.
        </p>
        <Link href="/shop" className="mt-6">
          <Button>Start shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          Your Cart{" "}
          <span className="text-sm font-normal text-[color:var(--color-muted)]">
            ({itemCount} items)
          </span>
        </h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          Clear cart
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_340px]">
        {/* Line items */}
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.productId}
              className="flex gap-4 rounded-lg border border-[color:var(--color-border)] p-3"
            >
              <Link
                href={`/product/${item.slug}`}
                className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-[color:var(--color-surface)]"
              >
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link
                    href={`/product/${item.slug}`}
                    className="line-clamp-2 text-sm font-medium hover:text-[color:var(--color-primary)]"
                  >
                    {item.name}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-[color:var(--color-muted)] hover:text-[color:var(--color-danger)]"
                    onClick={() => removeItem(item.productId)}
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="mt-auto flex items-center justify-between pt-2">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.productId, q)}
                    max={10}
                  />
                  <div className="text-right">
                    <p className="text-sm font-bold">
                      (Rs){(item.price * item.quantity).toFixed(0)}
                    </p>
                    <p className="text-xs text-[color:var(--color-muted)]">
                      {item.price.toFixed(0)} each
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* Summary */}
        <aside className="h-fit rounded-lg border border-[color:var(--color-border)] p-4">
          <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-[color:var(--color-muted)]">Subtotal</dt>
              <dd>(Rs){subtotal.toFixed(0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[color:var(--color-muted)]">Shipping</dt>
              <dd className="text-[color:var(--color-primary)]">
                {subtotal >= 499 ? "Free" : "(Rs)49"}
              </dd>
            </div>
            <div className="flex justify-between border-t border-[color:var(--color-border)] pt-2 text-base font-bold">
              <dt>Total</dt>
              <dd>(Rs){(subtotal + (subtotal >= 499 ? 0 : 49)).toFixed(0)}</dd>
            </div>
          </dl>

          <Link href="/checkout" className="mt-4 block">
            <Button className="w-full" size="lg">
              Proceed to checkout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <Link href="/shop" className="mt-2 block">
            <Button variant="outline" className="w-full">
              Continue shopping
            </Button>
          </Link>

          {subtotal < 499 && (
            <p className="mt-3 text-xs text-[color:var(--color-muted)]">
              Add (Rs){(499 - subtotal).toFixed(0)} more for free delivery.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
