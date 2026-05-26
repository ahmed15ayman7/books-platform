import { describe, it, expect } from "vitest";
import { slugify, truncate, formatNumber } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils/cn";

describe("cn utility", () => {
  it("merges class names", () => {
    expect(cn("text-red-500", "bg-white")).toBe("text-red-500 bg-white");
  });

  it("resolves Tailwind conflicts", () => {
    const result = cn("px-4", "px-6");
    expect(result).toBe("px-6");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "excluded", "included")).toBe("base included");
  });
});

describe("slugify", () => {
  it("converts to lowercase with hyphens", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(slugify("Book: A Story!")).toBe("book-a-story");
  });

  it("collapses multiple hyphens", () => {
    expect(slugify("A -- B")).toBe("a-b");
  });
});

describe("truncate", () => {
  it("returns string unchanged if within limit", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates and adds ellipsis", () => {
    const result = truncate("Hello World", 7);
    expect(result).toContain("…");
    expect(result.length).toBeLessThanOrEqual(8);
  });
});

describe("formatNumber", () => {
  it("formats number in Arabic locale", () => {
    const result = formatNumber(1247, "ar");
    expect(result).toBeTruthy();
  });

  it("formats number in English locale", () => {
    const result = formatNumber(1247, "en");
    expect(result).toBe("1,247");
  });
});
