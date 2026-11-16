import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const instant = false;

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect("/login?redirect=/checkout");

  const addresses = await prisma.address.findMany({
    where: { userId: session.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  const prescriptions = await prisma.prescription.findMany({
    where: { userId: session.id, status: { in: ["PENDING", "APPROVED"] } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const rxProducts = await prisma.product.findMany({
    where: { requiresPrescription: true },
    select: { id: true },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="mb-4 text-sm text-[color:var(--color-muted)]">
        <Link href="/cart" className="hover:text-[color:var(--color-primary)]">
          Cart
        </Link>{" "}
        / <span className="text-[color:var(--color-foreground)]">Checkout</span>
      </nav>
      <h1 className="mb-6 text-2xl font-bold">Checkout</h1>

      <CheckoutClient
        addresses={addresses.map((a) => ({
          id: a.id,
          label: a.label,
          line1: a.line1,
          line2: a.line2,
          city: a.city,
          state: a.state,
          pincode: a.pincode,
          phone: a.phone,
          isDefault: a.isDefault,
        }))}
        existingPrescriptions={prescriptions.map((p) => ({
          id: p.id,
          fileUrl: p.fileUrl,
          status: p.status,
        }))}
        rxProductIds={rxProducts.map((p) => p.id)}
      />
    </div>
  );
}