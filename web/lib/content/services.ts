import type { Locale } from "@/lib/i18n";
import { pickLocale, pickLocaleList, type BilingualString } from "./types";

export interface OutputMapBlock {
  key: string;
  title: BilingualString;
  body: BilingualString;
  bullets?: BilingualString[];
  /** First block spans both grid columns with body and bullets side by side */
  spanFullWidth?: boolean;
}

export interface ProductCard {
  key: string;
  title: BilingualString;
  body: BilingualString;
  audiences: BilingualString;
}

export interface ServicesPageContent {
  hero: { title: string; subtitle: string };
  platformServices: { title: string; intro: string; items: string[] };
  outputMap: {
    title: string;
    blocks: { key: string; title: string; body: string; bullets?: string[]; spanFullWidth?: boolean }[];
  };
  bibliography: { title: string; body: string };
  products: {
    title: string;
    audiencesLabel: string;
    cards: { key: string; title: string; body: string; audiences: string }[];
  };
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
    key: "book-sections",
    spanFullWidth: true,
    title: { ar: "أقسام الكتب", en: "Book Sections" },
    body: {
      ar: "تتكون من سبعة أقسام رئيسية تغطي تصنيفات الكتب في جميع المجالات العلمية والمعرفية، ويتم نشر بيانات وعروض الكتب مع الأغلفة في القسم المخصص لها بحسب تصنيفها كالتالي:",
      en: "It consists of seven main sections covering book categories across all scientific and knowledge fields. Book data and showcases with covers are published in the dedicated section according to category, as follows:",
    },
    bullets: [
      { ar: "تقنيات وعلوم", en: "Technology & Science" },
      { ar: "دراسات اجتماعية", en: "Social Studies" },
      { ar: "لغات واداب", en: "Languages & Literature" },
      { ar: "فلسفات وثقافات", en: "Philosophies & Cultures" },
      { ar: "اديان وعقائد", en: "Religions & Beliefs" },
      { ar: "اقتصاد وتنمية", en: "Economy & Development" },
      { ar: "أفكار وسياسات", en: "Ideas & Policies" },
    ],
  },
  {
    key: "nominated-for-translation",
    title: { ar: "كتب مرشحة للترجمة", en: "Books nominated for translation" },
    body: {
      ar: "قسم مخصص لعرض (أحدث وأهم) الكتب الواردة المنشورة على المنصة من كل الأقسام والتصنيفات ومن جميع اللغات.",
      en: "A section dedicated to displaying (the latest and most important) incoming books published on the platform from all sections and categories and from all languages.",
    },
  },
  {
    key: "translated-books",
    title: { ar: "كتب مترجمة", en: "Translated Books" },
    body: {
      ar: "قسم خاص يقدم فيه أحدث الكتب الاجنبية المترجمة إلى العربية.",
      en: "A special section that presents the latest foreign books translated into Arabic.",
    },
  },
  {
    key: "publishers",
    title: { ar: "ناشرون", en: "Publishers" },
    body: {
      ar: "صفحة تعريفية لدور النشر (العربية والأجنبية) وتصنيفها بحسب البلد، وربطها بالكتب المنشورة لها على المنصة، مع موقعها الالكتروني وبريدها الالكتروني.",
      en: "A page introducing the publishing houses (Arabic and foreign) and classifying them by country, linking them to the books published by them on the platform, along with their website and email address.",
    },
  },
  {
    key: "publish-book",
    title: { ar: "انشر كتابك", en: "Publish Your Book" },
    body: {
      ar: "يعرض نبذات عن كتب وأعمال المؤلفين والأدباء والكتاب، التي لم تطبع ولم تنشر بعد.. وكذلك عرض الاطروحات الاكاديمية للباحثين.. بهدف ترويجها وتعريف الناشرين بها.. تشجيعاً لشرائح كبيرة من الشباب على التأليف والإبداع.. ويمكن إتاحة خدمة الرفع والتنزيل المجاني للجمهور لمن يرغب من المؤلفين والكتاب.",
      en: "It presents summaries of books and works by authors, writers, and authors that have not yet been printed or published. It also presents academic theses by researchers, with the aim of promoting them and introducing them to publishers, encouraging large segments of young people to write and create. Free upload and download service can be made available to the public for any authors and writers who wish to do so.",
    },
  },
  {
    key: "world-reads",
    title: { ar: " العالم يقرأ", en: "World Reads" },
    body: {
      ar: "أخبار ونشرات صحفية يومية عن أهم الكتب الصادرة حديثا.",
      en: "Daily news and press releases about the most important newly published books.",
    },
  },
  {
    key: "book-harvest",
    title: { ar: "حصاد الكتب", en: "Book Harvest" },
    body: {
      ar: "تقارير دورية متخصصة لاهم الكتب الصادرة في مجالات وتصانيف (الادب – والفكر – والثقافة – والعلوم – والفنون) – لكل تصنيف تقرير منفصل.",
      en: "Specialized periodic reports on the most important books published in the fields and categories of (literature, thought, culture, science, and arts) - a separate report for each category.",
    },
  },
  {
    key: "ideas-butter",
    title: { ar: "زبدة الافكار", en: "Ideas Butter" },
    body: {
      ar: "قسم خاص للباحثين والمثقفين يقدم قراءات تحليلية ومعمقة للكتب المهمة الصادرة حديثا.",
      en: "A special section for researchers and intellectuals offers in-depth analytical readings of important recently published books."
    }
  },
  {
    key: "see-your-book",
    title: { ar: "شاهد كتابك", en: "See your book" },
    body: {
      ar: "فيديوهات قصيرة عن أهم الكتب الأجنبية والعربية الصادرة حديثا. ويتم ربطه بقناة اليوتيوب والتيك توك ومنصات السوشيال ميديا.",
      en: "Short videos about the most important recently published foreign and Arabic books. These are linked to YouTube, TikTok, and other social media platforms."
    },
  },
  {
    key: "book-talks",
    title: { ar: "حديث الكتب", en: "Book Talks" },
    body: {
      ar: "مقاطع صوتية عن الكتب الجديدة – في عرض سريع وموجز في حدود (3 – 5 دقائق).",
      en: "Audio clips about new books – in a quick and concise presentation within (3-5 minutes)."
    }
  },
  {
    key: "novel-within-a-story",
    title: { ar: "رواية في حكاية", en: "Novel within a story" },
    body: {
      ar: "فيديوهات مختصر ة للروايات الشهيرة لكبار الأدباء العرب والعالميين – في قالب مبتكر ومشوق بأدوات AI يحكي الرواية باسلوب سينمائي للتشجيع على قراءتها والالمام بمضمونها.",
      en: "Short videos of famous novels by leading Arab and international writers – in an innovative and exciting format using AI tools that tell the story in a cinematic style to encourage reading and understanding its content."
    }
  },
];

