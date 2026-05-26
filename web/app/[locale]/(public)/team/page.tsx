import type { Metadata } from "next";
import Link from "next/link";
import { getLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { TeamGrid, type TeamMember } from "@/components/sections/team-grid";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/team`,
    title: locale === "ar" ? "فريق العمل" : "Our Team",
    description:
      locale === "ar"
        ? "تعرّف على فريق منصة الكتب العالمية"
        : "Meet the Books Platform team",
    keywords: locale === "ar" ? ["فريق", "منصة"] : ["team", "platform"],
  });
}

const TEAM: TeamMember[] = [
  { name: "أحمد محمود", nameEn: "Ahmed Mahmoud", role: "المدير التنفيذي", roleEn: "CEO", bio: "قيادة الرؤية والاستراتيجية", bioEn: "Vision and strategy leadership" },
  { name: "سارة الخطيب", nameEn: "Sara Al-Khatib", role: "مديرة المحتوى", roleEn: "Content Director", bio: "إشراف على المقالات والكتب", bioEn: "Oversees articles and books" },
  { name: "محمد العلي", nameEn: "Mohammed Al-Ali", role: "رئيس التحرير", roleEn: "Editor-in-Chief", bio: "جودة المحتوى العربي", bioEn: "Arabic content quality" },
  { name: "ليلى حسن", nameEn: "Layla Hassan", role: "مديرة الترجمة", roleEn: "Translation Lead", bio: "كتب مرشحة ومترجمة", bioEn: "Nominated and translated books" },
  { name: "عمر يوسف", nameEn: "Omar Youssef", role: "مطور تقني", roleEn: "Tech Lead", bio: "بنية المنصة والأداء", bioEn: "Platform architecture and performance" },
  { name: "نورا إبراهيم", nameEn: "Noura Ibrahim", role: "علاقات الناشرين", roleEn: "Publisher Relations", bio: "شراكات دور النشر", bioEn: "Publishing house partnerships" },
  { name: "خالد منصور", nameEn: "Khaled Mansour", role: "تسويق رقمي", roleEn: "Digital Marketing", bio: "نمو الجمهور والوعي", bioEn: "Audience growth and awareness" },
  { name: "رنا سعيد", nameEn: "Rana Saeed", role: "تجربة المستخدم", roleEn: "UX Designer", bio: "تصميم واجهات سهلة", bioEn: "Accessible interface design" },
  { name: "ياسر فهمي", nameEn: "Yasser Fahmy", role: "دعم القراء", roleEn: "Reader Support", bio: "مساعدة المستخدمين يومياً", bioEn: "Daily user assistance" },
];

export default async function TeamPage() {
  const locale = (await getLocale()) as Locale;
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        variant="light"
        title={isAr ? "فريق المنصة" : "Our Team"}
        subtitle={
          isAr
            ? "وجوه تبني جسراً بين العالم والقارئ العربي"
            : "People building a bridge between the world and Arabic readers"
        }
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: isAr ? "فريق العمل" : "Our Team" },
        ]}
      />

      <div className="container-platform py-12">
        <TeamGrid members={TEAM} locale={locale} />

        <blockquote className="mx-auto mt-12 max-w-2xl border-s-4 border-[var(--brand-red)] ps-6 text-center text-[var(--brand-gray-700)] italic md:text-lg">
          {isAr
            ? "«نؤمن أن العمل الجماعي المتخصص هو ما يصنع تجربة قراءة عالمية حقيقية»"
            : '"We believe specialized teamwork creates a truly global reading experience"'}
        </blockquote>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href={`/${locale}/contact`}>
              {isAr ? "تواصل معنا" : "Get in Touch"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
