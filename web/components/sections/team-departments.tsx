"use client";

import { BookOpen, Cpu, Megaphone } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { SectionBlock } from "@/components/sections/section-block";
import { ValueCard, ValueCardGrid } from "@/components/sections/value-card";

interface Department {
  key: string;
  title: string;
  body: string;
}

interface TeamDepartmentsProps {
  locale: Locale;
  eyebrow: string;
  title: string;
  items: Department[];
}

const ICONS = {
  editorial: BookOpen,
  tech: Cpu,
  marketing: Megaphone,
} as const;

export function TeamDepartments({ eyebrow, title, items }: TeamDepartmentsProps) {
  return (
    <SectionBlock id="departments" eyebrow={eyebrow} title={title}>
      <ValueCardGrid>
        {items.map((item) => {
          const Icon = ICONS[item.key as keyof typeof ICONS] ?? BookOpen;
          return (
            <ValueCard key={item.key} icon={Icon} title={item.title} body={item.body} />
          );
        })}
      </ValueCardGrid>
    </SectionBlock>
  );
}
