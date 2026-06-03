import { type NextRequest } from "next/server";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import {
  TRASH_TYPES,
  type TrashType,
  canAccessTrashType,
  getAccessibleTrashTypes,
  listTrashItems,
} from "@/lib/admin/content-hub";

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (isAdminAuthError(auth)) return auth;

  const accessible = getAccessibleTrashTypes(auth);
  if (accessible.length === 0) return ApiErrors.forbidden();

  const { searchParams } = request.nextUrl;
  const typeParam = searchParams.get("type") ?? accessible[0];
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") ?? "20", 10));

  if (!TRASH_TYPES.includes(typeParam as TrashType)) {
    return ApiErrors.badRequest("Invalid trash type");
  }

  const type = typeParam as TrashType;
  if (!canAccessTrashType(auth, type)) return ApiErrors.forbidden();

  try {
    const { items, total } = await listTrashItems(type, page, limit);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return apiPaginated(
      items.map((item) => ({
        ...item,
        type,
        deletedAt: item.deletedAt?.toISOString(),
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
    console.error("[GET /api/v1/admin/trash]", error);
    return ApiErrors.internal();
  }
}
