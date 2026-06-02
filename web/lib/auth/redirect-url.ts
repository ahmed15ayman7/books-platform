import { locales } from "@/lib/i18n/config";

const LOCALE_PATTERN = new RegExp(`^/(${locales.join("|")})(/|$)`);

/** Allow only same-site relative paths like /ar/publish?draft=... */
export function sanitizeRedirectUrl(
  redirect: string | null | undefined,
  fallback: string,
): string {
  if (!redirect || typeof redirect !== "string") return fallback;

  const trimmed = redirect.trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;
  if (!LOCALE_PATTERN.test(trimmed)) return fallback;

  return trimmed;
}
