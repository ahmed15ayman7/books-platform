import {
  ACCESS_TOKEN_MAX_AGE_SECONDS,
  REFRESH_TOKEN_MAX_AGE_SECONDS,
} from "@/lib/auth/session-config";

export function setClientAccessToken(token: string) {
  if (typeof document === "undefined") return;
  const secure = process.env.NODE_ENV === "production" ? "; secure" : "";
  document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=${ACCESS_TOKEN_MAX_AGE_SECONDS}; samesite=strict${secure}`;
}

export function clearClientAccessToken() {
  if (typeof document === "undefined") return;
  document.cookie = "access_token=; path=/; max-age=0; samesite=strict";
}

export function accessTokenCookieOptions(token: string) {
  return {
    name: "access_token" as const,
    value: token,
    path: "/",
    maxAge: ACCESS_TOKEN_MAX_AGE_SECONDS,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    httpOnly: false,
  };
}

export function refreshTokenCookieOptions(token: string) {
  return {
    name: "refresh_token" as const,
    value: token,
    path: "/api/v1/auth",
    maxAge: REFRESH_TOKEN_MAX_AGE_SECONDS,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };
}
