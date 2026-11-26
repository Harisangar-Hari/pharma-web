export default function AccountLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8" aria-busy="true">
      <span className="sr-only" role="status">
        Loading account…
      </span>

      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-[color:var(--color-surface)]" />

      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <div className="space-y-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="h-9 w-full animate-pulse rounded-md bg-[color:var(--color-surface)]"
            />
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-32 animate-pulse rounded-lg bg-[color:var(--color-surface)]" />
          <div className="grid gap-3 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-lg bg-[color:var(--color-surface)]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
