import type { Locale } from "@/lib/i18n";
import { ServicesSectionHeading } from "@/components/sections/services/services-section-heading";
import { cn } from "@/lib/utils";

interface ServicesPlatformListProps {
  locale: Locale;
  title: string;
  intro: string;
  items: string[];
}

export function ServicesPlatformList({ locale, title, intro, items }: ServicesPlatformListProps) {
  const isAr = locale === "ar";

  return (
    <section id="platform-services" dir={isAr ? "rtl" : "ltr"}>
      <ServicesSectionHeading title={title} />
      <p className="mx-auto mt-8 max-w-4xl text-center text-lg leading-relaxed text-[var(--brand-gray-700)] md:text-xl">
        {intro}
      </p>
      <ol className="mx-auto mt-10 max-w-4xl space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-4">
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-red)] text-sm font-bold text-white md:h-9 md:w-9 md:text-base",
              )}
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <p className="pt-0.5 text-lg leading-relaxed text-[var(--brand-gray-800)] md:text-xl">
              {item}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
