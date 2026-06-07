import type { Locale } from "@/lib/i18n";
import { pickLocale, type BilingualString } from "./types";

export interface TeamMemberData {
  slug: string;
  name: BilingualString;
  role: BilingualString;
  bio: BilingualString;
  photoUrl: string | null;
  initials?: string;
  featured?: boolean;
}

export interface TeamPageContent {
  hero: { title: string; subtitle: string };
  intro: string;
  members: TeamMemberData[];
  quote: string;
  cta: string;
  departments: {
    eyebrow: string;
    title: string;
    items: { key: string; title: string; body: string }[];
  };
  leadershipSection: { title: string };
  teamSection: { title: string };
}

export const TEAM_MEMBERS: TeamMemberData[] = [
  {
    slug: "atef-mazhar",
    name: { ar: "عاطف مظهر", en: "Atef Mazhar" },
    role: { ar: "المدير العام", en: "General Manager" },
    bio: {
      ar: "المؤسس والرؤية الاستراتيجية — الإدارة العليا والإشراف العام.",
      en: "Founder and Strategic Visionary — senior management and general supervision.",
    },
    photoUrl: "/team/atef-mazhar.webp",
    featured: true,
  },
  {
    slug: "mariam-mazhar",
    name: { ar: "مريم مظهر", en: "Mariam Mazhar" },
    role: { ar: "الرئيس التنفيذي", en: "CEO" },
    bio: {
      ar: "مسؤولة عن استراتيجية التسويق وتعزيز الحضور الرقمي وبناء تفاعل مجتمع القراءة والنشر.",
      en: "Responsible for shaping the platform's marketing strategy, strengthening its digital presence, and building meaningful engagement with the reading and publishing community.",
    },
    photoUrl: "/team/mariam-mazhar.webp",
    featured: true,
  },
  {
    slug: "sara-mazhar",
    name: { ar: "سارة مظهر", en: "Sara Mazhar" },
    role: { ar: "مديرة التكنولوجيا", en: "Chief Technology Officer" },
    bio: {
      ar: "تشرف على البنية التقنية والتطوير الرقمي للمنصة، وتضمن تجربة مستخدم آمنة وسلسة.",
      en: "Oversees the technical infrastructure and digital development of the platform, ensuring a secure, efficient, and seamless user experience.",
    },
    photoUrl: "/team/sara-mazhar.webp",
    featured: true,
  },
  {
    slug: "mohamed-abou-elwafa",
    name: { ar: "محمد أبو الوفا", en: "Mohamed Abou Elwafa" },
    role: { ar: "رئيس التحرير (إنجليزي)", en: "Editor-in-Chief (English)" },
    bio: {
      ar: "يشرف على المحتوى التحريري ويراجع الأعمال الأدبية والفكرية ويضمن الجودة وفق معايير المنصة.",
      en: "Supervises editorial content, reviews literary and intellectual works, and ensures quality and consistency in line with the platform's standards.",
    },
    photoUrl: "/team/mohamed-abou-elwafa.webp",
  },
  {
    slug: "hany-mawafy",
    name: { ar: "هاني موافي", en: "Hany Mawafy" },
    role: { ar: "رئيس التحرير (عربي)", en: "Editor-in-Chief (Arabic)" },
    bio: {
      ar: "يدير المحتوى الثقافي والفكري وينسّق مع المؤلفين والكتّاب والباحثين.",
      en: "Manages cultural and intellectual content and coordinates with authors, writers, and researchers.",
    },
    photoUrl: "/team/hany-mawafy.webp",
  },
  {
    slug: "zakaria-elshal",
    name: { ar: "زكريا الشال", en: "Zakaria Elshal" },
    role: { ar: "مدير التسويق", en: "Marketing Director" },
    bio: {
      ar: "يقود رؤية المنصة ويشرف على النمو الاستراتيجي لضمان تحقيق رسالتها الثقافية والمعرفية.",
      en: "Leads the platform's vision and oversees strategic growth and development to ensure the achievement of its cultural and knowledge-driven mission.",
    },
    photoUrl: "/team/zakaria-elshal.webp",
  },
  {
    slug: "abdelrahman-saeed",
    name: { ar: "عبدالرحمن سعيد", en: "Abdelrahman Saeed" },
    role: { ar: "رئيس وحدة التحرير والذكاء الاصطناعي", en: "Head of Editing & AI Unit" },
    bio: {
      ar: "يشرف على إنتاج المحتوى المرئي والحلول المدعومة بالذكاء الاصطناعي لتعزيز التجربة الرقمية.",
      en: "Oversees visual content production and AI-driven solutions that enhance the platform's digital and multimedia experience.",
    },
    photoUrl: "/team/abdelrahman-saeed.webp",
  },
  {
    slug: "hatem-farag",
    name: { ar: "د. حاتم فراج", en: "Dr. Hatem Farag" },
    role: { ar: "مستشار علمي", en: "Scientific Advisor" },
    bio: {
      ar: "يقدّم الإشراف الأكاديمي والعلمي على الأوراق البحثية والمنشورات العلمية على المنصة.",
      en: "Provides academic and scientific supervision for research papers and scholarly publications on the platform.",
    },
    photoUrl: "/team/hatem-farag.webp",
  },
  {
    slug: "ahmed-elshal",
    name: { ar: "أحمد الشال", en: "Ahmed Elshal" },
    role: { ar: "رئيس التطوير وSEO", en: "Head of Development & SEO" },
    bio: {
      ar: "مسؤول عن التطوير التقني وتحسين محركات البحث لتعظيم ظهور المحتوى ووصوله.",
      en: "Responsible for technical development and search engine optimization to maximize content visibility and reach.",
    },
    photoUrl: "/team/ahmed-elshal.webp",
  },
  {
    slug: "ahmed-ayman",
    name: { ar: "أحمد أيمن", en: "Ahmed Ayman" },
    role: { ar: "مطور الموقع", en: "FullStack & AI Developer" },
    bio: {
      ar: "مطور الموقع والتطوير التقني والذكاء الاصطناعي.",
      en: "FullStack (Next.js, React, Tailwind CSS, TypeScript) and AI Developer.",
    },
    photoUrl: "/team/ahmed-ayman.jpeg",
    initials: "AA",
  },
  {
    slug: "youssef-emad",
    name: { ar: "يوسف عماد", en: "Youssef Emad" },
    role: { ar: "مطور الابلكيشن", en: "App Developer" },
    bio: {
      ar: "تطوير تطبيق المنصة للهاتف المحمول باستخدام ابلكيشن.",
      en: "Mobile application development for the platform using Flutter.",
    },
    photoUrl: "/team/youssef-emad.jpeg",
    initials: "YE",
  },
];

