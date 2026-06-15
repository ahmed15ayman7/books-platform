import Link from "next/link";
import { localeHref } from "@/lib/i18n/href";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { carouselAutoplayReverse } from "@/lib/carousel/autoplay";
import { localizedPublisherName, type PublisherLocalizedFields } from "@/lib/i18n/publisher-locale";

interface Publisher extends PublisherLocalizedFields {
  id: string;
  title?: string;
  slug: string;
  imageUrl?: string | null;
}

interface PublishersMarqueeProps {
  publishers: Publisher[];
  locale: string;
  pageOrder?: number;
  reverse?: boolean;
}

export function PublishersMarquee({
  publishers,
  locale,
  pageOrder = 0,
  reverse: reverseProp,
}: PublishersMarqueeProps) {
  if (!publishers.length) return null;

  const reverse = reverseProp ?? carouselAutoplayReverse(pageOrder);
  const items = [...publishers, ...publishers];

  return (
    <div
      className="overflow-hidden py-2"
      aria-label={locale === "ar" ? "دور النشر" : "Publishers"}
    >
      <div
        className={cn(
          "flex w-max gap-6",
          locale === "ar" ? "animate-marquee-rtl" : "animate-marquee",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {items.map((publisher, i) => {
          const displayName = localizedPublisherName(publisher, locale);
          return (
            <Link
              key={`${publisher.id}-${i}`}
              href={localeHref(locale, `/publishers/${publisher.slug}`)}
              className={cn(
                "flex h-16 w-36 shrink-0 items-center justify-center rounded-lg",
                "border border-[var(--brand-gray-200)] bg-white px-3",
                "transition-all hover:border-[var(--brand-red)] hover:shadow-md",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
              )}
              aria-label={displayName}
            >
              {publisher.imageUrl ? (
                <Image
                  src={publisher.imageUrl}
                  alt={displayName}
                  width={120}
                  height={48}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="line-clamp-2 text-center text-xs font-medium text-[var(--brand-gray-600)]">
                  {displayName}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
