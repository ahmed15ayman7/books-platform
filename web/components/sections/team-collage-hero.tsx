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

/** Front row — leadership (featured), center stage, highest z-index. */
const LEADERSHIP_SLOTS: ScatterSlot[] = [
  { top: "14%", insetInlineStart: "40%", rotate: -3, scale: 1.14, zIndex: 30 },
  { top: "4%", insetInlineStart: "15%", rotate: -11, scale: 1.06, zIndex: 28 },
  { top: "6%", insetInlineEnd: "14%", rotate: 9, scale: 1.06, zIndex: 28 },
];

/** Background — rest of team, pushed to edges/corners, smaller & lower z-index. */
const TEAM_SLOTS: ScatterSlot[] = [
  { top: "0%", insetInlineStart: "-5%", rotate: -15, scale: 0.8, zIndex: 2 },
  { top: "1%", insetInlineEnd: "-4%", rotate: 12, scale: 0.78, zIndex: 1 },
  { top: "32%", insetInlineStart: "-8%", rotate: 13, scale: 0.82, zIndex: 4 },
  { top: "62%", insetInlineEnd: "0%", rotate: -6, scale: 0.79, zIndex: 5 },
  { top: "60%", insetInlineStart: "0%", rotate: 9, scale: 0.81, zIndex: 5 },
  { top: "34%", insetInlineEnd: "-6%", rotate: -8, scale: 0.8, zIndex: 4 },
  { top: "68%", insetInlineStart: "30%", rotate: 7, scale: 0.84, zIndex: 7 },
  { top: "70%", insetInlineEnd: "30%", rotate: -10, scale: 0.82, zIndex: 7 },
];

function buildCollageItems(members: TeamMemberData[]) {
  const withPhoto = members.filter((m) => m.photoUrl || m.initials);
  const leadership = withPhoto.filter((m) => m.featured);
  const team = withPhoto.filter((m) => !m.featured);

  const items: { member: TeamMemberData; slot: ScatterSlot; featured: boolean }[] = [];

  team.slice(0, TEAM_SLOTS.length).forEach((member, i) => {
    items.push({ member, slot: TEAM_SLOTS[i]!, featured: false });
  });

  leadership.slice(0, LEADERSHIP_SLOTS.length).forEach((member, i) => {
    items.push({ member, slot: LEADERSHIP_SLOTS[i]!, featured: true });
  });

  return items;
}

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
  featured,
}: {
  member: TeamMemberData;
  locale: Locale;
  slot: ScatterSlot;
  featured?: boolean;
}) {
  const name = pickLocale(member.name, locale);
  const [failed, setFailed] = useState(false);
  const showInitials = !member.photoUrl || failed;
  const memberHref = `#member-${member.slug}`;

  const cardInner = (
    <div
      className={cn(
        "group relative aspect-[2/3] overflow-hidden rounded-xl",
        "bg-white/10 shadow-2xl transition-transform duration-500 ease-out",
        featured
          ? "ring-2 ring-[var(--brand-red)]/60 shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:ring-[var(--brand-red)]"
          : "ring-1 ring-white/20 opacity-90 hover:opacity-100",
        "hover:z-[40] hover:scale-110 hover:rotate-0 hover:shadow-[0_20px_40px_rgba(0,0,0,0.45)]",
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
        className={cn(
          "absolute",
          featured
            ? "w-[84px] sm:w-[96px] md:w-[112px] lg:w-[128px]"
            : "w-[64px] sm:w-[76px] md:w-[86px] lg:w-[92px]",
        )}
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

  const collageItems = buildCollageItems(members);
  const mobileItems = [
    ...collageItems.filter((item) => !item.featured),
    ...collageItems.filter((item) => item.featured),
  ].slice(0, 10);

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
            className="relative order-1 mx-auto hidden min-h-[380px] w-full max-w-[540px] sm:block lg:order-2 lg:min-h-[440px] lg:max-w-none"
          >
            <StaggerContainer className="relative h-full min-h-[380px] lg:min-h-[440px]">
              {collageItems.map(({ member, slot, featured }) => (
                <TeamPhotoCard
                  key={member.slug}
                  member={member}
                  locale={locale}
                  slot={slot}
                  featured={featured}
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
            {mobileItems.map((item, i) => {
              const { member, featured } = item;
              const name = pickLocale(member.name, locale);
              const rotate = [-10, 6, -4, 8, -6, 5, -8, 3, -5, 4][i] ?? 0;
              return (
                <Link
                  key={member.slug}
                  href={`#member-${member.slug}`}
                  aria-label={name}
                  className={cn(
                    "relative -ms-3 first:ms-0 aspect-[2/3] shrink-0 overflow-hidden rounded-lg bg-white/10 shadow-lg ring-1 transition-transform hover:scale-105",
                    featured
                      ? "w-[76px] ring-2 ring-[var(--brand-red)]/60"
                      : "w-[60px] ring-white/20 opacity-90",
                  )}
                  style={{
                    transform: `rotate(${rotate}deg) translateY(${i % 2 === 0 ? "0" : "8px"})`,
                    zIndex: featured ? 20 + i : i,
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
