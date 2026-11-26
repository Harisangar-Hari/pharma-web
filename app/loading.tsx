export default function Loading() {
  return (
    <div className="min-h-screen animate-pulse" aria-busy="true">
      <span className="sr-only" role="status">
        Loading page content...
      </span>

      <header className="h-16 border-b border-[color:var(--color-border)]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
          <div className="h-8 w-36 rounded bg-[color:var(--color-surface)]" />
          <div className="hidden items-center gap-6 md:flex">
            <div className="h-4 w-16 rounded bg-[color:var(--color-surface)]" />
            <div className="h-4 w-16 rounded bg-[color:var(--color-surface)]" />
            <div className="h-4 w-16 rounded bg-[color:var(--color-surface)]" />
          </div>
          <div className="h-9 w-24 rounded bg-[color:var(--color-surface)]" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 space-y-3">
          <div className="h-8 w-56 rounded bg-[color:var(--color-surface)]" />
          <div className="h-4 w-72 max-w-full rounded bg-[color:var(--color-surface)]" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <div key={index} className="space-y-3">
              <div className="aspect-[3/4] rounded-lg bg-[color:var(--color-surface)]" />
              <div className="h-4 w-3/4 rounded bg-[color:var(--color-surface)]" />
              <div className="h-4 w-1/2 rounded bg-[color:var(--color-surface)]" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
