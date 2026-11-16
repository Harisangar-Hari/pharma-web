"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { suggestProducts } from "@/lib/actions/search";

type Suggestion = {
  id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
};

export function SearchBox({
  defaultValue = "",
  autoFocus = false,
}: {
  defaultValue?: string;
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (q.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    let cancelled = false;
    const t = setTimeout(async () => {
      setLoading(true);
      const results = await suggestProducts(q);
      if (!cancelled) {
        setSuggestions(results);
        setOpen(results.length > 0);
        setLoading(false);
      }
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div ref={boxRef} className="relative">
      <form onSubmit={submit}>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-muted)]" />
          <Input
            name="q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Search medicines, vitamins, brands..."
            className="pl-9 pr-9"
            autoFocus={autoFocus}
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[color:var(--color-muted)]" />
          )}
        </div>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-white shadow-lg">
          {suggestions.map((s) => (
            <Link
              key={s.id}
              href={`/product/${s.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-[color:var(--color-surface)]"
            >
              <img
                src={s.images[0] || "/placeholder.svg"}
                alt=""
                className="h-10 w-10 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate">{s.name}</p>
                <p className="text-xs text-[color:var(--color-muted)]">(Rs){s.price.toFixed(0)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}