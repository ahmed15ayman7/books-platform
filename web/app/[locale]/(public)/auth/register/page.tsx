import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import AuthorRegisterForm from "@/components/auth/author-register-form";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { getAboutContent } from "@/lib/content/about";
import type { Locale } from "@/lib/i18n";

export default async function AuthRegisterPage() {
  const locale = (await getLocale()) as Locale;
  const about = getAboutContent(locale);
  const isAr = locale === "ar";

  return (
    <AuthSplitLayout
      quote={about.closing.quote}
      imageAlt={isAr ? "إنشاء حساب" : "Register"}
    >
      <Suspense>
        <AuthorRegisterForm locale={locale} />
      </Suspense>
    </AuthSplitLayout>
  );
}
