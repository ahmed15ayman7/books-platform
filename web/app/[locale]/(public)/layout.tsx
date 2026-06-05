import { PublicChromeShell } from "@/components/sections/public-chrome-shell";
import { SiteHeader } from "@/components/sections/site-header";
import { Footer } from "@/components/sections/footer";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <PublicChromeShell>
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </PublicChromeShell>
  );
}
