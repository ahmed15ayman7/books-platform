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
    ar: "سرعة الكشف والاطلاع على الإصدارات العالمية والفهرسة والوصف الببليوغرافي لها.",
    en: "Rapid discovery of global releases with bibliographic indexing and description.",
  },
  {
    ar: "إعلام وتسويق وهندسة إلكترونية للكتب الجديدة والمتميزة على مختلف المنصات والقنوات.",
    en: "Promotion, marketing, and digital engineering for new and distinctive books across platforms and channels.",
  },
  {
    ar: "تصنيف دقيق للكتب وفق تصنيف محلي واحترافي للعالم.",
    en: "Precise book categorization using a local yet professional global taxonomy.",
  },
  {
    ar: "توجيه القرّاء لاستخدام المنصة لكافة القرّاء من العامة والمتخصصين والباحثين.",
    en: "Guiding all readers — general, specialist, and researcher — to use the platform effectively.",
  },
  {
    ar: "خدمة بحثية لمتابعة الإصدارات والترجمات العربية للكتب.",
    en: "Research service tracking book releases and Arabic translations.",
  },
  {
    ar: "تخديم شديدي القراءة باقتراح الكتب المشابهة لما قرأوه وجديرة بالقراءة.",
    en: "Serving avid readers with recommendations similar to what they have read and worth reading.",
  },
  {
    ar: "ترشيح الإصدارات المعنية بالترجمة.",
    en: "Nominating editions suitable for translation.",
  },
  {
    ar: "توثيق وترجمة لقائمة أكثر الكتب مبيعاً ورواجاً باللغة العربية.",
    en: "Documenting and translating lists of the best-selling and most popular books in Arabic.",
  },
  {
    ar: "تمكين المؤلفين والمؤلفات من نشر كتاباتهم وكتبهم على المنصة.",
    en: "Enabling authors to publish their writings and books on the platform.",
  },
  {
    ar: "تمكين دور النشر من إطلاع جمهورها ومرتاديها على الكتب الجديدة.",
    en: "Enabling publishers to showcase new books to their audiences and visitors.",
  },
  {
    ar: "خدمة تجارية لدور النشر لطلب بيع وتسويق كتبها في العالم العربي والشرق الأوسط.",
    en: "Commercial service for publishers to sell and market their books in the Arab world and Middle East.",
  },
  {
    ar: "تزويد المترجمين بالعربية بالاطلاع على أهم وأحدث الكتب والروائع العالمية القابلة للترجمة.",
    en: "Providing Arabic translators access to the most important and latest world books eligible for translation.",
  },
  {
    ar: "إطلاع المبدعين والمعنيين بنشر كتاب مترجم أو مؤلف أفكار أو معرفة للنشر وشراء حقوق نشر كتبهم.",
    en: "Informing creators interested in publishing translated or authored works and acquiring publishing rights.",
  },
  {
    ar: "تقديم خدمات ثقافية وإعلامية مبتكرة عبر نشرات يومية عن الكتب الجديدة، وإنتاج فيديوهات وبودكاست تسلّط الضوء على أهم الإصدارات، والتفاعل عبر تطبيق المنصة وقنوات التواصل.",
    en: "Delivering innovative cultural and media services through daily bulletins on new books, videos and podcasts highlighting key releases, and engagement via the app and social channels.",
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
    ar: "تقدّم منصة الكتب مجموعة من الخدمات الجديدة والمميزة والحصرية للقرّاء والمؤلفين والناشرين والمترجمين.",
    en: "Books Platform offers a range of new, distinctive, and exclusive services to readers, authors, publishers, and translators.",
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
