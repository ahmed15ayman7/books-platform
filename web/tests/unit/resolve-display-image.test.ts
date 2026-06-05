import { describe, expect, it } from "vitest";
import { resolveArticleDisplayImage } from "@/lib/articles/resolve-display-image";

describe("resolveArticleDisplayImage", () => {
  it("prefers article featured image", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: "https://example.com/hero.jpg",
        bookImageUrl: "https://example.com/book.jpg",
        excerpt: "![x](https://example.com/excerpt.jpg)",
      }),
    ).toBe("https://example.com/hero.jpg");
  });

  it("falls back to linked book cover", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: null,
        bookImageUrl: "https://example.com/book.jpg",
        excerpt: "![x](https://example.com/excerpt.jpg)",
      }),
    ).toBe("https://example.com/book.jpg");
  });

  it("falls back to first image in excerpt", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: null,
        bookImageUrl: null,
        excerpt: '<p>Text</p><img src="https://example.com/in-excerpt.jpg" />',
      }),
    ).toBe("https://example.com/in-excerpt.jpg");
  });

  it("falls back to first image in content when excerpt has none", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: null,
        bookImageUrl: null,
        excerpt: "Plain text only",
        content: "![cover](https://example.com/content.jpg)",
      }),
    ).toBe("https://example.com/content.jpg");
  });

  it("returns null when no image source exists", () => {
    expect(
      resolveArticleDisplayImage({
        imageUrl: null,
        bookImageUrl: null,
        excerpt: "No images here",
        content: "Still no images",
      }),
    ).toBeNull();
  });
});
