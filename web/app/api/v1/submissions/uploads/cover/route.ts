import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { getOptionalAuth, getDraftToken } from "@/lib/auth/optional-auth";
import { canAccessDraft } from "@/lib/submissions/draft-helpers";
import { uploadImage, UploadError, ALLOWED_MIMES } from "@/lib/storage/upload-image";

// IP-based rate limit: 10 uploads per 15 minutes
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX = 10;
const ipUploads = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = ipUploads.get(ip);
  if (!entry || now > entry.resetAt) {
    ipUploads.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) return ApiErrors.rateLimited();

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return ApiErrors.badRequest("Expected multipart/form-data");
  }

  const file = formData.get("file");
  const draftId = formData.get("draftId");

  if (typeof draftId !== "string" || !draftId) {
    return ApiErrors.badRequest("draftId is required");
  }

  if (!(file instanceof File)) {
    return ApiErrors.badRequest("Missing file field");
  }

  const declaredMime = file.type || "application/octet-stream";
  if (!(ALLOWED_MIMES as readonly string[]).includes(declaredMime)) {
    return ApiErrors.badRequest(
      `Unsupported file type "${declaredMime}" — upload JPEG, PNG, WebP or GIF`,
    );
  }

  const auth = await getOptionalAuth(request);
  const draftToken = getDraftToken(request);

  const draft = await db.publishBookSubmission.findUnique({
    where: { id: draftId },
    select: { id: true, userId: true, draftToken: true, status: true },
  });

  if (!draft) return ApiErrors.notFound("Draft");

  const userId = auth?.userId ?? null;
  if (!canAccessDraft(draft, userId, draftToken)) {
    return ApiErrors.forbidden("Access denied to this draft");
  }

  if (draft.status !== "draft") {
    return ApiErrors.badRequest("Can only upload to draft submissions");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await uploadImage({
      buffer,
      declaredMime,
      folder: "submissions",
      field: "image_url",
      entityId: draftId,
    });

    await db.publishBookSubmission.update({
      where: { id: draftId },
      data: { imageUrl: result.url },
    });

    return apiSuccess(result);
  } catch (err) {
    if (err instanceof UploadError) {
      return ApiErrors.badRequest(err.message);
    }
    console.error("[POST /api/v1/submissions/uploads/cover]", err);
    return ApiErrors.internal();
  }
}
