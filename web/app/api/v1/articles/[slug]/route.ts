import { ArticleService } from "@/server/services/article.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const article = await ArticleService.getBySlug(slug);
    if (!article) return ApiErrors.notFound("Article");
    return apiSuccess(article);
  } catch (error) {
    console.error("[GET /api/v1/articles/:slug]", error);
    return ApiErrors.internal();
  }
}
