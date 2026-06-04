"use client";

import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import type { Locale } from "@/lib/i18n";
import {
  FadeIn,
  RevealText,
  StaggerContainer,
  StaggerItem,
} from "@/components/motion";

interface AuthorDetailHeroProps {
  locale: Locale;
  name: string;
  alternateName?: string | null;
  bio?: string | null;
  imageUrl?: string | null;
  slug: string;
  homeHref: string;
  booksHref: string;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function AuthorDetailHero({
  locale,
  name,
  alternateName,
  bio,
  imageUrl,
  slug,
  homeHref,
  booksHref,
}: AuthorDetailHeroProps) {
  const isAr = locale === "ar";
  const avatarSrc = imageUrl ?? ABOUT_IMAGES.authorDefault;
  const bioExcerpt = bio ? bio.split("\n").slice(0, 3).join("\n") : null;

  return (
    <div className="bg-[var(--brand-black)] py-10">
      <div className="container-platform">
        <nav className="mb-4 flex items-center gap-2 text-sm text-[var(--brand-gray-400)]">
          <Link href={homeHref} className="hover:text-white">
            {isAr ? "الرئيسية" : "Home"}
          </Link>
          <span>/</span>
          <Link href={booksHref} className="hover:text-white">
            {isAr ? "الكتب" : "Books"}
          </Link>
          <span>/</span>
          <span className="text-white">{name}</span>
        </nav>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <FadeIn>
            <div className="relative h-[120px] w-[120px] flex-shrink-0 overflow-hidden rounded-full ring-2 ring-[var(--brand-red)]">
              {imageUrl ? (
                <SafeImage
                  src={avatarSrc}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--brand-gray-800)] text-xl font-bold text-[var(--brand-red)]">
                  {getInitials(name)}
                </div>
              )}
            </div>
          </FadeIn>

          <div className="flex-1 min-w-0">
            <RevealText
              text={name}
              as="h1"
              className="font-display text-display-sm font-black text-white block"
            />
            {alternateName && (
              <FadeIn delay={0.1}>
                <p
                  className="mt-2 text-base font-medium text-[var(--brand-gray-400)]"
                  dir={isAr ? "ltr" : "rtl"}
                >
                  {alternateName}
                </p>
              </FadeIn>
            )}
            <StaggerContainer className="mt-3 flex flex-wrap gap-2" delay={0.15}>
              <StaggerItem>
                <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-sm text-[var(--brand-gray-400)]">
                  {slug}
                </span>
              </StaggerItem>
            </StaggerContainer>
            {bioExcerpt && (
              <FadeIn delay={0.2}>
                <p className="mt-4 line-clamp-3 max-w-3xl text-sm leading-relaxed text-[var(--brand-gray-300)] whitespace-pre-wrap">
                  {bioExcerpt}
                </p>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
