import type { Locale } from "@/lib/i18n";
import { pickLocale, pickLocaleList, type BilingualString } from "./types";

export interface OutputMapBlock {
  key: string;
  title: BilingualString;
  body: BilingualString;
  bullets?: BilingualString[];
}

export interface ProductCard {
  key: string;
  title: BilingualString;
  items: BilingualString[];
}

export interface ServicesPageContent {
  hero: { title: string; subtitle: string };
  platformServices: { title: string; intro: string; items: string[] };
  outputMap: { title: string; blocks: { key: string; title: string; body: string; bullets?: string[] }[] };
  bibliography: { title: string; body: string };
  products: { title: string; cards: { key: string; title: string; items: string[] }[] };
  closing: string;
}

const platformServiceItems: BilingualString[] = [
  {
    ar: "رصد وانتقاء أحدث الكتب الصادرة في العالم بكل اللغات وفي كافة التصنيفات.",
    en: "Monitoring and curating the latest books published worldwide, in all languages and across all categories.",
  },
  {
    ar: "تقديم بيانات كاملة ونبذات وافية عن جديد الكتب باللغتين العربية والإنجليزية.",
    en: "Providing complete data and comprehensive summaries of new books in both Arabic and English.",
  },
  {
    ar: "نشر بيانات الكتب في القسم المخصص لها في المنصة بحسب تصنيفها.",
    en: "Publishing book data in their dedicated sections on the platform according to category.",
  },
  {
    ar: "إعداد نشرات إخبارية يومية وفيديوهات وبودكاست عن أهم الكتب.",
    en: "Producing daily news bulletins, videos, and podcasts about the most important books.",
  },
  {
    ar: "إعداد تقارير تحليلية مجمّعة لحصاد الكتب العربية والأجنبية تصدر أسبوعياً.",
    en: "Preparing consolidated analytical reports on Arabic and foreign book harvests, published weekly.",
  },
  {
    ar: "تقديم خدمات تفاعلية وأدوات التشبيك بين كافة عناصر العملية الثقافية.",
    en: "Offering interactive services and networking tools connecting all elements of the cultural process.",
  },
  {
    ar: "تعريف الناشرين العرب بالكتب الأجنبية الجديدة وترشيحها للترجمة إلى العربية.",
    en: "Introducing Arab publishers to new foreign books and nominating them for translation into Arabic.",
  },
  {
    ar: "التنسيق مع المترجمين الراغبين في نيل حقوق الترجمة للكتب الأجنبية.",
    en: "Coordinating with translators seeking to obtain translation rights for foreign books.",
  },
  {
    ar: "التعريف بالأبحاث والدراسات والمؤلفات العربية الجديدة التي لم تُنشر بعد.",
    en: "Highlighting new Arabic research, studies, and manuscripts that have not yet been published.",
  },
  {
    ar: "التسويق الشبكي على الإنترنت عبر منصات التواصل الاجتماعي، والترويج باستخدام برامج وقوائم إيميلات خاصة تضم ملايين القراء والباحثين.",
    en: "Online network marketing through social media platforms, and promotion via dedicated email programs and lists reaching millions of readers and researchers.",
  },
  {
    ar: "خدمة تسهيل شراء الكتب الجديدة بالإحالة إلى مصدر البيع وموقع الناشر، أو عن طريق خدمة الدفع الإلكتروني وشراء الكتب مباشرة من خلال المنصة.",
    en: "Facilitating purchase of new books by referral to the seller and publisher website, or through electronic payment and direct purchase via the platform.",
  },
];

