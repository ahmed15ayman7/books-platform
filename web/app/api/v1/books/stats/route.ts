import { BookService } from "@/server/services/book.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

export async function GET() {
  try {
    const stats = await BookService.getStats();
    return apiSuccess(stats);
  } catch (error) {
    console.error("[GET /api/v1/books/stats]", error);
    return ApiErrors.internal();
  }
}
