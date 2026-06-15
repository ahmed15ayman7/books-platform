"use client";

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { youtubeThumbnail } from "@/lib/media/youtube";
import type { Locale } from "@/lib/i18n";

interface MediaVideoCardProps {
  slug: string;
  title: string;
  videoId: string;
  imageUrl?: string | null;
  locale: Locale;
  compact?: boolean;
  active?: boolean;
  onSelect?: () => void;
}

export function MediaVideoCard({
  slug,
  title,
  videoId,
  imageUrl,
  locale,
  compact,
  active,
  onSelect,
}: MediaVideoCardProps) {
  const thumb = imageUrl ?? youtubeThumbnail(videoId);
  const inner = (
    <>
      <div className={cn("relative overflow-hidden rounded-lg bg-[var(--brand-gray-200)]", compact ? "h-20 w-32 shrink-0" : "aspect-video w-full")}>
        <Image src={thumb} alt="" fill className="object-cover" sizes={compact ? "128px" : "400px"} />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-red)] text-white">
            <Play className="h-5 w-5 fill-current" aria-hidden="true" />
          </span>
        </div>
      </div>
      {!compact && (
        <h3 className="mt-2 line-clamp-2 text-sm font-semibold text-[var(--brand-gray-900)]">{title}</h3>
      )}
      {compact && (
        <p className="line-clamp-2 text-xs font-medium text-[var(--brand-gray-800)]">{title}</p>
      )}
    </>
  );

  const className = cn(
    "block transition-opacity",
    compact && "flex gap-3 rounded-lg border p-2 text-start",
    compact && active && "border-[var(--brand-red)] bg-[var(--brand-red-soft)]",
    compact && !active && "border-[var(--brand-gray-200)] hover:border-[var(--brand-red-soft)]",
    !compact && "group rounded-xl border border-[var(--brand-gray-200)] bg-white p-3 shadow-sm hover:shadow-md",
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={className}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={`/${locale}/articles/${slug}`} className={className}>
      {inner}
    </Link>
  );
}
