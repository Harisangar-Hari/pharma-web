"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddressForm } from "./address-form";
import { PrescriptionUpload } from "./prescription-upload";
import { useCartStore } from "@/stores/cart-store";
import { useHydrated } from "@/lib/use-hydrated";
import { placeOrderAction } from "@/lib/actions/checkout";

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

type Rx = { id: string; fileUrl: string; status: string };

export function CheckoutClient({
  addresses,
  existingPrescriptions,
  rxProductIds,
}: {
  addresses: Address[];
  existingPrescriptions: Rx[];
  rxProductIds: string[];
}) {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? null
  );
  const [showAddressForm, setShowAddressForm] = useState(addresses.length === 0);

  const [prescriptionId, setPrescriptionId] = useState<string | null>(
    existingPrescriptions[0]?.id ?? null
  );
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.replace("/cart");
    }
  }, [hydrated, items.length, router]);

  const rxSet = useMemo(() => new Set(rxProductIds), [rxProductIds]);
  const needsRx = items.some((i) => rxSet.has(i.productId));

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= 499 ? 0 : 49;
  const total = subtotal + shipping;

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-lg bg-[color:var(--color-surface)]" />;
  }

  if (items.length === 0) {
    return null;
  }

  const placeOrder = async () => {
    if (!selectedAddressId) {
      toast.error("Select a delivery address");
      return;
    }
    if (needsRx && !prescriptionId) {
      toast.error("Upload a prescription to continue");
      return;
    }

    setPlacing(true);
    const result = await placeOrderAction({
      addressId: selectedAddressId,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      prescriptionId: needsRx ? prescriptionId : null,
    });
    setPlacing(false);

    if (result.success) {
      clearCart();
      toast.success("Order placed successfully");
      router.push(`/order-confirmation/${result.orderId}`);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_360px]">
      {/* Left column */}
      <div className="space-y-6">
        {/* Address */}
        <section>
          <h2 className="mb-3 text-lg font-semibold">Delivery address</h2>

          {addresses.length > 0 && (
            <div className="mb-3 space-y-2">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={`block cursor-pointer rounded-lg border p-3 text-sm ${
                    selectedAddressId === a.id
                      ? "border-[color:var(--color-primary)] bg-teal-50/40"
                      : "border-[color:var(--color-border)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="mr-2"
                    checked={selectedAddressId === a.id}
                    onChange={() => setSelectedAddressId(a.id)}
                  />
                  <span className="font-medium">{a.label || "Address"}</span> —{" "}
                  {a.line1}
                  {a.line2 ? `, ${a.line2}` : ""}, {a.city}, {a.state} {a.pincode}
                  <span className="ml-2 text-xs text-[color:var(--color-muted)]">
                    ({a.phone})
                  </span>
                </label>
              ))}
            </div>
          )}

          {showAddressForm ? (
            <AddressForm
              onSaved={(id) => {
                setShowAddressForm(false);
                setSelectedAddressId(id);
                // Pull the saved address from the server without losing state.
                router.refresh();
              }}
              onCancel={addresses.length > 0 ? () => setShowAddressForm(false) : undefined}
            />
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddressForm(true)}
            >
              + Add new address
            </Button>
          )}
        </section>

        {/* Prescription */}
        {needsRx && (
          <section>
            <h2 className="mb-3 text-lg font-semibold">Prescription</h2>

            {existingPrescriptions.length > 0 && (
              <div className="mb-3 space-y-2">
                {existingPrescriptions.map((p) => (
                  <label
                    key={p.id}
                    className={`block cursor-pointer rounded-lg border p-3 text-sm ${
                      prescriptionId === p.id
                        ? "border-[color:var(--color-primary)] bg-teal-50/40"
                        : "border-[color:var(--color-border)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="rx"
                      className="mr-2"
                      checked={prescriptionId === p.id}
                      onChange={() => setPrescriptionId(p.id)}
                    />
                    Use existing prescription · {p.status}
                  </label>
                ))}
              </div>
            )}

            <PrescriptionUpload
              prescriptionId={prescriptionId}
              onChange={setPrescriptionId}
            />
          </section>
        )}
      </div>

      {/* Right column — summary */}
      <aside className="h-fit rounded-lg border border-[color:var(--color-border)] p-4">
        <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>

        <ul className="mb-4 space-y-2 border-b border-[color:var(--color-border)] pb-4 text-sm">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between gap-2">
              <span className="line-clamp-1">
                {i.name} × {i.quantity}
              </span>
              <span className="whitespace-nowrap">
                (Rs){(i.price * i.quantity).toFixed(0)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-muted)]">Subtotal</dt>
            <dd>(Rs){subtotal.toFixed(0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-muted)]">Shipping</dt>
            <dd>{shipping === 0 ? "Free" : `(Rs)${shipping}`}</dd>
          </div>
          <div className="flex justify-between border-t border-[color:var(--color-border)] pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>(Rs){total.toFixed(0)}</dd>
          </div>
        </dl>

        <Button
          size="lg"
          className="mt-4 w-full"
          onClick={placeOrder}
          disabled={placing || !selectedAddressId || (needsRx && !prescriptionId)}
        >
          {placing ? "Placing order…" : "Place order"}
        </Button>

        <p className="mt-2 text-xs text-[color:var(--color-muted)]">
          Payment will be collected on delivery for now.
        </p>
      </aside>
    </div>
  );
}
