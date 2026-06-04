"use client";

import { StatsCounter } from "@/components/sections/stats-counter";
import { AnimatedSection } from "@/components/motion";
import type { Locale } from "@/lib/i18n";

interface AboutStatsBandProps {
  locale: Locale;
  totalBooks: number;
  totalPublishers: number;
  totalTranslatedBooks: number;
  totalCountries: number;
}

export function AboutStatsBand(props: AboutStatsBandProps) {
  return (
    <AnimatedSection className="bg-[#fff7f6]">
      <StatsCounter {...props} />
    </AnimatedSection>
  );
}
