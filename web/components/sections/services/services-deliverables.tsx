"use client";

import { EditorialSplit } from "@/components/sections/editorial-split";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import type { Locale } from "@/lib/i18n";

interface Deliverable {
  key: string;
  title: string;
  items: string[];
}

export function ServicesDeliverables({
  locale,
  eyebrow,
  title,
  items,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  items: Deliverable[];
}) {
  const isAr = locale === "ar";

  return (
    <EditorialSplit
      id="deliverables"
      eyebrow={eyebrow}
      title={title}
      image={{
        src: ABOUT_IMAGES.uniqueness,
        alt: isAr ? "مخرجات الخدمة" : "Service deliverables",
      }}
      imagePosition="left"
      locale={locale}
      textSize="lg"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((d) => (
          <article
            key={d.key}
            className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[var(--brand-gray-900)] md:text-xl">{d.title}</h3>
            <ul className="mt-3 space-y-2 text-base leading-relaxed text-[var(--brand-gray-700)] md:text-lg">
              {d.items.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-red)]" />
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </EditorialSplit>
  );
}
