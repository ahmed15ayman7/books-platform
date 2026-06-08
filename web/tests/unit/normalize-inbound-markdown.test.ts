import { describe, expect, it } from "vitest";
import {
  normalizeInboundMarkdown,
  normalizeOutboundMarkdown,
} from "@/lib/markdown/normalize-inbound-markdown";
import { parseArticleContent } from "@/lib/markdown/parse-article-content";

describe("normalizeInboundMarkdown", () => {
  it("returns empty string for blank input", () => {
    expect(normalizeInboundMarkdown("")).toBe("");
    expect(normalizeInboundMarkdown("   ")).toBe("");
  });

  it("passes through plain markdown", () => {
    const md = "## عنوان\n\n**نص عريض**";
    expect(normalizeInboundMarkdown(md)).toBe(md);
  });

  it("converts legacy HTML to markdown-friendly text", () => {
    const html = "<h2>عنوان</h2><p>فقرة <strong>مهمة</strong></p>";
    const result = normalizeInboundMarkdown(html);
    expect(result).toContain("##");
    expect(result).toContain("**مهمة**");
    expect(parseArticleContent(result).some((b) => b.type === "heading")).toBe(true);
  });
});

describe("normalizeOutboundMarkdown", () => {
  it("collapses excessive blank lines", () => {
    expect(normalizeOutboundMarkdown("أول\n\n\n\nثاني")).toBe("أول\n\nثاني");
  });

  it("trims surrounding whitespace", () => {
    expect(normalizeOutboundMarkdown("  \nنص\n  ")).toBe("نص");
  });
});

describe("article markdown round-trip compatibility", () => {
  const sample = [
    "## عنوان فرعي",
    "",
    "فقرة فيها **كلمة عريضة** و*مائلة*.",
    "",
    "- عنصر أول",
    "- عنصر ثاني",
    "",
    "[رابط](https://example.com)",
    "",
    "![صورة](https://example.com/photo.jpg)",
  ].join("\n");

  it("parses representative admin markdown into expected blocks", () => {
    const blocks = parseArticleContent(sample);
    expect(blocks.some((b) => b.type === "heading" && b.level === 2)).toBe(true);
    expect(blocks.some((b) => b.type === "paragraph")).toBe(true);
    expect(blocks.some((b) => b.type === "list" && b.items.length === 2)).toBe(true);
    expect(blocks.some((b) => b.type === "image")).toBe(true);
  });
});