const outputMapBlocks: OutputMapBlock[] = [
  {
    key: "fastest-book",
    title: { ar: "أسرع كتاب", en: "Fastest Book" },
    body: {
      ar: "خدمة يومية للكتب الجديدة في العالم.",
      en: "A daily service for new books worldwide.",
    },
    bullets: [
      { ar: "صحيفة يومية للكتب الجديدة", en: "Daily newspaper for new books" },
      { ar: "نشرة ومخزن ببليوغرافي للكتب الجديدة worldwide", en: "Bibliographic bulletin and archive for new books worldwide" },
      { ar: "خدمة اتصال بين القرّاء والكتب على مستوى العالم", en: "Connecting readers with books globally" },
    ],
  },
  {
    key: "specialized",
    title: { ar: "كتب متخصصة", en: "Specialized Books" },
    body: {
      ar: "مكتبة إلكترونية متخصصة online specialized library.",
      en: "An online specialized electronic library.",
    },
  },
  {
    key: "literary-studies",
    title: { ar: "أدب دراسات نقدية", en: "Literature & Critical Studies" },
    body: {
      ar: "بيت المعرفة للمنصة في الأدب والدراسات النقدية.",
      en: "The platform's knowledge hub for literature and critical studies.",
    },
  },
  {
    key: "publish-book",
    title: { ar: "نشر كتابك", en: "Publish Your Book" },
    body: {
      ar: "مساعدة المؤلفين والمؤلفات على نشر كتاباتهم وكتبهم.",
      en: "Helping authors publish their writings and books.",
    },
  },
  {
    key: "authors",
    title: { ar: "مؤلفون", en: "Authors" },
    body: {
      ar: "منصة للمؤلفين الذين لا يجدون من ينشر لهم.",
      en: "A platform for authors who cannot find a publisher.",
    },
  },
  {
    key: "books-sky",
    title: { ar: "سماء الكتب", en: "Books Sky" },
    body: {
      ar: "تجميع كل منتجات المنصة في مكان واحد.",
      en: "Aggregating all platform products in one place.",
    },
  },
  {
    key: "world-reads",
    title: { ar: "العالم يقرأ", en: "The World Reads" },
    body: {
      ar: "قسم يومي يعرض ما يقرأه العالم من كتب.",
      en: "A daily section showing what the world is reading.",
    },
  },
  {
    key: "learning-radar",
    title: { ar: "رصد التعلم", en: "Learning Radar" },
    body: {
      ar: "رصد أحدث الكتب في مجال التعلم والتطوير.",
      en: "Tracking the latest books in learning and development.",
    },
  },
  {
    key: "reading-scenes",
    title: { ar: "مشاهد القراءة", en: "Reading Scenes" },
    body: {
      ar: "جولة أسبوعية في مشاهد القراءة حول العالم.",
      en: "A weekly tour of reading scenes around the world.",
    },
  },
  {
    key: "book-life",
    title: { ar: "حياة كتاب", en: "A Book's Life" },
    body: {
      ar: "برنامج نصف شهري عن حياة الكتاب من الفكرة إلى القارئ.",
      en: "A biweekly program on a book's life from idea to reader.",
    },
  },
  {
    key: "novel-story",
    title: { ar: "رواية في حكاية", en: "Novel in a Story" },
    body: {
      ar: "قناة مخصصة للرواية والسرد العالمي.",
      en: "A channel dedicated to novels and global storytelling.",
    },
  },
];

const productCards: ProductCard[] = [
  {
    key: "biblio",
    title: { ar: "مخرجات ببليوغرافية", en: "Bibliographic Outputs" },
    items: [
      { ar: "كتالوجات وفهارس", en: "Catalogs and indexes" },
      { ar: "بطاقات ببليوغرافية يومية", en: "Daily bibliographic records" },
      { ar: "بيانات metadata للكتب", en: "Book metadata" },
    ],
  },
  {
    key: "journal",
    title: { ar: "مخرجات صحفية", en: "Journalistic Outputs" },
    items: [
      { ar: "مقالات وتقارير", en: "Articles and reports" },
      { ar: "نشرات يومية", en: "Daily bulletins" },
      { ar: "العالم يقرأ", en: "The World Reads" },
    ],
  },
  {
    key: "research",
    title: { ar: "مخرجات بحثية", en: "Research Outputs" },
    items: [
      { ar: "دراسات ومراجع", en: "Studies and references" },
      { ar: "تحليلات أكاديمية", en: "Academic analyses" },
      { ar: "أوراق بحثية", en: "Research papers" },
    ],
  },
  {
    key: "av",
    title: { ar: "مخرجات صوتية ومرئية", en: "Audio & Video Outputs" },
    items: [
      { ar: "فيديو YouTube", en: "YouTube video" },
      { ar: "بودكاست", en: "Podcasts" },
      { ar: "قنوات الميديا", en: "Media channels" },
    ],
  },
  {
    key: "social",
    title: { ar: "مخرجات السوشيال ميديا", en: "Social Media Outputs" },
    items: [
      { ar: "منشورات قصيرة", en: "Short posts" },
      { ar: "Carousel و Reels", en: "Carousels and reels" },
      { ar: "بطاقات اقتباس", en: "Quote cards" },
    ],
  },
];

