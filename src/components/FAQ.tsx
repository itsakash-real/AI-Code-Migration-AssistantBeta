"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// FAQ: Common questions about the AI code review tool
export default function FAQ() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="border-b border-[var(--color-border)] bg-[var(--color-secondary)]/40">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 id="faq-heading" className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-[var(--color-muted-foreground)]">Answers to common questions about the AI Code Migration Assistant.</p>
        </div>

        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="what-is-migration-assistant">
              <AccordionTrigger>What is the AI Code Migration Assistant?</AccordionTrigger>
              <AccordionContent>
                It translates code and project logic between programming languages and frameworks (e.g., TypeScript → Python,
                Express → FastAPI) while preserving behavior, performance considerations, and edge cases—outputting idiomatic
                code for the target ecosystem.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="how-accurate">
              <AccordionTrigger>How accurate are migrations?</AccordionTrigger>
              <AccordionContent>
                Accuracy depends on input clarity and ecosystem parity. We apply guardrails, retain error paths and invariants,
                and map APIs to practical equivalents. Add notes (versions, constraints) on the migrate page to improve results.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="what-languages-are-supported">
              <AccordionTrigger>What languages are supported?</AccordionTrigger>
              <AccordionContent>
                Popular languages are supported, including TypeScript/JavaScript, Python, Go, Java, C#, Ruby, PHP, Rust, Kotlin,
                and Swift. Framework mapping is supported for common stacks; where no 1:1 exists, we propose viable alternatives.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="is-my-code-secure">
              <AccordionTrigger>Is my code secure?</AccordionTrigger>
              <AccordionContent>
                Yes. The API key is used server-side, and requests are handled via our API route. We do not store your code; it is
                processed for the purpose of migration and returned to you. Use self-hosting and private networks for sensitive code.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  );
}