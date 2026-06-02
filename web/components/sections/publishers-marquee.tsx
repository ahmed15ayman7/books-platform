import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
}

export function PublishersMarquee({ publishers, locale }: PublishersMarqueeProps) {
  if (!publishers.length) return null;

  const items = [...publishers, ...publishers];

  return (
    <div
      className="overflow-hidden py-2"
      aria-label={locale === "ar" ? "دور النشر" : "Publishers"}
    >
      <div
        className={cn(
          "flex gap-6 w-max",
          locale === "ar" ? "animate-marquee-rtl" : "animate-marquee"
        )}
      >
        {items.map((publisher, i) => {
          const displayName = localizedPublisherName(publisher, locale);
          return (
          <Link
            key={`${publisher.id}-${i}`}
            href={`/${locale}/publishers/${publisher.slug}`}
            className={cn(
              "flex h-16 w-36 shrink-0 items-center justify-center rounded-lg",
              "border border-[var(--brand-gray-200)] bg-white px-3",
              "transition-all hover:border-[var(--brand-red)] hover:shadow-md",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]"
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
              <span className="text-xs font-medium text-[var(--brand-gray-600)] text-center line-clamp-2">
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
