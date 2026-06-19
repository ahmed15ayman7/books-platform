import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = { robots: "noindex, nofollow" };

export default async function UnsubscribedPage() {
  const locale = await getLocale();
  const isAr = locale === "ar";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--brand-gray-50)] px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-10 text-center shadow-sm">
        <CheckCircle className="mx-auto mb-4 h-14 w-14 text-[var(--success,#16a34a)]" />
        <h1 className="mb-3 text-xl font-bold text-[var(--brand-gray-900)]">
          {isAr ? "تم إلغاء اشتراكك" : "You've been unsubscribed"}
        </h1>
        <p className="mb-6 text-sm text-[var(--brand-gray-600)]">
          {isAr
            ? "لن تتلقى أي رسائل بريدية من منصة الكتب العالمية. يمكنك الاشتراك مجدداً في أي وقت."
            : "You won't receive any more emails from Books Platform. You can resubscribe at any time."}
        </p>
        <Link
          href={isAr ? "/ar" : "/en"}
          className="inline-block rounded-lg bg-[var(--brand-red)] px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          {isAr ? "العودة للرئيسية" : "Back to home"}
        </Link>
      </div>
    </div>
  );
}
