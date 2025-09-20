"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

// Header: Responsive navigation with logo and CTA
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)]/80 bg-[var(--color-background)]/80 backdrop-blur supports-[backdrop-filter]:bg-[color:var(--color-background)/0.6]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="#top" className="group inline-flex items-center gap-2">
          <span className="inline-grid size-8 place-items-center rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm transition-transform group-hover:scale-105">
            GV
          </span>
          <span className="text-lg font-semibold tracking-tight">Genevion</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          <Link href="#top" className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
            Home
          </Link>
          <Link href="#features" className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
            Features
          </Link>
          <Link href="#about" className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
            About
          </Link>
          <Link href="#faq" className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
            FAQ
          </Link>
          <Link href="/migrate" className="text-sm text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
            Migrate
          </Link>
          <Button asChild className="ml-2">
            <Link href="/migrate" aria-label="Start AI code migration now">
              Try Now
            </Link>
          </Button>
        </nav>

        {/* Mobile menu button */}
        <button
          aria-label="Open menu"
          className="inline-flex items-center justify-center rounded-md p-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)] md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Nav Drawer (simple) */}
      {open && (
        <div className="border-t border-[var(--color-border)] bg-[var(--color-background)] md:hidden">
          <nav className="mx-auto grid max-w-7xl gap-1 px-4 py-3 sm:px-6" aria-label="Mobile">
            <Link
              href="#top"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
            >
              Home
            </Link>
            <Link
              href="#features"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
            >
              Features
            </Link>
            <Link
              href="#about"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
            >
              About
            </Link>
            <Link
              href="#faq"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
            >
              FAQ
            </Link>
            <Link
              href="#contact"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
            >
              Contact
            </Link>
            <Link
              href="/migrate"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-[var(--color-foreground)] hover:bg-[var(--color-muted)]"
            >
              Migrate
            </Link>
            <Button asChild className="mt-1">
              <Link href="/migrate" onClick={() => setOpen(false)}>
                Try Now
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}