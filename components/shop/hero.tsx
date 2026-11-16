"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Truck, Clock } from "lucide-react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.from(".hero-badge", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" });
      gsap.from(".hero-title", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.1,
        ease: "power3.out",
      });
      gsap.from(".hero-sub", {
        opacity: 0,
        y: 20,
        duration: 0.7,
        delay: 0.25,
        ease: "power3.out",
      });
      gsap.from(".hero-cta > *", {
        opacity: 0,
        y: 16,
        duration: 0.5,
        delay: 0.4,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.from(".hero-card", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        delay: 0.5,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section className="bg-gradient-to-br from-[color:var(--color-primary)] to-[#0a5d4e] text-white">
      <div
        ref={containerRef}
        className="mx-auto grid max-w-7xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center"
      >
        <div>
          <p className="hero-badge mb-3 inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-medium">
            Trusted by 50,000+ customers
          </p>
          <h1 className="hero-title text-3xl font-bold leading-tight md:text-5xl">
            Your trusted online pharmacy
          </h1>
          <p className="hero-sub mt-4 max-w-md text-white/90">
            Genuine medicines, vitamins, baby care and health essentials — delivered to your door
            with pharmacist support.
          </p>
          <div className="hero-cta mt-6 flex flex-wrap gap-3">
            <Link href="/shop">
              <Button size="lg" variant="secondary">
                Shop now
              </Button>
            </Link>
            <Link href="/prescription">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
              >
                Upload prescription
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center text-sm">
          <div className="hero-card rounded-lg bg-white/10 p-4">
            <ShieldCheck className="mx-auto mb-2 h-6 w-6" />
            <p className="font-medium">100% Genuine</p>
          </div>
          <div className="hero-card rounded-lg bg-white/10 p-4">
            <Truck className="mx-auto mb-2 h-6 w-6" />
            <p className="font-medium">Fast Delivery</p>
          </div>
          <div className="hero-card rounded-lg bg-white/10 p-4">
            <Clock className="mx-auto mb-2 h-6 w-6" />
            <p className="font-medium">24/7 Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}