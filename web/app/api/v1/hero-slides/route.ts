import { HeroSlideService } from "@/server/services/hero-slide.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

export async function GET() {
  try {
    const slides = await HeroSlideService.listActive();
    return apiSuccess(slides);
  } catch (error) {
    console.error("[GET /api/v1/hero-slides]", error);
    return ApiErrors.internal();
  }
}
