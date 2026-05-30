import { type NextRequest } from "next/server";
import { z } from "zod";
import { HeroSlideService } from "@/server/services/hero-slide.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

const updateSchema = z.object({
  titleAr: z.string().min(1).optional(),
  titleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  subtitleEn: z.string().optional().nullable(),
  imageUrl: z.string().min(1).optional(),
  foregroundImageUrl: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  position: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.hero.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const { id } = await params;
    const existing = await HeroSlideService.getById(id);
    if (!existing) return ApiErrors.notFound("Hero slide");

    const body = await request.json() as unknown;
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const slide = await HeroSlideService.update(id, parsed.data);

    await db.auditLog.create({
      data: {
        userId: auth.payload.userId,
        action: "UPDATE_HERO_SLIDE",
        entity: "HomeHeroSlide",
        entityId: slide.id,
      },
    });

    return apiSuccess(slide);
  } catch (error) {
    console.error("[PATCH /api/v1/admin/hero-slides/[id]]", error);
    return ApiErrors.internal();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.hero.update);
  if (isErrorResponse(auth)) return auth;

  try {
    const { id } = await params;
    const existing = await HeroSlideService.getById(id);
    if (!existing) return ApiErrors.notFound("Hero slide");

    await HeroSlideService.delete(id);

    await db.auditLog.create({
      data: {
        userId: auth.payload.userId,
        action: "DELETE_HERO_SLIDE",
        entity: "HomeHeroSlide",
        entityId: id,
      },
    });

    return apiSuccess({ deleted: true });
  } catch (error) {
    console.error("[DELETE /api/v1/admin/hero-slides/[id]]", error);
    return ApiErrors.internal();
  }
}
