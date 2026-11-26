"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const list = images.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-surface)]">
        <Image
          src={list[active]}
          alt={name}
          fill
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 ${
                i === active
                  ? "border-[color:var(--color-primary)]"
                  : "border-[color:var(--color-border)]"
              }`}
            >
              <Image
                src={img}
                alt=""
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
