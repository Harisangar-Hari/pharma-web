import Link from "next/link";
import { FileText, ShoppingBag, Package, AlertTriangle } from "lucide-react";
import { requireStaff } from "@/lib/auth-admin";
import { prisma } from "@/lib/prisma";
export const instant = false;
export default async function AdminDashboard() {
  await requireStaff();

  const [pendingRx, pendingApproval, openOrders, totalProducts, lowStock] =
    await Promise.all([
      prisma.prescription.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "PENDING_APPROVAL" } }),
      prisma.order.count({
        where: { status: { in: ["PENDING", "CONFIRMED", "PACKED", "SHIPPED"] } },
      }),
      prisma.product.count(),
      prisma.product.count({ where: { isActive: true, stock: { lt: 10 } } }),
    ]);

  const cards = [
    {
      label: "Pending prescriptions",
      value: pendingRx,
      href: "/admin/prescriptions",
      icon: FileText,
      accent: pendingRx > 0 ? "text-[color:var(--color-danger)]" : "",
    },
    {
      label: "Orders awaiting approval",
      value: pendingApproval,
      href: "/admin/orders?status=PENDING_APPROVAL",
      icon: AlertTriangle,
      accent: pendingApproval > 0 ? "text-[color:var(--color-warning)]" : "",
    },
    {
      label: "Open orders",
      value: openOrders,
      href: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      label: "Products",
      value: totalProducts,
      href: "/admin/products",
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, href, icon: Icon, accent }) => (
          <Link
            key={label}
            href={href}
            className="rounded-lg border border-[color:var(--color-border)] bg-white p-4 hover:border-[color:var(--color-primary)]"
          >
            <Icon className={`mb-2 h-5 w-5 ${accent || "text-[color:var(--color-primary)]"}`} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-[color:var(--color-muted)]">{label}</p>
          </Link>
        ))}
      </div>

      {lowStock > 0 && (
        <div className="rounded-lg border border-[color:var(--color-warning)] bg-yellow-50 p-4 text-sm text-yellow-800">
          <strong>{lowStock}</strong> active product{lowStock === 1 ? "" : "s"} low on stock (under 10).{" "}
          <Link href="/admin/products?lowstock=1" className="underline">
            Review products
          </Link>
        </div>
      )}
    </div>
  );
}