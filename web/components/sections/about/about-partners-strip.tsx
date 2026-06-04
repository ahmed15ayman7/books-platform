import Link from "next/link";
import { SectionBlock } from "@/components/sections/section-block";
import { SafeImage } from "@/components/ui/safe-image";
import { PublisherService } from "@/server/services/publisher.service";
import { localizedPublisherName } from "@/lib/i18n/publisher-locale";
import type { Locale } from "@/lib/i18n";

interface AboutPartnersStripProps {
  locale: Locale;
  eyebrow: string;
  title: string;
}

const PLACEHOLDER_NAMES = [
  { ar: "دار نشر عالمية", en: "Global Publisher" },
  { ar: "مكتبة وطنية", en: "National Library" },
  { ar: "مؤسسة ثقافية", en: "Cultural Institution" },
  { ar: "شريك إعلامي", en: "Media Partner" },
];

export async function AboutPartnersStrip({ locale, eyebrow, title }: AboutPartnersStripProps) {
  const isAr = locale === "ar";
  const sponsored = await PublisherService.getSponsored(8).catch(() => []);

  const items =
    sponsored.length > 0
      ? sponsored.map((pub) => ({
          key: pub.slug,
          href: `/${locale}/publishers/${pub.slug}`,
          name: localizedPublisherName(pub, locale),
          imageUrl: pub.imageUrl,
        }))
      : PLACEHOLDER_NAMES.map((p, i) => ({
          key: `placeholder-${i}`,
          href: `/${locale}/publishers`,
          name: isAr ? p.ar : p.en,
          imageUrl: null as string | null,
        }));

  return (
    <SectionBlock id="partners" eyebrow={eyebrow} title={title} staggerChildren={false}>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="min-w-[140px] snap-start transition-transform hover:-translate-y-1 sm:min-w-[160px]"
          >
            <div className="flex h-24 flex-col items-center justify-center rounded-xl border border-[var(--brand-gray-200)] bg-white p-4 shadow-sm transition-colors hover:border-[var(--brand-red)]">
              {item.imageUrl ? (
                <div className="relative h-12 w-full">
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    className="object-contain"
                    sizes="140px"
                  />
                </div>
              ) : (
                <span className="text-center text-xs font-semibold text-[var(--brand-gray-600)]">
                  {item.name}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </SectionBlock>
  );
}
