import { Suspense } from "react";
import { Hero } from "@/components/shop/hero";
import { CategoryGrid } from "@/components/shop/category-grid";
import { ProductSection } from "@/components/shop/product-section";
import { PrescriptionCta } from "@/components/shop/prescription-cta";
import {
  getBestSelling,
  getCategories,
  getNewArrivals,
  getTopRated,
} from "@/lib/products";
import { getSavedProductIds } from "@/lib/wishlist";
import { OrganizationJsonLd } from "@/components/seo/organization-json-ld";

function SectionSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 h-7 w-40 animate-pulse rounded bg-[color:var(--color-surface)]" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] animate-pulse rounded-lg bg-[color:var(--color-surface)]"
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
     <OrganizationJsonLd />
      <Hero />
      <Suspense fallback={<SectionSkeleton />}>
        <CategoriesSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <NewArrivalsSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <BestSellingSection />
      </Suspense>
      <Suspense fallback={<SectionSkeleton />}>
        <TopRatedSection />
      </Suspense>
      <PrescriptionCta />
    </>
  );
}

async function CategoriesSection() {
  const categories = await getCategories();
  return <CategoryGrid categories={categories} />;
}

async function NewArrivalsSection() {
  const [products, savedIds] = await Promise.all([
    getNewArrivals(8),
    getSavedProductIds(),
  ]);
  return (
    <ProductSection
      title="New Arrivals"
      subtitle="Just landed in our store"
      products={products}
      viewAllHref="/shop?sort=newest"
      savedIds={savedIds}
    />
  );
}

async function BestSellingSection() {
  const [products, savedIds] = await Promise.all([
    getBestSelling(8),
    getSavedProductIds(),
  ]);
  return (
    <ProductSection
      title="Best Selling"
      subtitle="What our customers love most"
      products={products}
      viewAllHref="/shop?sort=best-selling"
      savedIds={savedIds}
    />
  );
}

async function TopRatedSection() {
  const [products, savedIds] = await Promise.all([
    getTopRated(8),
    getSavedProductIds(),
  ]);
  return (
    <ProductSection
      title="Top Rated"
      subtitle="Highest rated by verified buyers"
      products={products}
      viewAllHref="/shop?sort=rating"
      savedIds={savedIds}
    />
  );
}