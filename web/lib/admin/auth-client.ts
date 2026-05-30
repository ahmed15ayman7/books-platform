/** Read admin access token from browser cookie (set on login). */
export function getAdminAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") : null;
}

const PASSKEY_VERIFICATION_KEY = "passkey_verification";

export function setPasskeyVerification(token: string) {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.setItem(PASSKEY_VERIFICATION_KEY, token);
}

export function getPasskeyVerification(): string | null {
  if (typeof sessionStorage === "undefined") return null;
  return sessionStorage.getItem(PASSKEY_VERIFICATION_KEY);
}

export function clearPasskeyVerification() {
  if (typeof sessionStorage === "undefined") return;
  sessionStorage.removeItem(PASSKEY_VERIFICATION_KEY);
}

export function adminAuthHeaders(): HeadersInit {
  const token = getAdminAccessToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const passkey = getPasskeyVerification();
  if (passkey) headers["X-Passkey-Verification"] = passkey;
  return headers;
}
