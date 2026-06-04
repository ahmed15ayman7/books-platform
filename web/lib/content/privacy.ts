import type { Locale } from "@/lib/i18n";
import { pickLocale, type BilingualString } from "./types";

export interface PrivacySection {
  id: string;
  title: string;
  paragraphs: string[];
}

interface PrivacySectionSource {
  id: string;
  title: BilingualString;
  paragraphs: BilingualString[];
}

const lastUpdated: BilingualString = {
  ar: "يونيو 2026",
  en: "June 2026",
};

const sections: PrivacySectionSource[] = [
  {
    id: "intro",
    title: { ar: "مقدمة", en: "Introduction" },
    paragraphs: [
      {
        ar: "نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضّح هذه السياسة أنواع المعلومات التي تجمعها منصة الكتب العالمية وكيفية استخدامها وحمايتها عند استخدامك للموقع أو التطبيق.",
        en: "We respect your privacy and are committed to protecting your personal data. This privacy policy explains the types of personal information that Books Platform collects and receives and how it is used.",
      },
      {
        ar: "باستخدامك للمنصة، فإنك توافق على الممارسات الموضّحة في هذه السياسة. إذا كنت بحاجة إلى مزيد من المعلومات، يرجى التواصل معنا.",
        en: "By using the platform, you agree to the practices described in this policy. If you need any more information or have any questions about the Privacy Policy, please feel free to contact us.",
      },
    ],
  },
  {
    id: "contact",
    title: { ar: "التواصل معنا", en: "Contact Us" },
    paragraphs: [
      {
        ar: "للاستفسارات المتعلقة بالخصوصية أو بياناتك الشخصية، يمكنك التواصل معنا عبر صفحة «اتصل بنا» على الموقع.",
        en: "For privacy-related inquiries or questions about your personal data, please contact us through the Contact page on our website.",
      },
    ],
  },
  {
    id: "data-collected",
    title: { ar: "البيانات التي نجمعها", en: "Information We Collect" },
    paragraphs: [
      {
        ar: "قد نجمع: الاسم، البريد الإلكتروني، بيانات التواصل عند إرسال نموذج، وسجلات الاستخدام التقنية (عنوان IP، نوع المتصفح، صفحات الزيارة) لتحسين الخدمة.",
        en: "We may collect your name, email address, contact details when you submit a form, and technical usage logs (IP address, browser type, pages visited) to improve the service.",
      },
      {
        ar: "لا نبيع بياناتك الشخصية لأطراف ثالثة لأغراض تسويقية.",
        en: "We do not sell your personal data to third parties for marketing purposes.",
      },
    ],
  },
  {
    id: "log-files",
    title: { ar: "ملفات السجل", en: "Log Files" },
    paragraphs: [
      {
        ar: "مثل العديد من المواقع، تستخدم منصة الكتب ملفات السجل. تتضمن المعلومات داخل ملفات السجل عناوين بروتوكول الإنترنت (IP)، نوع المتصفح، مزود خدمة الإنترنت، الطابع الزمني للتاريخ/الوقت، صفحات الإحالة/الخروج، وعدد النقرات لتحليل الاتجاهات وإدارة حركة الموقع.",
        en: "Like many other websites, Books Platform makes use of log files. The information inside log files includes Internet Protocol (IP) addresses, browser type, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and the number of clicks to analyze trends, manage site traffic, and gather demographic information.",
      },
      {
        ar: "عناوين IP والمعلومات المماثلة غير مرتبطة بأي معلومات شخصية يمكن التعرف عليها.",
        en: "IP addresses and other such information are not linked to any information that is personally identifiable.",
      },
    ],
  },
  {
    id: "cookies",
    title: { ar: "ملفات تعريف الارتباط", en: "Cookies and Web Beacons" },
    paragraphs: [
      {
        ar: "نستخدم ملفات تعريف الارتباط (Cookies) لتذكّر تفضيلاتك (مثل اللغة) وتحليل الاستخدام وتخصيص المحتوى. يمكنك ضبط متصفحك لرفضها، مع احتمال تأثر بعض الميزات.",
        en: "We use cookies to store information about visitor preferences, record user-specific information about pages accessed or visited, and customize web page content. You may configure your browser to refuse cookies, though some features may be affected.",
      },
    ],
  },
  {
    id: "third-party-ads",
    title: { ar: "إعلانات طرف ثالث", en: "Third-Party Advertising" },
    paragraphs: [
      {
        ar: "قد يستخدم شركاؤنا الإعلانيون ملفات تعريف الارتباط وإشارات الويب (web beacons) على موقعنا. يتلقى متصفحك تلقائيًا عنوان IP عند ظهور هذه الإعلانات.",
        en: "Some of our advertising partners may use cookies and web beacons on our website. They automatically receive your IP address when this occurs.",
      },
      {
        ar: "Google، كمزود إعلانات طرف ثالث، يستخدم ملفات تعريف الارتباط لعرض الإعلانات بناءً على زياراتك لمنصة الكتب ومواقع أخرى. يمكنك إلغاء الاشتراك في ملفات DART عبر: https://www.google.com/policies/technologies/ads/",
        en: "Google, as a third-party vendor, uses cookies to serve ads based on your visits to Books Platform and other websites. Users may opt out of the use of DART cookies by visiting: https://www.google.com/policies/technologies/ads/",
      },
    ],
  },
  {
    id: "data-sharing",
    title: { ar: "مشاركة البيانات", en: "Data Sharing" },
    paragraphs: [
      {
        ar: "لا تملك منصة الكتب العالمية وصولًا أو تحكمًا في ملفات تعريف الارتباط التي يستخدمها المعلنون من أطراف ثالثة. يجب مراجعة سياسة الخصوصية لكل مزود إعلانات للاطلاع على ممارساته.",
        en: "Books Platform has no access to or control over these cookies used by third-party advertisers. You should consult the privacy policy of each third-party advertising service for more detailed information about their practices.",
      },
      {
        ar: "سياسة الخصوصية هذه لا تنطبق على مواقع أو ممارسات المعلنين الآخرين الذين لا نستطيع التحكم في أنشطتهم.",
        en: "Our Privacy Policy does not apply to other advertisers or websites, and we cannot control their activities.",
      },
    ],
  },
  {
    id: "your-choices",
    title: { ar: "خياراتك", en: "Your Choices" },
    paragraphs: [
      {
        ar: "إذا رغبت في تعطيل ملفات تعريف الارتباط، يمكنك القيام بذلك من خلال إعدادات المتصفح الفردية. راجع مواقع المتصفحات للحصول على تعليمات إدارة ملفات تعريف الارتباط.",
        en: "If you wish to disable cookies, you may do so through your individual browser options. More detailed information about cookie management with specific web browsers can be found on the browsers' websites.",
      },
    ],
  },
  {
    id: "updates",
    title: { ar: "تحديثات السياسة", en: "Policy Updates" },
    paragraphs: [
      {
        ar: "قد نحدّث هذه السياسة من وقت لآخر. يُنصح بمراجعتها دوريًا. استمرارك في استخدام المنصة بعد التحديثات يعني موافقتك على السياسة المحدّثة.",
        en: "We may update this policy from time to time. We encourage you to review it periodically. Continued use of the platform after updates constitutes acceptance of the revised policy.",
      },
    ],
  },
];

export function getPrivacySections(locale: Locale): PrivacySection[] {
  return sections.map((section) => ({
    id: section.id,
    title: pickLocale(section.title, locale),
    paragraphs: section.paragraphs.map((p) => pickLocale(p, locale)),
  }));
}

export function getPrivacyLastUpdated(locale: Locale): string {
  return pickLocale(lastUpdated, locale);
}

export function getPrivacyHero(locale: Locale) {
  const isAr = locale === "ar";
  return {
    title: isAr ? "سياسة الخصوصية" : "Privacy Policy",
    subtitle: isAr
      ? "كيف نجمع بياناتك ونستخدمها ونحميها"
      : "How we collect, use, and protect your data",
  };
}
