import { locales } from "@/lib/i18n/config";

const LOCALE_PATTERN = new RegExp(`^/(${locales.join("|")})(/|$)`);

/** Allow only same-site relative paths: /ar/..., /en/..., or unprefixed /... */
export function sanitizeRedirectUrl(
  redirect: string | null | undefined,
  fallback: string,
): string {
  if (!redirect || typeof redirect !== "string") return fallback;

  const trimmed = redirect.trim();
  if (!trimmed.startsWith("/")) return fallback;
  if (trimmed.startsWith("//")) return fallback;
  if (trimmed.includes("://")) return fallback;

  // Allow locale-prefixed paths (/ar/... or /en/...)
  if (LOCALE_PATTERN.test(trimmed)) return trimmed;

  // Also allow unprefixed same-site paths (aliases served via beforeFiles rewrites)
  if (/^\/[^/]/.test(trimmed) || trimmed === "/") return trimmed;

  return fallback;
}
