import Link from "next/link";
import { requireAdmin } from "@/lib/auth-admin";
import { prisma } from "@/lib/prisma";
import { ProductRowActions } from "@/components/admin/product-row-actions";

export const instant = false;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ lowstock?: string }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const lowOnly = sp.lowstock === "1";

  const products = await prisma.product.findMany({
    where: lowOnly ? { isActive: true, stock: { lt: 10 } } : {},
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      brand: { select: { name: true } },
    },
    take: 200,
  });

  const now = Date.now();
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex gap-2">
          <Link
            href={lowOnly ? "/admin/products" : "/admin/products?lowstock=1"}
            className="rounded-md border border-[color:var(--color-border)] bg-white px-3 py-1.5 text-xs hover:bg-[color:var(--color-surface)]"
          >
            {lowOnly ? "Show all" : "Low stock only"}
          </Link>
          <Link href="/admin/products/new">
            <span className="rounded-md bg-[color:var(--color-primary)] px-3 py-1.5 text-xs font-medium text-white">
              + New product
            </span>
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[color:var(--color-border)] bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-left text-xs uppercase text-[color:var(--color-muted)]">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Cost</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">MRP</th>
              <th className="px-4 py-2">Stock</th>
              <th className="px-4 py-2">Expiry</th>
              <th className="px-4 py-2">Rx</th>
              <th className="px-4 py-2">Active</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const cost = Number(p.costPrice);
              const price = Number(p.price);
              const margin = price > 0 ? ((price - cost) / price) * 100 : 0;
              const expiryDate = p.expiryDate;
              const daysToExpiry = expiryDate
                ? Math.floor((expiryDate.getTime() - now) / (1000 * 60 * 60 * 24))
                : null;
              const expirySoon =
                daysToExpiry !== null && daysToExpiry >= 0 && daysToExpiry < 90;
              const expired = daysToExpiry !== null && daysToExpiry < 0;

              return (
                <tr
                  key={p.id}
                  className="border-b border-[color:var(--color-border)] last:border-0"
                >
                  <td className="px-4 py-2">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-[color:var(--color-muted)]">
                      {p.sku}
                    </p>
                  </td>
                  <td className="px-4 py-2 text-xs">{p.category.name}</td>
                  <td className="px-4 py-2 text-[color:var(--color-muted)]">
                    (Rs){cost.toFixed(0)}
                  </td>
                  <td className="px-4 py-2">(Rs){price.toFixed(0)}</td>
                  <td className="px-4 py-2 text-[color:var(--color-muted)]">
                    (Rs){Number(p.mrp).toFixed(0)}
                  </td>
                  <td
                    className={`px-4 py-2 ${p.stock < 10 ? "font-semibold text-red-600" : ""
                      }`}
                  >
                    {p.stock}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {expiryDate ? (
                      <span
                        className={
                          expired
                            ? "font-semibold text-red-600"
                            : expirySoon
                              ? "text-[color:var(--color-warning)]"
                              : ""
                        }
                      >
                        {expiryDate.toLocaleDateString("en-IN", {
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    ) : (
                      <span className="text-[color:var(--color-muted)]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {p.requiresPrescription ? "Yes" : "—"}
                  </td>
                  <td className="px-4 py-2">{p.isActive ? "Yes" : "No"}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <ProductRowActions
                        productId={p.id}
                        isActive={p.isActive}
                      />
                      <span className="text-[10px] text-[color:var(--color-muted)]">
                        Margin {margin.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}