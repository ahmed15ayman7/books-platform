import type { Locale } from "@/lib/i18n";

interface ServicesClosingProps {
  locale: Locale;
  text: string;
}

export function ServicesClosing({ locale, text }: ServicesClosingProps) {
  const isAr = locale === "ar";

  return (
    <section dir={isAr ? "rtl" : "ltr"}>
      <p className="mx-auto max-w-4xl text-center text-lg leading-relaxed text-[var(--brand-gray-700)] md:text-xl lg:text-2xl">
        {text}
      </p>
    </section>
  );
}
