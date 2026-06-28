import { type NextRequest } from "next/server";
import { apiSuccess, ApiErrors } from "@/lib/api-client/response";
import { requireAuth, isErrorResponse } from "@/lib/auth/middleware";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { uploadImage, UploadError, ALLOWED_MIMES } from "@/lib/storage/upload-image";
import { isValidFolder, isValidField, type UploadFolder } from "@/lib/storage/image-key";
import type { Permission } from "@/lib/auth/permissions";

const FOLDER_PERMISSIONS: Record<UploadFolder, Permission> = {
  articles: PERMISSIONS.articles.update,
  products: PERMISSIONS.books.update,
  publishers: PERMISSIONS.publishers.update,
  hero: PERMISSIONS.hero.update,
  submissions: PERMISSIONS.submissions.view,
};

export async function POST(request: NextRequest) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return ApiErrors.badRequest("Expected multipart/form-data");
  }

  const folder = formData.get("folder");
  const field = formData.get("field");
  const file = formData.get("file");
  const originalIdRaw = formData.get("originalId");
  const entityId = formData.get("entityId");

  if (typeof folder !== "string" || !isValidFolder(folder)) {
    return ApiErrors.badRequest(
      `Invalid folder — must be one of: articles, products, publishers, hero, submissions`,
    );
  }

  if (typeof field !== "string" || !isValidField(field)) {
    return ApiErrors.badRequest(
      `Invalid field — must be one of: image_url, image_featured, foreground_image_url`,
    );
  }

  const permission = FOLDER_PERMISSIONS[folder];
  const auth = await requireAuth(request, "ADMIN", permission);
  if (isErrorResponse(auth)) return auth;

  if (!(file instanceof File)) {
    return ApiErrors.badRequest("Missing file field");
  }

  const declaredMime = file.type || "application/octet-stream";
  if (!(ALLOWED_MIMES as readonly string[]).includes(declaredMime)) {
    return ApiErrors.badRequest(
      `Unsupported file type "${declaredMime}" — upload JPEG, PNG, WebP or GIF`,
    );
  }

  const originalId =
    originalIdRaw !== null && originalIdRaw !== ""
      ? parseInt(String(originalIdRaw), 10)
      : null;
  const resolvedEntityId =
    entityId !== null && entityId !== "" ? String(entityId) : null;

  if (originalId === null && !resolvedEntityId) {
    return ApiErrors.badRequest("Provide originalId (number) or entityId (string)");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const result = await uploadImage({
      buffer,
      declaredMime,
      folder,
      field,
      originalId: isNaN(originalId!) ? null : originalId,
      entityId: resolvedEntityId,
    });

    return apiSuccess(result);
  } catch (err) {
    if (err instanceof UploadError) {
      return ApiErrors.badRequest(err.message);
    }
    console.error("[POST /api/v1/admin/uploads/image]", err);
    return ApiErrors.internal();
  }
}
