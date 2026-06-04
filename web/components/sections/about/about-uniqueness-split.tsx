"use client";

import { EditorialSplit } from "@/components/sections/editorial-split";
import { NumberedFeatureList } from "@/components/sections/numbered-feature-list";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import type { Locale } from "@/lib/i18n";

interface AboutUniquenessSplitProps {
  eyebrow: string;
  title: string;
  items: string[];
  locale: Locale;
}

export function AboutUniquenessSplit({
  eyebrow,
  title,
  items,
  locale,
}: AboutUniquenessSplitProps) {
  const isAr = locale === "ar";

  return (
    <EditorialSplit
      id="unique"
      eyebrow={eyebrow}
      title={title}
      image={{
        src: ABOUT_IMAGES.uniqueness,
        alt: isAr ? "تميّز المنصة" : "Platform uniqueness",
      }}
      imagePosition="right"
      locale={locale}
    >
      <NumberedFeatureList items={items} columns={2} />
    </EditorialSplit>
  );
}
