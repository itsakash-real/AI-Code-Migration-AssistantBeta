import { Suspense } from "react";
import { MigrateClient } from "./MigrateClient";

export const metadata = {
  title: "AI Code Migration Assistant | Migrate",
};

export default function MigratePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            AI Code Migration Assistant
            <span className="ml-2 align-middle rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-xs font-medium text-[var(--color-muted-foreground)]">Beta</span>
          </h1>
          <p className="mt-2 text-[var(--color-muted-foreground)]">
            Translate code between languages and frameworks while preserving behavior and best practices.
          </p>
        </div>
        <div className="mt-2 sm:mt-0 text-xs text-[var(--color-muted-foreground)]">
          Press Ctrl/⌘ + Enter to run
        </div>
      </div>

      <div className="mt-4 rounded-md border border-[var(--color-border)] bg-[var(--color-secondary)] px-3 py-2 text-sm text-[var(--color-secondary-foreground)]" role="status" aria-live="polite">
        5 free runs/day. We don't store your code — processed transiently for migration only.
      </div>

      <Suspense fallback={<div className="mt-8 text-sm text-[var(--color-muted-foreground)]">Loading migration UI…</div>}>
        <div className="mt-8">
          <MigrateClient />
        </div>
      </Suspense>
    </div>
  );
}