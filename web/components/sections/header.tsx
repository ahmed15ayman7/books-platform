import Link from "next/link";
import { getLocale } from "next-intl/server";
import { ShoppingCart } from "lucide-react";
import { MobileNavTrigger } from "@/components/sections/mobile-nav";
import { DesktopNavClient } from "@/components/sections/desktop-nav-client";
import { SiteLogo } from "@/components/sections/site-logo";

export async function Header() {
  const locale = await getLocale();

  return (
    <header className="site-chrome sticky top-0 z-40 border-b border-white/10 bg-[var(--brand-black)] text-white shadow-[0_4px_24px_rgba(0,0,0,0.45)]">
      <div className="container-platform flex h-[76px] items-center justify-between gap-6">
        <SiteLogo locale={locale} />

        <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex">
          <DesktopNavClient locale={locale} />
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          <Link
            href={`/${locale}/cart`}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10 hover:text-[var(--brand-red)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]"
            aria-label={locale === "ar" ? "السلة" : "Cart"}
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={1.75} />
            <span
              id="cart-count-badge"
              className="absolute -top-0.5 -end-0.5 hidden h-4 w-4 items-center justify-center rounded-full bg-[var(--brand-red)] text-[10px] font-bold text-white"
              aria-live="polite"
            />
          </Link>

          <div className="lg:hidden">
            <MobileNavTrigger locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}