const hero = {
  title: { ar: "فريق المنصة", en: "Our Team" },
  subtitle: {
    ar: "نؤمن أن التعاون والخبرة أساس مشاركة المعرفة المؤثرة والمستدامة",
    en: "At Books Platform, we believe that collaboration and expertise are the foundation of impactful and sustainable knowledge sharing.",
  },
};

const intro: BilingualString = {
  ar: "يجمع فريق منصة الكتب مجموعة من المحترفين المتخصصين في النشر والتكنولوجيا والإعلام والتسويق. يعمل الفريق برؤية مشتركة لدعم المعرفة وتشجيع الإبداع وتقديم محتوى ثقافي وأكاديمي موثوق للقرّاء والكتّاب والباحثين حول العالم.",
  en: "The Books Platform team brings together a group of professionals specialized in publishing, technology, media, and marketing. United by a shared vision, the team works to support knowledge, encourage creativity, and deliver reliable cultural and academic content to readers, writers, and researchers worldwide.",
};

const quote: BilingualString = {
  ar: "«نؤمن أن التعاون والخبرة أساس مشاركة المعرفة المؤثرة والمستدامة»",
  en: "\"We believe that collaboration and expertise are the foundation of impactful and sustainable knowledge sharing.\"",
};

const departments: { key: string; title: BilingualString; body: BilingualString }[] = [
  {
    key: "editorial",
    title: { ar: "التحرير", en: "Editorial" },
    body: {
      ar: "فريق تحرير متخصص يراجع المحتوى الثقافي والأدبي ويضمن جودة الإصدارات.",
      en: "A specialized editorial team reviewing cultural and literary content and ensuring publication quality.",
    },
  },
  {
    key: "tech",
    title: { ar: "التكنولوجيا", en: "Technology" },
    body: {
      ar: "تطوير المنصة الرقمية وتطبيق الهاتف والحلول المدعومة بالذكاء الاصطناعي.",
      en: "Digital platform development, mobile app, and AI-powered solutions.",
    },
  },
  {
    key: "marketing",
    title: { ar: "التسويق", en: "Marketing" },
    body: {
      ar: "بناء الحضور الرقمي وتعزيز التفاعل مع مجتمع القرّاء والناشرين.",
      en: "Building digital presence and engaging the reading and publishing community.",
    },
  },
];

export function getTeamContent(locale: Locale): TeamPageContent {
  const isAr = locale === "ar";
  return {
    hero: {
      title: pickLocale(hero.title, locale),
      subtitle: pickLocale(hero.subtitle, locale),
    },
    intro: pickLocale(intro, locale),
    members: TEAM_MEMBERS,
    quote: pickLocale(quote, locale),
    cta: isAr ? "تواصل معنا" : "Get in Touch",
    departments: {
      eyebrow: isAr ? "أقسام" : "Departments",
      title: isAr ? "فرق العمل" : "Our Departments",
      items: departments.map((d) => ({
        key: d.key,
        title: pickLocale(d.title, locale),
        body: pickLocale(d.body, locale),
      })),
    },
    leadershipSection: {
      title: isAr ? "المؤسسين" : "Founders",
    },
    teamSection: {
      title: isAr ? "فريق العمل" : "The Team",
    },
  };
}

export function getTeamDisplayOrder(): TeamMemberData[] {
  return TEAM_MEMBERS;
}
