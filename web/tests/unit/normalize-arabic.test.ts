import { describe, it, expect } from "vitest";
import { normalizeArabic } from "@/lib/i18n/normalize-arabic";

describe("normalizeArabic", () => {
  it("matches alef variants", () => {
    expect(normalizeArabic("لغات وآداب")).toBe(normalizeArabic("لغات واداب"));
  });

  it("matches taa marbuta and haa", () => {
    expect(normalizeArabic("مرشحة")).toBe(normalizeArabic("مرشحه"));
  });

  it("trims and lowercases", () => {
    expect(normalizeArabic("  تقنيات وعلوم  ")).toBe("تقنيات وعلوم");
  });
});
