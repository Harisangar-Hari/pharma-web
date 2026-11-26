import { notFound } from "next/navigation";
import Link from "next/link";
import { requireStaff } from "@/lib/auth-admin";
import { prisma } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/account/order-status-badge";
import { OrderStatusControl } from "@/components/admin/order-status-control";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireStaff();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      address: true,
      prescription: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });

  if (!order) notFound();

  return (
    <div className="space-y-4">
      <Link href="/admin/orders" className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]">
        ← Back to orders
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 rounded-lg border border-[color:var(--color-border)] bg-white p-4">
        <div>
          <h1 className="text-xl font-bold">{order.orderNumber}</h1>
          <p className="text-xs text-[color:var(--color-muted)]">
            Placed {order.createdAt.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OrderStatusBadge status={order.status} />
          <OrderStatusControl orderId={order.id} currentStatus={order.status} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold">Customer</h2>
          <p className="text-sm">{order.user.name}</p>
          <p className="text-xs text-[color:var(--color-muted)]">{order.user.email}</p>
          {order.user.phone && (
            <p className="text-xs text-[color:var(--color-muted)]">{order.user.phone}</p>
          )}
        </div>

        <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold">Delivery address</h2>
          <p className="text-sm">{order.address.line1}</p>
          {order.address.line2 && <p className="text-sm">{order.address.line2}</p>}
          <p className="text-sm">
            {order.address.city}, {order.address.state} {order.address.pincode}
          </p>
          <p className="mt-1 text-xs text-[color:var(--color-muted)]">Phone: {order.address.phone}</p>
        </div>
      </div>

      <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
        <h2 className="mb-2 text-sm font-semibold">Items</h2>
        <table className="w-full text-sm">
          <tbody>
            {order.items.map((it) => (
              <tr key={it.id} className="border-b border-[color:var(--color-border)] last:border-0">
                <td className="py-2">{it.name}</td>
                <td className="py-2 text-right">×{it.quantity}</td>
                <td className="py-2 text-right">(Rs){(Number(it.price) * it.quantity).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <dl className="mt-3 space-y-1 border-t border-[color:var(--color-border)] pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-muted)]">Subtotal</dt>
            <dd>(Rs){Number(order.subtotal).toFixed(0)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-muted)]">Shipping</dt>
            <dd>(Rs){Number(order.shipping).toFixed(0)}</dd>
          </div>
          <div className="flex justify-between text-base font-bold">
            <dt>Total</dt>
            <dd>(Rs){Number(order.total).toFixed(0)}</dd>
          </div>
        </dl>
      </div>

      {order.prescription && (
        <div className="rounded-lg border border-[color:var(--color-border)] bg-white p-4">
          <h2 className="mb-2 text-sm font-semibold">Prescription</h2>
          <p className="text-sm">Status: {order.prescription.status}</p>
          <a
            href={order.prescription.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm text-[color:var(--color-primary)] hover:underline"
          >
            View file →
          </a>
          {order.prescription.pharmacistNote && (
            <p className="mt-1 text-xs text-red-700">Note: {order.prescription.pharmacistNote}</p>
          )}
        </div>
      )}
    </div>
  );
}