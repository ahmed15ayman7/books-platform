import type { Locale } from "@/lib/i18n";
import { pickLocale, pickLocaleList, type BilingualString } from "./types";
import { ABOUT_IMAGES, ABOUT_HERO_COVER_URLS } from "./image-assets";

export interface AboutImage {
  src: string;
  alt: BilingualString;
}

export interface AboutValue {
  key: string;
  title: BilingualString;
  body: BilingualString;
  image?: AboutImage;
}

export interface AboutContent {
  hero: { title: string; subtitle: string; images: AboutImage[] };
  intro: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    image: AboutImage;
    imagePosition: "left" | "right";
  };
  concept: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    image: AboutImage;
    imagePosition: "left" | "right";
  };
  storyGallery: Array<AboutImage & { caption: BilingualString }>;
  values: { eyebrow: string; title: string; items: AboutValue[] };
  unique: { eyebrow: string; title: string; items: string[] };
  efforts: { eyebrow: string; title: string; items: string[] };
  mediaSection: { eyebrow: string; title: string; lead: string };
  teamPreview: { eyebrow: string; title: string; memberSlugs: string[] };
  partnersSection: { eyebrow: string; title: string };
  closing: { quote: string; tagline: string };
  cta: { primary: string; secondary: string };
}

const storyGallery: Array<AboutImage & { caption: BilingualString }> = [
  {
    src: ABOUT_IMAGES.gallery1,
    alt: { ar: "كتب على رف", en: "Books on shelf" },
    caption: { ar: "اكتشاف الإصدارات", en: "Discovering releases" },
  },
  {
    src: ABOUT_IMAGES.gallery2,
    alt: { ar: "قارئ", en: "Reader" },
    caption: { ar: "القراءة والوعي", en: "Reading & awareness" },
  },
  {
    src: ABOUT_IMAGES.gallery3,
    alt: { ar: "كتابة وبحث", en: "Writing & research" },
    caption: { ar: "المحتوى البحثي", en: "Research content" },
  },
  {
    src: ABOUT_IMAGES.gallery4,
    alt: { ar: "بودكast", en: "Podcast" },
    caption: { ar: "صوت ومرئي", en: "Audio & video" },
  },
  {
    src: ABOUT_IMAGES.gallery5,
    alt: { ar: "فريق عمل", en: "Team collaboration" },
    caption: { ar: "شراكات", en: "Partnerships" },
  },
  {
    src: ABOUT_IMAGES.gallery6,
    alt: { ar: "عالم المعرفة", en: "World of knowledge" },
    caption: { ar: "نافذة على العالم", en: "Window to the world" },
  },
];

const heroImages: AboutImage[] = [
  {
    src: ABOUT_HERO_COVER_URLS[0],
    alt: { ar: "مكتبة وكتب", en: "Library and books" },
  },
  {
    src: ABOUT_HERO_COVER_URLS[1],
    alt: { ar: "كتب مكدّسة", en: "Stacked books" },
  },
  {
    src: ABOUT_HERO_COVER_URLS[2],
    alt: { ar: "صفحات قاموس ومعرفة", en: "Dictionary pages and knowledge" },
  },
  {
    src: ABOUT_HERO_COVER_URLS[3],
    alt: { ar: "صفحات مفتوحة من كتاب", en: "Open book pages" },
  },
  {
    src: ABOUT_HERO_COVER_URLS[4],
    alt: { ar: "رفوف مكتبة", en: "Library shelves" },
  },
  {
    src: ABOUT_HERO_COVER_URLS[5],
    alt: { ar: "ميكروفون وبودكast", en: "Podcast microphone" },
  },
  {
    src: ABOUT_HERO_COVER_URLS[6],
    alt: { ar: "مجموعة كتب", en: "Book collection" },
  },
  {
    src: ABOUT_HERO_COVER_URLS[7],
    alt: { ar: "كتابة ومعرفة", en: "Writing and knowledge" },
  },
];

const hero: { title: BilingualString; subtitle: BilingualString } = {
  title: { ar: "من نحن", en: "About Us" },
  subtitle: {
    ar: "منصة الكتب | نافذة معرفية على ثقافات العالم",
    en: "Books Platform | A Knowledge Window to World Cultures",
  },
};

