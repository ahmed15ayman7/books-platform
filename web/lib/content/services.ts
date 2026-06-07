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
    key: "specialized",
    title: { ar: "كتب متخصصة", en: "Specialized Books" },
    body: {
      ar: "مكتبة إلكترونية متخصصة في مجالات الفكر والسياسة والاجتماع.",
      en: "A specialized digital library in the fields of thought, politics, and society.",
    },
  },
  {
    key: "literary-studies",
    title: { ar: "أدب، دراسات نقدية", en: "Literature & Critical Studies" },
    body: {
      ar: "قسم متخصص يعنى بأهم المراجع والدراسات النقدية في مختلف المجالات الأدبية والفكرية ومن جميع اللغات.",
      en: "A specialized section covering the most important references and critical studies across literary and intellectual fields, in all languages.",
    },
  },
  {
    key: "publish-book",
    title: { ar: "انشر كتابك", en: "Publish Your Book" },
    body: {
      ar: "خدمة تتيح لكل من لديه فكرة أو عمل إبداعي رائد أن يتقدم بطلبه لنشر عمله، وسوف تخضع كافة الطلبات للتقييم من قبل لجان متخصصة، لضمان جودة المحتوى المقدم، بما يتناسب مع المعايير الفكرية والأدبية للمنصة، وبما يخدم رسالتها في نشر المعرفة والفكر.",
      en: "A service allowing anyone with a pioneering idea or creative work to apply to publish it. All submissions are evaluated by specialized committees to ensure content quality meets the platform's intellectual and literary standards and serves its mission of disseminating knowledge and thought.",
    },
  },
  {
    key: "authors",
    title: { ar: "مؤلفون", en: "Authors" },
    body: {
      ar: "نافذة تطل على سيرة أهم المؤلفين والمفكرين والمبدعين، وترصد أعمالهم الفكرية والأدبية، وما قيل عنهم في الصحافة العربية والعالمية في مختلف العصور.",
      en: "A window onto the lives of leading authors, thinkers, and creators; tracking their intellectual and literary works and what has been written about them in Arabic and international press across the ages.",
    },
  },
  {
    key: "books-sky",
    title: { ar: "سماء الكتب", en: "Books Sky" },
    body: {
      ar: "آفاق معرفية متخصصة ترصد أهم الإصدارات العربية والعالمية، وتتناول كل جديد في عالم النشر.",
      en: "Specialized knowledge horizons tracking the most important Arabic and international releases, covering everything new in the publishing world.",
    },
  },
  {
    key: "world-reads",
    title: { ar: "العالم يقرأ", en: "The World Reads" },
    body: {
      ar: "رصد يومي لأبرز ما تنشره الصحافة العالمية في مجالات الفكر والأدب.",
      en: "Daily monitoring of the most prominent coverage in international press on thought and literature.",
    },
  },
  {
    key: "learning-radar",
    title: { ar: "رصد التعلم", en: "Learning Radar" },
    body: {
      ar: "قسم يعنى برصد كل ما هو جديد في مجالات التعليم والتدريب، وتنمية القدرات والمهارات الشخصية والمهنية.",
      en: "A section dedicated to monitoring everything new in education and training, and personal and professional skills development.",
    },
  },
  {
    key: "reading-scenes",
    title: { ar: "مشاهد القراءة", en: "Reading Scenes" },
    body: {
      ar: "جولة بصرية بين أهم الأماكن والمؤسسات الثقافية، والمكتبات العامة والخاصة، التي تعنى بنشر الثقافة والمعرفة حول العالم.",
      en: "A visual tour of leading cultural venues and institutions, public and private libraries devoted to spreading culture and knowledge worldwide.",
    },
  },
  {
    key: "book-life",
    title: { ar: "حياة كتاب", en: "A Book's Life" },
    body: {
      ar: "مقالات متخصصة تتناول السيرة الذاتية لبعض الكتب، وتاريخ صدورها، وأبرز ما قيل عنها.",
      en: "Specialized articles exploring the biographies of selected books, their publication history, and the most notable commentary about them.",
    },
  },
  {
    key: "novel-story",
    title: { ar: "رواية في حكاية", en: "Novel in a Story" },
    body: {
      ar: "فيديوهات قصيرة تتناول ملخصات لأهم الكتب العربية والعالمية، بأسلوب مشوق يعتمد بالأساس على الصورة، وبما يواكب ما يتم تداوله عبر منصات التواصل الاجتماعي والمنصات الرقمية.",
      en: "Short videos presenting summaries of important Arabic and international books in an engaging, image-led style aligned with trends on social media and digital platforms.",
    },
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
    ar: "من أهم المخرجات التي سعت المنصة لتقديمها هي الببليوغرافيا، حيث توفر المنصة قاعدة بيانات ببليوغرافية متكاملة عن الكتب المترجمة من اللغة العربية وإلى عدد من اللغات العالمية، وهي في هذا السياق تهدف لتسهيل عملية الوصول للمعلومات الببليوغرافية، كما تهدف أيضاً إلى تسليط الضوء على حركة الترجمة من العربية وإليها، وتوفير أداة بحثية هامة للباحثين والمترجمين والناشرين، وتتضمن الببليوغرافيا بيانات تفصيلية عن الكتب المترجمة، بما في ذلك بيانات المؤلفين والمترجمين والناشرين، وتاريخ النشر، واللغة الأصلية، واللغة المترجم إليها، وغيرها من البيانات الهامة.",
    en: "Among the most important outputs the platform has sought to provide is the bibliography. The platform offers an integrated bibliographic database of books translated from Arabic into a number of world languages. In this context, it aims to facilitate access to bibliographic information, shed light on the translation movement to and from Arabic, and provide an important research tool for researchers, translators, and publishers. The bibliography includes detailed data on translated books, including authors, translators, publishers, publication date, original language, target language, and other important data.",
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
