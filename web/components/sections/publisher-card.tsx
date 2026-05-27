import Link from "next/link";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PublisherCardProps {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  websiteUrl?: string | null;
  country?: string | null;
  bookCount?: number;
  locale: string;
  className?: string;
}

export function PublisherCard({
  title,
  slug,
  imageUrl,
  country,
  bookCount,
  locale,
  className,
}: PublisherCardProps) {
  const isAr = locale === "ar";

  return (
    <Link
      href={`/${locale}/publishers/${slug}`}
      className={cn(
        "group flex flex-col items-center gap-3 rounded-2xl border border-[var(--brand-gray-200)] bg-white p-4 text-center",
        "transition-all hover:border-[var(--brand-red)] hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
        className
      )}
    >
      <div className="flex h-16 w-full items-center justify-center rounded-xl bg-[var(--brand-gray-50)] px-3 py-2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={120}
            height={56}
            className="h-12 w-auto max-w-full object-contain"
          />
        ) : (
          <Building2 className="h-8 w-8 text-[var(--brand-gray-400)]" strokeWidth={1.5} />
        )}
      </div>
      <div className="min-w-0 w-full">
        <p className="line-clamp-2 text-sm font-semibold text-[var(--brand-gray-900)] group-hover:text-[var(--brand-red)] transition-colors">
          {title}
        </p>
        {(country || bookCount !== undefined) && (
          <p className="mt-1 text-xs text-[var(--brand-gray-500)]">
            {[country, bookCount ? `${bookCount} ${isAr ? "كتاب" : "books"}` : null]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </div>
    </Link>
  );
}
