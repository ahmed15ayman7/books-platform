"use client";

import { SafeImage } from "@/components/ui/safe-image";
import { SectionBlock } from "@/components/sections/section-block";
import { pickLocale } from "@/lib/content/types";
import type { AboutImage } from "@/lib/content/about";
import type { Locale } from "@/lib/i18n";
import { BlurIn, SlideIn, FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

interface ServicesIntroSplitProps {
  id?: string;
  eyebrow: string;
  title: string;
  lead: string;
  image: AboutImage;
  imagePosition: "left" | "right";
  locale: Locale;
}

export function ServicesIntroSplit({
  id,
  eyebrow,
  title,
  lead,
  image,
  imagePosition,
  locale,
}: ServicesIntroSplitProps) {
  const imageAlt = pickLocale(image.alt, locale);
  const imageFirst = imagePosition === "left";

  return (
    <SectionBlock id={id} eyebrow={eyebrow} title={title} textSize="lg" staggerChildren={false}>
      <div className={cn("grid items-center gap-8 lg:grid-cols-2", imageFirst && "lg:[direction:ltr]")}>
        <BlurIn className={cn(!imageFirst && "lg:order-2")}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[var(--brand-gray-200)] shadow-sm">
            <SafeImage
              src={image.src}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width:1024px) 100vw, 50vw"
            />
          </div>
        </BlurIn>
        <SlideIn from={imageFirst ? "end" : "start"} className={cn(!imageFirst && "lg:order-1")}>
          <FadeIn delay={0.1}>
            <p className="text-lg leading-[1.9] text-[var(--brand-gray-700)] md:text-xl">{lead}</p>
          </FadeIn>
        </SlideIn>
      </div>
    </SectionBlock>
  );
}
