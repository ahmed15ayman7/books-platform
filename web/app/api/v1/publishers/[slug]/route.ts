import { PublisherService } from "@/server/services/publisher.service";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const publisher = await PublisherService.getBySlug(slug);
    if (!publisher) return ApiErrors.notFound("Publisher");
    return apiSuccess(publisher);
  } catch (error) {
    console.error("[GET /api/v1/publishers/:slug]", error);
    return ApiErrors.internal();
  }
}
