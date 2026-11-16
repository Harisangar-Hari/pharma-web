"use client";

import { useState } from "react";

type Tab = { label: string; content: string | null };

export function ProductTabs({ tabs }: { tabs: Tab[] }) {
  const visible = tabs.filter((t) => t.content);
  const [active, setActive] = useState(0);

  if (visible.length === 0) return null;

  return (
    <div className="border-t border-[color:var(--color-border)] pt-6">
      <div className="mb-4 flex gap-6 border-b border-[color:var(--color-border)]">
        {visible.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setActive(i)}
            className={`-mb-px border-b-2 pb-2 text-sm font-medium transition ${
              i === active
                ? "border-[color:var(--color-primary)] text-[color:var(--color-primary)]"
                : "border-transparent text-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="whitespace-pre-line text-sm leading-relaxed text-[color:var(--color-muted)]">
        {visible[active].content}
      </div>
    </div>
  );
}