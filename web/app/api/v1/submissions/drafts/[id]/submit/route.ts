import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { getOptionalAuth, getDraftToken } from "@/lib/auth/optional-auth";
import { canAccessDraft, draftToFormValues } from "@/lib/submissions/draft-helpers";
import { createSubmissionSchema } from "@/lib/validation/submission.schema";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteParams) {
  return submitDraft(request, params);
}

async function submitDraft(request: NextRequest, params: Promise<{ id: string }>) {
  const { id } = await params;
  try {
    const auth = await getOptionalAuth(request);
    const draftToken = getDraftToken(request);

    const existing = await db.publishBookSubmission.findUnique({ where: { id } });
    if (!existing || existing.status !== "draft") return ApiErrors.notFound("Draft");

    if (!canAccessDraft(existing, auth?.userId ?? null, draftToken)) {
      return ApiErrors.forbidden();
    }

    const formValues = draftToFormValues(existing);
    const parsed = createSubmissionSchema.safeParse(formValues);
    if (!parsed.success) {
      return ApiErrors.badRequest("Complete all required fields before submitting", parsed.error.issues);
    }

    const { website, ...data } = parsed.data;
    if (website) return apiSuccess({ message: "Submission received" });

    const previousCount = await db.publishBookSubmission.count({
      where: {
        authorEmail: data.authorEmail,
        status: { not: "draft" },
        id: { not: id },
      },
    });
    const isFirstFree = previousCount === 0;

    const slugBase = data.bookTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    const slug = `${slugBase}-${Date.now()}`;

    const submission = await db.publishBookSubmission.update({
      where: { id },
      data: {
        title: data.bookTitle,
        content: data.bookSummary,
        authorEmail: data.authorEmail,
        authorFirstName: data.authorName.split(" ")[0] ?? data.authorName,
        authorLastName: data.authorName.split(" ").slice(1).join(" ") || null,
        authorPhone: data.authorPhone ?? null,
        authorBio: data.authorBio ?? null,
        bookLanguage: data.bookLanguage,
        bookCategory: data.bookCategory ?? null,
        fileUrl: data.fileUrl ?? null,
        imageUrl: data.coverUrl ?? null,
        allowFreeDownload: data.allowFreeDownload,
        isFirstFree,
        paymentStatus: isFirstFree ? "PAID" : "PENDING",
        status: "pending",
        slug,
        draftToken: null,
        userId: auth?.role === "AUTHOR" ? auth.userId : existing.userId,
        formData: data,
        postModifiedDate: new Date(),
      },
      select: {
        id: true,
        status: true,
        isFirstFree: true,
        paymentStatus: true,
        slug: true,
      },
    });

    return apiSuccess({
      submission,
      message: "Submission received successfully",
      requiresPayment: !isFirstFree,
    });
  } catch (error) {
    console.error("[POST /api/v1/submissions/drafts/:id/submit]", error);
    return ApiErrors.internal();
  }
}
