import Link from "next/link";
import { Upload, FileCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/animations/reveal";

export function PrescriptionCta() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <Reveal direction="up">
        <div className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-6 md:p-10">
          <div className="grid gap-6 md:grid-cols-3 md:items-center">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold">Have a prescription?</h2>
              <p className="mt-2 text-sm text-[color:var(--color-muted)]">
                Upload it and our licensed pharmacists will verify it within a few hours. Order
                prescription medicines easily and safely.
              </p>
              <ol className="mt-4 grid gap-2 text-sm md:grid-cols-3">
                <li className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-[color:var(--color-primary)]" /> Upload
                </li>
                <li className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4 text-[color:var(--color-primary)]" /> Pharmacist
                  review
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[color:var(--color-primary)]" /> Safe
                  delivery
                </li>
              </ol>
            </div>
            <Link href="/prescription" className="md:justify-self-end">
              <Button size="lg">Upload prescription</Button>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}