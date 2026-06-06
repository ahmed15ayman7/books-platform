import { describe, expect, it } from "vitest";
import {
  normalizeArticleImageUrl,
  resolveArticleDisplayImage,
} from "@/lib/articles/resolve-display-image";

describe("normalizeArticleImageUrl", () => {
  it("accepts valid image URLs", () => {
    expect(normalizeArticleImageUrl("https://example.com/hero.jpg")).toBe(
      "https://example.com/hero.jpg",
    );
  });

  it("rejects empty and placeholder values", () => {
    expect(normalizeArticleImageUrl("")).toBeNull();
    expect(normalizeArticleImageUrl("null")).toBeNull();
    expect(normalizeArticleImageUrl("#")).toBeNull();
  });

  it("rejects non-image page URLs", () => {
    expect(normalizeArticleImageUrl("https://example.com/articles/some-post")).toBeNull();
  });

  it("resolves relative wp upload paths", () => {
    expect(normalizeArticleImageUrl("/wp-content/uploads/cover.jpg")).toBe(
      "https://booksplatform.net/wp-content/uploads/cover.jpg",
    );
  });
});

describe("resolveArticleDisplayImage", () => {
  it("prefers article featured image", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: "https://example.com/hero.jpg",
        bookImageUrls: ["https://example.com/book.jpg"],
        excerpt: "![x](https://example.com/excerpt.jpg)",
      }),
    ).toBe("https://example.com/hero.jpg");
  });

  it("skips invalid featured image and falls back to linked book cover", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: "https://example.com/articles/not-an-image",
        bookImageUrls: ["https://example.com/book.jpg"],
      }),
    ).toBe("https://example.com/book.jpg");
  });

  it("uses the first valid linked book cover", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: null,
        bookImageUrls: [null, "https://example.com/book-2.jpg"],
      }),
    ).toBe("https://example.com/book-2.jpg");
  });

  it("falls back to first image in excerpt", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: null,
        bookImageUrls: [],
        excerpt: '<p>Text</p><img src="https://example.com/in-excerpt.jpg" />',
      }),
    ).toBe("https://example.com/in-excerpt.jpg");
  });

  it("falls back to first image in content when excerpt has none", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: null,
        bookImageUrls: [],
        excerpt: "Plain text only",
        content: "![cover](https://example.com/content.jpg)",
      }),
    ).toBe("https://example.com/content.jpg");
  });

  it("returns null when no image source exists", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: null,
        bookImageUrls: [],
        excerpt: "No images here",
        content: "Still no images",
      }),
    ).toBeNull();
  });
});
