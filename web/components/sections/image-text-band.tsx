"use client";

import type { ReactNode } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { BlurIn, SlideIn, FadeIn } from "@/components/motion";
import { cn } from "@/lib/utils";

interface ImageTextBandProps {
  id?: string;
  title: string;
  lead?: string;
  image: { src: string; alt: string };
  imagePosition?: "left" | "right";
  children?: ReactNode;
  className?: string;
}

export function ImageTextBand({
  id,
  title,
  lead,
  image,
  imagePosition = "left",
  children,
  className,
}: ImageTextBandProps) {
  const imageFirst = imagePosition === "left";

  return (
    <section id={id} className={cn("mb-10", className)}>
      <div className={cn("grid items-center gap-8 lg:grid-cols-2", imageFirst && "lg:[direction:ltr]")}>
        <BlurIn className={cn(!imageFirst && "lg:order-2")}>
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
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
          <FadeIn>
            <h2 className="font-display text-2xl font-bold text-[var(--brand-gray-900)]">{title}</h2>
          </FadeIn>
          {lead && (
            <FadeIn delay={0.1}>
              <p className="mt-3 text-base leading-relaxed text-[var(--brand-gray-600)]">{lead}</p>
            </FadeIn>
          )}
          {children && <div className="mt-6">{children}</div>}
        </SlideIn>
      </div>
    </section>
  );
}
