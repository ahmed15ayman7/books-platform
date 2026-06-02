import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { claimDraftSchema } from "@/lib/validation/submission.schema";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { DRAFT_SELECT } from "@/lib/submissions/draft-helpers";

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "AUTHOR");
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json() as unknown;
    const parsed = claimDraftSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const draft = await db.publishBookSubmission.findFirst({
      where: { draftToken: parsed.data.draftToken, status: "draft" },
    });
    if (!draft) return ApiErrors.notFound("Draft");

    if (draft.userId && draft.userId !== auth.payload.userId) {
      return ApiErrors.forbidden();
    }

    const updated = await db.publishBookSubmission.update({
      where: { id: draft.id },
      data: { userId: auth.payload.userId },
      select: DRAFT_SELECT,
    });

    return apiSuccess({ draft: updated });
  } catch (error) {
    console.error("[POST /api/v1/submissions/drafts/claim]", error);
    return ApiErrors.internal();
  }
}
