import { describe, expect, it } from "vitest";
import { isImageUrl } from "@/lib/markdown/is-image-url";
import { htmlToArticleSource, parseArticleContent } from "@/lib/markdown/parse-article-content";

describe("isImageUrl", () => {
  it("detects common image extensions", () => {
    expect(isImageUrl("https://example.com/photo.jpg")).toBe(true);
    expect(isImageUrl("https://example.com/photo.webp?size=large")).toBe(true);
    expect(isImageUrl("https://example.com/page.html")).toBe(false);
  });

  it("detects wp upload paths", () => {
    expect(isImageUrl("https://booksplatform.net/wp-content/uploads/book.jpeg")).toBe(true);
  });

  it("detects Google thumbnail CDN URLs without file extension", () => {
    expect(
      isImageUrl(
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0eH9-QMCxNn0rQWmiQ2y_IcWWK2EskO7V3w&s",
      ),
    ).toBe(true);
  });
});

describe("parseArticleContent", () => {
  it("parses markdown image syntax", () => {
    const blocks = parseArticleContent("Intro\n\n![cover](https://example.com/a.jpg)\n\nOutro");
    expect(blocks.some((b) => b.type === "image" && b.src.includes("a.jpg"))).toBe(true);
    expect(blocks.some((b) => b.type === "paragraph" && b.text === "Intro")).toBe(true);
  });

  it("turns image links into image blocks", () => {
    const blocks = parseArticleContent("[https://example.com/pic.png](https://example.com/pic.png)");
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({ type: "image", src: "https://example.com/pic.png" });
  });

  it("converts bare image URLs on their own line", () => {
    const blocks = parseArticleContent("Text\n\nhttps://example.com/x.webp\n\nMore");
    const images = blocks.filter((b) => b.type === "image");
    expect(images).toHaveLength(1);
    expect(images[0]).toMatchObject({ src: "https://example.com/x.webp" });
  });

  it("converts HTML img tags via htmlToArticleSource", () => {
    const source = htmlToArticleSource('<p>Hello</p><img src="https://example.com/a.jpg" />');
    const blocks = parseArticleContent(source);
    expect(blocks.some((b) => b.type === "image")).toBe(true);
  });

  it("converts HTML anchor image links", () => {
    const source = htmlToArticleSource(
      '<a href="https://example.com/photo.jpg">View</a>',
    );
    const blocks = parseArticleContent(source);
    expect(blocks[0]).toMatchObject({ type: "image" });
  });

  it("renders gstatic thumbnail as image block", () => {
    const url =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ0eH9-QMCxNn0rQWmiQ2y_IcWWK2EskO7V3w&s";
    const blocks = parseArticleContent(`${url}`);
    expect(blocks[0]).toMatchObject({ type: "image", src: url });
  });

  it("preserves bold from HTML strong tags", () => {
    const source = htmlToArticleSource("<p>Hello <strong>world</strong></p>");
    const blocks = parseArticleContent(source);
    expect(blocks.some((b) => b.type === "paragraph" && b.text.includes("**world**"))).toBe(true);
  });

  it("parses markdown headings", () => {
    const blocks = parseArticleContent("## Section title\n\nBody text");
    expect(blocks[0]).toMatchObject({ type: "heading", level: 2, text: "Section title" });
  });
});
