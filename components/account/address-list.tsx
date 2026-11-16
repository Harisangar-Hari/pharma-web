"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddressForm } from "@/components/checkout/address-form";
import { deleteAddressAction } from "@/lib/actions/address";

type Address = {
  id: string;
  label: string | null;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  isDefault: boolean;
};

export function AddressList({ addresses: initial }: { addresses: Address[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(initial.length === 0);

  const remove = async (id: string) => {
    const result = await deleteAddressAction(id);
    if (result.success) {
      toast.success("Address removed");
      router.refresh();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="space-y-4">
      {initial.map((a) => (
        <div
          key={a.id}
          className="flex items-start justify-between gap-3 rounded-lg border border-[color:var(--color-border)] p-4 text-sm"
        >
          <div>
            <p className="font-medium">
              {a.label || "Address"}
              {a.isDefault && (
                <span className="ml-2 rounded bg-[color:var(--color-primary)] px-1.5 py-0.5 text-[10px] text-white">
                  Default
                </span>
              )}
            </p>
            <p className="mt-1">
              {a.line1}
              {a.line2 ? `, ${a.line2}` : ""}
            </p>
            <p>
              {a.city}, {a.state} {a.pincode}
            </p>
            <p className="mt-1 text-xs text-[color:var(--color-muted)]">Phone: {a.phone}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => remove(a.id)}
            aria-label="Delete address"
            className="text-[color:var(--color-muted)] hover:text-[color:var(--color-danger)]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {showForm ? (
        <AddressForm
          onSaved={() => {
            setShowForm(false);
            router.refresh();
          }}
          onCancel={initial.length > 0 ? () => setShowForm(false) : undefined}
        />
      ) : (
        <Button variant="outline" onClick={() => setShowForm(true)}>
          + Add new address
        </Button>
      )}
    </div>
  );
}