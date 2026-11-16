import Link from "next/link";
import { Package, FileText, MapPin } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "My Account" };
export const instant = false;
export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [orderCount, prescriptionCount, addressCount] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.prescription.count({ where: { userId: user.id } }),
    prisma.address.count({ where: { userId: user.id } }),
  ]);

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-[color:var(--color-border)] p-4">
        <h2 className="mb-3 text-lg font-semibold">Profile</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-[color:var(--color-muted)]">Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt className="text-[color:var(--color-muted)]">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt className="text-[color:var(--color-muted)]">Phone</dt>
            <dd>{user.phone ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-[color:var(--color-muted)]">Member since</dt>
            <dd>{user.createdAt.toLocaleDateString()}</dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/account/orders"
          className="rounded-lg border border-[color:var(--color-border)] p-4 hover:border-[color:var(--color-primary)]"
        >
          <Package className="mb-2 h-5 w-5 text-[color:var(--color-primary)]" />
          <p className="text-2xl font-bold">{orderCount}</p>
          <p className="text-sm text-[color:var(--color-muted)]">Orders</p>
        </Link>
        <Link
          href="/account/prescriptions"
          className="rounded-lg border border-[color:var(--color-border)] p-4 hover:border-[color:var(--color-primary)]"
        >
          <FileText className="mb-2 h-5 w-5 text-[color:var(--color-primary)]" />
          <p className="text-2xl font-bold">{prescriptionCount}</p>
          <p className="text-sm text-[color:var(--color-muted)]">Prescriptions</p>
        </Link>
        <Link
          href="/account/addresses"
          className="rounded-lg border border-[color:var(--color-border)] p-4 hover:border-[color:var(--color-primary)]"
        >
          <MapPin className="mb-2 h-5 w-5 text-[color:var(--color-primary)]" />
          <p className="text-2xl font-bold">{addressCount}</p>
          <p className="text-sm text-[color:var(--color-muted)]">Addresses</p>
        </Link>
      </section>
    </div>
  );
}