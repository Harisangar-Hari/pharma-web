import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { ChevronRight } from "lucide-react";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: {
      items: true,
      address: true,
      prescription: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <nav className="flex items-center gap-1 text-sm text-[color:var(--color-muted)]">
        <Link href="/account/orders" className="hover:text-[color:var(--color-primary)]">
          Orders
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-[color:var(--color-foreground)]">{order.orderNumber}</span>
      </nav>

      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{order.orderNumber}</h2>
          <p className="text-xs text-[color:var(--color-muted)]">
            Placed on {order.createdAt.toLocaleString()}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {order.status === "PENDING_APPROVAL" && (
        <p className="rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          Our pharmacist is reviewing your prescription. You'll be notified once
          it's approved.
        </p>
      )}

      <section className="rounded-lg border border-[color:var(--color-border)] p-4">
        <h3 className="mb-3 text-sm font-semibold">Items</h3>
        <ul className="space-y-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{(Number(item.price) * item.quantity).toFixed(0)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-3 space-y-1 border-t border-[color:var(--color-border)] pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-muted)]">Subtotal</dt>
            <dd>{Number(order.subtotal).toFixed(0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-muted)]">Shipping</dt>
            <dd>{Number(order.shipping).toFixed(0)}</dd>
          </div>
          <div className="flex justify-between border-t border-[color:var(--color-border)] pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd>{Number(order.total).toFixed(0)}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-lg border border-[color:var(--color-border)] p-4 text-sm">
        <h3 className="mb-2 text-sm font-semibold">Delivery address</h3>
        <p>{order.address.line1}</p>
        {order.address.line2 && <p>{order.address.line2}</p>}
        <p>
          {order.address.city}, {order.address.state} {order.address.pincode}
        </p>
        <p className="mt-1 text-[color:var(--color-muted)]">Phone: {order.address.phone}</p>
      </section>

      {order.prescription && (
        <section className="rounded-lg border border-[color:var(--color-border)] p-4 text-sm">
          <h3 className="mb-2 text-sm font-semibold">Prescription</h3>
          <p>Status: {order.prescription.status}</p>
          <a
            href={order.prescription.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-[color:var(--color-primary)] hover:underline"
          >
            View uploaded file
          </a>
        </section>
      )}
    </div>
  );
}