import { User } from "lucide-react";
import type { Locale } from "@/lib/i18n";

export interface TeamMember {
  name: string;
  nameEn?: string;
  role: string;
  roleEn?: string;
  bio?: string;
  bioEn?: string;
}

interface TeamGridProps {
  members: TeamMember[];
  locale: Locale;
}

export function TeamGrid({ members, locale }: TeamGridProps) {
  const isAr = locale === "ar";

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <article
          key={member.name}
          className="group rounded-xl border border-[var(--brand-gray-200)] bg-white p-6 text-center transition-shadow hover:shadow-md"
        >
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[var(--brand-gray-100)] text-[var(--brand-gray-400)] transition-colors group-hover:bg-[var(--brand-red-soft)] group-hover:text-[var(--brand-red)]">
            <User className="h-12 w-12" strokeWidth={1.25} aria-hidden="true" />
          </div>
          <h3 className="mt-4 font-bold text-[var(--brand-gray-900)]">
            {isAr ? member.name : (member.nameEn ?? member.name)}
          </h3>
          <p className="mt-1 text-sm text-[var(--brand-red)]">
            {isAr ? member.role : (member.roleEn ?? member.role)}
          </p>
          {(member.bio || member.bioEn) && (
            <p className="mt-3 text-sm text-[var(--brand-gray-600)] opacity-0 transition-opacity group-hover:opacity-100">
              {isAr ? member.bio : (member.bioEn ?? member.bio)}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
