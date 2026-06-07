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

function splitBibliographyTitle(_title: string, locale: Locale): [string, string] {
  if (locale === "ar") {
    return ["ببليوغرافيا", "المنصة"];
  }
  return ["Platform", "Bibliography"];
}

export function ServicesBibliographyFeature({
  locale,
  title,
  body,
  imageSrc,
  imageAlt,
}: ServicesBibliographyFeatureProps) {
  const isAr = locale === "ar";
  const [titleLine1, titleLine2] = splitBibliographyTitle(title, locale);

  return (
    <section id="bibliography" dir={isAr ? "rtl" : "ltr"} aria-labelledby="bibliography-title">
      <div className="relative mx-auto max-w-5xl">
        <div className="relative ms-auto flex min-h-[220px] w-full max-w-[min(100%,520px)] items-stretch bg-[var(--brand-red)] md:min-h-[280px] md:max-w-[72%]">
          <div className="relative z-10 flex flex-1 flex-col justify-center px-6 py-8 md:px-8 md:py-10">
            <h2
              id="bibliography-title"
              className="font-display text-3xl font-bold leading-[1.05] text-white md:text-5xl lg:text-[3.25rem]"
            >
              <span className="block">{titleLine1}</span>
              {titleLine2 ? <span className="block">{titleLine2}</span> : null}
            </h2>
          </div>

          <div className="relative aspect-square w-[42%] shrink-0 overflow-hidden md:w-[46%]">
            <SafeImage
              src={imageSrc}
              alt=""
              fill
              className="object-cover object-center opacity-50"
              sizes="(max-width: 768px) 40vw, 240px"
              aria-hidden
            />
            <div className="absolute inset-0 bg-[var(--brand-red)]/55" aria-hidden="true" />
            <BibliographyBookmarkRibbon className="absolute top-0 end-4 h-12 w-3.5 md:end-5 md:h-14 md:w-4" />
          </div>
        </div>

        <span className="sr-only">{imageAlt}</span>
      </div>

      <p className="mx-auto mt-8 max-w-5xl text-start text-lg leading-relaxed text-[var(--brand-gray-700)] md:mt-10 md:text-xl">
        {body}
      </p>
    </section>
  );
}
