"use client";

import type { ReactNode } from "react";
import { SectionBlock } from "@/components/sections/section-block";
import { SafeImage } from "@/components/ui/safe-image";
import type { Locale } from "@/lib/i18n";
import { BlurIn, SlideIn, FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

interface EditorialSplitProps {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  image: { src: string; alt: string };
  imagePosition: "left" | "right";
  locale: Locale;
  variant?: "default" | "dark" | "band";
  textSize?: "default" | "lg";
}

export function EditorialSplit({
  id,
  eyebrow,
  title,
  lead,
  children,
  image,
  imagePosition,
  locale: _locale,
  variant = "default",
  textSize = "default",
}: EditorialSplitProps) {
  const imageFirst = imagePosition === "left";

  const content = (
    <div className={cn("grid items-center gap-8 lg:grid-cols-2", imageFirst && "lg:[direction:ltr]")}>
      <BlurIn className={cn(!imageFirst && "lg:order-2")}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <SafeImage
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width:1024px) 100vw, 50vw"
          />
        </div>
      </BlurIn>
      <SlideIn from={imageFirst ? "end" : "start"} className={cn(!imageFirst && "lg:order-1")}>
        <div className="space-y-4">
          {lead && (
            <FadeIn>
              <p className="text-lg font-medium leading-relaxed text-[var(--brand-gray-700)]">{lead}</p>
            </FadeIn>
          )}
          {children}
        </div>
      </SlideIn>
    </div>
  );

  if (variant === "band") {
    return (
      <section id={id} className="rounded-2xl bg-[var(--brand-gray-100)] px-6 py-10 md:px-10">
        {(eyebrow || title) && (
          <div className="mb-8">
            {eyebrow && (
              <p className="text-sm font-semibold uppercase tracking-wider text-[var(--brand-red)]">{eyebrow}</p>
            )}
            <h2 className="mt-1 font-display text-2xl font-bold text-[var(--brand-gray-900)]">{title}</h2>
          </div>
        )}
        {content}
      </section>
    );
  }

  return (
    <SectionBlock id={id} eyebrow={eyebrow} title={title} textSize={textSize} staggerChildren={false}>
      {content}
    </SectionBlock>
  );
}
