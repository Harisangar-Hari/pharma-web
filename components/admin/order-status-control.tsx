"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateOrderStatusAction } from "@/lib/actions/admin";
import { ORDER_TRANSITIONS } from "@/lib/order-transitions";

export function OrderStatusControl({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const options = ORDER_TRANSITIONS[currentStatus] ?? [];

  if (options.length === 0) {
    return (
      <span className="text-xs text-[color:var(--color-muted)]">No actions available</span>
    );
  }

  const update = async (status: string) => {
    setLoading(true);
    const r = await updateOrderStatusAction(orderId, status);
    setLoading(false);
    if (r.success) {
      toast.success(`Order marked as ${status}`);
      router.refresh();
    } else {
      toast.error(r.error);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((status) => (
        <Button
          key={status}
          size="sm"
          variant={status === "CANCELLED" ? "outline" : "default"}
          onClick={() => update(status)}
          disabled={loading}
        >
          Mark {status.toLowerCase()}
        </Button>
      ))}
    </div>
  );
}