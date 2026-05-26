import { type NextRequest } from "next/server";
import { PublisherService } from "@/server/services/publisher.service";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));
    const country = searchParams.get("country") ?? undefined;
    const search = searchParams.get("search") ?? undefined;

    const { publishers, pagination } = await PublisherService.list({ page, limit, country, search });
    return apiPaginated(publishers, pagination);
  } catch (error) {
    console.error("[GET /api/v1/publishers]", error);
    return ApiErrors.internal();
  }
}
