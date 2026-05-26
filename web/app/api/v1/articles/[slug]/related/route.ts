import { type NextRequest } from "next/server";
import { ArticleService } from "@/server/services/article.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "3", 10);
    const articles = await ArticleService.getRelated(slug, limit);
    return apiSuccess(articles);
  } catch (error) {
    console.error("[GET /api/v1/articles/:slug/related]", error);
    return ApiErrors.internal();
  }
}
