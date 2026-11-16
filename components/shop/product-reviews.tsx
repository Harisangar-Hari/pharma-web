import { Star } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  isVerified: boolean;
  createdAt: string;
  userName: string;
};

export function ProductReviews({
  reviews,
  avgRating,
  reviewCount,
}: {
  reviews: Review[];
  avgRating: number;
  reviewCount: number;
}) {
  return (
    <section className="border-t border-[color:var(--color-border)] pt-6">
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-lg font-semibold">Customer Reviews</h2>
        <div className="flex items-center gap-1 text-sm text-[color:var(--color-muted)]">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-[color:var(--color-foreground)]">
            {avgRating.toFixed(1)}
          </span>
          <span>({reviewCount} reviews)</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-[color:var(--color-muted)]">
          No reviews yet. Be the first to review this product.
        </p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="rounded-lg border border-[color:var(--color-border)] p-4"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{r.userName}</span>
                  {r.isVerified && (
                    <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                      Verified
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < r.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {r.title && <p className="text-sm font-medium">{r.title}</p>}
              {r.body && (
                <p className="mt-1 text-sm text-[color:var(--color-muted)]">{r.body}</p>
              )}
              <p className="mt-2 text-xs text-[color:var(--color-muted)]">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}