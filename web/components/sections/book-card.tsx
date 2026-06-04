"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import {
  CardMedia,
  CardMediaImage,
  CardMediaPlaceholder,
} from "@/components/ui/card-media";
import { cn } from "@/lib/utils";
import {
  localizedBookName,
  localizedBookShortDesc,
  type BookLocalizedFields,
} from "@/lib/i18n/book-locale";

interface BookCardProps extends BookLocalizedFields {
  slug: string;
  imageUrl?: string | null;
  translationStatus?: string;
  primaryCategory?: { nameAr?: string | null; name: string } | null;
  locale: string;
  isNew?: boolean;
  className?: string;
  compact?: boolean;
}

export function BookCard({
  slug,
  nameEn,
  nameAr,
  shortDesc,
  shortDescAr,
  imageUrl,
  translationStatus,
  primaryCategory,
  locale,
  isNew = false,
  className,
  compact = false,
  entrance = true,
}: BookCardProps & { entrance?: boolean }) {
  const bookFields = { nameEn, nameAr, shortDesc, shortDescAr };
  const displayName = localizedBookName(bookFields, locale);
  const excerpt = localizedBookShortDesc(bookFields, locale);
  const categoryLabel =
    locale === "ar" && primaryCategory?.nameAr
      ? primaryCategory.nameAr
      : primaryCategory?.name;

  const statusVariant =
    translationStatus === "TRANSLATED"
      ? "translated"
      : translationStatus === "NOMINATED"
        ? "nominated"
        : translationStatus === "PARTIAL"
          ? "partial"
        : translationStatus === "NOT_TRANSLATED"
          ? "not-translated"
          : undefined;

  const statusLabel =
    translationStatus === "TRANSLATED"
      ? locale === "ar"
        ? "مترجم"
        : "Translated"
      : translationStatus === "NOMINATED"
        ? locale === "ar"
          ? "مرشح للترجمة"
          : "For Translation"
        : translationStatus === "PARTIAL"
          ? locale === "ar"
            ? "مرشح للترجمة"
            : "For Translation"
          : locale === "ar"
          ? "غير مترجم"
          : "Not Translated";

  return (
    <motion.div
      initial={entrance ? { opacity: 0, y: 18 } : false}
      whileInView={entrance ? { opacity: 1, y: 0 } : undefined}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 360, damping: 20 }}
      className={cn("h-full will-change-transform", className)}
    >
      <Link
        href={`/${locale}/books/${slug}`}
        className="group relative flex flex-col overflow-hidden surface-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)] h-full"
      >
        <CardMedia>
          {imageUrl ? (
            <CardMediaImage
              src={imageUrl}
              alt={displayName}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <CardMediaPlaceholder>
              <BookOpen
                className="h-12 w-12"
                strokeWidth={1.25}
                aria-hidden="true"
              />
            </CardMediaPlaceholder>
          )}
          {isNew && (
            <Badge variant="new" className="absolute top-2 start-2 z-10">
              {locale === "ar" ? "جديد" : "New"}
            </Badge>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </CardMedia>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1.5 p-3">
          {categoryLabel && (
            <span className="text-xs font-medium text-[var(--brand-red)] truncate">
              {categoryLabel}
            </span>
          )}
          <h3
            className={cn(
              "font-semibold text-[var(--brand-gray-900)] line-clamp-2 text-balance group-hover:text-[var(--brand-red)] transition-colors duration-200",
              compact ? "text-sm" : "text-base"
            )}
          >
            {displayName}
          </h3>
          {excerpt && !compact && (
            <p className="line-clamp-2 text-xs text-[var(--brand-gray-500)]">
              {excerpt}
            </p>
          )}
          {translationStatus && !compact && (
            <Badge
              variant={statusVariant as BadgeProps["variant"]}
              className="self-start text-[10px] px-2 py-0.5"
            >
              {statusLabel}
            </Badge>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
