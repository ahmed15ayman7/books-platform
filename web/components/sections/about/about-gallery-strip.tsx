"use client";

import Image from "next/image";
import { SectionBlock } from "@/components/sections/section-block";
import { pickLocale } from "@/lib/content/types";
import type { AboutImage } from "@/lib/content/about";
import type { BilingualString } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n";
import { StaggerContainer, StaggerItem, BlurIn, AnimatedCard } from "@/components/motion";

interface GalleryItem extends AboutImage {
  caption: BilingualString;
}

interface AboutGalleryStripProps {
  eyebrow: string;
  title: string;
  items: GalleryItem[];
  locale: Locale;
}

export function AboutGalleryStrip({ eyebrow, title, items, locale }: AboutGalleryStripProps) {
  return (
    <SectionBlock id="gallery" eyebrow={eyebrow} title={title} staggerChildren={false}>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        <StaggerContainer className="flex gap-4">
          {items.map((item, i) => (
            <StaggerItem key={i} className="min-w-[220px] snap-start sm:min-w-[260px]">
              <AnimatedCard>
                <figure className="overflow-hidden rounded-xl border border-[var(--brand-gray-200)] bg-white shadow-sm">
                  <BlurIn>
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={item.src}
                        alt={pickLocale(item.alt, locale)}
                        fill
                        className="object-cover"
                        sizes="260px"
                      />
                    </div>
                  </BlurIn>
                  <figcaption className="p-3 text-sm font-medium text-[var(--brand-gray-700)]">
                    {pickLocale(item.caption, locale)}
                  </figcaption>
                </figure>
              </AnimatedCard>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </SectionBlock>
  );
}
