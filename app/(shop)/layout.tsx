import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSession } from "@/lib/auth";

function NavbarSkeleton() {
  return (
    <div className="h-16 border-b border-[color:var(--color-border)] bg-white" />
  );
}


async function NavbarWithSession() {
  const session = await getSession();
  return <Navbar user={session} />;
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<NavbarSkeleton />}>
        <NavbarWithSession />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}