const introParagraphs: BilingualString[] = [
  {
    ar: "انطلقت «منصة الكتب» كمبادرة ثقافية عربية طموحة، تسعى إلى ردم الفجوة المعرفية ومواكبة الحراك العلمي العالمي. تهدف المنصة إلى إحياء ثقافة القراءة في المجتمع العربي، وتنشيط حركة الترجمة، وتعزيز الوعي المعرفي لدى الجمهور.",
    en: "Books Platform launched as an ambitious Arab cultural initiative seeking to bridge the knowledge gap and keep pace with global scientific momentum. The platform aims to revive reading culture in Arab society, energize the translation movement, and strengthen intellectual awareness among audiences.",
  },
  {
    ar: "باعتبارها مشروعاً مؤسسياً متكاملاً، تمتلك «منصة الكتب» المقومات الاستراتيجية لتكون ركيزة أساسية في المشهد الثقافي العربي. وتأكيداً على نهجها الانفتاحي، ترحب المنصة بكافة أشكال الشراكات الاستراتيجية والدعم—سواء على الصعيد المالي، التقني، الإعلامي، أو التسويقي—لتحقيق أهدافها في إحداث أثر ثقافي ملموس.",
    en: "As an integrated institutional project, Books Platform possesses the strategic foundations to become a cornerstone of the Arab cultural landscape. Affirming its open approach, the platform welcomes all forms of strategic partnerships and support—whether financial, technical, media, or marketing—to achieve its goal of creating tangible cultural impact.",
  },
];

const conceptParagraphs: BilingualString[] = [
  {
    ar: "تتبلور فكرة «منصة الكتب» في تقديم نافذة رقمية متطورة (عبر موقع إلكتروني وتطبيق ذكي) تعمل كجسر معرفي بين القارئ العربي وأحدث الإصدارات العالمية. وتتمحور آلية عملها حول:",
    en: "The concept of Books Platform crystallizes in offering an advanced digital window (through a website and a smart app) that serves as a knowledge bridge between the Arab reader and the latest global publications. Its operating mechanism focuses on:",
  },
  {
    ar: "• رصد الاتجاهات العالمية: متابعة دقيقة لأحدث الإصدارات الدولية في شتى حقول المعرفة، من علوم وفنون وآداب.",
    en: "• Global trend monitoring: precise tracking of the latest international releases across fields of knowledge, from sciences and arts to literature.",
  },
  {
    ar: "• الانتقاء النوعي: التركيز على الكتب النوعية الحديثة التي لم تُترجم بعد إلى اللغة العربية.",
    en: "• Selective curation: focusing on notable recent books that have not yet been translated into Arabic.",
  },
  {
    ar: "• التوثيق المنهجي: توفير بيانات ببليوغرافية شاملة ودقيقة لكل إصدار لضمان وصول القارئ إلى المعلومة الموثقة.",
    en: "• Systematic documentation: providing comprehensive, accurate bibliographic data for each title to ensure readers access verified information.",
  },
  {
    ar: "يهدف هذا المحتوى إلى تزويد القارئ العربي بأدوات معرفية متجددة، وتعريفه بالإنتاج الفكري العالمي، بما يعزز من حضوره في السياق الثقافي والحضاري المعاصر.",
    en: "This content aims to equip the Arab reader with renewed knowledge tools, introduce them to global intellectual output, and strengthen their presence in the contemporary cultural and civilizational context.",
  },
];

const values: AboutValue[] = [
  {
    key: "vision",
    title: { ar: "الرؤية", en: "Vision" },
    body: {
      ar: "ربط العالم العربي بالمجتمعات العالمية عبر جسر ثقافي يعزّز التفاهم بين الحضارات، ويدعم الإبداع، ويجعل المعرفة العالمية متاحة من خلال الترجمة والحلول الرقمية المبتكرة.",
      en: "To connect the Arab world with global societies by building a cultural bridge that enhances understanding between civilizations, promotes creativity, and makes global knowledge accessible through translation and innovative digital solutions.",
    },
    image: {
      src: ABOUT_IMAGES.vision,
      alt: { ar: "رؤية المنصة", en: "Platform vision" },
    },
  },
  {
    key: "mission",
    title: { ar: "الرسالة", en: "Mission" },
    body: {
      ar: "دعم القارئ العربي بتقديم محتوى ثقافي وعلمي قيّم يثري الفكر، ويُحيي عادات القراءة، ويرفع مستوى الوعي، ويساهم في بناء بيئة عربية متقدمة تقنيًا ومعرفيًا.",
      en: "To support the Arab reader by delivering valuable cultural and scientific content that enriches thought, revives reading habits, raises awareness, and fosters a technologically advanced and knowledge-driven Arab environment.",
    },
    image: {
      src: ABOUT_IMAGES.mission,
      alt: { ar: "رسالة المنصة", en: "Platform mission" },
    },
  },
  {
    key: "objectives",
    title: { ar: "الأهداف", en: "Objectives" },
    body: {
      ar: "نسعى لأن تكون منصة الكتب المنصة العربية الرائدة في التثقيف الثقافي وإحدى المراكز العالمية البارزة في نشر المعرفة والثقافة والوعي والاستنارة الفكرية.",
      en: "We seek to make Books Platform the leading Arab platform for cultural education and one of the world's prominent centers for disseminating knowledge, culture, awareness, and intellectual enlightenment.",
    },
    image: {
      src: ABOUT_IMAGES.objectives,
      alt: { ar: "أهداف المنصة", en: "Platform objectives" },
    },
  },
  {
    key: "policies",
    title: { ar: "السياسات", en: "Policies" },
    body: {
      ar: "نلتزم بتقديم جميع خدماتنا وأنشطتنا بأسلوب مهني وأخلاقي، مع الالتزام بالمعايير العلمية والقانونية والأخلاقية التي تحفظ حقوق الملكية الفكرية لجميع الأطراف.",
      en: "We are committed to delivering all our services and activities in a professional and ethical manner, adhering to scientific, legal, and moral standards that safeguard intellectual property rights for all parties.",
    },
    image: {
      src: ABOUT_IMAGES.policies,
      alt: { ar: "سياسات المنصة", en: "Platform policies" },
    },
  },
];

