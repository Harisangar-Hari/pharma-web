import Link from "next/link";
import { Stagger } from "@/components/animations/stagger";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  description: string | null;
};

export function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
      <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/shop/${c.slug}`}
            className="group overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-white transition hover:shadow-md"
          >
            <div className="relative aspect-square bg-[color:var(--color-surface)]">
              <img
                src={c.image || "/placeholder.svg"}
                alt={c.name}
                className="h-full w-full object-cover transition group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-2 text-center">
              <p className="text-sm font-medium leading-tight">{c.name}</p>
            </div>
          </Link>
        ))}
      </Stagger>
    </section>
  );
}