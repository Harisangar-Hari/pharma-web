import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { OrderStatusBadge } from "@/components/account/order-status-badge";



export const metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: { select: { id: true, name: true, quantity: true } },
    },
  });

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-[color:var(--color-border)] p-8 text-center">
        <p className="text-[color:var(--color-muted)]">You haven&apos;t placed any orders yet.</p>
        <Link
          href="/shop"
          className="mt-3 inline-block text-sm font-medium text-[color:var(--color-primary)] hover:underline"
        >
          Start shopping →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block rounded-lg border border-[color:var(--color-border)] p-4 hover:border-[color:var(--color-primary)]"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-medium">{order.orderNumber}</p>
              <p className="text-xs text-[color:var(--color-muted)]">
                Placed on {order.createdAt.toLocaleDateString()}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <p className="mt-2 line-clamp-1 text-sm text-[color:var(--color-muted)]">
            {order.items.map((i) => `${i.name} × ${i.quantity}`).join(", ")}
          </p>

          <div className="mt-2 flex justify-between text-sm">
            <span className="text-[color:var(--color-muted)]">
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </span>
            <span className="font-bold">{Number(order.total).toFixed(0)}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}