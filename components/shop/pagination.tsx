"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  basePath,
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
}) {
  const params = useSearchParams();
  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const next = new URLSearchParams(params.toString());
    next.set("page", String(page));
    return `${basePath}?${next.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  );

  return (
    <nav className="mt-8 flex items-center justify-center gap-1">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface)]"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      )}

      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1">
            {gap && <span className="px-1 text-sm text-[color:var(--color-muted)]">…</span>}
            <Link
              href={buildHref(p)}
              className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm ${
                p === currentPage
                  ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                  : "border-[color:var(--color-border)] hover:bg-[color:var(--color-surface)]"
              }`}
            >
              {p}
            </Link>
          </span>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-[color:var(--color-border)] hover:bg-[color:var(--color-surface)]"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </nav>
  );
}