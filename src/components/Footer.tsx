"use client";

import Link from "next/link";

// Footer: Site links and copyright
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="border-t border-[var(--color-border)]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="text-center sm:text-left">
            {/* Brand */}
            <p className="text-sm font-semibold">Genevion</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">AI Code Migration Assistant</p>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm" aria-label="Footer">
            <Link href="#about" className="text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
              About
            </Link>
            <Link href="#contact" className="text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
              Contact
            </Link>
            <Link href="https://github.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
              GitHub
            </Link>
            <Link href="/privacy" className="text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--color-foreground)]">
              Privacy Policy
            </Link>
          </nav>
        </div>
        <div className="mt-6 text-center text-xs text-[var(--color-muted-foreground)]">
          © {year} Genevion. All rights reserved.
        </div>
      </div>
    </footer>
  );
}