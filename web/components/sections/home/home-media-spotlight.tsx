import Link from "next/link";
import { SectionHeading } from "@/components/ui/section-heading";
import { YoutubeEmbed } from "@/components/sections/youtube-embed";
import { MediaVideoCard } from "@/components/sections/media-video-card";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";

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
    <section className="section-spacing bg-[#fff7f6]" aria-labelledby="media-spotlight-heading">
      <div className="container-platform">
        <div className="mb-8 flex items-end justify-between gap-4">
          <SectionHeading id="media-spotlight-heading" title={title} subtitle={subtitle} />
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/articles/watch-your-book`}>{cta}</Link>
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_240px]">
          {featured?.videoId && (
            <YoutubeEmbed videoId={featured.videoId} title={featured.title} />
          )}
          <div className="flex flex-col gap-3">
            {rest.slice(0, 3).map((v) => (
              <MediaVideoCard
                key={v.slug}
                slug={v.slug}
                title={v.title}
                videoId={v.videoId!}
                imageUrl={v.imageUrl}
                locale={locale}
                compact
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
