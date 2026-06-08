import Link from "next/link";
import type { Locale } from "@/lib/i18n";

interface TeamDesignCreditProps {
  locale: Locale;
}

export function TeamDesignCredit({ locale }: TeamDesignCreditProps) {
  const isAr = locale === "ar";

  return (
    <section
      className="mt-10 rounded-xl border border-[var(--brand-gray-200)] bg-white px-6 py-5 text-center shadow-[var(--shadow-soft)]"
      aria-label={isAr ? "إسناد التصميم" : "Design credit"}
    >
      <p className="text-sm text-[var(--brand-gray-600)] md:text-base">
        {isAr ? "تم تصميم الموقع من خلال شركة" : "This website was designed by"}{" "}
        <Link
          href="https://real.com.eg"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--brand-red)] hover:underline"
        >
          real.com.eg
        </Link>
      </p>
    </section>
  );
}
