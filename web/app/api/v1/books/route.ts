import { type NextRequest } from "next/server";
import { BookService } from "@/server/services/book.service";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { PAGINATION } from "@/lib/utils/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      PAGINATION.MAX_PAGE_SIZE,
      parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10),
    );
    const category = searchParams.get("category") ?? undefined;
    const language = searchParams.get("language") ?? undefined;
    const publisher = searchParams.get("publisher") ?? undefined;
    const status = searchParams.get("status") ?? undefined;
    const sort = (searchParams.get("sort") ?? "newest") as "newest" | "oldest" | "title";
    const search = searchParams.get("q") ?? undefined;

    const { books, pagination } = await BookService.list({
      page,
      limit,
      category,
      language,
      publisher,
      status,
      sort,
      search,
    });

    return apiPaginated(books, pagination);
  } catch (error) {
    console.error("[GET /api/v1/books]", error);
    return ApiErrors.internal();
  }
}
