"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { YoutubeEmbed } from "@/components/sections/youtube-embed";
import { MediaVideoCard } from "@/components/sections/media-video-card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import {
  AnimatedSection,
  FadeIn,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

interface VideoItem {
  slug: string;
  title: string;
  videoId: string | null;
  imageUrl: string | null;
}

interface HomeMediaSpotlightProps {
  locale: Locale;
  title: string;
  subtitle: string;
  cta: string;
  videos: VideoItem[];
}

export function HomeMediaSpotlight({
  locale,
  title,
  subtitle,
  cta,
  videos,
}: HomeMediaSpotlightProps) {
  const withVideo = videos.filter((v) => v.videoId);
  if (withVideo.length === 0) return null;

  const [featured, ...rest] = withVideo;

  return (
    <AnimatedSection className="section-spacing bg-[#fff7f6]" aria-labelledby="media-spotlight-heading">
      <div className="container-platform">
        <FadeIn className="mb-8 flex items-end justify-between gap-4">
          <SectionHeading id="media-spotlight-heading" title={title} subtitle={subtitle} />
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/media`}>{cta}</Link>
          </Button>
        </FadeIn>
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          {featured?.videoId && (
            <ScaleIn>
              <YoutubeEmbed videoId={featured.videoId} title={featured.title} />
            </ScaleIn>
          )}
          <StaggerContainer className="flex flex-col gap-3">
            {rest.slice(0, 3).map((v) => (
              <StaggerItem key={v.slug}>
                <MediaVideoCard
                  slug={v.slug}
                  title={v.title}
                  videoId={v.videoId!}
                  imageUrl={v.imageUrl}
                  locale={locale}
                  compact
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </AnimatedSection>
  );
}
