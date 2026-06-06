"use client";

import Link from "next/link";
import { SectionBlock } from "@/components/sections/section-block";
import { MediaVideoCard } from "@/components/sections/media-video-card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/motion";

interface VideoItem {
  slug: string;
  title: string;
  videoId: string | null;
  imageUrl: string | null;
}

interface AboutMediaShowcaseProps {
  locale: Locale;
  eyebrow: string;
  title: string;
  lead: string;
  videos: VideoItem[];
}

export function AboutMediaShowcase({
  locale,
  eyebrow,
  title,
  lead,
  videos,
}: AboutMediaShowcaseProps) {
  const withVideo = videos.filter((v) => v.videoId);
  const isAr = locale === "ar";

  return (
    <SectionBlock id="media" eyebrow={eyebrow} title={title} lead={lead} staggerChildren={false}>
      {withVideo.length === 0 ? (
        <FadeIn>
          <div className="rounded-xl border border-dashed border-[var(--brand-gray-300)] bg-white p-8 text-center">
            <p className="text-[var(--brand-gray-600)]">
              {isAr ? "تابع أحدث الفيديوهات على قنوات الميديا." : "Follow the latest videos on our media channels."}
            </p>
            <Button asChild className="mt-4" variant="outline">
              <Link href={`/${locale}/media`}>
                {isAr ? "تصفّح القناة" : "Browse channel"}
              </Link>
            </Button>
          </div>
        </FadeIn>
      ) : (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {withVideo.slice(0, 3).map((v) => (
            <StaggerItem key={v.slug}>
              <MediaVideoCard
                slug={v.slug}
                title={v.title}
                videoId={v.videoId!}
                imageUrl={v.imageUrl}
                locale={locale}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </SectionBlock>
  );
}
