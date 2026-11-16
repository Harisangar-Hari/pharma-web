"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadProductImageAction } from "@/lib/actions/product-image";

export function ImageUploader({
  images,
  onChange,
  max = 5,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList) => {
    const remaining = max - images.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${max} images`);
      return;
    }

    setUploading(true);
    const next = [...images];

    for (const file of Array.from(files).slice(0, remaining)) {
      const fd = new FormData();
      fd.append("file", file);
      const r = await uploadProductImageAction(fd);
      if (r.success) {
        next.push(r.url);
      } else {
        toast.error(`${file.name}: ${r.error}`);
      }
    }

    setUploading(false);
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {images.map((src, i) => (
          <div
            key={i}
            className="group relative h-24 w-24 overflow-hidden rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-surface)]"
          >
            <img
              src={src}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            {i === 0 && (
              <span className="absolute left-1 top-1 rounded bg-[color:var(--color-primary)] px-1 py-0.5 text-[10px] font-medium text-white">
                Main
              </span>
            )}
            <button
              type="button"
              onClick={() => remove(i)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition group-hover:opacity-100"
              aria-label="Remove"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}

        {images.length < max && (
          <>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-[color:var(--color-border)] text-xs text-[color:var(--color-muted)] hover:border-[color:var(--color-primary)] hover:text-[color:var(--color-primary)] disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Upload className="h-5 w-5" />
              )}
              <span>{uploading ? "Uploading…" : "Add image"}</span>
            </button>
          </>
        )}
      </div>
      <p className="mt-2 text-xs text-[color:var(--color-muted)]">
        First image is the main product photo. Max {max} images, 5 MB each.
      </p>
    </div>
  );
}