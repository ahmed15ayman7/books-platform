import { describe, expect, it } from "vitest";
import { isImageUrl } from "@/lib/markdown/is-image-url";
import { htmlToArticleSource, parseArticleContent } from "@/lib/markdown/parse-article-content";
import {
  linkLabelFromUrl,
} from "@/lib/markdown/normalize-article-source";

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

  it("parses h4 headings", () => {
    const blocks = parseArticleContent("#### Section title\n\nBody text");
    expect(blocks[0]).toMatchObject({ type: "heading", level: 4, text: "Section title" });
  });

  it("keeps prose with inline markdown images as paragraphs", () => {
    const line =
      "الشغب الأبيض ![](https://booksplatform.net/wp-content/uploads/Gord-Hil-1-300x240.jpg) نبدأ من قلب فانكوفر";
    const blocks = parseArticleContent(`${line}\n\n### خاتمة`);
    expect(blocks[0]).toMatchObject({ type: "paragraph", text: line });
  });

  it("normalizes relative wp upload paths in image blocks", () => {
    const blocks = parseArticleContent("/wp-content/uploads/cover-11-224x300.jpg");
    expect(blocks[0]).toMatchObject({
      type: "image",
      src: "https://booksplatform.net/wp-content/uploads/cover-11-224x300.jpg",
    });
  });

  it("skips markdown horizontal rules", () => {
    const blocks = parseArticleContent("Intro\n\n* * *\n\nOutro");
    expect(blocks.map((b) => b.type)).toEqual(["paragraph", "paragraph"]);
  });

  it("does not treat prose containing wp-content as a bare image URL", () => {
    expect(
      isImageUrl(
        "الشغب الأبيض ![](https://booksplatform.net/wp-content/uploads/Gord-Hil-1-300x240.jpg) نبدأ",
      ),
    ).toBe(false);
  });

  it("strips escaped WordPress caption shortcodes and keeps caption text", () => {
    const raw =
      '\\[caption id="attachment_53526" align="aligncenter" width="320"\\] Immanuel Kant\\[/caption\\]\n\n![](https://example.com/kant.jpg)';
    const blocks = parseArticleContent(raw);
    expect(blocks.some((b) => b.type === "paragraph" && b.text.includes("*Immanuel Kant*"))).toBe(
      true,
    );
    expect(blocks.some((b) => b.type === "image")).toBe(true);
  });

  it("converts caption shortcode with embedded img to image block", () => {
    const raw =
      '[caption id="53526"]<img src="/wp-content/uploads/kant.jpg" /> Immanuel Kant[/caption]';
    const blocks = parseArticleContent(raw);
    expect(blocks).toHaveLength(1);
    expect(blocks[0]).toMatchObject({
      type: "image",
      alt: "Immanuel Kant",
      caption: "Immanuel Kant",
      src: "https://booksplatform.net/wp-content/uploads/kant.jpg",
    });
  });

  it("linkifies parenthesized encoded Wikipedia URLs", () => {
    const url =
      "https://ar.wikipedia.org/wiki/%D8%A5%D9%8A%D9%85%D8%A7%D9%86%D9%88%D9%8A%D9%84_%D9%83%D8%A7%D9%86%D8%B7";
    const blocks = parseArticleContent(`اقرأ المزيد (${url}) عن الفيلسوف.`);
    expect(blocks[0]).toMatchObject({ type: "paragraph" });
    const text = (blocks[0] as { text: string }).text;
    expect(text).toContain(`[${linkLabelFromUrl(url)}](${url})`);
    expect(linkLabelFromUrl(url)).toBe("إيمانويل كانط");
  });

  it("linkifies Wikipedia URLs without a closing parenthesis", () => {
    const url =
      "https://ar.wikipedia.org/wiki/%D8%A5%D9%8A%D9%85%D8%A7%D9%86%D9%88%D9%8A%D9%84_%D9%83%D8%A7%D9%86%D8%B7";
    const blocks = parseArticleContent(`اقرأ (${url} عن الفيلسوف.`);
    const text = (blocks[0] as { text: string }).text;
    expect(text).toContain(`[${linkLabelFromUrl(url)}](${url})`);
  });

  it("turns markdown-image syntax with external URLs into text links", () => {
    const url =
      "https://ar.wikipedia.org/wiki/%D8%A5%D9%8A%D9%85%D8%A7%D9%86%D9%88%D9%8A%D9%84_%D9%83%D8%A7%D9%86%D8%B7";
    const blocks = parseArticleContent(`![فيلسوف](${url})`);
    expect(blocks[0]).toMatchObject({
      type: "paragraph",
      text: `[فيلسوف](${url})`,
    });
  });
});