const productCards: ProductCard[] = [
  {
    key: "biblio",
    title: { ar: "مخرجات ببليوجرافية", en: "Bibliographic Outputs" },
    body: {
      ar: "توفير بيانات حديثة ومتجددة ومستمرة عن الكتب الجديدة التي تصدر في العالم مترجمة إلى العربية",
      en: "Providing up-to-date, renewed, and continuous data on new books published worldwide and translated into Arabic",
    },
    audiences: {
      ar: "المكتبات الوطنية – الجامعات ومراكز البحوث – دور النشر – الباحثين – المترجمين",
      en: "National libraries — universities and research centers — publishers — researchers — translators",
    },
  },
  {
    key: "journal",
    title: { ar: "مخرجات صحفية", en: "Journalistic Outputs" },
    body: {
      ar: "تقديم خدمة خبرية يومية: أخبار الكتب",
      en: "Providing a daily news service: book news",
    },
    audiences: {
      ar: "الصحف – والمجلات – والمواقع الالكترونية – والقنوات التلفزيونية",
      en: "Newspapers — magazines — websites — television channels",
    },
  },
  {
    key: "research",
    title: { ar: "مخرجات بحثية", en: "Research Outputs" },
    body: {
      ar: "إعداد تقارير خاصة ونوعية.. مجمعة وتحليلية عن الكتب الجديدة. تصدر أسبوعيًا وشهريًا",
      en: "Preparing special, curated, consolidated and analytical reports on new books. Published weekly and monthly",
    },
    audiences: {
      ar: "مراكز البحوث والدراسات – والمجلات الفصلية والمتخصصة",
      en: "Research and study centers — quarterly and specialized journals",
    },
  },
  {
    key: "av",
    title: { ar: "مخرجات صوتية ومرئية", en: "Audio & Video Outputs" },
    body: {
      ar: "انتاج بودكاست - وفيديوهات",
      en: "Producing podcasts and videos",
    },
    audiences: {
      ar: "القنوات التلفزيونية – والمحطات الاذاعية – اطلاق قنوات خاصة على اليوتيوب والتلجرام والتيك توك",
      en: "Television channels — radio stations — launching dedicated channels on YouTube, Telegram, and TikTok",
    },
  },
  {
    key: "social",
    title: { ar: "مخرجات السوشيال ميديا", en: "Social Media Outputs" },
    body: {
      ar: "اطلاق صفحات مخصصة لأخبار وعروض الكتب الاجنبية الجديدة",
      en: "Launching dedicated pages for news and showcases of new foreign books",
    },
    audiences: {
      ar: "الجمهور العربي على السوشيال ميديا",
      en: "The Arab audience on social media",
    },
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
    ar: "من أهم المخرجات الأساسية لـ”منصة الكتب العالمية” توفير بيانات ببليوغرافية حديثة وكاملة عن الكتب الجديدة والمهمة التي تصدر في العالم مترجمة إلى اللغة العربية، وفي هذا الخصوص يقوم المشروع بتقديم خدمة توفير هذه البيانات الببليوغرافية المتجددة “يوميًّا”.. إلى المكتبات الوطنية ومراكز البحوث والدراسات ودور النشر العربية الكبرى المعنية بحركة الترجمة، ويتم انتقاء نوعية الكتب من بين أحدث الإصدارات التي تُنشر في جميع أنحاء العالم وبكل اللغات؛ طبقاً لمعايير محددة تراعي مجالات الجهة التي تطلب الاستفادة من الخدمة وخصوصياتها.",
    en: "One of the most important basic outputs of the “Global Books Platform” is providing up-to-date and complete bibliographic data on new and important books published worldwide translated into Arabic. In this regard, the project provides a service to provide this updated bibliographic data “daily” to national libraries, research and studies centers, and major Arab publishing houses concerned with the translation movement. The quality of books is selected from among the latest publications published worldwide and in all languages, according to specific criteria that take into account the fields and specificities of the entity requesting to benefit from the service.",
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
        spanFullWidth: block.spanFullWidth,
      })),
    },
    bibliography: {
      title: isAr ? "ببليوغرافيا المنصة" : "Platform Bibliography",
      body: pickLocale(bibliographyBody, locale),
    },
    products: {
      title: isAr ? "مخرجات ومنتجات المنصة" : "Platform Outputs & Products",
      audiencesLabel: isAr ? "الجهات المستهدفة:" : "Target audiences:",
      cards: productCards.map((card) => ({
        key: card.key,
        title: pickLocale(card.title, locale),
        body: pickLocale(card.body, locale),
        audiences: pickLocale(card.audiences, locale),
      })),
    },
    closing: pickLocale(closing, locale),
  };
}
