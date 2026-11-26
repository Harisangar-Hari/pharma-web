import Link from "next/link";
import { requireStaff } from "@/lib/auth-admin";
import { AdminSidebar } from "@/components/admin/sidebar";
import { logoutAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const metadata = { title: "Admin — PharmaCare" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireStaff();

  return (
    <div className="flex min-h-screen bg-[color:var(--color-surface)]">
      <AdminSidebar role={session.role} />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[color:var(--color-border)] bg-white px-6 py-3">
          <div>
            <p className="text-sm font-semibold">Admin Console</p>
            <p className="text-xs text-[color:var(--color-muted)]">
              Signed in as {session.name} ({session.role})
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]">
              View storefront
            </Link>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="mr-1 h-4 w-4" /> Log out
              </Button>
            </form>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}