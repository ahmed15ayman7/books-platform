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
    path: `/${locale}/privacy`,
    title: locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy",
    description:
      locale === "ar"
        ? "سياسة الخصوصية لمنصة الكتب العالمية"
        : "Privacy policy for Books Platform",
    keywords: locale === "ar" ? ["خصوصية"] : ["privacy"],
  });
}

function privacySections(isAr: boolean): LegalSection[] {
  if (isAr) {
    return [
      {
        id: "intro",
        title: "مقدمة",
        paragraphs: [
          "نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضّح هذه السياسة كيفية جمع واستخدام وحماية المعلومات عند استخدامك لمنصة الكتب العالمية.",
        ],
      },
      {
        id: "collection",
        title: "البيانات التي نجمعها",
        paragraphs: [
          "قد نجمع: الاسم، البريد الإلكتروني، بيانات التواصل عند إرسال نموذج، وسجلات الاستخدام التقنية (عنوان IP، نوع المتصفح، صفحات الزيارة) لتحسين الخدمة.",
          "لا نبيع بياناتك الشخصية لأطراف ثالثة لأغراض تسويقية.",
        ],
      },
      {
        id: "usage",
        title: "كيف نستخدم البيانات",
        paragraphs: [
          "نستخدم البيانات لتشغيل المنصة، الرد على استفساراتك، تحسين المحتوى والأداء، وإرسال تحديثات إذا اشتركت في النشرة البريدية.",
        ],
      },
      {
        id: "cookies",
        title: "ملفات تعريف الارتباط",
        paragraphs: [
          "نستخدم ملفات تعريف الارتباط (Cookies) لتذكّر تفضيلاتك (مثل اللغة) وتحليل الاستخدام. يمكنك ضبط متصفحك لرفضها، مع احتمال تأثر بعض الميزات.",
        ],
      },
      {
        id: "security",
        title: "الأمان",
        paragraphs: [
          "نطبّق إجراءات تقنية وإدارية معقولة لحماية بياناتك. لا يمكن ضمان أمان مطلق عبر الإنترنت.",
        ],
      },
      {
        id: "rights",
        title: "حقوقك",
        paragraphs: [
          "يمكنك طلب الوصول إلى بياناتك أو تصحيحها أو حذفها بالتواصل معنا عبر صفحة اتصل بنا.",
        ],
      },
      {
        id: "updates",
        title: "تحديثات السياسة",
        paragraphs: [
          "قد نحدّث هذه السياسة. سننشر التاريخ المحدّث في أعلى الصفحة عند التغيير الجوهري.",
          "آخر تحديث: مايو 2026.",
        ],
      },
    ];
  }

  return [
    {
      id: "intro",
      title: "Introduction",
      paragraphs: [
        "We respect your privacy and are committed to protecting your personal data. This policy explains how we collect, use, and safeguard information when you use Books Platform.",
      ],
    },
    {
      id: "collection",
      title: "Data We Collect",
      paragraphs: [
        "We may collect: name, email, contact details when you submit a form, and technical usage logs (IP address, browser type, pages visited) to improve the service.",
        "We do not sell your personal data to third parties for marketing purposes.",
      ],
    },
    {
      id: "usage",
      title: "How We Use Data",
      paragraphs: [
        "We use data to operate the platform, respond to inquiries, improve content and performance, and send updates if you subscribe to our newsletter.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies",
      paragraphs: [
        "We use cookies to remember preferences (such as language) and analyze usage. You may configure your browser to refuse cookies, though some features may be affected.",
      ],
    },
    {
      id: "security",
      title: "Security",
      paragraphs: [
        "We apply reasonable technical and administrative measures to protect your data. Absolute security over the internet cannot be guaranteed.",
      ],
    },
    {
      id: "rights",
      title: "Your Rights",
      paragraphs: [
        "You may request access, correction, or deletion of your data by contacting us through the Contact page.",
      ],
    },
    {
      id: "updates",
      title: "Policy Updates",
      paragraphs: [
        "We may update this policy. We will post the revised date at the top of this page for material changes.",
        "Last updated: May 2026.",
      ],
    },
  ];
}

export default async function PrivacyPage() {
  const locale = (await getLocale()) as Locale;
  const isAr = locale === "ar";

  return (
    <div className="min-h-screen bg-[var(--brand-gray-50)]">
      <PageHero
        locale={locale}
        variant="light"
        title={isAr ? "سياسة الخصوصية" : "Privacy Policy"}
        breadcrumbs={[
          { label: isAr ? "الرئيسية" : "Home", href: `/${locale}` },
          { label: isAr ? "سياسة الخصوصية" : "Privacy Policy" },
        ]}
      />
      <LegalProseLayout locale={locale} sections={privacySections(isAr)} />
    </div>
  );
}
