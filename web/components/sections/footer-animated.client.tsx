"use client";

import Link from "next/link";
import { SocialIconCircle } from "@/components/ui/social-icon-circle";
import { SOCIAL_LINKS } from "@/components/icons";
import { FooterAppBadges } from "@/components/sections/footer-app-badges";
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

function FooterColumnBlock({ column }: { column: FooterColumn }) {
  return (
    <div>
      <h3 className="mb-4 text-lg font-bold uppercase tracking-wider text-[var(--brand-red)]">
        {column.title}
      </h3>
      <ul className="space-y-2" role="list">
        {column.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-base font-bold text-white transition-all duration-[var(--motion-base)] hover:translate-x-0.5 hover:text-[var(--brand-red)] hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FooterAnimatedGrid({ columns, locale }: FooterAnimatedGridProps) {
  const isAr = locale === "ar";
  const primaryColumns = columns.slice(0, 2);
  const secondaryColumns = columns.slice(2);

  return (
    <>
      <StaggerContainer className="grid grid-cols-2 gap-8 md:grid-cols-5 md:items-start">
        {primaryColumns.map((col) => (
          <StaggerItem key={col.title}>
            <FooterColumnBlock column={col} />
          </StaggerItem>
        ))}

        <StaggerItem className="col-span-2 md:col-span-3">
          <div className="flex h-full flex-col gap-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
              {secondaryColumns.map((col) => (
                <FooterColumnBlock key={col.title} column={col} />
              ))}
            </div>
            <FooterAppBadges locale={locale} />
          </div>
        </StaggerItem>
      </StaggerContainer>

      <FadeIn delay={0.3}>
        <div className="mt-10 border-t border-[var(--brand-gray-800)] pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex flex-col items-center gap-1 sm:items-start">
              <p className="text-xs font-bold text-white">
                {new Date().getFullYear()} ©{" "}
                <span className="text-[var(--brand-red)]">
                  {isAr ? "منصة الكتب العالمية" : "Books Platform"}
                </span>
                {" — "}
                {isAr ? "جميع الحقوق محفوظة" : "All rights reserved"}
              </p>
              <p className="text-xs text-[var(--brand-gray-400)]">
                {isAr ? "تصميم الموقع:" : "Site design:"}{" "}
                <a
                  href="https://real.com.eg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[var(--brand-gray-300)] transition-colors hover:text-[var(--brand-red)] hover:underline"
                >
                  real.com.eg
                </a>
              </p>
            </div>
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
