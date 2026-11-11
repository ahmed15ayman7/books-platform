import { describe, expect, it } from "vitest";
import { newsletterFailureKey } from "@/components/sections/newsletter-strip";

describe("newsletterFailureKey", () => {
  it("returns mailFailed only for the welcome-mail code", () => {
    expect(
      newsletterFailureKey({
        success: false,
        error: { code: "WELCOME_MAIL_FAILED", message: "Could not send the confirmation email. Please try again." },
      }),
    ).toBe("mailFailed");
  });

  it("returns error for a rejected address", () => {
    expect(
      newsletterFailureKey({ success: false, error: { code: "VALIDATION_ERROR", message: "Validation failed" } }),
    ).toBe("error");
  });

  it("returns error for another 500", () => {
    expect(
      newsletterFailureKey({ success: false, error: { code: "INTERNAL_ERROR", message: "Internal server error" } }),
    ).toBe("error");
  });

  it("returns error when rate limited", () => {
    expect(
      newsletterFailureKey({ success: false, error: { code: "RATE_LIMITED", message: "Too many requests" } }),
    ).toBe("error");
  });

  it("returns error when the body is not a JSON object", () => {
    expect(newsletterFailureKey(null)).toBe("error");
    expect(newsletterFailureKey("not json")).toBe("error");
    expect(newsletterFailureKey(undefined)).toBe("error");
  });
});
