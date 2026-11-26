import Link from "next/link";
import { requireStaff } from "@/lib/auth-admin";
import { prisma } from "@/lib/prisma";
import { OrderStatusBadge } from "@/components/account/order-status-badge";

const STATUSES = [
  "ALL",
  "PENDING",
  "PENDING_APPROVAL",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireStaff();
  const sp = await searchParams;
  const status = sp.status ?? "ALL";

  const orders = await prisma.order.findMany({
    where: status === "ALL" ? {} : { status: status as any },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      items: { select: { name: true, quantity: true } },
    },
    take: 100,
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="flex gap-1 overflow-x-auto border-b border-[color:var(--color-border)] pb-1">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`whitespace-nowrap rounded px-3 py-1.5 text-xs font-medium ${status === s
              ? "bg-[color:var(--color-primary)] text-white"
              : "text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface)]"
              }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <p className="rounded-lg border border-[color:var(--color-border)] bg-white p-8 text-center text-sm text-[color:var(--color-muted)]">
          No orders with this status.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border)] bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-left text-xs uppercase text-[color:var(--color-muted)]">
              <tr>
                <th className="px-4 py-2">Order</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[color:var(--color-border)] last:border-0">
                  <td className="px-4 py-2">
                    <p className="font-medium">{o.orderNumber}</p>
                    <p className="text-xs text-[color:var(--color-muted)]">
                      {o.createdAt.toLocaleDateString()}
                    </p>
                  </td>
                  <td className="px-4 py-2">
                    <p>{o.user.name}</p>
                    <p className="text-xs text-[color:var(--color-muted)]">{o.user.email}</p>
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                  </td>
                  <td className="px-4 py-2 font-medium">(Rs){Number(o.total).toFixed(0)}</td>
                  <td className="px-4 py-2">
                    <OrderStatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-2 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-xs text-[color:var(--color-primary)] hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}