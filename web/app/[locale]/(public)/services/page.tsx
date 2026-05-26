import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { Button } from "@/components/ui/button";
import {
  BookMarked,
  FileText,
  Mic,
  Newspaper,
  Search,
  Share2,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/services`,
    title: locale === "ar" ? "خدماتنا" : "Our Services",
    description:
      locale === "ar"
        ? "خدمات المنصة: ببليوجرافيا، محتوى صحفي وبحثي، إنتاج صوتي ومرئي"
        : "Platform services: bibliography, journalism, research, audio and video",
    keywords: locale === "ar" ? ["خدمات", "ببليوجرافيا"] : ["services", "bibliography"],
  });
}

const SERVICES = [
  {
    icon: BookMarked,
    titleAr: "مخرجات ببليوجرافية",
    titleEn: "Bibliographic Outputs",
    descAr: "كتالوجات، فهارس، وبطاقات ببليوجرافية للكتب والمؤلفات",
    descEn: "Catalogs, indexes, and bibliographic records for books and works",
  },
  {
    icon: Newspaper,
    titleAr: "مخرجات صحفية",
    titleEn: "Journalistic Outputs",
    descAr: "مقالات، تقارير، ومحتوى إعلامي حول الكتب والقراءة",
    descEn: "Articles, reports, and media content on books and reading",
  },
  {
    icon: Search,
    titleAr: "مخرجات بحثية",
    titleEn: "Research Outputs",
    descAr: "دراسات، مراجع، وتحليلات أكاديمية",
    descEn: "Studies, references, and academic analyses",
  },
  {
    icon: Mic,
    titleAr: "مخرجات صوتية ومرئية",
    titleEn: "Audio & Video",
    descAr: "بودكاست، حلقات، ومحتوى مرئي عن الكتب",
    descEn: "Podcasts, episodes, and visual content about books",
  },
  {
    icon: Share2,
    titleAr: "مخرجات سوشيال",
    titleEn: "Social Content",
    descAr: "محتوى قصير للانتشار على المنصات الاجتماعية",
    descEn: "Short-form content for social platforms",
  },
  {
    icon: FileText,
    titleAr: "إدارة محتوى",
    titleEn: "Content Management",
    descAr: "نشر وترتيب المحتوى على المنصة بمعايير احترافية",
    descEn: "Publishing and organizing content on the platform professionally",
  },
] as const;

export default async function ServicesPage() {
  const locale = (await getLocale()) as Locale;
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        variant="light"
        title={isAr ? "خدمات المنصة" : "Platform Services"}
        subtitle={
          isAr
            ? "حلول متكاملة للناشرين والمؤسسات والقارئ"
            : "Integrated solutions for publishers, institutions, and readers"
        }
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: isAr ? "خدماتنا" : "Our Services" },
        ]}
      />

      <div className="container-platform py-12">
        <p className="mx-auto mb-10 max-w-2xl text-center text-[var(--brand-gray-600)]">
          {isAr
            ? "نقدّم منظومة خدمات تغطي دورة حياة الكتاب — من الفهرسة إلى النشر والإعلام"
            : "We offer a service ecosystem covering the book lifecycle — from indexing to publishing and media"}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <article
              key={service.titleEn}
              className="rounded-xl border border-[var(--brand-gray-200)] bg-white p-6 transition-shadow hover:shadow-md"
            >
              <service.icon className="h-8 w-8 text-[var(--brand-red)]" aria-hidden="true" />
              <h2 className="mt-4 font-bold text-[var(--brand-gray-900)]">
                {isAr ? service.titleAr : service.titleEn}
              </h2>
              <p className="mt-2 text-sm text-[var(--brand-gray-600)]">
                {isAr ? service.descAr : service.descEn}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-xl bg-[var(--brand-red)] p-8 text-center text-white">
          <p className="font-bold text-lg">
            {isAr ? "هل تبحث عن شراكة أو خدمة مخصصة؟" : "Looking for a partnership or custom service?"}
          </p>
          <Button asChild size="lg" className="mt-4 bg-white text-[var(--brand-red)] hover:bg-[var(--brand-gray-100)]">
            <Link href={`/${locale}/contact`}>{isAr ? "اتصل بنا" : "Contact Us"}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
