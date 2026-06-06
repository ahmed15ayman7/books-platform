import { type NextRequest } from "next/server";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { PAGINATION } from "@/lib/utils/constants";
import { parseSearchSectionType } from "@/lib/search/search-types";
import { GlobalSearchService } from "@/server/services/global-search.service";

export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const q = sp.get("q")?.trim() ?? "";
  const type = parseSearchSectionType(sp.get("type"));
  const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10));
  const limit = Math.min(
    PAGINATION.MAX_PAGE_SIZE,
    Math.max(1, parseInt(sp.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10)),
  );

  if (q.length < 2) {
    return apiSuccess({
      mode: type === "all" ? "preview" : "section",
      query: q,
      books: type === "all" ? { items: [], total: 0 } : [],
      articles: type === "all" ? { items: [], total: 0 } : [],
      media: type === "all" ? { items: [], total: 0 } : [],
      publishers: type === "all" ? { items: [], total: 0 } : [],
      authors: type === "all" ? { items: [], total: 0 } : [],
      pagination: type === "all" ? undefined : {
        page: 1,
        limit,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    });
  }

  try {
    const result = await GlobalSearchService.search({
      q,
      type,
      page,
      limit,
      category: sp.get("category") ?? undefined,
      status: sp.get("status") ?? undefined,
      sort: (sp.get("sort") as "newest" | "oldest" | "title") ?? "newest",
      channel: sp.get("channel") ?? undefined,
      country: sp.get("country") ?? undefined,
    });

    if (!result) {
      return apiSuccess({
        mode: type === "all" ? "preview" : "section",
        query: q,
        books: type === "all" ? { items: [], total: 0 } : [],
        articles: type === "all" ? { items: [], total: 0 } : [],
        media: type === "all" ? { items: [], total: 0 } : [],
        publishers: type === "all" ? { items: [], total: 0 } : [],
        authors: type === "all" ? { items: [], total: 0 } : [],
      });
    }

    return apiSuccess(result);
  } catch (error) {
    console.error("[GET /api/v1/search]", error);
    return ApiErrors.internal();
  }
}
