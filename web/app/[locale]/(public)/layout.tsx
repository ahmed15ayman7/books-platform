import { getLocale } from "next-intl/server";
import { PublicChromeShell } from "@/components/sections/public-chrome-shell";
import { SiteHeader } from "@/components/sections/site-header";
import { MobileAppBanner } from "@/components/sections/mobile-app-banner";
import { Footer } from "@/components/sections/footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default async function PublicLayout({ children }: PublicLayoutProps) {
  const locale = await getLocale();

  return (
    <PublicChromeShell>
      <div className="flex min-h-screen flex-col">
        <MobileAppBanner locale={locale} />
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </PublicChromeShell>
  );
}
