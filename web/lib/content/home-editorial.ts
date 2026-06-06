import type { Locale } from "@/lib/i18n";
import { pickLocale, type BilingualString } from "./types";

const missionQuote: BilingualString = {
  ar: "«غايتنا أن نُعرّف القارئ العربي بكل كتاب جديد يُنشر في العالم»",
  en: "\"Our purpose is to introduce the Arab reader to every new book published around the world.\"",
};

const readerJourney: { key: string; title: BilingualString; desc: BilingualString }[] = [
  {
    key: "discover",
    title: { ar: "اكتشف", en: "Discover" },
    desc: { ar: "كتب العالم في مكان واحد", en: "World books in one place" },
  },
  {
    key: "read",
    title: { ar: "اقرأ", en: "Read" },
    desc: { ar: "مقالات وقنوات متخصصة", en: "Articles and specialized channels" },
  },
  {
    key: "translate",
    title: { ar: "ترجم", en: "Translate" },
    desc: { ar: "كتب مرشحة للترجمة", en: "Books nominated for translation" },
  },
  {
    key: "publish",
    title: { ar: "انشر", en: "Publish" },
    desc: { ar: "شارك كتابك مع القرّاء", en: "Share your book with readers" },
  },
];

const servicesPreview: { key: string; title: BilingualString; desc: BilingualString }[] = [
  {
    key: "biblio",
    title: { ar: "ببليوغرافيا", en: "Bibliography" },
    desc: { ar: "فهرسة يومية للإصدارات", en: "Daily release indexing" },
  },
  {
    key: "av",
    title: { ar: "مرئي", en: "Video" },
    desc: { ar: "فيديوهات على YouTube", en: "Videos on YouTube" },
  },
  {
    key: "journal",
    title: { ar: "صحفي", en: "Journalism" },
    desc: { ar: "مقالات وتقارير متخصصة", en: "Specialized articles and reports" },
  },
];

export function getHomeEditorial(locale: Locale) {
  const isAr = locale === "ar";
  return {
    mission: {
      quote: pickLocale(missionQuote, locale),
      primary: isAr ? "تصفّح الكتب" : "Browse Books",
      secondary: isAr ? "من نحن" : "About Us",
    },
    readerJourney: {
      title: isAr ? "رحلة القارئ" : "Reader Journey",
      steps: readerJourney.map((s) => ({
        key: s.key,
        title: pickLocale(s.title, locale),
        desc: pickLocale(s.desc, locale),
      })),
    },
    mediaSpotlight: {
      title: isAr ? "إبداعات الميديا" : "Media Creations",
      subtitle: isAr ? "من قنوات الميديا" : "From our media channels",
      cta: isAr ? "كل الفيديوهات" : "All Videos",
    },
    servicesPreview: {
      title: isAr ? "خدماتنا" : "Our Services",
      subtitle: isAr ? "حلول متكاملة للنشر والمعرفة" : "Integrated publishing solutions",
      items: servicesPreview.map((s) => ({
        key: s.key,
        title: pickLocale(s.title, locale),
        desc: pickLocale(s.desc, locale),
      })),
      cta: isAr ? "كل الخدمات" : "All Services",
    },
    publishStrip: {
      title: isAr ? "انشر كتابك" : "Publish Your Book",
      description: isAr
        ? "يتيح هذا القسم من منصة الكتب العالمية مساحة خاصة لإبداعات المؤلفين والباحثين العرب الذين يعولون على طباعة ونشر أعمالهم الأولى غير المنشورة، لعرضها أمام القرّاء والناشرين والمهتمين بالثقافة والمعرفة."
        : "Books Platform dedicates this space to Arab authors and researchers preparing to print and publish their first unpublished works — giving them visibility among readers, publishers, and the wider knowledge community.",
      cta: isAr ? "امنح كتابك فرصته الأولى للانتشار" : "Give your book its first chance to reach readers",
      booksTitle: isAr ? "آخر الكتب المنشورة" : "Latest Published Books",
    },
  };
}
