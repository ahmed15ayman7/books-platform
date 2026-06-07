import { type NextRequest } from "next/server";
import { ArticleService } from "@/server/services/article.service";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { isMediaChannel } from "@/lib/media/youtube";
import { PAGINATION } from "@/lib/utils/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const channel = searchParams.get("channel") ?? undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      PAGINATION.MAX_PAGE_SIZE,
      parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10),
    );
    const sort = (searchParams.get("sort") ?? "newest") as "newest" | "oldest";

    if (channel && !isMediaChannel(channel)) {
      return ApiErrors.badRequest("Invalid media channel");
    }

    const { articles, pagination } = await ArticleService.list({
      channel,
      page,
      limit,
      sort,
      mediaOnly: true,
    });

    return apiPaginated(articles, pagination);
  } catch (error) {
    console.error("[GET /api/v1/media]", error);
    return ApiErrors.internal();
  }
}
