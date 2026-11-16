import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  const order = await prisma.order.findFirst({
    where: { id, userId: session.id },
    include: {
      items: true,
      address: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[color:var(--color-primary)]" />
      <h1 className="text-2xl font-bold">Order placed successfully</h1>
      <p className="mt-2 text-sm text-[color:var(--color-muted)]">
        Order number: <strong>{order.orderNumber}</strong>
      </p>
      {order.status === "PENDING_APPROVAL" && (
        <p className="mx-auto mt-4 max-w-md rounded-md bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          Your order contains prescription medicines. Our pharmacist will review
          your prescription and confirm the order shortly.
        </p>
      )}

      <div className="mt-8 rounded-lg border border-[color:var(--color-border)] p-4 text-left text-sm">
        <h2 className="mb-2 font-semibold">Summary</h2>
        <ul className="space-y-1">
          {order.items.map((it) => (
            <li key={it.id} className="flex justify-between">
              <span>
                {it.name} × {it.quantity}
              </span>
              <span>(Rs){(Number(it.price) * it.quantity).toFixed(0)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 border-t border-[color:var(--color-border)] pt-3 text-base font-bold">
          Total: (Rs){Number(order.total).toFixed(0)}
        </div>
        <div className="mt-2 text-xs text-[color:var(--color-muted)]">
          Delivering to: {order.address.line1}, {order.address.city}{" "}
          {order.address.pincode}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href={`/account/orders/${order.id}`}>
          <Button>View order</Button>
        </Link>
        <Link href="/shop">
          <Button variant="outline">Continue shopping</Button>
        </Link>
      </div>
    </div>
  );
}