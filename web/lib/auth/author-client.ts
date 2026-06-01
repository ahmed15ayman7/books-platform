/** Author/public auth helpers (shared access_token cookie with admin). */

export function getAccessToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token="));
  return match ? decodeURIComponent(match.split("=")[1] ?? "") : null;
}

export function setAccessToken(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=900; samesite=strict`;
}

export function clearAccessToken() {
  if (typeof document === "undefined") return;
  document.cookie = "access_token=; path=/; max-age=0; samesite=strict";
}

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
