"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight, GitPullRequest, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    title: "Cross‑Language Translation",
    description:
      "Convert code between languages (e.g., Python ⇄ TypeScript, Java ⇄ Go) while preserving logic and behavior.",
    Icon: ArrowLeftRight,
  },
  {
    title: "Framework‑to‑Framework",
    description:
      "Migrate between frameworks (Express → FastAPI, Jest → Vitest, React → SvelteKit) with idiomatic patterns.",
    Icon: GitPullRequest,
  },
  {
    title: "Safety & Correctness",
    description:
      "Guardrails to minimize insecure patterns and retain edge‑case handling, error paths, and performance.",
    Icon: ShieldCheck,
  },
  {
    title: "Idiomatic Best Practices",
    description:
      "Output follows target ecosystem conventions: types, project structure, and modern APIs.",
    Icon: Sparkles,
  },
];

// Features: Grid of informative cards with icons, titles, and descriptions
export default function Features() {
  return (
    <section id="features" aria-labelledby="features-heading" className="border-b border-[var(--color-border)] bg-[var(--color-secondary)]/40">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="features-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Built for reliable code migrations
          </h2>
          <p className="mt-3 text-[var(--color-muted-foreground)]">
            Translate logic across languages and frameworks—without sacrificing readability or safety.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ title, description, Icon }) => (
            <Card
              key={title}
              className="group h-full border-[color:var(--color-border)]/80 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <CardHeader>
                <div className="mb-2 inline-flex size-10 items-center justify-center rounded-md bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
                <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-1 w-0 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-16" aria-hidden />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}