const uniqueItems: BilingualString[] = [
  {
    ar: "نافذة رقمية تخاطب أكثر من 400 مليون عربي، تطمح إلى خلق مناخ ثقافي منفتح على العالم، مع فرص واعدة لتفعيل جهود الترجمة وتحريك سوق الكتاب العربي.",
    en: "A digital window addressing more than 400 million Arabs, aspiring to create an open cultural climate connected to the world, while offering new and promising opportunities to activate translation efforts and stimulate the Arab book market.",
  },
  {
    ar: "منصة ثقافية وإعلامية جديدة — الأولى من نوعها في العالم العربي — تخدم جمهورًا واسعًا من القراء والمثقفين والباحثين المهتمين بمتابعة الكتب العالمية حديثة النشر غير المترجمة إلى العربية.",
    en: "A new cultural and media platform — the first of its kind in the Arab world — serving a wide audience of readers, intellectuals, and researchers interested in staying informed about newly published global books that have not yet been translated into Arabic.",
  },
  {
    ar: "تقديم خدمات ثقافية وإعلامية مبتكرة عبر نشرات يومية عن الكتب الجديدة، وإنتاج فيديوهات وبودكasts تسلّط الضوء على أهم الإصدارات، والتفاعل عبر تطبيق المنصة وقنوات التواصل.",
    en: "Providing innovative cultural and media services through daily news bulletins on new books, as well as producing videos and podcasts highlighting the most important releases, and engaging audiences via the platform's mobile application and social media channels.",
  },
  {
    ar: "وسيلة عملية لتسهيل التنسيق والتواصل المباشر مع الكتّاب والمؤلفين والباحثين والمؤسسات الفكرية ودور النشر العربية والدولية.",
    en: "A practical means to facilitate coordination and direct communication with writers, authors, researchers, intellectual institutions, and Arab and international publishers.",
  },
];

const effortItems: BilingualString[] = [
  {
    ar: "التعريف بالمؤسسات الثقافية والنشر العربية والدولية والشخصيات العامة المؤثرة بمشروع منصة الكتب وأهدافه وأدواره ومراحل تطوره، بهدف إبرام اتفاقيات شراكة ورعاية وتأمين التمويل المناسب.",
    en: "Introducing Arab and international cultural and publishing institutions, as well as influential public figures, to the Books Platform project, its objectives, roles, and development phases, with the aim of establishing partnership and sponsorship agreements and securing appropriate funding.",
  },
  {
    ar: "السعي لاتفاقيات مع المكتبات الوطنية العربية لتوفير بيانات ببليوغرافية محدّثة وشاملة يوميًا عن كل كتاب جديد مهم يُنشر في العالم وبجميع اللغات.",
    en: "Moving toward agreements with Arab national libraries to provide updated, comprehensive, and daily bibliographic data for every significant new book published worldwide and in all languages.",
  },
  {
    ar: "التنسيق مع المؤسسات الإعلامية الرائدة لعرض خدماتنا الإعلامية الجديدة، بما في ذلك الأخبار اليومية والتقارير المتخصصة تحت عنوان «العالم العربي يقرأ».",
    en: "Coordinating with leading media institutions to present our new media services, including daily news and specialized reports published under the title \"The Arab World Reads\".",
  },
  {
    ar: "التعاون مع القنوات التلفزيونية المهتمة بالإعلام الثقافي لإنتاج محتوى فيديو قصير بعنوان «الكتب تتحدث»، بأساليب إبداعية تجذب المشاهدين إلى القراءة.",
    en: "Collaborating with television channels interested in cultural media to produce short video content titled \"Books Speak\", using innovative creative approaches aimed at attracting viewers to reading.",
  },
  {
    ar: "ترشيح المشروع للجوائز الثقافية الإقليمية والدولية، بوصفه مبادرة عربية رائدة تمكّن القارئ العربي من اكتشاف كل كتاب مهم يُنشر في العالم.",
    en: "Nominating the project for regional and international cultural awards, as it represents a pioneering Arab initiative that enables the Arab reader to discover every important book published worldwide.",
  },
];

