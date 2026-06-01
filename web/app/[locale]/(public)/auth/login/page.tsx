import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import AuthorLoginForm from "@/components/auth/author-login-form";
import type { Locale } from "@/lib/i18n";

export default async function AuthLoginPage() {
  const locale = (await getLocale()) as Locale;
  return (
    <Suspense>
      <AuthorLoginForm locale={locale} />
    </Suspense>
  );
}
