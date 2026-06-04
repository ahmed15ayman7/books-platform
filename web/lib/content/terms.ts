import type { Locale } from "@/lib/i18n";
import { pickLocale, type BilingualString } from "./types";

export interface TermsSection {
  id: string;
  title: BilingualString;
  paragraphs: BilingualString[];
}

const lastUpdated: BilingualString = {
  ar: "يونيو 2026",
  en: "June 2026",
};

const sections: TermsSection[] = [
  {
    id: "acceptance",
    title: { ar: "قبول الشروط", en: "Acceptance" },
    paragraphs: [
      {
        ar: "باستخدامك لهذه المنصة فإنك توافق على هذه الشروط. إن لم توافق، يرجى عدم استخدام الخدمة.",
        en: "By using this platform you agree to these terms. If you do not agree, please do not use the service.",
      },
    ],
  },
  {
    id: "service",
    title: { ar: "الخدمة", en: "The Service" },
    paragraphs: [
      {
        ar: "توفر المنصة فهرسة وعرض كتب ومقالات ومحتوى ناشرين. قد تتغير الميزات دون إشعار مسبق لتحسين التجربة.",
        en: "The platform provides indexing and display of books, articles, and publisher content. Features may change without prior notice to improve the experience.",
      },
    ],
  },
  {
    id: "accounts",
    title: { ar: "الحسابات والمحتوى", en: "Accounts & Content" },
    paragraphs: [
      {
        ar: "أنت مسؤول عن دقة المعلومات التي تقدّمها عند النشر أو التواصل.",
        en: "You are responsible for the accuracy of information you submit when publishing or contacting us.",
      },
      {
        ar: "يُحظر نشر محتوى مخالف للقانون أو ينتهك حقوق الملكية الفكرية للغير.",
        en: "Publishing content that violates the law or infringes third-party intellectual property is prohibited.",
      },
    ],
  },
  {
    id: "ip",
    title: { ar: "الملكية الفكرية", en: "Intellectual Property" },
    paragraphs: [
      {
        ar: "حقوق الكتب والمقالات المعروضة تعود لأصحابها. لا يجوز نسخ أو إعادة توزيع المحتوى دون إذن صريح.",
        en: "Rights to displayed books and articles belong to their owners. Content may not be copied or redistributed without explicit permission.",
      },
    ],
  },
  {
    id: "liability",
    title: { ar: "حدود المسؤولية", en: "Limitation of Liability" },
    paragraphs: [
      {
        ar: "المنصة تُقدَّم «كما هي». لا نضمن دقة كل البيانات الوصفية للكتب الواردة من مصادر خارجية.",
        en: "The platform is provided \"as is\". We do not guarantee the accuracy of all bibliographic metadata from external sources.",
      },
    ],
  },
  {
    id: "law",
    title: { ar: "القانون المعمول به", en: "Governing Law" },
    paragraphs: [
      {
        ar: "تخضع هذه الشروط للقوانين المعمول بها في بلد تشغيل المنصة ما لم ينص على غير ذلك.",
        en: "These terms are governed by the laws applicable in the platform's country of operation unless otherwise stated.",
      },
    ],
  },
];

export function getTermsSections(locale: Locale) {
  return sections.map((s) => ({
    id: s.id,
    title: pickLocale(s.title, locale),
    paragraphs: s.paragraphs.map((p) => pickLocale(p, locale)),
  }));
}

export function getTermsLastUpdated(locale: Locale): string {
  return pickLocale(lastUpdated, locale);
}

export function getTermsHero(locale: Locale) {
  const isAr = locale === "ar";
  return {
    title: isAr ? "الشروط والأحكام" : "Terms & Conditions",
    subtitle: isAr
      ? "شروط استخدام منصة الكتب العالمية"
      : "Terms of use for Books Platform",
  };
}
