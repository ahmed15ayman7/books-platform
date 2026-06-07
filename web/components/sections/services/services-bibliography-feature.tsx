import { SafeImage } from "@/components/ui/safe-image";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ServicesBibliographyFeatureProps {
  locale: Locale;
  title: string;
  body: string;
  imageSrc: string;
  imageAlt: string;
}

function BibliographyBookmarkRibbon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 52"
      fill="currentColor"
      aria-hidden="true"
      className={cn("text-white", className)}
    >
      <path d="M0 0h14v46L7 40 0 46V0z" />
    </svg>
  );
}

export function ServicesBibliographyFeature({
  locale,
  title,
  body,
  imageSrc,
  imageAlt,
}: ServicesBibliographyFeatureProps) {
  const isAr = locale === "ar";

  return (
    <section id="bibliography" dir={isAr ? "rtl" : "ltr"}>
      <div className="relative mx-auto min-h-[280px] max-w-5xl overflow-hidden bg-[var(--brand-red)] md:min-h-[320px]">
        <SafeImage
          src={imageSrc}
          alt=""
          fill
          className="object-cover object-center opacity-40"
          sizes="(max-width: 1024px) 100vw, 1024px"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[var(--brand-red)]/80" aria-hidden="true" />

        <BibliographyBookmarkRibbon className="absolute top-0 end-6 h-14 w-4 md:end-10 md:h-16 md:w-5" />

        <div className="relative flex min-h-[inherit] items-end px-8 pb-8 pt-16 md:px-12 md:pb-10 md:pt-20">
          <h2 className="max-w-2xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            {title}
          </h2>
        </div>
        <span className="sr-only">{imageAlt}</span>
      </div>

      <p className="mx-auto mt-8 max-w-4xl text-center text-lg leading-relaxed text-[var(--brand-gray-700)] md:text-xl">
        {body}
      </p>
    </section>
  );
}
