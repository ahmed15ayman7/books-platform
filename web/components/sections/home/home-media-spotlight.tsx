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

  const sidebar = videos.filter((v) => v.slug !== featured.slug).slice(0, 4);
  const featuredThumb = featured.imageUrl ?? youtubeThumbnail(featured.videoId);

  return (
    <div className="min-w-0">
      <Link
        href={channel.href}
        className="mb-3 flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <h3 className="font-display text-xl font-bold text-[var(--brand-red)] sm:text-2xl">
          {channel.title}
        </h3>
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center bg-[var(--brand-red)]"
          aria-hidden="true"
        >
          <Bookmark className="h-5 w-5 fill-white text-white" />
        </span>
      </Link>

      <div
        className="grid grid-cols-[minmax(0,1fr)_72px] gap-2 sm:grid-cols-[minmax(0,1fr)_84px] sm:gap-2.5"
        dir="ltr"
      >
        <Link
          href={`/${locale}/articles/${featured.slug}`}
          className="group relative block aspect-[4/5] overflow-hidden bg-[var(--brand-gray-200)]"
        >
          <Image
            src={featuredThumb}
            alt={featured.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 50vw, 320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/25" />

          <span className="absolute start-2 top-2 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white shadow-md ring-2 ring-white/80">
            <Image src="/logo.webp" alt="" width={28} height={28} className="h-7 w-7 object-contain" />
          </span>

          <p className="absolute end-2 top-2 max-w-[58%] text-end text-[11px] font-bold leading-snug text-white drop-shadow sm:text-xs">
            {featured.title}
          </p>

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-11 w-14 items-center justify-center rounded-lg bg-[#e62117] shadow-lg transition-transform group-hover:scale-105 sm:h-12 sm:w-16">
              <Play className="ms-0.5 h-5 w-5 fill-white text-white sm:h-6 sm:w-6" aria-hidden="true" />
            </span>
          </span>
        </Link>

        {sidebar.length > 0 && (
          <div className="flex flex-col gap-2">
            {sidebar.map((video) => {
              const thumb = video.imageUrl ?? youtubeThumbnail(video.videoId, "mq");
              return (
                <button
                  key={video.slug}
                  type="button"
                  onClick={() => setFeaturedSlug(video.slug)}
                  className={cn(
                    "relative aspect-[4/3] w-full overflow-hidden bg-[var(--brand-gray-200)] ring-1 ring-[var(--brand-gray-200)] transition-all",
                    "hover:ring-[var(--brand-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
                  )}
                  aria-label={video.title}
                >
                  <Image src={thumb} alt="" fill className="object-cover" sizes="84px" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/95 shadow">
                      <Play className="ms-0.5 h-3 w-3 fill-[var(--brand-red)] text-[var(--brand-red)]" aria-hidden="true" />
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
        <FadeIn className="mb-8">
          <h2
            id="media-spotlight-heading"
            className="font-display text-display-xs font-bold text-[var(--brand-gray-900)]"
          >
            {title}
          </h2>
        </FadeIn>

        <div
          className={cn(
            "grid gap-8",
            visible.length > 1 ? "md:grid-cols-2" : "max-w-xl",
          )}
        >
          {visible.map((channel) => (
            <MediaChannelBlock key={channel.key} locale={locale} channel={channel} />
          ))}
        </div>

        <FadeIn delay={0.15} className="mt-8 text-center">
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
