import { CtaBand } from "@/components/sections/cta-band";

interface AboutCtaProps {
  quote: string;
  tagline: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
}

export function AboutCta({
  quote,
  tagline,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: AboutCtaProps) {
  return (
    <CtaBand
      quote={quote}
      tagline={tagline}
      primaryHref={primaryHref}
      primaryLabel={primaryLabel}
      secondaryHref={secondaryHref}
      secondaryLabel={secondaryLabel}
    />
  );
}
