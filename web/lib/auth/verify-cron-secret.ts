import { type NextRequest } from "next/server";
import { ApiErrors } from "@/lib/api-client/response";

export function verifyCronSecret(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.warn("[cron] CRON_SECRET is not configured");
    return ApiErrors.forbidden("Cron not configured");
  }

  const auth = request.headers.get("authorization");
  const bearer = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  const header = request.headers.get("x-cron-secret");

  if (bearer !== secret && header !== secret) {
    return ApiErrors.unauthorized();
  }

  return null;
}
