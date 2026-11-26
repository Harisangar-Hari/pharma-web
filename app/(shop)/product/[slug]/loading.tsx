export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6" aria-busy="true">
      <span className="sr-only" role="status">
        Loading product…
      </span>

      <div className="mb-6 h-4 w-64 animate-pulse rounded bg-[color:var(--color-surface)]" />

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <div className="aspect-square animate-pulse rounded-lg bg-[color:var(--color-surface)]" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="h-16 w-16 animate-pulse rounded-md bg-[color:var(--color-surface)]"
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="h-4 w-24 animate-pulse rounded bg-[color:var(--color-surface)]" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-[color:var(--color-surface)]" />
          <div className="h-4 w-40 animate-pulse rounded bg-[color:var(--color-surface)]" />
          <div className="h-10 w-32 animate-pulse rounded bg-[color:var(--color-surface)]" />
          <div className="h-16 w-full animate-pulse rounded bg-[color:var(--color-surface)]" />
          <div className="h-12 w-full animate-pulse rounded bg-[color:var(--color-surface)]" />
        </div>
      </div>
    </div>
  );
}
