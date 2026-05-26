import Link from "next/link";
import { getLocale } from "next-intl/server";

export default async function NotFound() {
  const locale = await getLocale().catch(() => "ar");
  const isAr = locale === "ar";

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 text-8xl font-black text-[var(--brand-red)]">404</div>
      <h1 className="mb-2 font-display text-display-md font-bold text-[var(--brand-gray-900)]">
        {isAr ? "الصفحة غير موجودة" : "Page Not Found"}
      </h1>
      <p className="mb-8 text-[var(--brand-gray-500)]">
        {isAr
          ? "الصفحة التي تبحث عنها غير موجودة أو نُقلت"
          : "The page you're looking for doesn't exist or has been moved"}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href={`/${locale}`}
          className="rounded-md bg-[var(--brand-red)] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-red-hover)]"
        >
          {isAr ? "الصفحة الرئيسية" : "Go Home"}
        </Link>
        <Link
          href={`/${locale}/books`}
          className="rounded-md border border-[var(--brand-gray-300)] px-6 py-2.5 text-sm font-semibold text-[var(--brand-gray-700)] hover:border-[var(--brand-red)] hover:text-[var(--brand-red)]"
        >
          {isAr ? "تصفح الكتب" : "Browse Books"}
        </Link>
      </div>
    </div>
  );
}
