"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import {
  AnimatedSection,
  RevealLines,
  StaggerContainer,
  StaggerItem,
  HoverLift,
} from "@/components/motion";

interface HomeMissionStripProps {
  locale: Locale;
  quote: string;
  primaryLabel: string;
  secondaryLabel: string;
}

export function HomeMissionStrip({
  locale,
  quote,
  primaryLabel,
  secondaryLabel,
}: HomeMissionStripProps) {
  return (
    <AnimatedSection className="bg-[var(--brand-black)] py-10 text-center text-white">
      <div className="container-platform">
        <RevealLines
          lines={[quote]}
          lineClassName="mx-auto max-w-3xl font-display text-lg font-bold md:text-xl"
        />
        <StaggerContainer className="mt-6 flex flex-wrap justify-center gap-4" delay={0.3}>
          <StaggerItem>
            <HoverLift>
              <Button asChild>
                <Link href={`/${locale}/books`}>{primaryLabel}</Link>
              </Button>
            </HoverLift>
          </StaggerItem>
          <StaggerItem>
            <HoverLift>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white hover:text-[var(--brand-red)]">
                <Link href={`/${locale}/about`}>{secondaryLabel}</Link>
              </Button>
            </HoverLift>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
