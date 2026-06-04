import type { Locale } from "@/lib/i18n";
import { pickLocale, pickLocaleList, type BilingualString } from "./types";

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
  hero: { title: string; subtitle: string; image: AboutImage };
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
  closing: { quote: string; tagline: string };
  cta: { primary: string; secondary: string };
}

const UNSPLASH = {
  hero: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80",
  intro: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80",
  concept: "https://images.unsplash.com/photo-1524995997478-a55c2633f573?w=800&q=80",
  vision: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80",
  mission: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&q=80",
  objectives: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&q=80",
  policies: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80",
} as const;

const storyGallery: Array<AboutImage & { caption: BilingualString }> = [
  {
    src: "https://images.unsplash.com/photo-1497633763765-c8a3bd345e2f?w=600&q=80",
    alt: { ar: "كتب على رف", en: "Books on shelf" },
    caption: { ar: "اكتشاف الإصدارات", en: "Discovering releases" },
  },
  {
    src: "https://images.unsplash.com/photo-1516979187450-637abb88f58e?w=600&q=80",
    alt: { ar: "قارئ", en: "Reader" },
    caption: { ar: "القراءة والوعي", en: "Reading & awareness" },
  },
  {
    src: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80",
    alt: { ar: "كتابة وبحث", en: "Writing & research" },
    caption: { ar: "المحتوى البحثي", en: "Research content" },
  },
  {
    src: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=600&q=80",
    alt: { ar: "بودكast", en: "Podcast" },
    caption: { ar: "صوت ومرئي", en: "Audio & video" },
  },
  {
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
    alt: { ar: "فريق عمل", en: "Team collaboration" },
    caption: { ar: "شراكات", en: "Partnerships" },
  },
  {
    src: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=600&q=80",
    alt: { ar: "عالم المعرفة", en: "World of knowledge" },
    caption: { ar: "نافذة على العالم", en: "Window to the world" },
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
    ar: "برزت فكرة منصة الكتب كمبادرة ثقافية عربية ومشروع استنارة رائد يهدف إلى مواكبة التقدم العالمي في العلم والمعرفة، وتشجيع حركة الترجمة وإحياء عادات القراءة ومفهوم الثقافة لدى الجمهور العربي.",
    en: "The idea of Books Platform emerged as an Arab cultural initiative and an enlightening, pioneering project aimed at keeping pace with global progress in science and knowledge. It seeks to encourage the translation movement and revive reading habits and the concept of culture among Arab audiences.",
  },
  {
    ar: "مبادرة منصة الكتب جهود طموحة تتطلب جهدًا كبيرًا وشراكات متنوعة، وهي في موقع قوي لأن تصبح من أكثر الكيانات الثقافية تأثيرًا في العالم العربي. وبصفتها مشروعًا مؤسسيًا، فهي منفتحة على كل أشكال الشراكة والدعم — ماليًا وتقنيًا وإعلاميًا وتسويقيًا.",
    en: "The Books Platform initiative is an ambitious endeavor that requires extensive efforts and diverse partnerships. It is strongly positioned to become one of the most influential cultural entities in the Arab world. As an institutional project, it remains open to all forms of partnership and support — financial, technical, media-related, and marketing-oriented.",
  },
];

const conceptParagraphs: BilingualString[] = [
  {
    ar: "تقوم فكرة منصة الكتب على إطلاق موقع إلكتروني وتطبيق للهاتف المحمول يقدّمان كتبًا أجنبية حديثة النشر لم تُترجم بعد إلى العربية، عبر رصد الاتجاهات العالمية في النشر ومتابعة إصدارات دور النشر الدولية في العلوم والفنون والأدب ومجالات المعرفة، وتوفير بيانات ببليوغرافية كاملة عن كل كتاب.",
    en: "The concept of Books Platform is based on launching a website and a mobile application that introduce newly published foreign books which have not yet been translated into Arabic. This is achieved by monitoring global publishing trends, tracking releases from international publishing houses across sciences, arts, literature, and knowledge fields, and providing complete bibliographic data for each book.",
  },
  {
    ar: "يُقدَّم كل هذا المحتوى للقارئ العربي لتشجيع القراءة والتعريف بإنتاج العالم العلمي والثقافي.",
    en: "All of this content is delivered to the Arab reader to encourage reading and to introduce them to global scientific and cultural production.",
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
      src: UNSPLASH.vision,
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
      src: UNSPLASH.mission,
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
      src: UNSPLASH.objectives,
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
      src: UNSPLASH.policies,
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
    ar: "«غايتنا أن نُعرّف القارئ العربي بكل كتاب جديد يُنشر في العالم»",
    en: "\"Our purpose is to introduce the Arab reader to every new book published around the world.\"",
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
      image: {
        src: UNSPLASH.hero,
        alt: { ar: "مكتبة وكتب — رمز المعرفة", en: "Library and books — symbol of knowledge" },
      },
    },
    intro: {
      eyebrow: isAr ? "مقدمة" : "Introduction",
      title: isAr ? "البداية" : "Introduction",
      paragraphs: pickLocaleList(introParagraphs, locale),
      image: {
        src: UNSPLASH.intro,
        alt: { ar: "قارئ مع كتاب", en: "Reader with a book" },
      },
      imagePosition: "right",
    },
    concept: {
      eyebrow: isAr ? "المفهوم" : "Concept",
      title: isAr ? "فكرة المنصة" : "The Platform Concept",
      paragraphs: pickLocaleList(conceptParagraphs, locale),
      image: {
        src: UNSPLASH.concept,
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
      memberSlugs: ["atef-mazhar", "mariam-mazhar", "sara-mazhar"],
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
