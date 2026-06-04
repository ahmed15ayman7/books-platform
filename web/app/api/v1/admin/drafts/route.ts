import { type NextRequest } from "next/server";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import {
  DRAFT_TYPES,
  type DraftType,
  canAccessDraftType,
  getAccessibleDraftTypes,
  listDraftItems,
} from "@/lib/admin/content-hub";

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (isAdminAuthError(auth)) return auth;

  const accessible = getAccessibleDraftTypes(auth);
  if (accessible.length === 0) return ApiErrors.forbidden();

  const { searchParams } = request.nextUrl;
  const typeParam = searchParams.get("type") ?? accessible[0];
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));

  if (!DRAFT_TYPES.includes(typeParam as DraftType)) {
    return ApiErrors.badRequest("Invalid draft type");
  }

  const type = typeParam as DraftType;
  if (!canAccessDraftType(auth, type)) return ApiErrors.forbidden();

  try {
    const { items, total } = await listDraftItems(type, page, limit);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return apiPaginated(
      items.map((item) => ({
        ...item,
        type,
        updatedAt: item.updatedAt.toISOString(),
      })),
      {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    );
  } catch (error) {
    console.error("[GET /api/v1/admin/drafts]", error);
    return ApiErrors.internal();
  }
}
