"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Locale } from "@/lib/i18n";
import { pickLocale } from "@/lib/content/types";
import type { TeamMemberData } from "@/lib/content/team";
import type { BreadcrumbItem } from "@/components/sections/page-hero";
import { FadeIn, RevealText, StaggerContainer, StaggerItem } from "@/components/motion";

interface ScatterSlot {
  top: string;
  insetInlineStart?: string;
  insetInlineEnd?: string;
  rotate: number;
  scale: number;
  zIndex: number;
}

/** Hand-tuned positions for a natural scattered collage (supports up to 12 cards). */
const SCATTER_SLOTS: ScatterSlot[] = [
  { top: "2%", insetInlineStart: "0%", rotate: -14, scale: 0.86, zIndex: 2 },
  { top: "0%", insetInlineStart: "26%", rotate: 9, scale: 1.02, zIndex: 6 },
  { top: "5%", insetInlineEnd: "4%", rotate: -7, scale: 0.9, zIndex: 4 },
  { top: "28%", insetInlineStart: "-2%", rotate: 11, scale: 0.92, zIndex: 3 },
  { top: "24%", insetInlineStart: "22%", rotate: -6, scale: 1.08, zIndex: 7 },
  { top: "32%", insetInlineStart: "48%", rotate: 5, scale: 0.88, zIndex: 5 },
  { top: "26%", insetInlineEnd: "0%", rotate: -11, scale: 0.94, zIndex: 4 },
  { top: "52%", insetInlineStart: "6%", rotate: 8, scale: 0.9, zIndex: 3 },
  { top: "58%", insetInlineStart: "34%", rotate: -4, scale: 1, zIndex: 6 },
  { top: "50%", insetInlineEnd: "16%", rotate: 12, scale: 0.87, zIndex: 2 },
  { top: "48%", insetInlineEnd: "38%", rotate: -9, scale: 0.84, zIndex: 1 },
  { top: "72%", insetInlineStart: "52%", rotate: 6, scale: 0.88, zIndex: 3 },
];

interface TeamCollageHeroProps {
  locale: Locale;
  title: string;
  subtitle: string;
  members: TeamMemberData[];
  breadcrumbs?: BreadcrumbItem[];
}

function TeamPhotoCard({
  member,
  locale,
  slot,
}: {
  member: TeamMemberData;
  locale: Locale;
  slot: ScatterSlot;
}) {
  const name = pickLocale(member.name, locale);
  const [failed, setFailed] = useState(false);
  const showInitials = !member.photoUrl || failed;
  const memberHref = `#member-${member.slug}`;

  const cardInner = (
    <div
      className={cn(
        "group relative aspect-[2/3] overflow-hidden rounded-xl",
        "bg-white/10 shadow-2xl ring-1 ring-white/25",
        "transition-transform duration-500 ease-out",
        "hover:z-20 hover:scale-110 hover:rotate-0 hover:shadow-[0_20px_40px_rgba(0,0,0,0.45)]",
      )}
    >
          {showInitials ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[var(--brand-red)]/40 to-[var(--brand-gray-800)] p-2">
              <span className="font-display text-lg font-bold text-white/90 sm:text-xl">
                {member.initials ?? name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          ) : (
            <Image
              src={member.photoUrl!}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 72px, 112px"
              onError={() => setFailed(true)}
            />
          )}
          <div
            className={cn(
              "pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent",
              "px-2 pb-2 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
            )}
          >
            <p className="truncate text-[10px] font-semibold text-white sm:text-[11px]">{name}</p>
        </div>
    </div>
  );

  return (
    <StaggerItem>
      <div
        className="absolute w-[72px] sm:w-[88px] md:w-[100px] lg:w-[112px]"
        style={{
          top: slot.top,
          insetInlineStart: slot.insetInlineStart,
          insetInlineEnd: slot.insetInlineEnd,
          zIndex: slot.zIndex,
          transform: `rotate(${slot.rotate}deg) scale(${slot.scale})`,
        }}
      >
        <Link href={memberHref} aria-label={name} className="block">
          {cardInner}
        </Link>
      </div>
    </StaggerItem>
  );
}

