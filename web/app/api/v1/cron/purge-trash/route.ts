import { type NextRequest } from "next/server";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { verifyCronSecret } from "@/lib/auth/verify-cron-secret";
import { purgeExpiredTrash } from "@/lib/admin/trash-purge";

export async function POST(request: NextRequest) {
  const authErr = verifyCronSecret(request);
  if (authErr) return authErr;

  try {
    const result = await purgeExpiredTrash();
    return apiSuccess(result);
  } catch (error) {
    console.error("[POST /api/v1/cron/purge-trash]", error);
    return ApiErrors.internal();
  }
}

/** GET للجدولة عبر Vercel Cron (يدعم GET و POST) */
export async function GET(request: NextRequest) {
  return POST(request);
}
