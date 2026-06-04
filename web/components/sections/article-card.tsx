"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, Play } from "lucide-react";
import { youtubeThumbnail } from "@/lib/media/youtube";
import { Badge } from "@/components/ui/badge";
import {
  CardMedia,
  CardMediaImage,
  CardMediaPlaceholder,
} from "@/components/ui/card-media";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils/formatters";
import type { ArticleLinkedBookDisplay } from "@/lib/i18n/article-linked-book";
import type { Locale } from "@/lib/i18n";

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  date?: Date | string | null;
  channel?: string | null;
  readingTimeMinutes?: number | null;
  videoId?: string | null;
  linkedBook?: ArticleLinkedBookDisplay;
  locale: Locale;
  className?: string;
  featured?: boolean;
}

const channelLabels: Record<string, { ar: string; en: string }> = {
  harvest: { ar: "حصاد الكتب", en: "Book Harvest" },
  ideas: { ar: "زبدة الأفكار", en: "Essence of Ideas" },
  "world-reads": { ar: "العالم يقرأ", en: "World Reads" },
  "books-talk": { ar: "حديث الكتب", en: "Book Talk" },
  "watch-your-book": { ar: "شاهد كتابك", en: "Watch Your Book" },
  "novel-story": { ar: "رواية فحكاية", en: "Novel & Story" },
};

export function ArticleCard({
  slug,
  title,
  excerpt,
  imageUrl,
  date,
  channel,
  readingTimeMinutes,
  videoId,
  linkedBook,
  locale,
  className,
  featured = false,
  entrance = true,
}: ArticleCardProps & { entrance?: boolean }) {
  const channelLabel = channel
    ? (channelLabels[channel]?.[locale] ?? channel)
    : null;

  const coverUrl = videoId
    ? youtubeThumbnail(videoId)
    : (linkedBook?.imageUrl ?? imageUrl);
  const coverAlt = linkedBook ? linkedBook.name : title;
  const bookCover = Boolean(linkedBook?.imageUrl) && !videoId;

  return (
    <motion.div
      initial={entrance ? { opacity: 0, y: 18 } : false}
      whileInView={entrance ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 360, damping: 22 }}
      className={cn("will-change-transform h-full", className)}
    >
      <div
        className={cn(
          "group flex h-full overflow-hidden surface-card",
          featured ? "flex-col md:flex-row" : "flex-col",
        )}
      >
        <Link
          href={`/${locale}/articles/${slug}`}
          className={cn(
            "block shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
            featured && "w-full md:w-64 md:max-w-[16rem]",
          )}
        >
          <CardMedia rounded={featured ? "none" : "top"}>
            {coverUrl ? (
              <CardMediaImage
                src={coverUrl}
                alt={coverAlt}
                objectFit={bookCover ? "contain" : "cover"}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <CardMediaPlaceholder className="from-[var(--brand-gray-100)] to-[var(--brand-red-soft)]">
                <BookOpen
                  className="h-10 w-10 text-[var(--brand-gray-400)]"
                  strokeWidth={1.25}
                  aria-hidden="true"
                />
              </CardMediaPlaceholder>
            )}
            {videoId && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-red)] text-white shadow-lg">
                  <Play className="h-6 w-6 fill-current" aria-hidden="true" />
                </span>
              </div>
            )}
            <div className="absolute inset-0 bg-[var(--brand-red)]/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </CardMedia>
        </Link>

        <div className="flex flex-1 flex-col gap-2 p-4">
          {channelLabel && (
            <Badge variant="outline" className="self-start text-xs">
              {channelLabel}
            </Badge>
          )}
          <Link
            href={`/${locale}/articles/${slug}`}
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] rounded-sm"
          >
            <h3
              className={cn(
                "font-bold text-[var(--brand-gray-900)] group-hover:text-[var(--brand-red)] transition-colors text-balance line-clamp-2",
                featured ? "text-lg" : "text-base",
              )}
            >
              {title}
            </h3>
          </Link>
          {linkedBook && (
            <Link
              href={`/${locale}/books/${linkedBook.slug}`}
              className="flex items-center gap-1.5 text-xs text-[var(--brand-gray-500)] hover:text-[var(--brand-red)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] rounded-sm"
            >
              <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="line-clamp-1">{linkedBook.name}</span>
            </Link>
          )}
          {excerpt && (
            <p className="text-sm text-[var(--brand-gray-500)] line-clamp-2">
              {excerpt}
            </p>
          )}
          <div className="mt-auto flex items-center gap-3 text-xs text-[var(--brand-gray-400)]">
            {date && <span>{formatDate(date, locale, "PP")}</span>}
            {readingTimeMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden="true" />
                {readingTimeMinutes} {locale === "ar" ? "دقيقة" : "min"}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
