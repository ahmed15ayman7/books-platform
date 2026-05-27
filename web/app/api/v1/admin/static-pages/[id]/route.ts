import { type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";

const KEY_PREFIX = "static_page:";

const updateSchema = z.object({
  slug: z.string().optional(),
  titleAr: z.string().optional(),
  titleEn: z.string().optional(),
  bodyAr: z.string().optional(),
  bodyEn: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAuth(request, "ADMIN");
  if (isErrorResponse(auth)) return auth;

  const { id } = await params;
  try {
    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const slug = parsed.data.slug ?? id;
    const key = `${KEY_PREFIX}${slug}`;

    const existing = await db.setting.findUnique({ where: { key } });
    const current = (existing?.value as Record<string, unknown>) ?? {};

    const updated = { ...current, ...parsed.data };

    await db.setting.upsert({
      where: { key },
      create: { key, value: updated, updatedBy: auth.payload.userId },
      update: { value: updated, updatedBy: auth.payload.userId },
    });

    return apiSuccess({ id: slug, slug, ...updated });
  } catch (error) {
    console.error("[PATCH /api/v1/admin/static-pages/:id]", error);
    return ApiErrors.internal();
  }
}
