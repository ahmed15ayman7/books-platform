import Link from "next/link";
import { getLocale } from "next-intl/server";
import { NotFoundIllustration } from "@/components/not-found-illustration";

export default async function NotFound() {
  const locale = await getLocale().catch(() => "ar");
  const isAr = locale === "ar";

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-[var(--brand-gray-950)] px-4 py-16 text-center">
      <NotFoundIllustration className="mb-8 h-auto w-full max-w-[280px] sm:max-w-[320px]" />

      <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--brand-red)]">
        404
      </p>
      <h1 className="mb-3 font-display text-2xl font-bold text-white sm:text-3xl">
        {isAr ? "الصفحة غير موجودة" : "Page Not Found"}
      </h1>
      <p className="mb-10 max-w-md text-sm leading-relaxed text-[var(--brand-gray-400)]">
        {isAr
          ? "يبدو أن هذه الصفحة سقطت من بين صفحات الكتاب — ربما نُقلت أو لم تُكتب بعد."
          : "This page seems to have fallen out of the book — it may have moved or was never written."}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={`/${locale}`}
          className="rounded-lg bg-[var(--brand-red)] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-red-hover)]"
        >
          {isAr ? "الصفحة الرئيسية" : "Go Home"}
        </Link>
        <Link
          href={`/${locale}/books`}
          className="rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-900)] px-6 py-2.5 text-sm font-semibold text-[var(--brand-gray-200)] transition-colors hover:border-[var(--brand-red)] hover:text-white"
        >
          {isAr ? "تصفح الكتب" : "Browse Books"}
        </Link>
      </div>
    </div>
  );
}
