import type { UserPasskey } from "@prisma/client";

export function passkeyToWebAuthnCredential(row: UserPasskey) {
  return {
    id: row.credentialId,
    publicKey: Buffer.from(row.publicKey, "base64url"),
    counter: Number(row.counter),
    transports: [] as AuthenticatorTransport[],
  };
}

export function encodePublicKey(buffer: Uint8Array): string {
  return Buffer.from(buffer).toString("base64url");
}
