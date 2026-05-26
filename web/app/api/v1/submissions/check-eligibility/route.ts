import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");
    if (!email) return ApiErrors.badRequest("email parameter required");

    const count = await db.publishBookSubmission.count({ where: { authorEmail: email } });
    return apiSuccess({ isEligibleForFree: count === 0, submissionsCount: count });
  } catch (error) {
    console.error("[GET /api/v1/submissions/check-eligibility]", error);
    return ApiErrors.internal();
  }
}
