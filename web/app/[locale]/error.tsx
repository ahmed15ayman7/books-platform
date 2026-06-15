"use client";

import Link from "next/link";
import { localeHref } from "@/lib/i18n/href";
import { useParams } from "next/navigation";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const isAr = locale === "ar";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-6xl">⚠️</div>
      <h1 className="mb-2 font-display text-display-sm font-bold text-[var(--brand-gray-900)]">
        {isAr ? "حدث خطأ" : "Something went wrong"}
      </h1>
      <p className="mb-6 text-sm text-[var(--brand-gray-500)]">
        {error.message || (isAr ? "حاول مرة أخرى" : "Please try again")}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="rounded-md bg-[var(--brand-red)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-red-hover)]"
        >
          {isAr ? "إعادة المحاولة" : "Try Again"}
        </button>
        <Link
          href={localeHref(locale, "/")}
          className="rounded-md border border-[var(--brand-gray-300)] px-6 py-2.5 text-sm font-semibold text-[var(--brand-gray-700)]"
        >
          {isAr ? "الرئيسية" : "Home"}
        </Link>
      </div>
    </div>
  );
}
