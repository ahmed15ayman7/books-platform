import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { verifyAccessToken } from "@/lib/auth/jwt";
import { accessTokenCookieOptions } from "@/lib/auth/access-token-cookie";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: true,
});

// With as-needed prefix, Arabic paths have no locale segment (/admin, /author…)
// while English paths retain it (/en/admin, /en/author…).
const ADMIN_PATTERN = /^(?:\/en)?\/admin(?:\/|$)/;
const ADMIN_LOGIN_PATTERN = /^(?:\/en)?\/admin\/login\/?$/;
const AMBASSADOR_PATTERN = /^(?:\/en)?\/ambassador(?:\/|$)/;
const AMBASSADOR_LOGIN_PATTERN = /^(?:\/en)?\/ambassador\/login\/?$/;
const AUTHOR_PATTERN = /^(?:\/en)?\/author(?:\/|$)/;
const AUTH_PATTERN = /^(?:\/en)?\/auth(?:\/|$)/;

type AuthPayload = Awaited<ReturnType<typeof verifyAccessToken>>;

async function resolveAccessToken(request: NextRequest): Promise<{
  token: string | null;
  payload: AuthPayload;
  refreshed: boolean;
}> {
  let token = request.cookies.get("access_token")?.value ?? null;
  let payload = token ? await verifyAccessToken(token) : null;

  if (payload) {
    return { token, payload, refreshed: false };
  }

  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return { token: null, payload: null, refreshed: false };
  }

  try {
    const refreshUrl = new URL("/api/v1/auth/refresh", request.url);
    const refreshRes = await fetch(refreshUrl, {
      method: "POST",
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });
    const data = (await refreshRes.json()) as {
      success: boolean;
      data?: { accessToken: string };
    };
    if (refreshRes.ok && data.success && data.data?.accessToken) {
      token = data.data.accessToken;
      payload = await verifyAccessToken(token);
      return { token, payload, refreshed: true };
    }
  } catch {
    // fall through
  }

  return { token: null, payload: null, refreshed: false };
}

function applyRefreshedToken(response: NextResponse, token: string) {
  response.cookies.set(accessTokenCookieOptions(token));
}

function roleAllowed(
  payload: NonNullable<AuthPayload>,
  allowed: string[],
): boolean {
  return allowed.includes(payload.role);
}

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|map)$/)
  ) {
    return NextResponse.next();
  }

  // With as-needed, Arabic URLs have no prefix; English start with /en
  const firstSegment = pathname.split("/")[1] ?? "";
  const locale = firstSegment === "en" ? "en" : "ar";
  let refreshedToken: string | null = null;

  const needsAuth =
    (ADMIN_PATTERN.test(pathname) && !ADMIN_LOGIN_PATTERN.test(pathname))
    || (AMBASSADOR_PATTERN.test(pathname) && !AMBASSADOR_LOGIN_PATTERN.test(pathname))
    || (AUTHOR_PATTERN.test(pathname) && !AUTH_PATTERN.test(pathname));

  let auth: Awaited<ReturnType<typeof resolveAccessToken>> | null = null;
  if (needsAuth) {
    auth = await resolveAccessToken(request);
    if (auth.refreshed && auth.token) refreshedToken = auth.token;
  }

  const localePrefix = locale === "en" ? "/en" : "";

  if (ADMIN_PATTERN.test(pathname) && !ADMIN_LOGIN_PATTERN.test(pathname)) {
    if (!auth?.payload || !roleAllowed(auth.payload, ["ADMIN"])) {
      return NextResponse.redirect(new URL(`${localePrefix}/admin/login`, request.url));
    }
  }

  if (AMBASSADOR_PATTERN.test(pathname) && !AMBASSADOR_LOGIN_PATTERN.test(pathname)) {
    if (!auth?.payload || !roleAllowed(auth.payload, ["AMBASSADOR", "ADMIN"])) {
      return NextResponse.redirect(new URL(`${localePrefix}/ambassador/login`, request.url));
    }
  }

  if (AUTHOR_PATTERN.test(pathname) && !AUTH_PATTERN.test(pathname)) {
    if (!auth?.payload || !roleAllowed(auth.payload, ["AUTHOR", "ADMIN"])) {
      const redirect = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(
        new URL(`${localePrefix}/auth/login?redirect=${redirect}`, request.url),
      );
    }
  }

  const response = intlMiddleware(request);
  if (refreshedToken) applyRefreshedToken(response, refreshedToken);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\..*).+)",
    "/",
  ],
};
