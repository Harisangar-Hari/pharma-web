import Link from "next/link";


async function getCurrentYear() {
 
  return new Date().getFullYear();
}
const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/shop" },
      { label: "Baby Care", href: "/shop/baby-care" },
      { label: "Vitamins", href: "/shop/vitamins-supplements" },
      { label: "Health Devices", href: "/shop/health-devices" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Return Policy", href: "/returns" },
    ],
  },
];

export async function Footer() {
     const year = await getCurrentYear();
  return (
    <footer className="mt-auto border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-xl font-bold text-[color:var(--color-primary)]">PharmaCare</p>
            <p className="mt-2 text-sm text-[color:var(--color-muted)]">
              Genuine medicines, delivered fast. Licensed online pharmacy.
            </p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-sm font-semibold">{col.title}</p>
              <ul className="space-y-2 text-sm text-[color:var(--color-muted)]">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="hover:text-[color:var(--color-primary)]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-[color:var(--color-border)] pt-6 text-xs text-[color:var(--color-muted)] md:flex-row">
          <p>© {year} PharmaCare. All rights reserved.</p>
          <p>Prescription medicines require a valid prescription.</p>
        </div>
      </div>
    </footer>
  );
}