import { describe, expect, it, vi, beforeEach } from "vitest";
import crypto from "node:crypto";

// Mock external dependencies before importing the module under test
vi.mock("@/lib/db", () => ({
  db: {
    uploadedAsset: {
      findUnique: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

vi.mock("@/lib/storage/r2-client", () => ({
  getR2Client: () => ({
    send: vi.fn().mockResolvedValue({}),
  }),
}));

vi.mock("@/lib/storage/r2-config", () => ({
  getR2Config: () => ({
    endpoint: "https://test.r2.cloudflarestorage.com",
    accessKeyId: "test-key",
    secretAccessKey: "test-secret",
    bucket: "test-bucket",
    cdnBaseUrl: "https://cdn.example.com",
  }),
}));

vi.mock("@aws-sdk/client-s3", () => ({
  PutObjectCommand: class PutObjectCommand {
    constructor(public input: unknown) {}
  },
}));

const { db } = await import("@/lib/db");
const { uploadImage, UploadError } = await import("@/lib/storage/upload-image");

function jpegBuffer(): Buffer {
  const buf = Buffer.alloc(20, 0);
  buf[0] = 0xff;
  buf[1] = 0xd8;
  buf[2] = 0xff;
  return buf;
}

function sha256(buf: Buffer): string {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

describe("uploadImage deduplication", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (db.uploadedAsset.upsert as ReturnType<typeof vi.fn>).mockResolvedValue({});
  });

  it("returns existing url when sha256 matches", async () => {
    const buf = jpegBuffer();
    const hash = sha256(buf);
    const existingUrl = "https://cdn.example.com/products/1__image_url.jpg";

    (db.uploadedAsset.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue({
      sha256: hash,
      bucketKey: "products/1__image_url.jpg",
      url: existingUrl,
    });

    const result = await uploadImage({
      buffer: buf,
      declaredMime: "image/jpeg",
      folder: "products",
      field: "image_url",
      originalId: 1,
    });

    expect(result.deduplicated).toBe(true);
    expect(result.url).toBe(existingUrl);
    expect(result.sha256).toBe(hash);
  });

  it("uploads to R2 and creates asset record for new bytes", async () => {
    const buf = jpegBuffer();
    const hash = sha256(buf);

    (db.uploadedAsset.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const result = await uploadImage({
      buffer: buf,
      declaredMime: "image/jpeg",
      folder: "products",
      field: "image_url",
      originalId: 46382,
    });

    expect(result.deduplicated).toBe(false);
    expect(result.url).toBe("https://cdn.example.com/products/46382__image_url.jpg");
    expect(result.key).toBe("products/46382__image_url.jpg");
    expect(result.sha256).toBe(hash);
    expect(db.uploadedAsset.upsert).toHaveBeenCalledOnce();
  });

  it("throws UploadError for files exceeding 5MB", async () => {
    const buf = Buffer.alloc(6 * 1024 * 1024, 0);
    buf[0] = 0xff;
    buf[1] = 0xd8;
    buf[2] = 0xff;

    (db.uploadedAsset.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await expect(
      uploadImage({ buffer: buf, declaredMime: "image/jpeg", folder: "products", field: "image_url", originalId: 1 }),
    ).rejects.toBeInstanceOf(UploadError);
  });

  it("throws UploadError for unsupported mime type", async () => {
    const buf = Buffer.from([0x25, 0x50, 0x44, 0x46]);

    (db.uploadedAsset.findUnique as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    await expect(
      uploadImage({ buffer: buf, declaredMime: "application/pdf", folder: "products", field: "image_url", originalId: 1 }),
    ).rejects.toBeInstanceOf(UploadError);
  });
});
