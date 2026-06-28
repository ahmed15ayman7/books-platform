import { describe, it, expect } from "vitest";
import { headersForMultipartUpload } from "@/lib/http/upload-headers";

describe("headersForMultipartUpload", () => {
  it("removes Content-Type from plain object headers", () => {
    const result = headersForMultipartUpload({
      Authorization: "Bearer token",
      "Content-Type": "application/json",
      "X-Draft-Token": "draft-abc",
    }) as Record<string, string>;

    expect(result.Authorization).toBe("Bearer token");
    expect(result["X-Draft-Token"]).toBe("draft-abc");
    expect(result["Content-Type"]).toBeUndefined();
  });

  it("removes content-type regardless of casing", () => {
    const result = headersForMultipartUpload({
      "content-type": "application/json",
      Authorization: "Bearer x",
    }) as Record<string, string>;

    expect(result.Authorization).toBe("Bearer x");
    expect(Object.keys(result)).not.toContain("content-type");
  });

  it("removes Content-Type from Headers instance", () => {
    const input = new Headers({
      Authorization: "Bearer token",
      "Content-Type": "application/json",
    });
    const result = headersForMultipartUpload(input) as Headers;

    expect(result.get("Authorization")).toBe("Bearer token");
    expect(result.get("Content-Type")).toBeNull();
  });

  it("removes Content-Type from tuple array headers", () => {
    const result = headersForMultipartUpload([
      ["Authorization", "Bearer token"],
      ["Content-Type", "application/json"],
    ]) as [string, string][];

    expect(result).toEqual([["Authorization", "Bearer token"]]);
  });

  it("returns undefined when headers are omitted", () => {
    expect(headersForMultipartUpload(undefined)).toBeUndefined();
  });
});

describe("authUploadHeaders", () => {
  it("does not include Content-Type", async () => {
    const { authUploadHeaders } = await import("@/lib/auth/author-client");
    const headers = authUploadHeaders() as Record<string, string>;
    expect(headers["Content-Type"]).toBeUndefined();
    expect(headers["content-type"]).toBeUndefined();
  });
});
