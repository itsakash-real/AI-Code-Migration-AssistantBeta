"use client";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import About from "@/components/About";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

// Main landing page for Genevion – AI Code Migration Assistant
export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Site Header with navigation and CTA */}
      <Header />

      {/* Main content sections */}
      <main id="main" className="relative">
        {/* Hero section with headline, subheadline, and CTAs */}
        <Hero />
        {/* Features section with 4 feature cards */}
        <Features />
        {/* About section explaining benefits */}
        <About />
        {/* FAQ section answering common questions */}
        <FAQ />
      </main>

      {/* Footer with links and contact anchor */}
      <Footer />
    </div>
  );
}