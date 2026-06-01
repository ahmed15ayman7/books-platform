import { describe, expect, it } from "vitest";
import { sanitizeRedirectUrl } from "@/lib/auth/redirect-url";

describe("sanitizeRedirectUrl", () => {
  it("allows valid locale paths", () => {
    expect(sanitizeRedirectUrl("/ar/publish?draft=abc", "/ar")).toBe("/ar/publish?draft=abc");
    expect(sanitizeRedirectUrl("/en/author/submissions", "/en")).toBe("/en/author/submissions");
  });

  it("rejects external and invalid paths", () => {
    expect(sanitizeRedirectUrl("https://evil.com", "/ar")).toBe("/ar");
    expect(sanitizeRedirectUrl("//evil.com", "/ar")).toBe("/ar");
    expect(sanitizeRedirectUrl("/admin/secret", "/ar")).toBe("/ar");
    expect(sanitizeRedirectUrl(null, "/ar")).toBe("/ar");
  });
});
