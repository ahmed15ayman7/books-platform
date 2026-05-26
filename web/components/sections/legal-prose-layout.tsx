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
}

export function LegalProseLayout({ locale, sections }: LegalProseLayoutProps) {
  const isAr = locale === "ar";

  return (
    <div className="container-platform py-10">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <aside className="lg:w-56 lg:flex-shrink-0">
          <nav
            className="sticky top-24 rounded-lg border border-[var(--brand-gray-200)] bg-white p-4"
            aria-label={isAr ? "فهرس المحتوى" : "Table of contents"}
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--brand-red)]">
              {isAr ? "فهرس" : "Contents"}
            </p>
            <ul className="space-y-2 text-sm" role="list">
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
              <h2 className="font-display text-xl font-bold text-[var(--brand-gray-900)]">
                {section.title}
              </h2>
              <div className="prose prose-neutral mt-4 max-w-none text-[var(--brand-gray-700)]">
                {section.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
