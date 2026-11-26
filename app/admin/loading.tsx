export default function AdminLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <span className="sr-only" role="status">
        Loading admin…
      </span>

      <div className="h-8 w-48 animate-pulse rounded bg-[color:var(--color-surface)]" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-lg border border-[color:var(--color-border)] bg-white"
          />
        ))}
      </div>

      <div className="h-64 animate-pulse rounded-lg border border-[color:var(--color-border)] bg-white" />
    </div>
  );
}
