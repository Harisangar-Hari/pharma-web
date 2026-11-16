"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, FileText, MapPin } from "lucide-react";

const LINKS = [
  { href: "/account", label: "Profile", icon: User, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/prescriptions", label: "Prescriptions", icon: FileText },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
];

export function AccountSidebar({
  user,
}: {
  user: { name: string; email: string };
}) {
  const pathname = usePathname();

  return (
    <aside>
      <div className="mb-4 rounded-lg border border-[color:var(--color-border)] p-3">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="truncate text-xs text-[color:var(--color-muted)]">{user.email}</p>
      </div>
      <nav className="flex flex-col gap-1">
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
    </aside>
  );
}