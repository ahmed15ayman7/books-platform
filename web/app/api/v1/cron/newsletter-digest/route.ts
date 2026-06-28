import { type NextRequest } from "next/server";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { verifyCronSecret } from "@/lib/auth/verify-cron-secret";
import { runNewsletterDigest } from "@/lib/email/newsletter-digest";

export async function POST(request: NextRequest) {
  const authErr = verifyCronSecret(request);
  if (authErr) return authErr;

  try {
    const result = await runNewsletterDigest();
    return apiSuccess(result);
  } catch (error) {
    console.error("[POST /api/v1/cron/newsletter-digest]", error);
    return ApiErrors.internal();
  }
}

/** GET support for Vercel Cron (supports GET and POST). */
export async function GET(request: NextRequest) {
  return POST(request);
}
