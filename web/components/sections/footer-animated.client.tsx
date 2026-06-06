"use client";

import Link from "next/link";
import { SocialIconCircle } from "@/components/ui/social-icon-circle";
import { SOCIAL_LINKS } from "@/components/icons";
import { StaggerContainer, StaggerItem, FadeIn, IconPulse } from "@/components/motion";

interface FooterLink {
  href: string;
  label: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterAnimatedGridProps {
  columns: FooterColumn[];
  locale: string;
}

export function FooterAnimatedGrid({ columns, locale }: FooterAnimatedGridProps) {
  const isAr = locale === "ar";

  return (
    <>
      <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-5">
        {columns.map((col) => (
          <StaggerItem key={col.title}>
            <div>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--brand-red)]">
                {col.title}
              </h3>
              <ul className="space-y-2" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--brand-gray-400)] transition-all duration-[var(--motion-base)] hover:translate-x-0.5 hover:text-[var(--brand-red)] hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn delay={0.3}>
        <div className="mt-10 border-t border-[var(--brand-gray-800)] pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-[var(--brand-gray-500)]">
              {new Date().getFullYear()} ©{" "}
              <span className="text-[var(--brand-red)]">
                {isAr ? "منصة الكتب العالمية" : "Books Platform"}
              </span>
              {" — "}
              {isAr ? "جميع الحقوق محفوظة" : "All rights reserved"}
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map((social) => (
                <IconPulse key={social.href}>
                  <SocialIconCircle href={social.href} label={social.label} className="h-8 w-8">
                    <social.Icon />
                  </SocialIconCircle>
                </IconPulse>
              ))}
            </div>
          </div>
        </div>
      </FadeIn>
    </>
  );
}
