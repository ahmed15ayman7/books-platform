import Link from "next/link";
import { getLocale } from "next-intl/server";
import { ShoppingCart } from "lucide-react";
import { SocialIconCircle } from "@/components/ui/social-icon-circle";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { HeaderSearch } from "@/components/sections/header-search";
import { MobileNavTrigger } from "@/components/sections/mobile-nav";
import { DesktopNavClient } from "@/components/sections/desktop-nav-client";
import { SiteLogo } from "@/components/sections/site-logo";
import { SOCIAL_LINKS } from "@/components/icons";

export async function SiteHeader() {
  const locale = await getLocale();

  const utilityLinks =
    locale === "ar"
      ? [
          { href: `/${locale}/about`, label: "من نحن" },
          { href: `/${locale}/services`, label: "خدماتنا" },
          { href: `/${locale}/team`, label: "فريق العمل" },
          { href: `/${locale}/contact`, label: "اتصل بنا" },
        ]
      : [
          { href: `/${locale}/about`, label: "About" },
          { href: `/${locale}/services`, label: "Services" },
          { href: `/${locale}/team`, label: "Team" },
          { href: `/${locale}/contact`, label: "Contact" },
        ];

  return (
    <header className="site-chrome sticky top-0 z-50 text-white">
      <div className="border-b border-white/10 bg-[var(--brand-black)]">
        <div className="container-platform flex flex-wrap items-center gap-3 py-2 md:flex-nowrap md:gap-6">
          <nav
            className="hidden items-center gap-5 lg:flex"
            aria-label={locale === "ar" ? "روابط مساعدة" : "Utility links"}
          >
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1 text-xs font-medium text-white/75 transition-all duration-[var(--motion-base)] hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="order-first w-full min-w-0 flex-1 md:order-none md:max-w-xl">
            <HeaderSearch />
          </div>

          <div className="ms-auto flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher className="text-white" />
            <div className="hidden h-5 w-px bg-white/15 sm:block" />
            <div className="hidden items-center gap-1 sm:flex">
              {SOCIAL_LINKS.map((social) => (
                <SocialIconCircle
                  key={social.href}
                  href={social.href}
                  label={social.label}
                  className="h-7 w-7 opacity-90 hover:opacity-100"
                >
                  <social.Icon />
                </SocialIconCircle>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-white/10 bg-[var(--brand-black)] shadow-[var(--shadow-header)]">
        <div className="container-platform flex h-[68px] items-center justify-between gap-4 md:h-[72px]">
          <SiteLogo locale={locale} />

          <div className="hidden min-w-0 flex-1 justify-center px-4 lg:flex">
            <DesktopNavClient locale={locale} />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <Link
              href={`/${locale}/cart`}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl text-white transition-all duration-[var(--motion-base)] hover:scale-105 hover:bg-white/10 hover:text-[var(--brand-red)]"
              aria-label={locale === "ar" ? "السلة" : "Cart"}
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
            </Link>
            <div className="lg:hidden">
              <MobileNavTrigger locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
