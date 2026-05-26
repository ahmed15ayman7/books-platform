import { BookService } from "@/server/services/book.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const book = await BookService.getBySlug(slug);

    if (!book) {
      return ApiErrors.notFound("Book");
    }

    // Compute rating aggregate
    const ratings = book.ratings;
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((sum: number, r: { stars: number }) => sum + r.stars, 0) / ratings.length
        : null;

    const { ratings: _ratings, ...rest } = book;
    const bookData = {
      ...rest,
      averageRating: averageRating ? Math.round(averageRating * 10) / 10 : null,
      ratingsCount: ratings.length,
    };

    return apiSuccess(bookData);
  } catch (error) {
    console.error("[GET /api/v1/books/:slug]", error);
    return ApiErrors.internal();
  }
}
