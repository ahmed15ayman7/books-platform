"use client";

import { SafeImage } from "@/components/ui/safe-image";
import { SectionBlock } from "@/components/sections/section-block";
import { pickLocale } from "@/lib/content/types";
import type { AboutImage } from "@/lib/content/about";
import type { Locale } from "@/lib/i18n";
import { BlurIn, SlideIn, FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

interface AboutStorySplitProps {
  id?: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
  image: AboutImage;
  imagePosition: "left" | "right";
  locale: Locale;
  textSize?: "default" | "lg";
}

export function AboutStorySplit({
  id,
  eyebrow,
  title,
  paragraphs,
  image,
  imagePosition,
  locale,
  textSize = "default",
}: AboutStorySplitProps) {
  const imageAlt = pickLocale(image.alt, locale);
  const imageFirst = imagePosition === "left";
  const isLarge = textSize === "lg";

  return (
    <SectionBlock
      id={id}
      eyebrow={eyebrow}
      title={title}
      textSize={textSize}
      staggerChildren={false}
    >
      <div className={cn("grid items-center gap-8 lg:grid-cols-2", imageFirst && "lg:[direction:ltr]")}>
        <BlurIn className={cn(!imageFirst && "lg:order-2")}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <SafeImage src={image.src} alt={imageAlt} fill className="object-cover" sizes="(max-width:1024px) 100vw, 50vw" />
          </div>
        </BlurIn>
        <SlideIn from={imageFirst ? "end" : "start"} className={cn(!imageFirst && "lg:order-1")}>
          <div
            className={cn(
              "space-y-4 leading-relaxed text-[var(--brand-gray-700)]",
              isLarge ? "text-lg md:text-xl" : "text-base md:text-lg",
            )}
          >
            {paragraphs.map((p, i) => (
              <FadeIn key={i} delay={0.1 + i * 0.08}>
                <p>{p}</p>
              </FadeIn>
            ))}
          </div>
        </SlideIn>
      </div>
    </SectionBlock>
  );
}
