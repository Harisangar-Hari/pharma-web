"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Option = { id: string; name: string; slug: string };

export function FilterSidebar({
  categories,
  brands,
  lockedCategory,
}: {
  categories: Option[];
  brands: Option[];
  lockedCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const updateParam = useCallback(
    (key: string, values: string[]) => {
      const next = new URLSearchParams(params.toString());
      if (values.length === 0) next.delete(key);
      else next.set(key, values.join(","));
      next.delete("page");
      router.push(`${pathname}?${next.toString()}`);
    },
    [params, pathname, router]
  );

  const toggle = (key: string, value: string) => {
    const current = (params.get(key) ?? "").split(",").filter(Boolean);
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateParam(key, next);
  };

  const setNumber = (key: string, value: string) => {
    const next = new URLSearchParams(params.toString());
    if (value === "") next.delete(key);
    else next.set(key, value);
    next.delete("page");
    router.push(`${pathname}?${next.toString()}`);
  };

  const activeCats = (params.get("category") ?? "").split(",").filter(Boolean);
  const activeBrands = (params.get("brand") ?? "").split(",").filter(Boolean);

  return (
    <aside className="space-y-6">
      {!lockedCategory && (
        <FilterGroup title="Category">
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={activeCats.includes(c.slug)}
                onCheckedChange={() => toggle("category", c.slug)}
              />
              {c.name}
            </label>
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Brand">
        {brands.map((b) => (
          <label key={b.id} className="flex cursor-pointer items-center gap-2 text-sm">
            <Checkbox
              checked={activeBrands.includes(b.slug)}
              onCheckedChange={() => toggle("brand", b.slug)}
            />
            {b.name}
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Price ((Rs))">
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            defaultValue={params.get("min") ?? ""}
            onBlur={(e) => setNumber("min", e.target.value)}
          />
          <span className="text-sm text-[color:var(--color-muted)]">–</span>
          <Input
            type="number"
            placeholder="Max"
            defaultValue={params.get("max") ?? ""}
            onBlur={(e) => setNumber("max", e.target.value)}
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Rating">
        {[4, 3, 2].map((r) => {
          const active = params.get("rating") === String(r);
          return (
            <label key={r} className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={active}
                onCheckedChange={() => setNumber("rating", active ? "" : String(r))}
              />
              {r}★ & up
            </label>
          );
        })}
      </FilterGroup>

      <FilterGroup title="Availability">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={params.get("stock") === "1"}
            onCheckedChange={(v) => setNumber("stock", v ? "1" : "")}
          />
          In stock only
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <Checkbox
            checked={params.get("rxfree") === "1"}
            onCheckedChange={(v) => setNumber("rxfree", v ? "1" : "")}
          />
          No prescription required
        </label>
      </FilterGroup>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push(pathname)}
      >
        Clear all filters
      </Button>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}