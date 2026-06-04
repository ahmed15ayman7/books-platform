"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AnimatedSection,
  RevealLines,
  FadeIn,
  StaggerContainer,
  StaggerItem,
  HoverLift,
} from "@/components/motion";

interface CtaBandProps {
  quote?: string;
  tagline?: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
}

export function CtaBand({
  quote,
  tagline,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  className,
}: CtaBandProps) {
  return (
    <AnimatedSection>
      <div
        className={cn(
          "rounded-2xl bg-gradient-to-br from-[var(--brand-black)] via-[#1a0a0c] to-[var(--brand-black)] px-6 py-12 text-center md:px-10 md:py-14",
          className,
        )}
      >
        {quote && (
          <RevealLines
            lines={[quote]}
            lineClassName="mx-auto max-w-2xl font-display text-xl font-bold text-white md:text-2xl"
          />
        )}
        {tagline && (
          <FadeIn delay={0.3}>
            <p className="mx-auto mt-4 max-w-xl text-sm text-[var(--brand-gray-400)] md:text-base">{tagline}</p>
          </FadeIn>
        )}
        <StaggerContainer className="mt-8 flex flex-wrap justify-center gap-4" delay={0.4}>
          <StaggerItem>
            <HoverLift>
              <Button asChild size="lg">
                <Link href={primaryHref}>{primaryLabel}</Link>
              </Button>
            </HoverLift>
          </StaggerItem>
          {secondaryHref && secondaryLabel && (
            <StaggerItem>
              <HoverLift>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/30 bg-white/10 text-white hover:bg-white hover:text-[var(--brand-red)]"
                >
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </Button>
              </HoverLift>
            </StaggerItem>
          )}
        </StaggerContainer>
      </div>
    </AnimatedSection>
  );
}
