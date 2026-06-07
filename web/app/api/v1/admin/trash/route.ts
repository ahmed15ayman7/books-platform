import { type NextRequest } from "next/server";
import { apiPaginated, ApiErrors } from "@/lib/api-client/response";
import { PAGINATION } from "@/lib/utils/constants";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import {
  TRASH_TYPES,
  type TrashType,
  canAccessTrashType,
  getAccessibleTrashTypes,
  listTrashItems,
} from "@/lib/admin/content-hub";
import { purgeExpiredTrash } from "@/lib/admin/trash-purge";
import {
  trashAutoPurgeAt,
  trashDaysRemaining,
} from "@/lib/admin/trash-config";

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (isAdminAuthError(auth)) return auth;

  const accessible = getAccessibleTrashTypes(auth);
  if (accessible.length === 0) return ApiErrors.forbidden();

  const { searchParams } = request.nextUrl;
  const typeParam = searchParams.get("type") ?? accessible[0];
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(PAGINATION.MAX_PAGE_SIZE, parseInt(searchParams.get("limit") ?? String(PAGINATION.DEFAULT_PAGE_SIZE), 10));

  if (!TRASH_TYPES.includes(typeParam as TrashType)) {
    return ApiErrors.badRequest("Invalid trash type");
  }

  const type = typeParam as TrashType;
  if (!canAccessTrashType(auth, type)) return ApiErrors.forbidden();

  try {
    void purgeExpiredTrash().catch((err) => {
      console.error("[GET /api/v1/admin/trash] auto-purge", err);
    });

    const { items, total } = await listTrashItems(type, page, limit);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return apiPaginated(
      items.map((item) => ({
        ...item,
        type,
        deletedAt: item.deletedAt?.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        autoPurgeAt: item.deletedAt ? trashAutoPurgeAt(item.deletedAt).toISOString() : null,
        daysRemaining: item.deletedAt ? trashDaysRemaining(item.deletedAt) : null,
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
