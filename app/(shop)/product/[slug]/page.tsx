import { notFound } from "next/navigation";
import Link from "next/link";
import { Star, ChevronRight } from "lucide-react";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductBuyBox } from "@/components/shop/product-buy-box";
import { ProductTabs } from "@/components/shop/product-tabs";
import { ProductReviews } from "@/components/shop/product-reviews";
import { ProductSection } from "@/components/shop/product-section";
import { ReviewForm } from "@/components/shop/review-form";
import { getProductBySlug, getRelatedProducts } from "@/lib/product-detail";
import { getSession } from "@/lib/auth";
import { canReviewProduct } from "@/lib/actions/review";
import { getSavedProductIds } from "@/lib/wishlist";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  const description =
    product.shortDescription ?? product.description ?? undefined;

  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description,
      url: `${SITE_URL}/product/${product.slug}`,
      images: product.images.length > 0 ? [product.images[0]] : undefined,
    },
  };
}


export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const session = await getSession();

  const [related, savedIds, userCanReview] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId),
    getSavedProductIds(),
    canReviewProduct(product.id),
  ]);

  const isSaved = savedIds.has(product.id);

  const price = product.price;
  const mrp = product.mrp;
  const discount = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image:
      product.images.length > 0
        ? product.images
        : [`${SITE_URL}/placeholder.svg`],
    description:
      product.shortDescription ?? product.description ?? product.name,
    sku: product.sku,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand.name }
      : undefined,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/product/${product.slug}`,
      priceCurrency: "INR",
      price: price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "PharmaCare" },
    },
    ...(product.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.avgRating,
        reviewCount: product.reviewCount,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-[color:var(--color-muted)]">
        <Link href="/" className="hover:text-[color:var(--color-primary)]">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/shop" className="hover:text-[color:var(--color-primary)]">
          Shop
        </Link>
        <ChevronRight className="h-3 w-3" />
        {product.category && (
          <>
            <Link
              href={`/shop/${product.category.slug}`}
              className="hover:text-[color:var(--color-primary)]"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="truncate text-[color:var(--color-foreground)]">
          {product.name}
        </span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {product.brand && (
            <Link
              href={`/shop?brand=${product.brand.slug}`}
              className="text-sm text-[color:var(--color-primary)] hover:underline"
            >
              {product.brand.name}
            </Link>
          )}
          <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>

          <div className="mt-2 flex items-center gap-2 text-sm text-[color:var(--color-muted)]">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.avgRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                    }`}
                />
              ))}
            </div>
            <span>{product.avgRating.toFixed(1)}</span>
            <span>({product.reviewCount} reviews)</span>
            {product.totalSold > 0 && (
              <span className="ml-2">· {product.totalSold}+ sold</span>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold">(Rs){price.toFixed(0)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-[color:var(--color-muted)] line-through">
                  (Rs){mrp.toFixed(0)}
                </span>
                <span className="text-sm font-medium text-[color:var(--color-danger)]">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-3 text-sm text-[color:var(--color-muted)]">
              {product.shortDescription}
            </p>
          )}

          <div className="mt-6">
            <ProductBuyBox
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                stock: product.stock,
                images: product.images,
                requiresPrescription: product.requiresPrescription,
                expiryDate: product.expiryDate,
              }}
              isSaved={isSaved}
            />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {product.manufacturer && (
              <>
                <dt className="text-[color:var(--color-muted)]">Manufacturer</dt>
                <dd>{product.manufacturer}</dd>
              </>
            )}
            {product.sku && (
              <>
                <dt className="text-[color:var(--color-muted)]">SKU</dt>
                <dd>{product.sku}</dd>
              </>
            )}
            {product.batchNumber && (
              <>
                <dt className="text-[color:var(--color-muted)]">Batch</dt>
                <dd>{product.batchNumber}</dd>
              </>
            )}
            {product.expiryDate && (
              <>
                <dt className="text-[color:var(--color-muted)]">Expiry</dt>
                <dd>
                  {new Date(product.expiryDate).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                  })}
                </dd>
              </>
            )}
          </dl>
        </div>
      </div>

      <div className="mt-10">
        <ProductTabs
          tabs={[
            { label: "Description", content: product.description },
            { label: "Ingredients", content: product.ingredients },
            { label: "Dosage", content: product.dosage },
          ]}
        />
      </div>

      <div className="mt-10">
        {userCanReview && (
          <div className="mb-4">
            <ReviewForm productId={product.id} />
          </div>
        )}
        <ProductReviews
          reviews={product.reviews}
          avgRating={product.avgRating}
          reviewCount={product.reviewCount}
        />
      </div>

      {related.length > 0 && (
        <div className="mt-6">
          <ProductSection
            title="You might also like"
            products={related}
            viewAllHref={`/shop/${product.category?.slug ?? ""}`}
            savedIds={savedIds}
          />
        </div>
      )}
    </div>
  );
}