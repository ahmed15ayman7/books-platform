import Link from "next/link";
import { getLocale } from "next-intl/server";
import { SocialIconCircle } from "@/components/ui/social-icon-circle";
import { SOCIAL_LINKS } from "@/components/icons";

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
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--brand-red)]">
                {col.title}
              </h3>
              <ul className="space-y-2" role="list">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--brand-gray-400)] transition-all duration-[var(--motion-base)] hover:translate-x-0.5 hover:text-[var(--brand-red)] hover:underline focus-visible:outline-none focus-visible:text-[var(--brand-red)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[var(--brand-gray-800)]">
        <div className="container-platform flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <p className="text-xs text-[var(--brand-gray-500)]">
            {new Date().getFullYear()} ©{" "}
            <span className="text-[var(--brand-red)]">
              {isAr ? "منصة الكتب العالمية" : "Books Platform"}
            </span>
            {" — "}
            {isAr ? "جميع الحقوق محفوظة" : "All rights reserved"}
          </p>

          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map((social) => (
              <SocialIconCircle
                key={social.href}
                href={social.href}
                label={social.label}
                className="h-8 w-8"
              >
                <social.Icon />
              </SocialIconCircle>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
