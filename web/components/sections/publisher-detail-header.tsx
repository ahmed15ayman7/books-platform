"use client";

import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Globe } from "lucide-react";
import { BlurIn, FadeIn, RevealText } from "@/components/motion";
import type { Locale } from "@/lib/i18n";
import { markdownExcerpt } from "@/lib/markdown/markdown-to-plain-text";

interface PublisherDetailHeaderProps {
  locale: Locale;
  displayName: string;
  displayDescription: string | null;
  imageUrl: string | null;
  isSponsored: boolean;
  countries: { id: string; name: string; nameAr?: string | null }[];
  websiteUrl: string | null;
  contactEmail: string | null;
  homeHref: string;
  publishersHref: string;
}

export function PublisherDetailHeader({
  locale,
  displayName,
  displayDescription,
  imageUrl,
  isSponsored,
  countries,
  websiteUrl,
  contactEmail,
  homeHref,
  publishersHref,
}: PublisherDetailHeaderProps) {
  const isAr = locale === "ar";

  return (
    <div className={`py-10 ${isSponsored ? "bg-gradient-to-r from-[var(--brand-black)] to-[#2a0a10]" : "bg-[var(--brand-black)]"}`}>
      <div className="container-platform">
        <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--brand-gray-400)]">
          <Link href={homeHref} className="hover:text-white">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <Link href={publishersHref} className="hover:text-white">
            {isAr ? "الناشرون" : "Publishers"}
          </Link>
          <span>/</span>
          <span className="text-white">{displayName}</span>
        </nav>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <BlurIn>
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-lg">
              {imageUrl ? (
                <div className="relative h-full w-full">
                  <SafeImage
                    src={imageUrl}
                    alt={displayName}
                    fill
                    className="object-contain"
                    sizes="96px"
                  />
                </div>
              ) : (
                <Globe className="h-12 w-12 text-[var(--brand-red)]" aria-hidden="true" />
              )}
            </div>
          </BlurIn>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <RevealText
                text={displayName}
                as="h1"
                className="font-display text-display-sm font-black text-white block"
              />
              {isSponsored && (
                <Badge variant="sponsored">
                  {isAr ? "ناشر مميز" : "Featured Publisher"}
                </Badge>
              )}
            </div>

            {countries.length > 0 && (
              <FadeIn delay={0.1}>
                <div className="mt-2 flex flex-wrap gap-2">
                  {countries.map((c) => (
                    <span key={c.id} className="inline-flex items-center gap-1 text-sm text-[var(--brand-gray-300)]">
                      <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                      {isAr && c.nameAr ? c.nameAr : c.name}
                    </span>
                  ))}
                </div>
              </FadeIn>
            )}

            {displayDescription && (
              <FadeIn delay={0.15}>
                <p className="mt-3 max-w-2xl text-sm text-[var(--brand-gray-300)] line-clamp-4">
                  {markdownExcerpt(displayDescription, 320)}
                </p>
              </FadeIn>
            )}

            <FadeIn delay={0.2}>
              <div className="mt-4 flex flex-wrap gap-3">
                {websiteUrl && (
                  <Button asChild variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                    <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                      {isAr ? "زيارة الموقع" : "Visit Website"}
                    </a>
                  </Button>
                )}
                {contactEmail && (
                  <Button asChild variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                    <a href={`mailto:${contactEmail}`}>
                      <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                      {isAr ? "تواصل" : "Contact"}
                    </a>
                  </Button>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}
