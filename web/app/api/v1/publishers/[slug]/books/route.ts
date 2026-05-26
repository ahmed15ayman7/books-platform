import { type NextRequest } from "next/server";
import { PublisherService } from "@/server/services/publisher.service";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(request.nextUrl.searchParams.get("limit") ?? "12", 10));
    const { books, pagination } = await PublisherService.getPublisherBooks(slug, page, limit);
    return apiPaginated(books, pagination);
  } catch (error) {
    console.error("[GET /api/v1/publishers/:slug/books]", error);
    return ApiErrors.internal();
  }
}
