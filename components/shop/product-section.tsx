import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "./product-card";
import { Reveal } from "@/components/animations/reveal";
import { Stagger } from "@/components/animations/stagger";
import type { SerializedProduct } from "@/lib/serialize";

export function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  savedIds,
}: {
  title: string;
  subtitle?: string;
  products: SerializedProduct[];
  viewAllHref: string;
  savedIds?: Set<string>;
}) {
  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <Reveal direction="up">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-[color:var(--color-muted)]">{subtitle}</p>
            )}
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-medium text-[color:var(--color-primary)] hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} isSaved={savedIds?.has(p.id) ?? false} />
        ))}
      </Stagger>
    </section>
  );
}