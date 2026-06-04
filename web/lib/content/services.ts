import type { Locale } from "@/lib/i18n";
import { pickLocale, pickLocaleList, type BilingualString } from "./types";

export interface ServicePillar {
  key: string;
  title: BilingualString;
  body: BilingualString;
}

export interface WorkflowStep {
  title: BilingualString;
  body: BilingualString;
}

export interface Deliverable {
  key: string;
  title: BilingualString;
  items: BilingualString[];
}

export interface PartnershipCard {
  key: string;
  title: BilingualString;
  body: BilingualString;
  href: string;
}

export interface ServicesContent {
  hero: { title: string; subtitle: string };
  intro: { eyebrow: string; title: string; lead: string };
  pillars: ServicePillar[];
  workflow: { eyebrow: string; title: string; steps: { title: string; body: string }[] };
  deliverables: { eyebrow: string; title: string; items: { key: string; title: string; items: string[] }[] };
  media: { eyebrow: string; title: string; lead: string };
  partnerships: { eyebrow: string; title: string; items: { key: string; title: string; body: string; href: string }[] };
  cta: { quote: string; primary: string; secondary: string };
}

const pillars: ServicePillar[] = [
  {
    key: "biblio",
    title: { ar: "مخرجات ببليوغرافية", en: "Bibliographic Outputs" },
    body: {
      ar: "كتالوجات، فهارس، وبطاقات ببليوغرافية يومية للإصدارات الجديدة من دور النشر العالمية.",
      en: "Catalogs, indexes, and daily bibliographic records for new releases from global publishers.",
    },
  },
  {
    key: "journal",
    title: { ar: "مخرجات صحفية", en: "Journalistic Outputs" },
    body: {
      ar: "مقالات، تقارير، ونشرات إعلامية — بما فيها «العالم العربي يقرأ».",
      en: "Articles, reports, and media bulletins — including \"The Arab World Reads\".",
    },
  },
  {
    key: "research",
    title: { ar: "مخرجات بحثية", en: "Research Outputs" },
    body: {
      ar: "دراسات، مراجع، وتحليلات أكاديمية مع إشراف علمي على المنشورات.",
      en: "Studies, references, and academic analyses with scholarly oversight.",
    },
  },
  {
    key: "av",
    title: { ar: "صوت ومرئي", en: "Audio & Video" },
    body: {
      ar: "بودكast، فيديو YouTube، وقناة «شاهد كتابك» للكتب والمؤلفين.",
      en: "Podcasts, YouTube video, and the Watch Your Book channel for books and authors.",
    },
  },
  {
    key: "social",
    title: { ar: "سوشيال", en: "Social Content" },
    body: {
      ar: "محتوى قصير للانتشار على المنصات الاجتماعية وتعزيز الوعي بالقراءة.",
      en: "Short-form content for social platforms to promote reading awareness.",
    },
  },
  {
    key: "cms",
    title: { ar: "إدارة محتوى", en: "Content Management" },
    body: {
      ar: "نشر وترتيب المحتوى على المنصة بمعايير تحريرية واحترافية.",
      en: "Publishing and organizing platform content with editorial standards.",
    },
  },
];

const workflowSteps: WorkflowStep[] = [
  {
    title: { ar: "اكتشاف", en: "Discovery" },
    body: {
      ar: "رصد الإصدارات العالمية ومتابعة دور النشر.",
      en: "Monitoring global releases and tracking publishers.",
    },
  },
  {
    title: { ar: "فهرسة", en: "Indexing" },
    body: {
      ar: "بيانات ببليوغرافية كاملة وتصنيف دقيق.",
      en: "Complete bibliographic data and accurate categorization.",
    },
  },
  {
    title: { ar: "إنتاج محتوى", en: "Content Production" },
    body: {
      ar: "مقالات، فيديو، وبودكast حسب القناة.",
      en: "Articles, video, and podcasts by channel.",
    },
  },
  {
    title: { ar: "نشر وتوزيع", en: "Publishing" },
    body: {
      ar: "المنصة، التطبيق، وقنوات التواصل.",
      en: "Platform, app, and social channels.",
    },
  },
  {
    title: { ar: "قياس وتطوير", en: "Measurement" },
    body: {
      ar: "تحليلات، SEO، وتحسين تجربة القارئ.",
      en: "Analytics, SEO, and reader experience optimization.",
    },
  },
];

