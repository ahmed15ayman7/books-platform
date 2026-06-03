import { type NextRequest } from "next/server";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAdminAuth, isAdminAuthError } from "@/lib/auth/rbac";
import {
  countTrashAndDrafts,
  getAccessibleDraftTypes,
  getAccessibleTrashTypes,
} from "@/lib/admin/content-hub";

export async function GET(request: NextRequest) {
  const auth = await requireAdminAuth(request);
  if (isAdminAuthError(auth)) return auth;

  try {
    const counts = await countTrashAndDrafts(auth);
    return apiSuccess({
      ...counts,
      trashTypes: getAccessibleTrashTypes(auth),
      draftTypes: getAccessibleDraftTypes(auth),
    });
  } catch (error) {
    console.error("[GET /api/v1/admin/hub-counts]", error);
    return ApiErrors.internal();
  }
}
