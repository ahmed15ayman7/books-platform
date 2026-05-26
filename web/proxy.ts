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

// Protected route patterns
const ADMIN_PATTERN = /^\/[a-z]{2}\/admin/;
const AMBASSADOR_PATTERN = /^\/[a-z]{2}\/ambassador/;

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

  // Protect admin routes
  if (ADMIN_PATTERN.test(pathname)) {
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

  // Protect ambassador routes
  if (AMBASSADOR_PATTERN.test(pathname)) {
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

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icons|.*\\..*).+)",
    "/",
  ],
};
