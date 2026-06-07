"use client";

import { BookMarked, FileText, Mic, Newspaper, Search, Share2 } from "lucide-react";
import type { ServicePillar } from "@/lib/content/services";
import type { Locale } from "@/lib/i18n";
import { pickLocale } from "@/lib/content/types";
import { SectionBlock } from "@/components/sections/section-block";
import { ValueCard, ValueCardGrid } from "@/components/sections/value-card";

const ICONS = {
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
  return (
    <SectionBlock id="pillars" eyebrow={eyebrow} title={title} textSize="lg" staggerChildren={false}>
      <ValueCardGrid className="lg:grid-cols-3">
        {items.map((item) => {
          const Icon = ICONS[item.key as keyof typeof ICONS] ?? BookMarked;
          return (
            <ValueCard
              key={item.key}
              icon={Icon}
              title={pickLocale(item.title, locale)}
              body={pickLocale(item.body, locale)}
              size="lg"
            />
          );
        })}
      </ValueCardGrid>
    </SectionBlock>
  );
}
