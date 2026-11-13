import type { Locale } from "@/lib/i18n";
import { pickLocale, type BilingualString } from "./types";
import type { PrivacySection } from "./privacy";

/**
 * تعليمات حذف البيانات — مطلوبة من Meta لنشر تطبيق "BP Partnerships Outreach"
 * اللي بيستقبل رسايل صفحة فيسبوك وحساب إنستجرام بتوع المنصة.
 */

const lastUpdated: BilingualString = { ar: "نوفمبر 2026", en: "November 2026" };

const sections: { id: string; title: BilingualString; paragraphs: BilingualString[] }[] = [
  {
    id: "what-we-keep",
    title: { ar: "البيانات التي نحتفظ بها", en: "What we keep" },
    paragraphs: [
      {
        ar: "تستخدم منصة الكتب العالمية تطبيقًا على منصة Meta باسم «BP Partnerships Outreach» فقط لاستقبال الرسائل التي تُرسَل إلى صفحة المنصة على فيسبوك وحسابها على إنستجرام، حتى يتمكن فريق الشراكات من متابعة دور النشر والرد عليها.",
        en: "Books Platform uses a Meta app called \"BP Partnerships Outreach\" only to receive messages sent to the Books Platform Facebook Page and Instagram account, so our partnerships team can follow up with publishers.",
      },
      {
        ar: "نحتفظ باسم المُرسِل واسم المستخدم على إنستجرام (إن وُجد) ونص الرسالة ووقتها، وقد نربطها بسجل دار النشر لدينا. لا نبيع هذه البيانات ولا نشاركها مع أي طرف ثالث.",
        en: "We store the sender's name, Instagram username (if any), the message text and its time, and may link them to the publisher's record in our partnerships list. We do not sell or share this data with third parties.",
      },
    ],
  },
  {
    id: "how-to-delete",
    title: { ar: "كيف تطلب حذف بياناتك", en: "How to request deletion" },
    paragraphs: [
      {
        ar: "أرسل بريدًا إلكترونيًا إلى partnerships@booksplatform.net بعنوان «طلب حذف بيانات»، واذكر الاسم أو اسم المستخدم الذي راسلتنا منه على فيسبوك أو إنستجرام.",
        en: "Email partnerships@booksplatform.net with the subject \"Data deletion request\" and include the name or username you messaged us from on Facebook or Instagram.",
      },
      {
        ar: "نحذف الرسائل وأي بيانات تواصل مرتبطة بها خلال 30 يومًا، ونؤكد لك الحذف عبر البريد الإلكتروني.",
        en: "We delete the messages and any linked contact details within 30 days and confirm the deletion by email.",
      },
    ],
  },
  {
    id: "account-data",
    title: { ar: "بيانات حسابك على المنصة", en: "Your platform account" },
    paragraphs: [
      {
        ar: "لحذف أي بيانات أخرى مرتبطة باستخدامك لموقع منصة الكتب أو تطبيقها، تواصل معنا عبر صفحة «اتصل بنا» أو على نفس البريد، وسنتعامل مع طلبك بنفس الطريقة.",
        en: "To delete any other data related to your use of the Books Platform website or app, contact us through the Contact page or the same email address and we will handle your request the same way.",
      },
    ],
  },
];

export function getDataDeletionSections(locale: Locale): PrivacySection[] {
  return sections.map((s) => ({
    id: s.id,
    title: pickLocale(s.title, locale),
    paragraphs: s.paragraphs.map((p) => pickLocale(p, locale)),
  }));
}

export function getDataDeletionLastUpdated(locale: Locale): string {
  return pickLocale(lastUpdated, locale);
}

export function getDataDeletionHero(locale: Locale) {
  const isAr = locale === "ar";
  return {
    title: isAr ? "تعليمات حذف البيانات" : "Data Deletion Instructions",
    subtitle: isAr ? "كيف تطلب حذف بياناتك من منصة الكتب" : "How to request deletion of your data from Books Platform",
  };
}