export function getServicesContent(locale: Locale): ServicesPageContent {
  const isAr = locale === "ar";

  const heroSubtitle: BilingualString = {
    ar: "خدمات جديدة ومميزة وغير مسبوقة تقدّمها منصة الكتب للقارئ والمؤلف والناشر والمترجم",
    en: "New, distinctive and unprecedented services offered by Books Platform to the reader, author, publisher and translator",
  };

  const platformIntro: BilingualString = {
    ar: "خدمات جديدة ومميزة وحصرية تقدمها «منصة الكتب العالمية» للقارئ والمؤلف والناشر والمترجم، كما يلي:",
    en: "New, distinctive, and exclusive services offered by Books Platform to the reader, author, publisher, and translator, as follows:",
  };

  const bibliographyBody: BilingualString = {
    ar: "ببليوغرافيا المنصة هي قلب خدماتنا: فهرسة يومية للإصدارات العالمية، بطاقات ببليوغرافية دقيقة، وتصنيف احترافي يربط القارئ العربي بكل كتاب جديد في العالم — من الكشف إلى الوصف إلى التوزيع عبر المنصة والتطبيق وقنوات التواصل.",
    en: "Platform bibliography is the heart of our services: daily indexing of global releases, precise bibliographic records, and professional categorization connecting the Arabic reader with every new book in the world — from discovery to description to distribution across the platform, app, and social channels.",
  };

  const closing: BilingualString = {
    ar: "منصة الكتب العالمية جسر معرفة يربط العالم بالقارئ العربي — ببليوغرافيا، إعلام، بحث، وصوت ومرئي وسوشيال — لبناء ثقافة قراءة عربية معاصرة ومتصلة بالعالم.",
    en: "Books Platform is a knowledge bridge connecting the world with the Arabic reader — through bibliography, media, research, audio-visual, and social content — building a contemporary Arabic reading culture connected to the world.",
  };

  return {
    hero: {
      title: isAr ? "خدماتنا" : "Our Services",
      subtitle: pickLocale(heroSubtitle, locale),
    },
    platformServices: {
      title: isAr ? "خدمات المنصة" : "Platform Services",
      intro: pickLocale(platformIntro, locale),
      items: pickLocaleList(platformServiceItems, locale),
    },
    outputMap: {
      title: isAr ? "خريطة مخرجات المنصة" : "Platform Outputs Map",
      blocks: outputMapBlocks.map((block) => ({
        key: block.key,
        title: pickLocale(block.title, locale),
        body: pickLocale(block.body, locale),
        bullets: block.bullets ? pickLocaleList(block.bullets, locale) : undefined,
      })),
    },
    bibliography: {
      title: isAr ? "ببليوغرافيا المنصة" : "Platform Bibliography",
      body: pickLocale(bibliographyBody, locale),
    },
    products: {
      title: isAr ? "مخرجات ومنتجات المنصة" : "Platform Outputs & Products",
      cards: productCards.map((card) => ({
        key: card.key,
        title: pickLocale(card.title, locale),
        items: pickLocaleList(card.items, locale),
      })),
    },
    closing: pickLocale(closing, locale),
  };
}
