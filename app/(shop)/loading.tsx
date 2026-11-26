export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10" aria-busy="true">
      <span className="sr-only" role="status">
        Loading page content…
      </span>

      <div className="mb-6 h-8 w-48 animate-pulse rounded bg-[color:var(--color-surface)]" />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square animate-pulse rounded-lg bg-[color:var(--color-surface)]" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-[color:var(--color-surface)]" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-[color:var(--color-surface)]" />
            <div className="h-8 w-full animate-pulse rounded bg-[color:var(--color-surface)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
