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
    <section id="bibliography" dir={isAr ? "rtl" : "ltr"} aria-labelledby="bibliography-title">
      <div className="grid w-full grid-cols-1 md:min-h-[240px] md:grid-cols-2">
        <div className="relative min-h-[200px] overflow-hidden md:min-h-0">
          <SafeImage
            src={imageSrc}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[var(--brand-red)]/65" aria-hidden="true" />
          <BibliographyBookmarkRibbon className="absolute top-0 start-4 h-12 w-3.5 md:start-5 md:h-14 md:w-4" />
        </div>

        <div className="flex items-center bg-[var(--brand-red)] px-8 py-10 md:px-10 md:py-12">
          <h2
            id="bibliography-title"
            className="w-full text-end font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
        </div>
      </div>

      <span className="sr-only">{imageAlt}</span>

      <p className="mt-8 w-full text-start text-lg leading-relaxed text-[var(--brand-gray-700)] md:mt-10 md:text-xl">
        {body}
      </p>
    </section>
  );
}
