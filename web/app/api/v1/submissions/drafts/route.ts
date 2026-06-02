import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { draftSubmissionSchema } from "@/lib/validation/submission.schema";
import { apiCreated, ApiErrors } from "@/lib/api-client/response";
import { getOptionalAuth, getDraftToken } from "@/lib/auth/optional-auth";
import {
  DRAFT_SELECT,
  formValuesToDraftData,
  generateDraftSlug,
  generateDraftToken,
} from "@/lib/submissions/draft-helpers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as unknown;
    const parsed = draftSubmissionSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const auth = await getOptionalAuth(request);
    const existingToken = getDraftToken(request);
    const draftToken = existingToken ?? generateDraftToken();
    const data = formValuesToDraftData(parsed.data);

    const draft = await db.publishBookSubmission.create({
      data: {
        ...data,
        status: "draft",
        slug: generateDraftSlug(),
        draftToken,
        currentStep: parsed.data.currentStep ?? 0,
        userId: auth?.role === "AUTHOR" ? auth.userId : null,
        paymentStatus: "pending",
        isFirstFree: true,
      },
      select: DRAFT_SELECT,
    });

    return apiCreated({ draft, draftToken });
  } catch (error) {
    console.error("[POST /api/v1/submissions/drafts]", error);
    return ApiErrors.internal();
  }
}
