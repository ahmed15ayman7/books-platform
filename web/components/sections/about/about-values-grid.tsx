"use client";

import { Compass, Eye, Shield, Target } from "lucide-react";
import type { AboutValue } from "@/lib/content/about";
import type { Locale } from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/content/about";
import { SectionBlock } from "@/components/sections/section-block";
import { ValueCard, ValueCardGrid } from "@/components/sections/value-card";

const ICONS = {
  vision: Eye,
  mission: Compass,
  objectives: Target,
  policies: Shield,
} as const;

interface AboutValuesGridProps {
  locale: Locale;
  eyebrow: string;
  title: string;
  items: AboutValue[];
}

export function AboutValuesGrid({ locale, eyebrow, title, items }: AboutValuesGridProps) {
  return (
    <SectionBlock id="values" eyebrow={eyebrow} title={title} staggerChildren={false}>
      <ValueCardGrid>
        {items.map((item) => {
          const localized = getLocalizedValue(item, locale);
          const Icon = ICONS[item.key as keyof typeof ICONS] ?? Eye;
          return (
            <ValueCard
              key={item.key}
              icon={Icon}
              title={localized.title}
              body={localized.body}
              imageUrl={localized.imageUrl}
              imageAlt={localized.imageAlt}
            />
          );
        })}
      </ValueCardGrid>
    </SectionBlock>
  );
}
