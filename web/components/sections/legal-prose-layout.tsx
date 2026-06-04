"use client";

import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { FadeIn, SlideIn, StaggerContainer, StaggerItem } from "@/components/motion";

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
}

interface LegalProseLayoutProps {
  locale: Locale;
  sections: LegalSection[];
  lastUpdated?: string;
}

const URL_PATTERN = /https?:\/\/[^\s]+/g;

function renderParagraph(text: string) {
  const parts = text.split(URL_PATTERN);
  const urls = text.match(URL_PATTERN) ?? [];

  if (urls.length === 0) {
    return text;
  }

  const nodes: ReactNode[] = [];
  parts.forEach((part, index) => {
    nodes.push(part);
    if (urls[index]) {
      nodes.push(
        <a
          key={`url-${index}`}
          href={urls[index]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--brand-red)] underline hover:text-[var(--brand-red-hover)]"
        >
          {urls[index]}
        </a>,
      );
    }
  });

  return nodes;
}

export function LegalProseLayout({ locale, sections, lastUpdated }: LegalProseLayoutProps) {
  const isAr = locale === "ar";

  return (
    <div className="container-platform py-10 md:py-12">
      {lastUpdated && (
        <FadeIn>
          <p className="mb-8 rounded-lg border border-[var(--brand-gray-200)] bg-white px-4 py-3 text-sm text-[var(--brand-gray-600)] md:text-base">
            {isAr ? `آخر تحديث: ${lastUpdated}` : `Last updated: ${lastUpdated}`}
          </p>
        </FadeIn>
      )}

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <aside className="lg:w-56 lg:flex-shrink-0">
          <FadeIn direction="left">
            <nav
              className="sticky top-24 rounded-lg border border-[var(--brand-gray-200)] bg-white p-4"
              aria-label={isAr ? "فهرس المحتوى" : "Table of contents"}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--brand-red)]">
                {isAr ? "فهرس" : "Contents"}
              </p>
              <StaggerContainer className="space-y-2 text-sm md:text-base">
                {sections.map((section) => (
                  <StaggerItem key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="block text-[var(--brand-gray-700)] transition-colors hover:text-[var(--brand-red)]"
                    >
                      {section.title}
                    </a>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </nav>
          </FadeIn>
        </aside>

        <div className="min-w-0 flex-1">
          {sections.map((section, index) => (
            <FadeIn key={section.id} delay={index * 0.08}>
              <section
                id={section.id}
                className={cn(index > 0 && "mt-10 border-t border-[var(--brand-gray-200)] pt-10")}
              >
                <SlideIn from="start">
                  <h2 className="font-display text-display-xs font-bold text-[var(--brand-gray-900)] md:text-display-sm">
                    {section.title}
                  </h2>
                </SlideIn>
                <div className="mt-4 space-y-4 text-base leading-7 text-[var(--brand-gray-700)]">
                  {section.paragraphs.slice(0, 5).map((p, i) => (
                    <FadeIn key={i} delay={0.1 + i * 0.06}>
                      <p>{renderParagraph(p)}</p>
                    </FadeIn>
                  ))}
                  {section.paragraphs.slice(5).map((p, i) => (
                    <p key={i + 5}>{renderParagraph(p)}</p>
                  ))}
                </div>
              </section>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
