import { Bookmark } from "lucide-react";
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
      <div className="relative mx-auto aspect-[16/9] max-w-4xl overflow-hidden rounded-2xl bg-[var(--brand-red)] md:aspect-[21/9]">
        <SafeImage
          src={imageSrc}
          alt=""
          fill
          className="object-cover opacity-25 mix-blend-luminosity"
          sizes="(max-width: 896px) 100vw, 896px"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[var(--brand-red)]/85" aria-hidden="true" />
        <div className="relative flex h-full flex-col justify-center px-8 py-12 md:px-14 md:py-16">
          <Bookmark
            className={cn(
              "mb-6 h-8 w-6 fill-white text-white",
              isAr ? "self-end" : "self-start",
            )}
            aria-hidden="true"
          />
          <h2 className="max-w-xl font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
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
