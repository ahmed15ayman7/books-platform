import crypto from "node:crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { db } from "@/lib/db";
import { getR2Client } from "./r2-client";
import { getR2Config } from "./r2-config";
import { buildObjectKey, type UploadFolder, type UploadField } from "./image-key";

export const ALLOWED_MIMES = ["image/jpeg", "image/png", "image/webp", "image/gif"] as const;
export type AllowedMime = (typeof ALLOWED_MIMES)[number];

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const MAGIC_BYTES: Array<{ mime: AllowedMime; header: number[] }> = [
  { mime: "image/jpeg", header: [0xff, 0xd8, 0xff] },
  { mime: "image/png", header: [0x89, 0x50, 0x4e, 0x47] },
  { mime: "image/webp", header: [0x52, 0x49, 0x46, 0x46] },
  { mime: "image/gif", header: [0x47, 0x49, 0x46, 0x38] },
];

function detectMimeFromBuffer(buf: Buffer): AllowedMime | null {
  for (const { mime, header } of MAGIC_BYTES) {
    if (header.every((b, i) => buf[i] === b)) return mime;
  }
  return null;
}

export interface UploadImageParams {
  buffer: Buffer;
  declaredMime: string;
  folder: UploadFolder;
  field: UploadField;
  /** Integer id (articles, products, publishers) */
  originalId?: number | null;
  /** String cuid (hero slides, draft submissions) */
  entityId?: string | null;
}

export interface UploadImageResult {
  url: string;
  key: string;
  sha256: string;
  deduplicated: boolean;
}

export async function uploadImage(params: UploadImageParams): Promise<UploadImageResult> {
  const { buffer, declaredMime, folder, field, originalId, entityId } = params;

  if (buffer.length > MAX_SIZE_BYTES) {
    throw new UploadError("File too large — maximum 5 MB", "FILE_TOO_LARGE");
  }

  const detected = detectMimeFromBuffer(buffer);
  const mime = (detected ?? declaredMime) as AllowedMime;
  if (!ALLOWED_MIMES.includes(mime)) {
    throw new UploadError("Unsupported image type — use JPEG, PNG, WebP or GIF", "INVALID_MIME");
  }

  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");

  const existing = await db.uploadedAsset.findUnique({ where: { sha256 } });
  if (existing) {
    return { url: existing.url, key: existing.bucketKey, sha256, deduplicated: true };
  }

  const config = getR2Config();
  const key = buildObjectKey({ folder, field, mime, originalId, entityId });
  const url = `${config.cdnBaseUrl}/${key}`;

  const r2 = getR2Client();
  await r2.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: key,
      Body: buffer,
      ContentType: mime,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  await db.uploadedAsset.upsert({
    where: { bucketKey: key },
    create: {
      sha256,
      bucketKey: key,
      url,
      mimeType: mime,
      sizeBytes: buffer.length,
      folder,
      field,
      entityId: entityId ?? null,
      originalId: originalId ?? null,
    },
    update: { sha256, url, mimeType: mime, sizeBytes: buffer.length },
  });

  return { url, key, sha256, deduplicated: false };
}

export class UploadError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "UploadError";
  }
}
