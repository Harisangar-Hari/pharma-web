"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleWishlistAction } from "@/lib/actions/wishlist";

export function WishlistButton({
  productId,
  initialSaved,
  variant = "icon",
}: {
  productId: string;
  initialSaved: boolean;
  variant?: "icon" | "full";
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    setLoading(true);
    const r = await toggleWishlistAction(productId);
    setLoading(false);
    if (!r.success) {
      toast.error(r.error);
      if (r.error.includes("log in")) {
        router.push(`/login?redirect=/product`);
      }
      return;
    }
    setSaved(r.added);
    toast.success(r.added ? "Saved to wishlist" : "Removed from wishlist");
    router.refresh();
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="flex h-11 flex-1 items-center justify-center gap-2 rounded-md border border-[color:var(--color-border)] text-sm font-medium hover:bg-[color:var(--color-surface)] disabled:opacity-50 sm:flex-none sm:px-4"
      >
        <Heart className={`h-5 w-5 ${saved ? "fill-red-500 text-red-500" : ""}`} />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white disabled:opacity-50"
    >
      <Heart className={`h-4 w-4 ${saved ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
    </button>
  );
}