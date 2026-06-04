import Link from "next/link";
import { BookOpen, Languages, PenTool, Search } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/lib/i18n";

const ICONS = [Search, BookOpen, Languages, PenTool];
const HREFS = ["books", "articles/harvest", "books/nominated-for-translation", "publish"];

interface HomeReaderJourneyProps {
  locale: Locale;
  title: string;
  steps: { key: string; title: string; desc: string }[];
}

export function HomeReaderJourney({ locale, title, steps }: HomeReaderJourneyProps) {
  return (
    <section className="section-spacing bg-white" aria-labelledby="reader-journey-heading">
      <div className="container-platform">
        <SectionHeading id="reader-journey-heading" title={title} className="mb-8" />
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-4 md:overflow-visible">
          {steps.map((step, i) => {
            const Icon = ICONS[i] ?? Search;
            return (
              <Link
                key={step.key}
                href={`/${locale}/${HREFS[i]}`}
                className="min-w-[200px] snap-start rounded-xl border border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] p-5 transition-shadow hover:shadow-md md:min-w-0"
              >
                <Icon className="h-8 w-8 text-[var(--brand-red)]" aria-hidden="true" />
                <h3 className="mt-3 font-bold text-[var(--brand-gray-900)]">{step.title}</h3>
                <p className="mt-1 text-sm text-[var(--brand-gray-600)]">{step.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
