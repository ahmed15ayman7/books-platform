"use client";

import type { LucideIcon } from "lucide-react";
import { Compass, Eye, Shield, Target } from "lucide-react";
import type { AboutValue } from "@/lib/content/about";
import type { Locale } from "@/lib/i18n";
import { getLocalizedValue } from "@/lib/content/about";
import { SectionBlock } from "@/components/sections/section-block";
import { ValueCard, ValueCardGrid } from "@/components/sections/value-card";
import { cn } from "@/lib/utils";

const DEFAULT_ICONS = {
  vision: Eye,
  mission: Compass,
  objectives: Target,
  policies: Shield,
} as const;

interface AboutValuesGridProps {
  locale: Locale;
  id?: string;
  eyebrow: string;
  title: string;
  items: AboutValue[];
  icons?: Record<string, LucideIcon>;
  defaultIcon?: LucideIcon;
  textSize?: "default" | "lg";
  cardSize?: "default" | "lg";
  columns?: 3 | 4;
}

export function AboutValuesGrid({
  locale,
  id = "values",
  eyebrow,
  title,
  items,
  icons = DEFAULT_ICONS,
  defaultIcon = Eye,
  textSize = "default",
  cardSize = "default",
  columns = 4,
}: AboutValuesGridProps) {
  return (
    <SectionBlock id={id} eyebrow={eyebrow} title={title} textSize={textSize} staggerChildren={false}>
      <ValueCardGrid className={cn(columns === 3 && "lg:grid-cols-3")}>
        {items.map((item) => {
          const localized = getLocalizedValue(item, locale);
          const Icon = icons[item.key] ?? defaultIcon;
          return (
            <ValueCard
              key={item.key}
              icon={Icon}
              title={localized.title}
              body={localized.body}
              imageUrl={localized.imageUrl}
              imageAlt={localized.imageAlt}
              size={cardSize}
            />
          );
        })}
      </ValueCardGrid>
    </SectionBlock>
  );
}
