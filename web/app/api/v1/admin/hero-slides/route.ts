import { type NextRequest } from "next/server";
import { z } from "zod";
import { HeroSlideService } from "@/server/services/hero-slide.service";
import { apiSuccess, apiCreated, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { db } from "@/lib/db";

const slideSchema = z.object({
  titleAr: z.string().min(1),
  titleEn: z.string().optional().nullable(),
  subtitleAr: z.string().optional().nullable(),
  subtitleEn: z.string().optional().nullable(),
  imageUrl: z.string().min(1),
  foregroundImageUrl: z.string().optional().nullable(),
  linkUrl: z.string().optional().nullable(),
  position: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.hero.view);
  if (isErrorResponse(auth)) return auth;

  try {
    const slides = await HeroSlideService.listAll();
    return apiSuccess(slides);
  } catch (error) {
    console.error("[GET /api/v1/admin/hero-slides]", error);
    return ApiErrors.internal();
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAuth(request, "ADMIN", PERMISSIONS.hero.create);
  if (isErrorResponse(auth)) return auth;

  try {
    const body = await request.json() as unknown;
    const parsed = slideSchema.safeParse(body);
    if (!parsed.success) return ApiErrors.badRequest("Validation failed", parsed.error.issues);

    const slide = await HeroSlideService.create(parsed.data, auth.payload.userId);

    await db.auditLog.create({
      data: {
        userId: auth.payload.userId,
        action: "CREATE_HERO_SLIDE",
        entity: "HomeHeroSlide",
        entityId: slide.id,
      },
    });

    return apiCreated(slide);
  } catch (error) {
    console.error("[POST /api/v1/admin/hero-slides]", error);
    return ApiErrors.internal();
  }
}
