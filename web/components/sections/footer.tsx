import { getLocale } from "next-intl/server";
import { localeHref } from "@/lib/i18n/href";
import { FooterAnimatedGrid } from "@/components/sections/footer-animated.client";
import { BookService } from "@/server/services/book.service";
import {
  buildBookCategoryLinks,
  buildMediaChannelLinks,
  buildReadingChannelLinks,
} from "@/lib/nav/site-nav";

export async function Footer() {
  const locale = await getLocale();
  const isAr = locale === "ar";

  const bookCategories = await BookService.getNavCategories().catch(() => []);
  const categoryLinks = buildBookCategoryLinks(locale, bookCategories);
  const readingLinks = buildReadingChannelLinks(locale);
  const mediaLinks = buildMediaChannelLinks(locale);

  const columns = [
    {
      title: isAr ? "تصنيفات الكتب" : "Book Categories",
      links: [
        ...categoryLinks,
        {
          href: localeHref(locale, "/books/nominated-for-translation"),
          label: isAr ? "مرشحة للترجمة" : "For Translation",
        },
        { href: localeHref(locale, "/books/translated"), label: isAr ? "كتب مترجمة" : "Translated Books" },
        { href: localeHref(locale, "/publish"), label: isAr ? "انشر كتابك" : "Publish Your Book" },
      ],
    },
    {
      title: isAr ? "قراءات وعروض" : "Readings",
      links: readingLinks,
    },
    {
      title: isAr ? "إبداعات الميديا" : "Media",
      links: mediaLinks,
    },
    {
      title: isAr ? "المنصة" : "Platform",
      links: [
        { href: localeHref(locale, "/about"), label: isAr ? "من نحن" : "About Us" },
        { href: localeHref(locale, "/services"), label: isAr ? "خدماتنا" : "Our Services" },
        { href: localeHref(locale, "/team"), label: isAr ? "فريق العمل" : "Our Team" },
        { href: localeHref(locale, "/publishers"), label: isAr ? "الناشرون" : "Publishers" },
      ],
    },
    {
      title: isAr ? "الدعم" : "Support",
      links: [
        { href: localeHref(locale, "/contact"), label: isAr ? "اتصل بنا" : "Contact Us" },
        { href: localeHref(locale, "/privacy"), label: isAr ? "سياسة الخصوصية" : "Privacy Policy" },
        { href: localeHref(locale, "/terms"), label: isAr ? "الشروط والأحكام" : "Terms & Conditions" },
      ],
    },
  ];

  return (
    <footer className="rounded-t-3xl bg-[var(--brand-black)] text-white" role="contentinfo">
      <div className="container-platform py-12">
        <FooterAnimatedGrid columns={columns} locale={locale} />
      </div>
    </footer>
  );
}
