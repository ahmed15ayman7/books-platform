import { type NextRequest } from "next/server";
import { BookService } from "@/server/services/book.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const limit = parseInt(request.nextUrl.searchParams.get("limit") ?? "12", 10);
    const result = await BookService.getSimilar(slug, limit);
    return apiSuccess(result);
  } catch (error) {
    console.error("[GET /api/v1/books/:slug/similar]", error);
    return ApiErrors.internal();
  }
}
