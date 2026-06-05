"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/media/youtube";
import type { Locale } from "@/lib/i18n";
import { AnimatedSection, FadeIn } from "@/components/motion";

export interface HomeMediaVideo {
  slug: string;
  title: string;
  videoId: string;
  imageUrl: string | null;
}

export interface HomeMediaChannel {
  key: string;
  title: string;
  href: string;
  videos: HomeMediaVideo[];
}

interface HomeMediaSpotlightProps {
  locale: Locale;
  title: string;
  channels: HomeMediaChannel[];
}

function MediaChannelBlock({
  locale,
  channel,
}: {
  locale: Locale;
  channel: HomeMediaChannel;
}) {
  const videos = channel.videos.filter((v) => v.videoId);
  const [featuredSlug, setFeaturedSlug] = useState(videos[0]?.slug ?? "");
  const featured = videos.find((v) => v.slug === featuredSlug) ?? videos[0];

  if (!featured) return null;

  const sidebar = videos.filter((v) => v.slug !== featured.slug).slice(0, 3);
  const featuredThumb = featured.imageUrl ?? youtubeThumbnail(featured.videoId);

  return (
    <div className="min-w-0">
      <Link
        href={channel.href}
        className="mb-2 flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <h3 className="font-display text-base font-bold text-[var(--brand-red)] sm:text-lg">
          {channel.title}
        </h3>
        <span
          className="flex h-7 w-7 shrink-0 items-center justify-center bg-[var(--brand-red)]"
          aria-hidden="true"
        >
          <Bookmark className="h-3.5 w-3.5 fill-white text-white" />
        </span>
      </Link>

      <div
        className="grid grid-cols-[minmax(0,1fr)_52px] gap-1.5 sm:grid-cols-[minmax(0,1fr)_60px] sm:gap-2"
        dir="ltr"
      >
        <Link
          href={`/${locale}/articles/${featured.slug}`}
          className="group relative block aspect-video overflow-hidden bg-[var(--brand-gray-200)]"
        >
          <Image
            src={featuredThumb}
            alt={featured.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 45vw, 280px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />

          <span className="absolute start-1.5 top-1.5 flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-white shadow-md ring-1 ring-white/80">
            <Image src="/logo.webp" alt="" width={22} height={22} className="h-5 w-5 object-contain" />
          </span>

          <p className="absolute end-1.5 top-1.5 max-w-[58%] text-end text-[9px] font-bold leading-snug text-white drop-shadow sm:text-[10px]">
            {featured.title}
          </p>

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-8 w-10 items-center justify-center rounded-md bg-[#e62117] shadow-lg transition-transform group-hover:scale-105 sm:h-9 sm:w-11">
              <Play className="ms-0.5 h-4 w-4 fill-white text-white" aria-hidden="true" />
            </span>
          </span>
        </Link>

        {sidebar.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {sidebar.map((video) => {
              const thumb = video.imageUrl ?? youtubeThumbnail(video.videoId, "mq");
              return (
                <button
                  key={video.slug}
                  type="button"
                  onClick={() => setFeaturedSlug(video.slug)}
                  className={cn(
                    "relative aspect-video w-full overflow-hidden bg-[var(--brand-gray-200)] ring-1 ring-[var(--brand-gray-200)] transition-all",
                    "hover:ring-[var(--brand-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
                  )}
                  aria-label={video.title}
                >
                  <Image src={thumb} alt="" fill className="object-cover" sizes="60px" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/95 shadow">
                      <Play className="ms-0.5 h-2.5 w-2.5 fill-[var(--brand-red)] text-[var(--brand-red)]" aria-hidden="true" />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function HomeMediaSpotlight({ locale, title, channels }: HomeMediaSpotlightProps) {
  const visible = channels.filter((c) => c.videos.some((v) => v.videoId));
  if (visible.length === 0) return null;

  const isAr = locale === "ar";

  return (
    <AnimatedSection className="section-spacing bg-[var(--brand-gray-50)]" aria-labelledby="media-spotlight-heading">
      <div className="container-platform">
        <FadeIn className="mb-5">
          <h2
            id="media-spotlight-heading"
            className="font-display text-lg font-bold text-[var(--brand-gray-900)] sm:text-xl"
          >
            {title}
          </h2>
        </FadeIn>

        <div
          className={cn(
            "mx-auto grid gap-5",
            visible.length > 1 ? "max-w-3xl md:grid-cols-2 md:gap-6" : "max-w-sm",
          )}
        >
          {visible.map((channel) => (
            <MediaChannelBlock key={channel.key} locale={locale} channel={channel} />
          ))}
        </div>

        <FadeIn delay={0.15} className="mt-5 text-center">
          <Link
            href={`/${locale}/media`}
            className="text-sm font-semibold text-[var(--brand-red)] hover:underline"
          >
            {isAr ? "كل إبداعات الميديا ←" : "All media →"}
          </Link>
        </FadeIn>
      </div>
    </AnimatedSection>
  );
}
