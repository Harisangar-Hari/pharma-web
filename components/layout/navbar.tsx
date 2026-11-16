"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
  LogOut,
  Package,
  FileText,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cart-store";
import { logoutAction } from "@/lib/actions/auth";
import type { SessionUser } from "@/lib/auth";

const CATEGORIES = [
  { name: "Baby Care", slug: "baby-care" },
  { name: "First Aid", slug: "first-aid" },
  { name: "Vitamins", slug: "vitamins-supplements" },
  { name: "Personal Care", slug: "personal-care" },
  { name: "Prescription", slug: "prescription-medicines" },
  { name: "Devices", slug: "health-devices" },
  { name: "Mother Care", slug: "mother-care" },
];

export function Navbar({ user }: { user: SessionUser | null }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-border)] bg-white/95 backdrop-blur">
      {/* Top strip */}
      <div className="bg-[color:var(--color-primary)] text-xs text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
          <p>Free delivery on orders above (Rs)499</p>
          <Link href="/contact" className="hover:underline">
            Need help? Contact us
          </Link>
        </div>
      </div>

      {/* Main row */}
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        {/* Logo + desktop nav links */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xl font-bold text-[color:var(--color-primary)]"
          >
            PharmaCare
          </Link>
          <nav className="hidden items-center gap-4 text-sm font-medium md:flex">
            <Link
              href="/shop"
              className="hover:text-[color:var(--color-primary)]"
            >
              Shop
            </Link>
            <Link
              href="/about"
              className="hover:text-[color:var(--color-primary)]"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="hover:text-[color:var(--color-primary)]"
            >
              Contact
            </Link>
          </nav>
        </div>

        {/* Search */}
        <form action="/search" className="hidden flex-1 md:block">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-muted)]" />
            <Input
              name="q"
              placeholder="Search medicines, vitamins, brands..."
              className="pl-9"
            />
          </div>
        </form>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-1">
          {user ? (
            <div className="flex items-center gap-1">
              <Link
                href="/account/orders"
                className="hidden md:block"
                aria-label="My orders"
              >
                <Button variant="ghost" size="sm">
                  <Package className="mr-1 h-4 w-4" />
                  Orders
                </Button>
              </Link>
              <Link href="/wishlist" aria-label="Wishlist" className="hidden md:block">
                <Button variant="ghost" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              <Link
                href="/account/prescriptions"
                className="hidden md:block"
                aria-label="My prescriptions"
              >
                <Button variant="ghost" size="sm">
                  <FileText className="mr-1 h-4 w-4" />
                  Rx
                </Button>
              </Link>
              <Link
                href="/account"
                className="hidden items-center gap-2 rounded-md px-2 py-1 text-sm font-medium hover:bg-[color:var(--color-surface)] md:flex"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-xs font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[80px] truncate">
                  {user.name.split(" ")[0]}
                </span>
              </Link>
              <form action={logoutAction}>
                <Button
                  variant="ghost"
                  size="icon"
                  type="submit"
                  aria-label="Log out"
                  className="text-[color:var(--color-muted)] hover:text-[color:var(--color-danger)]"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </form>
            </div>
          ) : (
            <Link href="/login" aria-label="Account">
              <Button variant="ghost" size="sm">
                <User className="mr-1 h-4 w-4" />
                Login
              </Button>
            </Link>
          )}

          <Link href="/cart" aria-label="Cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {mounted && itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--color-danger)] px-1 text-[10px] font-bold text-white">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Category strip (desktop) */}
      <nav className="hidden border-t border-[color:var(--color-border)] md:block">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-4 py-2 text-sm">
          <Link
            href="/shop"
            className="font-medium hover:text-[color:var(--color-primary)]"
          >
            All Products
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className="whitespace-nowrap text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-[color:var(--color-border)] bg-white md:hidden">
          <form action="/search" className="p-3">
            <Input name="q" placeholder="Search products..." />
          </form>

          {/* Mobile account block */}
          <div className="border-b border-[color:var(--color-border)] px-3 pb-3">
            {user ? (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 px-1 py-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--color-primary)] text-xs font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <div className="text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-xs text-[color:var(--color-muted)]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Link
                  href="/account"
                  className="rounded-md px-2 py-2 text-sm hover:bg-[color:var(--color-surface)]"
                  onClick={() => setMobileOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  href="/account/orders"
                  className="rounded-md px-2 py-2 text-sm hover:bg-[color:var(--color-surface)]"
                  onClick={() => setMobileOpen(false)}
                >
                  My Orders
                </Link>
                <Link href="/wishlist" aria-label="Wishlist" className="hidden md:block">
                  <Button variant="ghost" size="icon">
                    <Heart className="h-5 w-5" />
                  </Button>
                </Link>
                <Link
                  href="/account/prescriptions"
                  className="rounded-md px-2 py-2 text-sm hover:bg-[color:var(--color-surface)]"
                  onClick={() => setMobileOpen(false)}
                >
                  My Prescriptions
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-md px-2 py-2 text-left text-sm text-[color:var(--color-danger)] hover:bg-red-50"
                  >
                    Log out
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="block rounded-md bg-[color:var(--color-primary)] px-3 py-2 text-center text-sm font-medium text-white"
                onClick={() => setMobileOpen(false)}
              >
                Log in / Sign up
              </Link>
            )}
          </div>

          <div className="flex flex-col pb-3">
            <Link
              href="/shop"
              className="px-4 py-2 text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              Shop All Products
            </Link>
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/shop/${c.slug}`}
                className="px-4 py-2 text-sm text-[color:var(--color-muted)]"
                onClick={() => setMobileOpen(false)}
              >
                {c.name}
              </Link>
            ))}
            <Link
              href="/about"
              className="px-4 py-2 text-sm text-[color:var(--color-muted)]"
              onClick={() => setMobileOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 text-sm text-[color:var(--color-muted)]"
              onClick={() => setMobileOpen(false)}
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}