import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--color-surface)]">
      <header className="border-b border-[color:var(--color-border)] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-[color:var(--color-primary)]">
            PharmaCare
          </Link>
          <Link href="/shop" className="text-sm text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]">
            Continue shopping
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-xl border border-[color:var(--color-border)] bg-white p-6 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}