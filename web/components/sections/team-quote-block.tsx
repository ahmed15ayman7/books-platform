"use client";

import { RevealLines, FadeIn, HoverLift } from "@/components/motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TeamQuoteBlock({ quote, ctaHref, ctaLabel }: { quote: string; ctaHref: string; ctaLabel: string }) {
  return (
    <>
      <RevealLines
        lines={[quote]}
        lineClassName="mx-auto max-w-2xl border-s-4 border-[var(--brand-red)] ps-6 text-center text-base italic text-[var(--brand-gray-700)] md:text-lg"
      />
      <FadeIn delay={0.2} className="text-center">
        <HoverLift className="inline-block">
          <Button asChild variant="outline" size="lg">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </HoverLift>
      </FadeIn>
    </>
  );
}
