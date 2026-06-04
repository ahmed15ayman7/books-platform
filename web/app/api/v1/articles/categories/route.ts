import { ArticleService } from "@/server/services/article.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

export async function GET() {
  try {
    const categories = await ArticleService.getCategories();
    return apiSuccess(categories);
  } catch (error) {
    console.error("[GET /api/v1/articles/categories]", error);
    return ApiErrors.internal();
  }
}
