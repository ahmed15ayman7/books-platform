"use client";

import Link from "next/link";
import { SectionBlock } from "@/components/sections/section-block";
import { MediaVideoCard } from "@/components/sections/media-video-card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { StaggerContainer, StaggerItem, FadeIn } from "@/components/motion";

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
    <SectionBlock id="media" eyebrow={eyebrow} title={title} lead={lead} textSize="lg" staggerChildren={false}>
      {withVideo.length === 0 ? (
        <FadeIn>
          <div className="rounded-xl border border-dashed border-[var(--brand-gray-300)] bg-white p-10 text-center">
            <p className="text-lg text-[var(--brand-gray-600)] md:text-xl">
              {isAr ? "تابع أحدث الفيديوهات على قنوات الميديا." : "Follow the latest videos on our media channels."}
            </p>
            <Button asChild className="mt-5" variant="outline" size="lg">
              <Link href={`/${locale}/media`}>
                {isAr ? "تصفّح القنوات" : "Browse channels"}
              </Link>
            </Button>
          </div>
        </FadeIn>
      ) : (
        <>
          <StaggerContainer className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          <FadeIn className="mt-6 flex flex-wrap gap-4">
            <Link
              href={`/${locale}/media/books-talk`}
              className="text-base font-medium text-[var(--brand-red)] hover:underline md:text-lg"
            >
              {isAr ? "حديث الكتب" : "Books Talk"} →
            </Link>
            <Link
              href={`/${locale}/media/novel-story`}
              className="text-base font-medium text-[var(--brand-red)] hover:underline md:text-lg"
            >
              {isAr ? "رواية فحكاية" : "Novel & Story"} →
            </Link>
          </FadeIn>
        </>
      )}
    </SectionBlock>
  );
}
