import { type NextRequest } from "next/server";
import { BookService } from "@/server/services/book.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "6", 10);
    const books = await BookService.getSimilar(slug, limit);
    return apiSuccess(books);
  } catch (error) {
    console.error("[GET /api/v1/books/:slug/similar]", error);
    return ApiErrors.internal();
  }
}
