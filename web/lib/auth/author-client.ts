import {
  clearClientAccessToken,
  setClientAccessToken,
} from "@/lib/auth/access-token-cookie";
import { ACCESS_TOKEN_MAX_AGE_SECONDS } from "@/lib/auth/session-config";

/** Author/public auth helpers (shared access_token cookie with admin). */

export function getAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") : null;
}

export function setAccessToken(token: string) {
  setClientAccessToken(token);
}

export function clearAccessToken() {
  clearClientAccessToken();
}

/** Renew access token using httpOnly refresh cookie (keeps session alive). */
export async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch("/api/v1/auth/refresh", {
      method: "POST",
      credentials: "include",
    });
    const data = (await res.json()) as {
      success: boolean;
      data?: { accessToken: string };
    };
    if (!res.ok || !data.success || !data.data?.accessToken) return false;
    setAccessToken(data.data.accessToken);
    return true;
  } catch {
    return false;
  }
}

export { ACCESS_TOKEN_MAX_AGE_SECONDS };

const DRAFT_TOKEN_KEY = "publish_draft_token";
const DRAFT_ID_KEY = "publish_draft_id";

export function getStoredDraftToken(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(DRAFT_TOKEN_KEY);
}

export function setStoredDraftToken(token: string) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(DRAFT_TOKEN_KEY, token);
}

export function getStoredDraftId(): string | null {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem(DRAFT_ID_KEY);
}

export function setStoredDraftId(id: string) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(DRAFT_ID_KEY, id);
}

export function clearStoredDraft() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(DRAFT_TOKEN_KEY);
  localStorage.removeItem(DRAFT_ID_KEY);
}

export function authHeaders(): HeadersInit {
  const token = getAccessToken();
  const draftToken = getStoredDraftToken();
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (draftToken) headers["X-Draft-Token"] = draftToken;
  return headers;
}

/** Auth headers for multipart uploads — never set Content-Type (browser adds boundary). */
export function authUploadHeaders(): HeadersInit {
  const token = getAccessToken();
  const draftToken = getStoredDraftToken();
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (draftToken) headers["X-Draft-Token"] = draftToken;
  return headers;
}

export interface AuthorSession {
  id: string;
  email: string;
  fullName: string;
  role: string;
}

const SESSION_KEY = "author_session";

export function saveAuthorSession(session: AuthorSession) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getAuthorSession(): AuthorSession | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthorSession;
  } catch {
    return null;
  }
}

export function clearAuthorSession() {
  if (typeof localStorage === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
