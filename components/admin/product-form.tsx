"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUploader } from "./image-uploader";
import { createProductAction, updateProductAction } from "@/lib/actions/admin";
import type { ProductInput } from "@/lib/validators/admin";

type Category = { id: string; name: string };
type Brand = { id: string; name: string };

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function ProductForm({
  productId,
  categories,
  brands,
  initial,
  initialImages = [],
}: {
  productId?: string;
  categories: Category[];
  brands: Brand[];
  initial?: ProductInput;
  initialImages?: string[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [slugEdited, setSlugEdited] = useState(Boolean(productId));
  const [images, setImages] = useState<string[]>(initialImages);

  const [form, setForm] = useState<ProductInput>(
    initial ?? {
      name: "",
      slug: "",
      sku: "",
      shortDescription: "",
      description: "",
      ingredients: "",
      dosage: "",
      manufacturer: "",
      costPrice: 0,
      price: 0,
      mrp: 0,
      stock: 0,
      categoryId: categories[0]?.id ?? "",
      brandId: "",
      requiresPrescription: false,
      isActive: true,
      images: [],
      expiryDate: "",
      expiryAlertDays: 90,
      batchNumber: "",
    }
  );

  const set = <K extends keyof ProductInput>(key: K, val: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const onNameChange = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: slugEdited ? f.slug : slugify(name),
    }));
  };

  const onSlugChange = (slug: string) => {
    setSlugEdited(true);
    set("slug", slug);
  };

  const slugInvalid = form.slug.length > 0 && !/^[a-z0-9-]+$/.test(form.slug);
  const priceInvalid = form.price > form.mrp;
  const costInvalid = form.costPrice > form.price;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (slugInvalid) {
      toast.error("Fix the slug before saving");
      return;
    }
    if (priceInvalid) {
      toast.error("Selling price cannot exceed MRP");
      return;
    }
    if (costInvalid) {
      toast.error("Cost price cannot exceed selling price");
      return;
    }
    setLoading(true);
    const payload = { ...form, images };
    const r = productId
      ? await updateProductAction(productId, payload)
      : await createProductAction(payload);
    setLoading(false);
    if (r.success) {
      toast.success(productId ? "Product updated" : "Product created");
      router.push("/admin/products");
      router.refresh();
    } else toast.error(r.error);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-lg border border-[color:var(--color-border)] bg-white p-4"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Name">
          <Input
            value={form.name}
            onChange={(e) => onNameChange(e.target.value)}
            required
          />
        </Field>
        <Field label="Slug">
          <Input
            value={form.slug}
            onChange={(e) => onSlugChange(e.target.value)}
            required
          />
          {slugInvalid && (
            <p className="mt-1 text-xs text-[color:var(--color-danger)]">
              Lowercase letters, digits, and hyphens only. No spaces.
            </p>
          )}
        </Field>
        <Field label="SKU">
          <Input
            value={form.sku}
            onChange={(e) => set("sku", e.target.value)}
            required
          />
        </Field>
        <Field label="Manufacturer">
          <Input
            value={form.manufacturer}
            onChange={(e) => set("manufacturer", e.target.value)}
          />
        </Field>
        <Field label="Category">
          <select
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Brand (optional)">
          <select
            value={form.brandId}
            onChange={(e) => set("brandId", e.target.value)}
            className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
          >
            <option value="">— None —</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Cost price ((Rs)) — internal only">
          <Input
            type="number"
            value={form.costPrice}
            onChange={(e) => set("costPrice", Number(e.target.value))}
          />
          {costInvalid && (
            <p className="mt-1 text-xs text-[color:var(--color-danger)]">
              Cost price exceeds selling price — you&apos;d be selling at a loss.
            </p>
          )}
        </Field>
        <Field label="Selling price ((Rs))">
          <Input
            type="number"
            value={form.price}
            onChange={(e) => set("price", Number(e.target.value))}
            required
          />
          {priceInvalid && (
            <p className="mt-1 text-xs text-[color:var(--color-danger)]">
              Selling price cannot exceed MRP.
            </p>
          )}
        </Field>
        <Field label="MRP ((Rs))">
          <Input
            type="number"
            value={form.mrp}
            onChange={(e) => set("mrp", Number(e.target.value))}
            required
          />
        </Field>
        <Field label="Stock">
          <Input
            type="number"
            value={form.stock}
            onChange={(e) => set("stock", Number(e.target.value))}
            required
          />
        </Field>
        <Field label="Expiry date">
          <Input
            type="date"
            value={form.expiryDate}
            onChange={(e) => set("expiryDate", e.target.value)}
          />
        </Field>
        <Field label="Batch number">
          <Input
            value={form.batchNumber}
            onChange={(e) => set("batchNumber", e.target.value)}
          />
        </Field>
        <Field label="Expiry alert (days)">
          <Input
            type="number"
            value={form.expiryAlertDays}
            onChange={(e) => set("expiryAlertDays", Number(e.target.value))}
          />
        </Field>
      </div>

      <Field label="Product images">
        <ImageUploader images={images} onChange={setImages} max={5} />
      </Field>

      <Field label="Short description">
        <Input
          value={form.shortDescription}
          onChange={(e) => set("shortDescription", e.target.value)}
        />
      </Field>
      <Field label="Description">
        <textarea
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={4}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Ingredients">
        <textarea
          value={form.ingredients}
          onChange={(e) => set("ingredients", e.target.value)}
          rows={2}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
        />
      </Field>
      <Field label="Dosage">
        <textarea
          value={form.dosage}
          onChange={(e) => set("dosage", e.target.value)}
          rows={2}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
        />
      </Field>

      <div className="flex gap-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.requiresPrescription}
            onChange={(e) => set("requiresPrescription", e.target.checked)}
          />
          Requires prescription (Rx)
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set("isActive", e.target.checked)}
          />
          Active (visible in store)
        </label>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={loading || slugInvalid || priceInvalid || costInvalid}
        >
          {loading ? "Saving…" : productId ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium">{label}</label>
      {children}
    </div>
  );
}