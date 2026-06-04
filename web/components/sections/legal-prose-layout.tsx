import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
        <p className="mb-8 rounded-lg border border-[var(--brand-gray-200)] bg-white px-4 py-3 text-sm text-[var(--brand-gray-600)] md:text-base">
          {isAr ? `آخر تحديث: ${lastUpdated}` : `Last updated: ${lastUpdated}`}
        </p>
      )}

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <aside className="lg:w-56 lg:flex-shrink-0">
          <nav
            className="sticky top-24 rounded-lg border border-[var(--brand-gray-200)] bg-white p-4"
            aria-label={isAr ? "فهرس المحتوى" : "Table of contents"}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--brand-red)]">
              {isAr ? "فهرس" : "Contents"}
            </p>
            <ul className="space-y-2 text-sm md:text-base" role="list">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-[var(--brand-gray-700)] transition-colors hover:text-[var(--brand-red)]"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              className={cn(index > 0 && "mt-10 border-t border-[var(--brand-gray-200)] pt-10")}
            >
              <h2 className="font-display text-display-xs font-bold text-[var(--brand-gray-900)] md:text-display-sm">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-7 text-[var(--brand-gray-700)]">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{renderParagraph(p)}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
