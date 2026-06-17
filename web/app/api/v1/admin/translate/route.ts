import { type NextRequest } from "next/server";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import { translateText } from "@/lib/translation/translate-text";

const bodySchema = z.object({
  text: z.string().min(1).max(12_000),
  from: z.enum(["ar", "en"]),
  to: z.enum(["ar", "en"]),
});

export async function POST(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (isAdminAuthError(auth)) return auth;

  try {
    const body = await request.json() as unknown;
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const { text, from, to } = parsed.data;
    if (from === to) {
      return apiSuccess({ translated: text });
    }

    const translated = await translateText(text, from, to);
    return apiSuccess({ translated });
  } catch (error) {
    console.error("[POST /api/v1/admin/translate]", error);
    const message =
      error instanceof Error && error.message.includes("All translation providers failed")
        ? error.message
        : "Translation failed";
    return ApiErrors.badRequest(message);
  }
}
