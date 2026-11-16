"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function QuantitySelector({
  value,
  onChange,
  max = 10,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        type="button"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-8 text-center text-sm font-medium">{value}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        type="button"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}