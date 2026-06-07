"use client";

import { AnimatedSection, RevealLines, FadeIn } from "@/components/motion";

interface ServicesQuoteBandProps {
  quote: string;
}

export function ServicesQuoteBand({ quote }: ServicesQuoteBandProps) {
  return (
    <AnimatedSection>
      <div className="rounded-2xl border border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] px-6 py-12 text-center md:px-10 md:py-14">
        <RevealLines
          lines={[quote]}
          lineClassName="mx-auto max-w-3xl font-display text-xl font-bold text-[var(--brand-gray-900)] md:text-2xl"
        />
        <FadeIn delay={0.2}>
          <div className="mx-auto mt-5 h-1 w-16 rounded-full bg-[var(--brand-red)]" />
        </FadeIn>
      </div>
    </AnimatedSection>
  );
}
