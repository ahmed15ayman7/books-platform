import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { PageHero } from "@/components/sections/page-hero";
import { LegalProseLayout, type LegalSection } from "@/components/sections/legal-prose-layout";
import type { Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) as Locale;
  return buildPageMetadata({
    locale,
    path: `/${locale}/terms`,
    title: locale === "ar" ? "الشروط والأحكام" : "Terms & Conditions",
    description:
      locale === "ar"
        ? "شروط وأحكام استخدام منصة الكتب العالمية"
        : "Terms and conditions for using Books Platform",
    keywords: locale === "ar" ? ["شروط", "أحكام"] : ["terms", "conditions"],
  });
}

function termsSections(isAr: boolean): LegalSection[] {
  if (isAr) {
    return [
      {
        id: "acceptance",
        title: "قبول الشروط",
        paragraphs: [
          "باستخدامك لهذه المنصة فإنك توافق على هذه الشروط. إن لم توافق، يرجى عدم استخدام الخدمة.",
        ],
      },
      {
        id: "service",
        title: "الخدمة",
        paragraphs: [
          "توفر المنصة فهرسة وعرض كتب ومقالات ومحتوى ناشرين. قد تتغير الميزات دون إشعار مسبق لتحسين التجربة.",
        ],
      },
      {
        id: "accounts",
        title: "الحسابات والمحتوى",
        paragraphs: [
          "أنت مسؤول عن دقة المعلومات التي تقدّمها عند النشر أو التواصل.",
          "يُحظر نشر محتوى مخالف للقانون أو ينتهك حقوق الملكية الفكرية للغير.",
        ],
      },
      {
        id: "ip",
        title: "الملكية الفكرية",
        paragraphs: [
          "حقوق الكتب والمقالات المعروضة تعود لأصحابها. لا يجوز نسخ أو إعادة توزيع المحتوى دون إذن صريح.",
        ],
      },
      {
        id: "liability",
        title: "حدود المسؤولية",
        paragraphs: [
          "المنصة تُقدَّم «كما هي». لا نضمن دقة كل البيانات الوصفية للكتب الواردة من مصادر خارجية.",
        ],
      },
      {
        id: "law",
        title: "القانون المعمول به",
        paragraphs: [
          "تخضع هذه الشروط للقوانين المعمول بها في بلد تشغيل المنصة ما لم ينص على غير ذلك.",
          "آخر تحديث: مايو 2026.",
        ],
      },
    ];
  }

  return [
    {
      id: "acceptance",
      title: "Acceptance",
      paragraphs: [
        "By using this platform you agree to these terms. If you do not agree, please do not use the service.",
      ],
    },
    {
      id: "service",
      title: "The Service",
      paragraphs: [
        "The platform indexes and displays books, articles, and publisher content. Features may change without prior notice to improve the experience.",
      ],
    },
    {
      id: "accounts",
      title: "Accounts & Content",
      paragraphs: [
        "You are responsible for the accuracy of information you submit when publishing or contacting us.",
        "You may not post content that is unlawful or infringes third-party intellectual property rights.",
      ],
    },
    {
      id: "ip",
      title: "Intellectual Property",
      paragraphs: [
        "Rights to displayed books and articles belong to their owners. Content may not be copied or redistributed without explicit permission.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      paragraphs: [
        "The platform is provided «as is». We do not guarantee the accuracy of all metadata for books sourced externally.",
      ],
    },
    {
      id: "law",
      title: "Governing Law",
      paragraphs: [
        "These terms are governed by applicable laws in the platform's operating jurisdiction unless otherwise stated.",
        "Last updated: May 2026.",
      ],
    },
  ];
}

export default async function TermsPage() {
  const locale = (await getLocale()) as Locale;
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        variant="light"
        title={isAr ? "الشروط والأحكام" : "Terms & Conditions"}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: isAr ? "الشروط والأحكام" : "Terms & Conditions" },
        ]}
      />
      <LegalProseLayout locale={locale} sections={termsSections(isAr)} />
    </div>
  );
}
