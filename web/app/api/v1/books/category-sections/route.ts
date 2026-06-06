import { BookService } from "@/server/services/book.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

export async function GET() {
  try {
    const categorySections = await BookService.getCategorySections();
    return apiSuccess(categorySections);
  } catch (error) {
    console.error("[GET /api/v1/books/category-sections]", error);
    return ApiErrors.internal();
  }
}