const deliverables: Deliverable[] = [
  {
    key: "biblio",
    title: { ar: "ببليوغرافية", en: "Bibliography" },
    items: [
      { ar: "بطاقة كتاب", en: "Book record card" },
      { ar: "فهرس تصنيف", en: "Category index" },
      { ar: "تصدير metadata", en: "Metadata export" },
    ],
  },
  {
    key: "journal",
    title: { ar: "صحفي", en: "Journalism" },
    items: [
      { ar: "تقرير", en: "Report" },
      { ar: "مقال رأي", en: "Opinion piece" },
      { ar: "نشرة يومية", en: "Daily bulletin" },
    ],
  },
  {
    key: "research",
    title: { ar: "بحثي", en: "Research" },
    items: [
      { ar: "مراجعة", en: "Review" },
      { ar: "ملخص", en: "Summary" },
      { ar: "ورقة بحثية", en: "Research paper" },
    ],
  },
  {
    key: "av",
    title: { ar: "مرئي", en: "Visual" },
    items: [
      { ar: "فيديو YouTube", en: "YouTube video" },
      { ar: "بودكast", en: "Podcast" },
      { ar: "Reel", en: "Reel" },
    ],
  },
  {
    key: "social",
    title: { ar: "سوشيال", en: "Social" },
    items: [
      { ar: "منشور", en: "Post" },
      { ar: "Carousel", en: "Carousel" },
      { ar: "Quote card", en: "Quote card" },
    ],
  },
];

export function getServicesContent(locale: Locale): ServicesContent {
  const isAr = locale === "ar";
  return {
    hero: {
      title: isAr ? "خدماتنا" : "Our Services",
      subtitle: isAr
        ? "خدمات جديدة ومميزة وغير مسبوقة تقدّمها منصة الكتب للقارئ والمؤلف والناشر والمترجم"
        : "New, distinctive and unprecedented services offered by Books Platform to the reader, author, publisher and translator",
    },
    intro: {
      eyebrow: isAr ? "خدمات المنصة" : "Platform Services",
      title: isAr ? "ماذا نقدّم؟" : "What We Offer",
      lead: isAr
        ? "تقدّم منصة الكتب مجموعة من الخدمات الجديدة والمميزة والحصرية للقرّاء والمؤلفين والناشرين والمترجمين."
        : "Books Platform offers a range of new, distinctive, and exclusive services to readers, authors, publishers, and translators.",
    },
    pillars: pillars.map((p) => ({
      ...p,
      title: { ar: p.title.ar, en: p.title.en },
      body: { ar: p.body.ar, en: p.body.en },
    })),
    workflow: {
      eyebrow: isAr ? "آلية العمل" : "How We Work",
      title: isAr ? "من الفكرة إلى القارئ" : "From Idea to Reader",
      steps: workflowSteps.map((s) => ({
        title: pickLocale(s.title, locale),
        body: pickLocale(s.body, locale),
      })),
    },
    deliverables: {
      eyebrow: isAr ? "مخرجات" : "Deliverables",
      title: isAr ? "ما نُسلّمه" : "What We Deliver",
      items: deliverables.map((d) => ({
        key: d.key,
        title: pickLocale(d.title, locale),
        items: pickLocaleList(d.items, locale),
      })),
    },
    media: {
      eyebrow: isAr ? "ميديا" : "Media",
      title: isAr ? "قدراتنا المرئية" : "Our Media Capabilities",
      lead: isAr
        ? "فيديو، بودكast، وقنوات متخصصة — شاهد أحدث محتوى المنصة."
        : "Video, podcasts, and specialized channels — watch our latest content.",
    },
    partnerships: {
      eyebrow: isAr ? "شراكات" : "Partnerships",
      title: isAr ? "نماذج الشراكة" : "Partnership Models",
      items: [
        {
          key: "institutions",
          title: { ar: "مؤسسات ثقافية", en: "Cultural Institutions" },
          body: {
            ar: "شراكات محتوى، رعاية، وفهرسة مشتركة.",
            en: "Content partnerships, sponsorship, and shared indexing.",
          },
          href: "/contact",
        },
        {
          key: "publishers",
          title: { ar: "دور نشر", en: "Publishers" },
          body: {
            ar: "عرض الكتب، ترجمة، وتسويق مشترك.",
            en: "Book listing, translation, and co-marketing.",
          },
          href: "/publishers",
        },
        {
          key: "creators",
          title: { ar: "مبدعون ومؤلفون", en: "Creators & Authors" },
          body: {
            ar: "نشر كتاب، مقالات، وفيديو.",
            en: "Book publishing, articles, and video.",
          },
          href: "/publish",
        },
      ].map((p) => ({
        ...p,
        title: pickLocale(p.title, locale),
        body: pickLocale(p.body, locale),
        href: `/${locale}${p.href}`,
      })),
    },
    cta: {
      quote: isAr
        ? "«لنبني معاً جسر المعرفة بين العالم والقارئ العربي»"
        : "\"Let's build the knowledge bridge between the world and the Arabic reader together.\"",
      primary: isAr ? "تواصل معنا" : "Contact Us",
      secondary: isAr ? "انشر كتابك" : "Publish Your Book",
    },
  };
}

export function getServicePillarIcons(): Record<string, string> {
  return {
    biblio: "BookMarked",
    journal: "Newspaper",
    research: "Search",
    av: "Mic",
    social: "Share2",
    cms: "FileText",
  };
}
