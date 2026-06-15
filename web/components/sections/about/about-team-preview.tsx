"use client";

import Link from "next/link";
import { SectionBlock } from "@/components/sections/section-block";
import { TeamAvatar } from "@/components/sections/team-avatar";
import { Button } from "@/components/ui/button";
import type { TeamMemberData } from "@/lib/content/team";
import type { Locale } from "@/lib/i18n";
import { pickLocale } from "@/lib/content/types";
import {
  StaggerContainer,
  StaggerItem,
  AnimatedCard,
  ScaleIn,
  FadeIn,
  HoverLift,
} from "@/components/motion";

interface AboutTeamPreviewProps {
  locale: Locale;
  eyebrow: string;
  title: string;
  members: TeamMemberData[];
}

export function AboutTeamPreview({ locale, eyebrow, title, members }: AboutTeamPreviewProps) {
  const isAr = locale === "ar";

  return (
    <SectionBlock id="team-preview" eyebrow={eyebrow} title={title} staggerChildren={false}>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <StaggerContainer className="flex gap-4">
        {members.map((member) => {
          const name = pickLocale(member.name, locale);
          const role = pickLocale(member.role, locale);
          const bio = pickLocale(member.bio, locale);
          return (
            <StaggerItem key={member.slug} className="min-w-[260px] snap-start sm:min-w-[280px]">
              <AnimatedCard>
                <article className="rounded-2xl border border-[var(--brand-gray-200)] bg-white p-6 text-center shadow-sm h-full">
                  <ScaleIn>
                    <TeamAvatar photoUrl={member.photoUrl} initials={member.initials} name={name} />
                  </ScaleIn>
                  <FadeIn delay={0.1}>
                    <h3 className="mt-4 font-bold text-[var(--brand-gray-900)]">{name}</h3>
                  </FadeIn>
                  <FadeIn delay={0.15}>
                    <p className="mt-1 text-sm font-medium text-[var(--brand-red)]">{role}</p>
                  </FadeIn>
                  <FadeIn delay={0.2}>
                    <p className="mt-3 line-clamp-3 text-sm text-[var(--brand-gray-600)]">{bio}</p>
                  </FadeIn>
                </article>
              </AnimatedCard>
            </StaggerItem>
          );
        })}
        </StaggerContainer>
      </div>
      <FadeIn delay={0.3} className="mt-8 text-center">
        <HoverLift className="inline-block">
          <Button asChild variant="outline">
            <Link href={`/${locale}/team`}>{isAr ? "عرض الكل" : "View all"}</Link>
          </Button>
        </HoverLift>
      </FadeIn>
    </SectionBlock>
  );
}
