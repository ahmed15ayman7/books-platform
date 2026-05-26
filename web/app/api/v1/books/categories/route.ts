import { BookService } from "@/server/services/book.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

export async function GET() {
  try {
    const categories = await BookService.getCategories();
    return apiSuccess(categories);
  } catch (error) {
    console.error("[GET /api/v1/books/categories]", error);
    return ApiErrors.internal();
  }
}
