import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { DRAFT_SELECT } from "@/lib/submissions/draft-helpers";

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "AUTHOR");
  if (isErrorResponse(auth)) return auth;

  try {
    const drafts = await db.publishBookSubmission.findMany({
      where: {
        userId: auth.payload.userId,
        status: { in: ["draft", "pending", "approved", "rejected"] },
      },
      orderBy: { updatedAt: "desc" },
      select: {
        ...DRAFT_SELECT,
        status: true,
        isFirstFree: true,
        paymentStatus: true,
      },
    });

    return apiSuccess({ drafts });
  } catch (error) {
    console.error("[GET /api/v1/submissions/drafts/mine]", error);
    return ApiErrors.internal();
  }
}
