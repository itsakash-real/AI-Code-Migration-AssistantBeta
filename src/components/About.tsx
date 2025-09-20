"use client";

// About: Brief description and benefits (image removed, single-column layout)
export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="border-b border-[var(--color-border)]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div>
          <h2 id="about-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Why AI Code Migration Assistant?
          </h2>
          <p className="mt-4 text-pretty text-[var(--color-muted-foreground)]">
            Modernize legacy systems and move between stacks with confidence. Our assistant translates
            code across languages and frameworks while preserving behavior, edge cases, and performance—
            producing idiomatic output that fits your target ecosystem.
          </p>
          <ul className="mt-6 grid list-disc gap-2 pl-5 text-[var(--color-foreground)]/90">
            <li>Retains logic, error paths, and important invariants during translation.</li>
            <li>Maps frameworks and libraries to practical, well-supported alternatives.</li>
            <li>Outputs idiomatic code aligned with community conventions and best practices.</li>
          </ul>

          {/* Subtle callout for extra polish */}
          <div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-secondary)] p-4 text-sm text-[var(--color-muted-foreground)]">
            Tip: Add migration notes (framework versions, constraints, performance goals) on the migrate page
            for more precise translations.
          </div>
        </div>
      </div>
    </section>
  );
}