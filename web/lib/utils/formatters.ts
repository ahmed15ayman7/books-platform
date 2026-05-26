import { format, formatDistanceToNow } from "date-fns";
import { ar, enUS } from "date-fns/locale";

type Locale = "ar" | "en";

const dateFnsLocale = {
  ar: ar,
  en: enUS,
};

export function formatDate(
  date: Date | string,
  locale: Locale = "ar",
  pattern = "PPP"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, pattern, { locale: dateFnsLocale[locale] });
}

export function formatRelativeDate(
  date: Date | string,
  locale: Locale = "ar"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, {
    addSuffix: true,
    locale: dateFnsLocale[locale],
  });
}

export function formatNumber(num: number, locale: Locale = "ar"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US").format(num);
}

export function formatCurrency(
  amount: number,
  currency = "USD",
  locale: Locale = "ar"
): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
