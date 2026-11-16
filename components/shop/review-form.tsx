"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { submitReviewAction } from "@/lib/actions/review";

export function ReviewForm({
  productId,
  defaultTitle = "",
}: {
  productId: string;
  defaultTitle?: string;
}) {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState(defaultTitle);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Write a review
      </Button>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please pick a rating");
      return;
    }
    setLoading(true);
    const r = await submitReviewAction({ productId, rating, title, body });
    setLoading(false);
    if (r.success) {
      toast.success("Thanks for your review!");
      setOpen(false);
      router.refresh();
    } else toast.error(r.error);
  };

  return (
    <form
      onSubmit={submit}
      className="space-y-3 rounded-lg border border-[color:var(--color-border)] p-4"
    >
      <div>
        <p className="mb-1 text-xs font-medium">Your rating</p>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="p-0.5"
              aria-label={`Rate ${n} stars`}
            >
              <Star
                className={`h-6 w-6 ${
                  n <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-400"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Title (optional)</label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium">Review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          required
          maxLength={2000}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
          placeholder="What did you like or dislike?"
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Posting…" : "Post review"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          Cancel
        </Button>
      </div>
    </form>
  );
}