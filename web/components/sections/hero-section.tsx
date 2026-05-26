"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BookOpen, PenTool } from "lucide-react";

export function HeroSection() {
  const t = useTranslations("home");
  const { locale } = useParams<{ locale: string }>();

  return (
    <section
      className="relative flex min-h-[65vh] items-center justify-center overflow-hidden gradient-brand"
      aria-label={t("heroTitle")}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #B11E2E 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="container-platform relative z-10 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--brand-red)]/30 bg-[var(--brand-red)]/10 px-4 py-1.5 text-sm text-[var(--brand-red-soft)]">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            <span>منصة الكتب العالمية</span>
          </div>

          <h1 className="font-display text-display-xl font-black text-balance leading-tight text-white">
            {t("heroTitle")}
          </h1>

          <p className="mt-4 text-lg text-[var(--brand-gray-300)] text-balance">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="xl" variant="default">
              <Link href={`/${locale}/books`}>
                <BookOpen className="h-5 w-5" aria-hidden="true" />
                {t("browseBooks")}
              </Link>
            </Button>
            <Button
              asChild
              size="xl"
              className="border border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Link href={`/${locale}/publish`}>
                <PenTool className="h-5 w-5" aria-hidden="true" />
                {t("publishYourBook")}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[var(--brand-gray-50)] to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
