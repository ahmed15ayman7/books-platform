export const R2_CONFIG = {
  endpoint: process.env["R2_ENDPOINT"],
  accessKeyId: process.env["R2_ACCESS_KEY_ID"],
  secretAccessKey: process.env["R2_SECRET_ACCESS_KEY"],
  bucket: process.env["R2_BUCKET"],
  cdnBaseUrl: process.env["CDN_BASE_URL"],
} as const;

export function getR2Config() {
  const { endpoint, accessKeyId, secretAccessKey, bucket, cdnBaseUrl } = R2_CONFIG;
  if (!endpoint || !accessKeyId || !secretAccessKey || !bucket || !cdnBaseUrl) {
    throw new Error(
      "Missing R2 config — set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, CDN_BASE_URL",
    );
  }
  return { endpoint, accessKeyId, secretAccessKey, bucket, cdnBaseUrl };
}
