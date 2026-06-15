import Link from "next/link";
import { localeHref } from "@/lib/i18n/href";
import { getLocale } from "next-intl/server";
import { SocialIconCircle } from "@/components/ui/social-icon-circle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { HeaderSearch } from "@/components/sections/header-search";
import { SOCIAL_LINKS } from "@/components/icons";

export async function TopUtilityBar() {
  const locale = await getLocale();

  const utilityLinks =
    locale === "ar"
      ? [
          { href: localeHref(locale, "/about"), label: "من نحن" },
          { href: localeHref(locale, "/services"), label: "خدماتنا" },
          { href: localeHref(locale, "/team"), label: "فريق العمل" },
          { href: localeHref(locale, "/contact"), label: "اتصل بنا" },
        ]
      : [
          { href: localeHref(locale, "/about"), label: "About Us" },
          { href: localeHref(locale, "/services"), label: "Our Services" },
          { href: localeHref(locale, "/team"), label: "Our Team" },
          { href: localeHref(locale, "/contact"), label: "Contact Us" },
        ];

  return (
    <div className="site-chrome border-b border-white/10 bg-[var(--brand-black)] text-white">
      <div className="container-platform grid h-11 grid-cols-1 items-center gap-2 py-1 md:h-12 md:grid-cols-[1fr_minmax(0,32rem)_1fr] md:gap-4">
        <nav
          aria-label={locale === "ar" ? "روابط مساعدة" : "Utility links"}
          className="order-2 hidden items-center justify-start gap-4 md:order-1 md:flex"
        >
          {utilityLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-2 text-xs font-medium transition-colors hover:text-white"
              style={{ color: "rgba(255,255,255,0.88)" }}
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-sm bg-[var(--brand-red)]" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="order-1 flex w-full justify-center px-0 md:order-2 md:px-2">
          <HeaderSearch />
        </div>

        <div className="order-3 flex items-center justify-end gap-3">
          <LanguageSwitcher className="text-white" />
          <div className="hidden h-4 w-px bg-white/20 sm:block" />
          <div className="flex items-center gap-1">
            {SOCIAL_LINKS.map((social) => (
              <SocialIconCircle
                key={social.href}
                href={social.href}
                label={social.label}
                className="h-7 w-7"
              >
                <social.Icon />
              </SocialIconCircle>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
