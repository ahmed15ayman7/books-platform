import Link from "next/link";
import { Building2 } from "lucide-react";
import {
  CardMedia,
  CardMediaImage,
  CardMediaPlaceholder,
} from "@/components/ui/card-media";
import { cn } from "@/lib/utils";

interface PublisherCardProps {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  websiteUrl?: string | null;
  country?: string | null;
  locale: string;
  className?: string;
}

export function PublisherCard({
  title,
  slug,
  imageUrl,
  country,
  locale,
  className,
}: PublisherCardProps) {
  return (
    <Link
      href={`/${locale}/publishers/${slug}`}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--brand-gray-200)] bg-white text-center",
        "transition-all hover:border-[var(--brand-red)] hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-red)]",
        className
      )}
    >
      <CardMedia rounded="top" className="bg-[var(--brand-gray-50)]">
        {imageUrl ? (
          <CardMediaImage
            src={imageUrl}
            alt={title}
            objectFit="contain"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
        ) : (
          <CardMediaPlaceholder className="from-[var(--brand-gray-50)] to-[var(--brand-gray-100)]">
            <Building2 className="h-8 w-8 text-[var(--brand-gray-400)]" strokeWidth={1.5} />
          </CardMediaPlaceholder>
        )}
      </CardMedia>
      <div className="flex flex-1 flex-col gap-1 p-4 min-w-0 w-full">
        <p className="line-clamp-2 text-sm font-semibold text-[var(--brand-gray-900)] group-hover:text-[var(--brand-red)] transition-colors">
          {title}
        </p>
        {country && (
          <p className="mt-1 text-xs text-[var(--brand-gray-500)]">{country}</p>
        )}
      </div>
    </Link>
  );
}