export function TeamCollageHero({
  locale,
  title,
  subtitle,
  members,
  breadcrumbs = [],
}: TeamCollageHeroProps) {
  const isAr = locale === "ar";
  const homeLabel = isAr ? "الرئيسية" : "Home";
  const crumbs =
    breadcrumbs.length > 0 ? breadcrumbs : [{ label: homeLabel, href: `/${locale}` }];

  const collageMembers = members.filter((m) => m.photoUrl || m.initials).slice(0, SCATTER_SLOTS.length);

  return (
    <section className="relative overflow-hidden bg-[var(--brand-black)] py-12 md:py-16 bg-gradient-to-br from-[var(--brand-red)]/25 via-[var(--brand-black)] to-[var(--brand-black)]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -end-24 top-8 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -start-16 bottom-0 h-56 w-56 rounded-full bg-[var(--brand-red)]/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(255,255,255,0.06)_0%,transparent_55%)]" />
      </div>

      <div className="container-platform relative z-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div className="order-2 lg:order-1">
            <StaggerContainer className="mb-4 flex flex-wrap items-center gap-1 text-sm text-[var(--brand-gray-400)]">
              {crumbs.map((item, index) => {
                const isLast = index === crumbs.length - 1;
                return (
                  <StaggerItem key={`${item.label}-${index}`}>
                    <span className="inline-flex items-center gap-1">
                      {index > 0 && (
                        <ChevronRight
                          className="h-3.5 w-3.5 shrink-0 opacity-60 rtl:rotate-180"
                          aria-hidden="true"
                        />
                      )}
                      {item.href && !isLast ? (
                        <Link
                          href={item.href}
                          className="transition-colors hover:text-white hover:underline"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span className={cn(isLast && "text-white")}>{item.label}</span>
                      )}
                    </span>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <RevealText
              text={title}
              as="h1"
              className="font-display text-display-md font-bold text-white"
            />
            <FadeIn delay={0.2}>
              <p className="mt-3 max-w-xl text-base text-[var(--brand-gray-300)] md:text-lg">
                {subtitle}
              </p>
            </FadeIn>
            <FadeIn delay={0.35}>
              <p className="mt-4 text-sm text-[var(--brand-gray-400)]">
                {isAr
                  ? `${members.length} محترف يعملون برؤية واحدة`
                  : `${members.length} professionals united by one vision`}
              </p>
            </FadeIn>
          </div>

          {/* Scattered collage — desktop & tablet */}
          <div
            className="relative order-1 mx-auto hidden min-h-[340px] w-full max-w-[520px] sm:block lg:order-2 lg:min-h-[400px] lg:max-w-none"
          >
            <StaggerContainer className="relative h-full min-h-[340px] lg:min-h-[400px]">
              {collageMembers.map((member, i) => (
                <TeamPhotoCard
                  key={member.slug}
                  member={member}
                  locale={locale}
                  slot={SCATTER_SLOTS[i]!}
                />
              ))}
            </StaggerContainer>
          </div>
        </div>

        {/* Mobile — overlapping fan strip */}
        <FadeIn delay={0.25} className="mt-2 sm:hidden">
          <div
            className="flex items-end justify-center gap-0 overflow-x-auto pb-4 pt-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {collageMembers.slice(0, 8).map((member, i) => {
              const name = pickLocale(member.name, locale);
              const rotate = [-10, 6, -4, 8, -6, 5, -8, 3][i] ?? 0;
              return (
                <Link
                  key={member.slug}
                  href={`#member-${member.slug}`}
                  aria-label={name}
                  className="relative -ms-3 first:ms-0 aspect-[2/3] w-[68px] shrink-0 overflow-hidden rounded-lg bg-white/10 shadow-lg ring-1 ring-white/20 transition-transform hover:scale-105"
                  style={{
                    transform: `rotate(${rotate}deg) translateY(${i % 2 === 0 ? "0" : "8px"})`,
                    zIndex: i,
                  }}
                >
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="68px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-[var(--brand-red)]/40 to-[var(--brand-gray-800)] text-sm font-bold text-white">
                      {member.initials ?? name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
