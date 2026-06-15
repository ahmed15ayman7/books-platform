"use client";

import Link from "next/link";
import { BookOpen, Languages, PenTool, Search } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { localeHref, type Locale } from "@/lib/i18n";
import {
  AnimatedSection,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedCard,
  IconPulse,
} from "@/components/motion";

const ICONS = [Search, BookOpen, Languages, PenTool];
const HREFS = ["books", "articles/harvest", "books/nominated-for-translation", "publish"];

interface HomeReaderJourneyProps {
  locale: Locale;
  title: string;
  steps: { key: string; title: string; desc: string }[];
}

export function HomeReaderJourney({ locale, title, steps }: HomeReaderJourneyProps) {
  return (
    <AnimatedSection className="section-spacing bg-white" aria-labelledby="reader-journey-heading">
      <div className="container-platform">
        <FadeIn>
          <SectionHeading id="reader-journey-heading" title={title} className="mb-8" />
        </FadeIn>
        <StaggerContainer className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible">
          {steps.map((step, i) => {
            const Icon = ICONS[i] ?? Search;
            return (
              <StaggerItem key={step.key} className="min-w-[200px] snap-start md:min-w-0">
                <AnimatedCard>
                  <Link
                    href={localeHref(locale, `/${HREFS[i]}`)}
                    className="block rounded-xl border border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] p-5 h-full"
                  >
                    <IconPulse>
                      <Icon className="h-8 w-8 text-[var(--brand-red)]" aria-hidden="true" />
                    </IconPulse>
                    <h3 className="mt-3 font-bold text-[var(--brand-gray-900)]">{step.title}</h3>
                    <p className="mt-1 text-sm text-[var(--brand-gray-600)]">{step.desc}</p>
                  </Link>
                </AnimatedCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
