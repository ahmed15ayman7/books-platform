export const COOKIE_CONSENT_KEY = "bp-cookie-consent";
export const COOKIE_CONSENT_EVENT = "cookie-consent-accepted";
export const CONSENT_REMIND_MS = 7 * 24 * 60 * 60 * 1000;

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

export function shouldShowCookieConsent(now = Date.now()): boolean {
  const record = readRecord();
  if (!record) return true;
  if (record.status === "accepted") return false;
  return now - record.at >= CONSENT_REMIND_MS;
}

export function saveCookieConsent(status: CookieConsentStatus): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(
    COOKIE_CONSENT_KEY,
    JSON.stringify({ status, at: Date.now() } satisfies CookieConsentRecord),
  );
  if (status === "accepted" && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COOKIE_CONSENT_EVENT));
  }
}

export function hasCookieConsent(): boolean {
  return readRecord()?.status === "accepted";
}
