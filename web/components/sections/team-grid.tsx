"use client";

import type { Locale } from "@/lib/i18n";
import { pickLocale } from "@/lib/content/types";
import type { TeamMemberData } from "@/lib/content/team";
import { TeamAvatar } from "./team-avatar";
import { cn } from "@/lib/utils";
import { AnimatedCard, StaggerContainer, StaggerItem, FadeIn, ScaleIn } from "@/components/motion";

interface TeamGridProps {
  members: TeamMemberData[];
  locale: Locale;
}

export function TeamGrid({ members, locale }: TeamGridProps) {
  const leadership = members.filter((m) => m.featured);
  const rest = members.filter((m) => !m.featured);

  return (
    <div className="space-y-10">
      {leadership.length > 0 && (
        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leadership.map((member) => (
            <StaggerItem key={member.slug}>
              <TeamMemberCard member={member} locale={locale} featured />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {rest.length > 0 && (
        <StaggerContainer className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((member) => (
            <StaggerItem key={member.slug}>
              <TeamMemberCard member={member} locale={locale} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </div>
  );
}

function TeamMemberCard({
  member,
  locale,
  featured,
}: {
  member: TeamMemberData;
  locale: Locale;
  featured?: boolean;
}) {
  const name = pickLocale(member.name, locale);
  const role = pickLocale(member.role, locale);
  const bio = pickLocale(member.bio, locale);

  return (
    <AnimatedCard>
      <article
        className={cn(
          "rounded-2xl border border-[var(--brand-gray-200)] bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-md h-full",
          featured && "ring-1 ring-[var(--brand-red-soft)]",
        )}
      >
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
          <p className="mt-3 text-sm leading-relaxed text-[var(--brand-gray-600)] md:text-base">{bio}</p>
        </FadeIn>
      </article>
    </AnimatedCard>
  );
}
