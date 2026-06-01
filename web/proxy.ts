import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { verifyAccessToken } from "@/lib/auth/jwt";

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});

// Protected route patterns (login pages must stay public)
const ADMIN_PATTERN = /^\/[a-z]{2}\/admin(?:\/|$)/;
const ADMIN_LOGIN_PATTERN = /^\/[a-z]{2}\/admin\/login\/?$/;
const AMBASSADOR_PATTERN = /^\/[a-z]{2}\/ambassador(?:\/|$)/;
const AMBASSADOR_LOGIN_PATTERN = /^\/[a-z]{2}\/ambassador\/login\/?$/;
const AUTHOR_PATTERN = /^\/[a-z]{2}\/author(?:\/|$)/;
const AUTH_PATTERN = /^\/[a-z]{2}\/auth(?:\/|$)/;

export default async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip API, static, etc.
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|map)$/)
  ) {
    return NextResponse.next();
  }

  // Protect admin routes (except login — otherwise infinite redirect loop)
  if (ADMIN_PATTERN.test(pathname) && !ADMIN_LOGIN_PATTERN.test(pathname)) {
    const token = request.cookies.get("access_token")?.value
      ?? request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      const locale = pathname.split("/")[1] ?? "ar";
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }

    const payload = await verifyAccessToken(token);
    if (!payload || payload.role !== "ADMIN") {
      const locale = pathname.split("/")[1] ?? "ar";
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
  }

  // Protect ambassador routes (except login)
  if (AMBASSADOR_PATTERN.test(pathname) && !AMBASSADOR_LOGIN_PATTERN.test(pathname)) {
    const token = request.cookies.get("access_token")?.value
      ?? request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      const locale = pathname.split("/")[1] ?? "ar";
      return NextResponse.redirect(new URL(`/${locale}/ambassador/login`, request.url));
    }

    const payload = await verifyAccessToken(token);
    if (!payload || (payload.role !== "AMBASSADOR" && payload.role !== "ADMIN")) {
      const locale = pathname.split("/")[1] ?? "ar";
      return NextResponse.redirect(new URL(`/${locale}/ambassador/login`, request.url));
    }
  }

  // Protect author portal (auth login/register stay public)
  if (AUTHOR_PATTERN.test(pathname) && !AUTH_PATTERN.test(pathname)) {
    const token = request.cookies.get("access_token")?.value
      ?? request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      const locale = pathname.split("/")[1] ?? "ar";
      const redirect = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?redirect=${redirect}`, request.url),
      );
    }

    const payload = await verifyAccessToken(token);
    if (!payload || (payload.role !== "AUTHOR" && payload.role !== "ADMIN")) {
      const locale = pathname.split("/")[1] ?? "ar";
      const redirect = encodeURIComponent(pathname + request.nextUrl.search);
      return NextResponse.redirect(
        new URL(`/${locale}/auth/login?redirect=${redirect}`, request.url),
      );
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\..*).+)",
    "/",
  ],
};
