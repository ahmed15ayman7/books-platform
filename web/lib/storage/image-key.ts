export const UPLOAD_FOLDERS = ["articles", "products", "publishers", "hero", "submissions"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const UPLOAD_FIELDS = ["image_url", "image_featured", "foreground_image_url"] as const;
export type UploadField = (typeof UPLOAD_FIELDS)[number];

const MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

interface KeyParams {
  folder: UploadFolder;
  field: UploadField;
  mime: string;
  /** Integer originalId used for articles, products, publishers */
  originalId?: number | null;
  /** String entity id (cuid) used for hero slides, draft submissions */
  entityId?: string | null;
}

export function buildObjectKey({ folder, field, mime, originalId, entityId }: KeyParams): string {
  const ext = MIME_TO_EXT[mime] ?? "jpg";
  const id = originalId != null ? String(originalId) : (entityId ?? "unknown");
  return `${folder}/${id}__${field}.${ext}`;
}

export function isValidFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function isValidField(value: string): value is UploadField {
  return (UPLOAD_FIELDS as readonly string[]).includes(value);
}
