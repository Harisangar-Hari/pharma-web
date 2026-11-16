"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { toggleProductActiveAction } from "@/lib/actions/admin";

export function ProductRowActions({
  productId,
  isActive,
}: {
  productId: string;
  isActive: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    const r = await toggleProductActiveAction(productId);
    setLoading(false);
    if (r.success) {
      toast.success(isActive ? "Product hidden" : "Product activated");
      router.refresh();
    } else toast.error(r.error);
  };

  return (
    <div className="flex justify-end gap-2 text-xs">
      <Link
        href={`/admin/products/${productId}`}
        className="text-[color:var(--color-primary)] hover:underline"
      >
        Edit
      </Link>
      <button
        onClick={toggle}
        disabled={loading}
        className="text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
      >
        {isActive ? "Hide" : "Show"}
      </button>
    </div>
  );
}