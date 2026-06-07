"use client";

import { BookMarked, FileText, Mic, Newspaper, Search, Share2 } from "lucide-react";
import type { ServicePillar } from "@/lib/content/services";
import type { AboutValue } from "@/lib/content/about";
import type { Locale } from "@/lib/i18n";
import { AboutValuesGrid } from "@/components/sections/about/about-values-grid";

const PILLAR_ICONS = {
  biblio: BookMarked,
  journal: Newspaper,
  research: Search,
  av: Mic,
  social: Share2,
  cms: FileText,
} as const;

export function ServicesPillarsGrid({
  locale,
  eyebrow,
  title,
  items,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  items: ServicePillar[];
}) {
  const values: AboutValue[] = items.map((item) => ({
    key: item.key,
    title: item.title,
    body: item.body,
  }));

  return (
    <AboutValuesGrid
      locale={locale}
      id="pillars"
      eyebrow={eyebrow}
      title={title}
      items={values}
      icons={PILLAR_ICONS}
      defaultIcon={BookMarked}
      textSize="lg"
      cardSize="lg"
      columns={3}
    />
  );
}
