"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// Hero: Prominent headline, subheadline, CTA (image removed, unique gradient backdrop)
export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-[var(--color-border)]"
      aria-labelledby="hero-heading"
    >
      {/* Decorative gradient aura for a unique look (no images) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-10%] h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-3xl [background:radial-gradient(60%_60%_at_50%_50%,color:var(--color-primary)/12,transparent_70%)]" />
        <div className="absolute right-[-10%] bottom-[-10%] h-[22rem] w-[22rem] rounded-full blur-3xl [background:radial-gradient(60%_60%_at_50%_50%,color:var(--color-chart-3)/14,transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {/* Text content only */}
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1 text-xs text-[var(--color-muted-foreground)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-chart-2)]" />
            AI Code Migration Assistant
          </div>
          <h1
            id="hero-heading"
            className="text-balance text-4xl font-bold tracking-tight sm:text-5xl"
          >
            Translate Code Between Languages—Safely, Accurately, and Fast
          </h1>
          <p className="text-pretty text-base leading-relaxed text-[var(--color-muted-foreground)] sm:text-lg">
            Migrate logic from one language or framework to another while preserving functionality, performance, and best practices.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="transition-transform hover:scale-[1.02]">
              <Link href="/migrate" aria-label="Start a code migration">Start Migration</Link>
            </Button>
            <Button asChild variant="secondary" className="transition-colors">
              <Link href="#features" aria-label="See how the migration works">
                How it works
              </Link>
            </Button>
          </div>

          {/* Minimal helper hint for keyboard users */}
          <p className="text-xs text-[var(--color-muted-foreground)]">Paste your source code on the migrate page to get started</p>
        </div>
      </div>
    </section>
  );
}