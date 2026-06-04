"use client";

import Link from "next/link";
import { SectionBlock } from "@/components/sections/section-block";
import { MediaVideoCard } from "@/components/sections/media-video-card";
import type { Locale } from "@/lib/i18n";
import { SlideIn, StaggerContainer, StaggerItem, FadeIn } from "@/components/motion";

interface MediaItem {
  slug: string;
  title: string;
  videoId: string | null;
  imageUrl: string | null;
}

export function ServicesMediaStrip({
  locale,
  eyebrow,
  title,
  lead,
  videos,
}: {
  locale: Locale;
  eyebrow: string;
  title: string;
  lead: string;
  videos: MediaItem[];
}) {
  const isAr = locale === "ar";
  const withVideo = videos.filter((v) => v.videoId);

  return (
    <SectionBlock id="media" eyebrow={eyebrow} title={title} lead={lead} staggerChildren={false}>
      <div className="grid gap-6 lg:grid-cols-2">
        <SlideIn from="start">
          <div className="space-y-3">
            <Link
              href={`/${locale}/articles/watch-your-book`}
              className="block text-sm font-medium text-[var(--brand-red)] hover:underline"
            >
              {isAr ? "شاهد كتابك" : "Watch Your Book"} →
            </Link>
            <Link
              href={`/${locale}/articles/books-talk`}
              className="block text-sm font-medium text-[var(--brand-red)] hover:underline"
            >
              {isAr ? "حديث الكتب" : "Books Talk"} →
            </Link>
          </div>
        </SlideIn>
        <StaggerContainer className="grid gap-4 sm:grid-cols-3">
          {withVideo.length > 0 ? (
            withVideo.slice(0, 3).map((v) => (
              <StaggerItem key={v.slug}>
                <MediaVideoCard
                  slug={v.slug}
                  title={v.title}
                  videoId={v.videoId!}
                  imageUrl={v.imageUrl}
                  locale={locale}
                />
              </StaggerItem>
            ))
          ) : (
            <FadeIn className="col-span-full">
              <p className="text-sm text-[var(--brand-gray-500)]">
                {isAr ? "لا توجد فيديوهات بعد — تصفّح القنوات" : "No videos yet — browse channels"}
              </p>
            </FadeIn>
          )}
        </StaggerContainer>
      </div>
    </SectionBlock>
  );
}
