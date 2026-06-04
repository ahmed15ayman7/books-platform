import { getLocale } from "next-intl/server";
import { FooterAnimatedGrid } from "@/components/sections/footer-animated.client";

export async function Footer() {
  const locale = await getLocale();
  const isAr = locale === "ar";
  const base = `/${locale}`;

  const columns = [
    {
      title: isAr ? "الكتب" : "Books",
      links: [
        { href: `${base}/books`, label: isAr ? "كل الكتب" : "All Books" },
        { href: `${base}/books/nominated-for-translation`, label: isAr ? "مرشحة للترجمة" : "For Translation" },
        { href: `${base}/books/translated`, label: isAr ? "كتب مترجمة" : "Translated Books" },
        { href: `${base}/publish`, label: isAr ? "انشر كتابك" : "Publish Your Book" },
      ],
    },
    {
      title: isAr ? "المقالات" : "Articles",
      links: [
        { href: `${base}/articles/harvest`, label: isAr ? "حصاد الكتب" : "Book Harvest" },
        { href: `${base}/articles/ideas`, label: isAr ? "زبدة الأفكار" : "Essence of Ideas" },
        { href: `${base}/articles/world-reads`, label: isAr ? "العالم يقرأ" : "World Reads" },
        { href: `${base}/articles/books-talk`, label: isAr ? "حديث الكتب" : "Book Talk" },
      ],
    },
    {
      title: isAr ? "المنصة" : "Platform",
      links: [
        { href: `${base}/about`, label: isAr ? "من نحن" : "About Us" },
        { href: `${base}/services`, label: isAr ? "خدماتنا" : "Our Services" },
        { href: `${base}/team`, label: isAr ? "فريق العمل" : "Our Team" },
        { href: `${base}/publishers`, label: isAr ? "الناشرون" : "Publishers" },
      ],
    },
    {
      title: isAr ? "الدعم" : "Support",
      links: [
        { href: `${base}/contact`, label: isAr ? "اتصل بنا" : "Contact Us" },
        { href: `${base}/privacy`, label: isAr ? "سياسة الخصوصية" : "Privacy Policy" },
        { href: `${base}/terms`, label: isAr ? "الشروط والأحكام" : "Terms & Conditions" },
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
