import { Suspense } from "react";
import { getLocale } from "next-intl/server";
import AuthorRegisterForm from "@/components/auth/author-register-form";
import type { Locale } from "@/lib/i18n";

export default async function AuthRegisterPage() {
  const locale = (await getLocale()) as Locale;
  return (
    <Suspense>
      <AuthorRegisterForm locale={locale} />
    </Suspense>
  );
}
