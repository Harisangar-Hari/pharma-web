"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";

export function AddToCartButton({
  product,
  disabled,
}: {
  product: {
    productId: string;
    name: string;
    slug: string;
    price: number;
    image: string;
  };
  disabled?: boolean;
}) {
  const addItem = useCartStore((s) => s.addItem);

  if (disabled) {
    return (
      <Button variant="outline" size="sm" className="w-full" disabled>
        Out of stock
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      className="w-full"
      onClick={() => {
        addItem(product);
        toast.success(`${product.name} added to cart`);
      }}
    >
      <ShoppingCart className="mr-1 h-4 w-4" />
      Add to cart
    </Button>
  );
}