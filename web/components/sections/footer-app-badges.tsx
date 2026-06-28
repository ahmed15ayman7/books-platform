import Image from "next/image";
import {
  APP_STORE_URL,
  GOOGLE_PLAY_URL,
} from "@/lib/constants/app-store-links";

interface FooterAppBadgesProps {
  locale: string;
}

function StoreBadge({
  href,
  src,
  label,
}: {
  href: string;
  src: string;
  label: string;
}) {
  const image = (
    <Image
      src={src}
      alt={label}
      width={150}
      height={40}
      className=" transition-opacity hover:opacity-85"
    />
  );

  if (!href) {
    return (
      <span
        className="inline-flex cursor-not-allowed opacity-60"
        aria-label={label}
        title={label}
      >
        {image}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex"
      aria-label={label}
    >
      {image}
    </a>
  );
}

export function FooterAppBadges({ locale }: FooterAppBadgesProps) {
  const isAr = locale === "ar";

  return (
    <div
      className="flex flex-wrap items-center gap-3 pt-2 md:pt-6"
      aria-label={isAr ? "تحميل التطبيق" : "Download the app"}
    >
      <StoreBadge
        href={APP_STORE_URL}
        src="/badges/app-store.svg"
        label={isAr ? "حمّل من App Store" : "Download on the App Store"}
      />
      <StoreBadge
        href={GOOGLE_PLAY_URL}
        src="/badges/google-play.svg"
        label={isAr ? "حمّل من Google Play" : "Get it on Google Play"}
      />
    </div>
  );
}
