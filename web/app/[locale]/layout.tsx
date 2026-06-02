import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
// import { Tajawal, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { locales } from "@/lib/i18n/config";
import type { Locale } from "@/lib/i18n/config";
import { buildRootMetadata } from "@/lib/seo/metadata";
import "@/app/globals.css";

// const tajawal = Tajawal({
//   subsets: ["arabic"],
//   weight: ["400", "500", "700", "800"],
//   variable: "--font-arabic",
//   display: "swap",
// });

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-latin",
//   display: "swap",
// });

export const metadata: Metadata = buildRootMetadata();

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      // className={`${tajawal.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            {/* Skip to main content (accessibility) */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:rounded-md focus:bg-[var(--brand-red)] focus:px-4 focus:py-2 focus:text-white focus:outline-none"
            >
              {locale === "ar" ? "تخطى للمحتوى الرئيسي" : "Skip to main content"}
            </a>
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
