import { S3Client } from "@aws-sdk/client-s3";
import { getR2Config } from "./r2-config";

let client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (!client) {
    const { endpoint, accessKeyId, secretAccessKey } = getR2Config();
    client = new S3Client({
      region: "auto",
      endpoint,
      credentials: { accessKeyId, secretAccessKey },
    });
  }
  return client;
}
