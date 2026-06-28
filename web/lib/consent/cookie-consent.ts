export const COOKIE_CONSENT_KEY = "bp-cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-accepted";

export type CookieConsentStatus = "accepted" | "dismissed";

export interface CookieConsentRecord {
  status: CookieConsentStatus;
  at: number;
}

function readRecord(): CookieConsentRecord | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CookieConsentRecord;
    if (parsed.status !== "accepted" && parsed.status !== "dismissed") return null;
    if (typeof parsed.at !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Show only until the user accepts or dismisses once. */
export function shouldShowCookieConsent(): boolean {
  return readRecord() === null;
}

export function saveCookieConsent(status: CookieConsentStatus): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(
    COOKIE_CONSENT_KEY,
    JSON.stringify({ status, at: Date.now() } satisfies CookieConsentRecord),
  );
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
  }
}

export function hasCookieConsent(): boolean {
  return readRecord()?.status === "accepted";
}
