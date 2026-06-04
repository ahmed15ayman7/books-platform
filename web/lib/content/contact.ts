import type { Locale } from "@/lib/i18n";
import { pickLocale, type BilingualString } from "./types";

export interface FaqItem {
  id: string;
  question: BilingualString;
  answer: BilingualString;
}

export interface ResponseTime {
  key: string;
  label: string;
  time: string;
}

export interface ContactContent {
  hero: { title: string; subtitle: string };
  channels: {
    email: string;
    secondaryEmail?: string;
    phone: string;
    mobile?: string;
    officeHours: string;
  };
  faq: { eyebrow: string; title: string; items: FaqItem[] };
  responseTimes: ResponseTime[];
  location: { title: string; body: string };
  formTopics: { value: string; label: string }[];
}

const faqItems: FaqItem[] = [
  {
    id: "publish",
    question: { ar: "كيف أنشر كتابي؟", en: "How do I publish my book?" },
    answer: {
      ar: "عبر صفحة «انشر كتابك» — أول كتاب مجاني للمؤلفين الجدد المؤهّلين.",
      en: "Through the Publish Your Book page — the first book is free for eligible new authors.",
    },
  },
  {
    id: "partnership",
    question: { ar: "كيف أطلب شراكة؟", en: "How do I request a partnership?" },
    answer: {
      ar: "اختر «شراكة» في نموذج التواصل أو راسلنا على info@booksplatform.net.",
      en: "Select Partnership in the contact form or email us at info@booksplatform.net.",
    },
  },
  {
    id: "translation",
    question: { ar: "هل تترجمون الكتب؟", en: "Do you translate books?" },
    answer: {
      ar: "نفهرس ونرشّح الكتب؛ الترجمة تتم عبر شركاء وناشرين.",
      en: "We index and nominate books; translation is done through partners and publishers.",
    },
  },
  {
    id: "media",
    question: { ar: "كيف أُعرض كتابي فيديو؟", en: "How can my book be featured in video?" },
    answer: {
      ar: "عبر قناة «شاهد كتابك» — تواصل مع فريق الميديا.",
      en: "Through the Watch Your Book channel — contact our media team.",
    },
  },
  {
    id: "data",
    question: { ar: "من أين بيانات الكتب؟", en: "Where does book data come from?" },
    answer: {
      ar: "دور نشر عالمية، مكتبات وطنية، وفريق المنصة.",
      en: "Global publishers, national libraries, and our platform team.",
    },
  },
  {
    id: "support",
    question: { ar: "ما مدة الرد؟", en: "What is the response time?" },
    answer: {
      ar: "24–48 ساعة عمل حسب نوع الاستفسار.",
      en: "24–48 business hours depending on inquiry type.",
    },
  },
];

export function getContactContent(locale: Locale): ContactContent {
  const isAr = locale === "ar";
  return {
    hero: {
      title: isAr ? "تواصل معنا" : "Contact Us",
      subtitle: isAr
        ? "نسعد باستفساراتك واقتراحاتك وطلبات الشراكة"
        : "We welcome your questions, suggestions, and partnership requests",
    },
    channels: {
      email: "info@booksplatform.net",
      secondaryEmail: "atefmazhar@yahoo.com",
      phone: "+20 2 33460619",
      mobile: "+20 100 577 2608",
      officeHours: isAr
        ? "متاح من 10:00 صباحاً إلى 7:00 مساءً"
        : "Available from 10:00 AM to 7:00 PM",
    },
    faq: {
      eyebrow: isAr ? "أسئلة شائعة" : "FAQ",
      title: isAr ? "الأسئلة المتكررة" : "Frequently Asked Questions",
      items: faqItems,
    },
    responseTimes: [
      {
        key: "general",
        label: { ar: "استفسار عام", en: "General inquiry" },
        time: { ar: "24 ساعة", en: "24 hours" },
      },
      {
        key: "partnership",
        label: { ar: "شراكة / نشر", en: "Partnership / publishing" },
        time: { ar: "48 ساعة", en: "48 hours" },
      },
      {
        key: "tech",
        label: { ar: "دعم تقني", en: "Technical support" },
        time: { ar: "72 ساعة", en: "72 hours" },
      },
    ].map((r) => ({
      ...r,
      label: pickLocale(r.label, locale),
      time: pickLocale(r.time, locale),
    })),
    location: {
      title: isAr ? "موقعنا" : "Our Location",
      body: isAr
        ? "القاهرة، جمهورية مصر العربية"
        : "Cairo, Arab Republic of Egypt",
    },
    formTopics: [
      { value: "general", label: isAr ? "استفسار عام" : "General" },
      { value: "publish", label: isAr ? "نشر كتاب" : "Publishing" },
      { value: "partnership", label: isAr ? "شراكة" : "Partnership" },
      { value: "support", label: isAr ? "دعم تقني" : "Support" },
    ],
  };
}

export function getFaqLocalized(items: FaqItem[], locale: Locale) {
  return items.map((item) => ({
    id: item.id,
    question: pickLocale(item.question, locale),
    answer: pickLocale(item.answer, locale),
  }));
}
