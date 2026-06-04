import { type NextRequest } from "next/server";
import { ArticleService } from "@/server/services/article.service";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const channel = searchParams.get("channel") ?? undefined;
    const categorySlug = searchParams.get("categorySlug") ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "10", 10));
    const sort = (searchParams.get("sort") ?? "newest") as "newest" | "oldest";

    const { articles, pagination } = await ArticleService.list({ channel, categorySlug, page, limit, sort });
    return apiPaginated(articles, pagination);
  } catch (error) {
    console.error("[GET /api/v1/articles]", error);
    return ApiErrors.internal();
  }
}
