import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

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
    <section className="bg-[var(--brand-black)] py-10 text-center text-white">
      <div className="container-platform">
        <blockquote className="mx-auto max-w-3xl font-display text-lg font-bold md:text-xl">
          {quote}
        </blockquote>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href={`/${locale}/books`}>{primaryLabel}</Link>
          </Button>
          <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white hover:text-[var(--brand-red)]">
            <Link href={`/${locale}/about`}>{secondaryLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
