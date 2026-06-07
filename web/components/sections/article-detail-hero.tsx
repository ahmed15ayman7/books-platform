import Image from "next/image";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ArticleDetailHeroProps {
  locale: Locale;
  title: string;
  coverUrl: string | null;
  coverAlt: string;
}

function BookmarkRibbon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 14 52"
      fill="currentColor"
      aria-hidden="true"
      className={cn("text-[var(--brand-red)]", className)}
    >
      <path d="M0 0h14v46L7 40 0 46V0z" />
    </svg>
  );
}

export function ArticleDetailHero({ locale, title, coverUrl, coverAlt }: ArticleDetailHeroProps) {
  // const isAr = locale === "ar";
  console.log(locale,coverUrl,coverAlt);

  return (
    <section className="relative w-full overflow-hidden bg-[var(--brand-gray-100)] py-8 md:py-10" style={{direction: "rtl"}}>
      {coverUrl && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverUrl}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl grayscale"
          />
          <div className="absolute inset-0 bg-white/40" aria-hidden="true" />
        </>
      )}

      <div className="container-platform relative z-10">
        <div
          className={cn(
            "flex flex-col items-center gap-6 md:flex-row md:items-center md:justify-center md:gap-10 lg:gap-14",
            // !isAr && "md:flex-row-reverse",
          )}
        >
          {coverUrl && (
            <div className="relative h-[220px] w-[158px] shrink-0 drop-shadow-lg sm:h-[250px] sm:w-[178px] md:h-[280px] md:w-[200px]">
              <Image
                src={coverUrl}
                alt={coverAlt}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 768px) 180px, 200px"
              />
            </div>
          )}

          <div
            className={cn(
              "relative w-full max-w-xl bg-white px-6 py-5 shadow-sm md:px-10 md:py-7",
              !coverUrl && "mx-auto",
            )}
          >
            <BookmarkRibbon className="absolute start-4 top-1/2 h-11 w-3 -translate-y-1/2 md:start-5 md:h-12 md:w-3.5" />
            <h1
              className={
                "font-display text-xl font-bold leading-snug text-[var(--brand-red-hover)] sm:text-2xl md:text-[1.65rem] pe-2 ps-10 text-right md:ps-12 "
              }
            >
              {title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}