const closing = {
  quote: {
    ar: " أن يعرف القارئ العربي بكل كتاب جديد يُنشر في العالم»",
    en: "\"To introduce the Arab reader to every new book published around the world.\"",
  },
  tagline: {
    ar: "«منصة الكتب العالمية — نافذة معرفية على ثقافات العالم»",
    en: "\"The global books platform is a knowledge window on the cultures of the world.\"",
  },
};

export function getAboutContent(locale: Locale): AboutContent {
  const isAr = locale === "ar";
  return {
    hero: {
      title: pickLocale(hero.title, locale),
      subtitle: pickLocale(hero.subtitle, locale),
      images: heroImages.map((img) => ({
        src: img.src,
        alt: img.alt,
      })),
    },
    intro: {
      eyebrow: isAr ? "مقدمة" : "Introduction",
      title: isAr ? "مقدمة" : "Introduction",
      paragraphs: pickLocaleList(introParagraphs, locale),
      image: {
        src: ABOUT_IMAGES.intro,
        alt: { ar: "قارئ مع كتاب", en: "Reader with a book" },
      },
      imagePosition: "right",
    },
    concept: {
      eyebrow: isAr ? "المفهوم" : "Concept",
      title: isAr ? "فكرة المنصة وآلية العمل" : "Platform Concept & How It Works",
      paragraphs: pickLocaleList(conceptParagraphs, locale),
      image: {
        src: ABOUT_IMAGES.concept,
        alt: { ar: "رفوف كتب", en: "Bookshelves" },
      },
      imagePosition: "left",
    },
    storyGallery: storyGallery.map((g) => ({
      src: g.src,
      alt: g.alt,
      caption: g.caption,
    })),
    values: {
      eyebrow: isAr ? "قيمنا" : "Our Values",
      title: isAr ? "رؤيتنا ورسالتنا" : "Vision & Mission",
      items: values,
    },
    unique: {
      eyebrow: isAr ? "تميّز" : "Uniqueness",
      title: isAr ? "ما يميز المنصة" : "What Makes the Platform Unique",
      items: pickLocaleList(uniqueItems, locale),
    },
    efforts: {
      eyebrow: isAr ? "جهود" : "Efforts",
      title: isAr ? "جهودنا الحالية في الترويج للمبادرة" : "Current Efforts in Promoting Our Initiative",
      items: pickLocaleList(effortItems, locale),
    },
    mediaSection: {
      eyebrow: isAr ? "ميديا" : "Media",
      title: isAr ? "محتوى مرئي وصوتي" : "Video & Audio Content",
      lead: isAr
        ? "فيديوهات وبودكasts تسلّط الضوء على أهم الإصدارات العالمية."
        : "Videos and podcasts highlighting the most important global releases.",
    },
    teamPreview: {
      eyebrow: isAr ? "فريقنا" : "Our Team",
      title: isAr ? "من يقف وراء المنصة" : "Who Stands Behind the Platform",
      memberSlugs: [
        "atef-mazhar",
        "mariam-mazhar",
        "sara-mazhar",
        "mohamed-abou-elwafa",
        "hany-mawafy",
      ],
    },
    partnersSection: {
      eyebrow: isAr ? "شركاؤنا" : "Partners",
      title: isAr ? "ناشرون وشركاء استراتيجيون" : "Publishers & Strategic Partners",
    },
    closing: {
      quote: pickLocale(closing.quote, locale),
      tagline: pickLocale(closing.tagline, locale),
    },
    cta: {
      primary: isAr ? "تصفّح الكتب" : "Browse Books",
      secondary: isAr ? "انشر كتابك" : "Publish Your Book",
    },
  };
}

export function getLocalizedValue(item: AboutValue, locale: Locale) {
  return {
    key: item.key,
    title: pickLocale(item.title, locale),
    body: pickLocale(item.body, locale),
    imageUrl: item.image ? item.image.src : undefined,
    imageAlt: item.image ? pickLocale(item.image.alt, locale) : undefined,
  };
}
