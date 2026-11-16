"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Package, ShoppingBag } from "lucide-react";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/products", label: "Products", icon: Package },
];

export function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 flex-shrink-0 border-r border-[color:var(--color-border)] bg-white md:block">
      <div className="border-b border-[color:var(--color-border)] p-4">
        <Link href="/admin" className="text-lg font-bold text-[color:var(--color-primary)]">
          PharmaCare Admin
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-3">
        {LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                active
                  ? "bg-[color:var(--color-primary)] text-white"
                  : "text-[color:var(--color-muted)] hover:bg-[color:var(--color-surface)]"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      {role === "PHARMACIST" && (
        <p className="mx-3 mt-3 rounded bg-yellow-50 px-2 py-1 text-xs text-yellow-800">
          Pharmacist access — product editing disabled
        </p>
      )}
    </aside>
  );
}