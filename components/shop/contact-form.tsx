"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendContactMessageAction } from "@/lib/actions/contact";

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setError(null);
    const r = await sendContactMessageAction({
      name: String(fd.get("name") ?? ""),
      email: String(fd.get("email") ?? ""),
      message: String(fd.get("message") ?? ""),
    });
    setLoading(false);
    if (r.success) {
      setSent(true);
    } else {
      setError(r.error);
    }
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-[color:var(--color-border)] bg-green-50 p-5 text-sm">
        <p className="font-medium text-green-800">Message sent</p>
        <p className="mt-1 text-green-700">We&apos;ll get back to you within 24 hours.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-3 rounded-lg border border-[color:var(--color-border)] p-5"
    >
      <div>
        <label className="mb-1 block text-xs font-medium">Name</label>
        <Input name="name" required />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Email</label>
        <Input name="email" type="email" required />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium">Message</label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-[color:var(--color-border)] px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-xs text-[color:var(--color-danger)]">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}