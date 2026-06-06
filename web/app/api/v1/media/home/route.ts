import { type NextRequest } from "next/server";
import { ArticleService } from "@/server/services/article.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const limitPerChannel = Math.min(
      12,
      Math.max(1, parseInt(searchParams.get("limit") ?? "5", 10)),
    );

    const channels = await ArticleService.getMediaHome(limitPerChannel);
    return apiSuccess(channels);
  } catch (error) {
    console.error("[GET /api/v1/media/home]", error);
    return ApiErrors.internal();
  }
}
