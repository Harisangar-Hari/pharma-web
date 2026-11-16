"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveAddressAction } from "@/lib/actions/checkout";

export function AddressForm({
  onSaved,
  onCancel,
}: {
  onSaved: (addressId: string) => void;
  onCancel?: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (formData: FormData) => {
    setLoading(true);
    setError(null);
    const result = await saveAddressAction({
      label: (formData.get("label") as string) || "",
      line1: formData.get("line1") as string,
      line2: (formData.get("line2") as string) || "",
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      phone: formData.get("phone") as string,
    });
    setLoading(false);
    if (result.success) {
      onSaved(result.addressId);
    } else {
      setError(result.error);
    }
  };

  return (
    <form action={onSubmit} className="space-y-3 rounded-lg border border-[color:var(--color-border)] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-medium">Label (optional)</label>
          <Input name="label" placeholder="Home / Office" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Phone</label>
          <Input name="phone" required placeholder="+91 98765 43210" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Address line 1</label>
        <Input name="line1" required placeholder="House / Flat / Street" />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Address line 2</label>
        <Input name="line2" placeholder="Landmark, area (optional)" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium">City</label>
          <Input name="city" required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">State</label>
          <Input name="state" required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium">Pincode</label>
          <Input name="pincode" required />
        </div>
      </div>

      {error && <p className="text-sm text-[color:var(--color-danger)]">{error}</p>}

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : "Save address"}
        </Button>
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}