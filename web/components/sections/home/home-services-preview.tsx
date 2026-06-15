"use client";

import Link from "next/link";
import { BookMarked, Mic, Newspaper } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import {
  AnimatedSection,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  AnimatedCard,
  IconPulse,
} from "@/components/motion";

const ICONS = [BookMarked, Mic, Newspaper];

interface HomeServicesPreviewProps {
  locale: Locale;
  title: string;
  subtitle: string;
  cta: string;
  items: { key: string; title: string; desc: string }[];
}

export function HomeServicesPreview({
  locale,
  title,
  subtitle,
  cta,
  items,
}: HomeServicesPreviewProps) {
  return (
    <AnimatedSection className="section-spacing bg-white" aria-labelledby="services-preview-heading">
      <div className="container-platform">
        <FadeIn className="mb-8 flex items-end justify-between gap-4">
          <SectionHeading id="services-preview-heading" title={title} subtitle={subtitle} />
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/services`}>{cta}</Link>
          </Button>
        </FadeIn>
        <StaggerContainer className="grid gap-4 sm:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i] ?? BookMarked;
            return (
              <StaggerItem key={item.key}>
                <AnimatedCard>
                  <Link
                    href={`/${locale}/services`}
                    className="block rounded-xl border border-[var(--brand-gray-200)] p-5 h-full"
                  >
                    <IconPulse>
                      <Icon className="h-7 w-7 text-[var(--brand-red)]" aria-hidden="true" />
                    </IconPulse>
                    <h3 className="mt-3 font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm text-[var(--brand-gray-600)]">{item.desc}</p>
                  </Link>
                </AnimatedCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
