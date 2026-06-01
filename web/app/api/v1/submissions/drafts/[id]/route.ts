import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { draftSubmissionSchema } from "@/lib/validation/submission.schema";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { getOptionalAuth, getDraftToken } from "@/lib/auth/optional-auth";
import {
  canAccessDraft,
  DRAFT_SELECT,
  draftToFormValues,
  formValuesToDraftData,
} from "@/lib/submissions/draft-helpers";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const auth = await getOptionalAuth(request);
    const draftToken = getDraftToken(request);

    const draft = await db.publishBookSubmission.findUnique({
      where: { id },
      select: DRAFT_SELECT,
    });
    if (!draft || draft.status !== "draft") return ApiErrors.notFound("Draft");

    if (!canAccessDraft(draft, auth?.userId ?? null, draftToken)) {
      return ApiErrors.forbidden();
    }

    return apiSuccess({
      draft: {
        ...draft,
        formValues: draftToFormValues(draft),
      },
    });
  } catch (error) {
    console.error("[GET /api/v1/submissions/drafts/:id]", error);
    return ApiErrors.internal();
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = draftSubmissionSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const auth = await getOptionalAuth(request);
    const draftToken = getDraftToken(request);

    const existing = await db.publishBookSubmission.findUnique({ where: { id } });
    if (!existing || existing.status !== "draft") return ApiErrors.notFound("Draft");

    if (!canAccessDraft(existing, auth?.userId ?? null, draftToken)) {
      return ApiErrors.forbidden();
    }

    const data = formValuesToDraftData(parsed.data);
    const draft = await db.publishBookSubmission.update({
      where: { id },
      data: {
        ...data,
        currentStep: parsed.data.currentStep ?? existing.currentStep,
        userId: auth?.role === "AUTHOR" ? auth.userId : existing.userId,
        postModifiedDate: new Date(),
      },
      select: DRAFT_SELECT,
    });

    return apiSuccess({ draft });
  } catch (error) {
    console.error("[PATCH /api/v1/submissions/drafts/:id]", error);
    return ApiErrors.internal();
  }
}
