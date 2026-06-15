import type { Metadata } from "next";
import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import AuthorLoginForm from "@/components/auth/author-login-form";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { getAboutContent } from "@/lib/content/about";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AuthLoginPage() {
  const locale = (await getLocale()) as Locale;
  const about = getAboutContent(locale);
  const isAr = locale === "ar";

  return (
    <AuthSplitLayout
      quote={about.closing.quote}
      imageAlt={isAr ? "تسجيل الدخول" : "Sign in"}
    >
      <Suspense>
        <AuthorLoginForm locale={locale} />
      </Suspense>
    </AuthSplitLayout>
  );
}
