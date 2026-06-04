"use client";

import { useState } from "react";
import Link from "next/link";
import { YoutubeEmbed } from "@/components/sections/youtube-embed";
import { MediaVideoCard } from "@/components/sections/media-video-card";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Locale } from "@/lib/i18n";

export interface BookMediaItem {
  slug: string;
  title: string;
  videoId: string | null;
  imageUrl: string | null;
  channel: string | null;
}

interface BookMediaSectionProps {
  locale: Locale;
  videos: BookMediaItem[];
}

export function BookMediaSection({ locale, videos }: BookMediaSectionProps) {
  const isAr = locale === "ar";
  const withVideo = videos.filter((v) => v.videoId);
  const [featuredId, setFeaturedId] = useState(withVideo[0]?.videoId ?? null);
  const featured = withVideo.find((v) => v.videoId === featuredId) ?? withVideo[0];

  if (!featured?.videoId) return null;

  return (
    <section aria-labelledby="book-media-heading">
      <SectionHeading
        id="book-media-heading"
        title={isAr ? "شاهد الكتاب" : "Watch the Book"}
        className="mb-6"
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <YoutubeEmbed
          videoId={featured.videoId}
          title={featured.title}
        />
        {withVideo.length > 1 && (
          <div className="flex flex-col gap-3">
            {withVideo.map((video) => (
              <MediaVideoCard
                key={video.slug}
                slug={video.slug}
                title={video.title}
                videoId={video.videoId!}
                imageUrl={video.imageUrl}
                locale={locale}
                compact
                active={video.videoId === featured.videoId}
                onSelect={() => video.videoId && setFeaturedId(video.videoId)}
              />
            ))}
          </div>
        )}
      </div>
      <p className="mt-4 text-center">
        <Link
          href={`/${locale}/media`}
          className="text-sm font-medium text-[var(--brand-red)] hover:underline"
        >
          {isAr ? "المزيد في شاهد كتابك" : "More on Watch Your Book"}
        </Link>
      </p>
    </section>
  );
}
