import { describe, expect, it } from "vitest";
import { normalizeMarkdownHardBreaks } from "@/lib/markdown/normalize-article-source";
import { parseArticleContent } from "@/lib/markdown/parse-article-content";

describe("normalizeMarkdownHardBreaks", () => {
  it("converts trailing backslash line breaks into paragraph gaps", () => {
    const input = "First paragraph\\ \nSecond paragraph\\ \nThird paragraph";
    expect(normalizeMarkdownHardBreaks(input)).toBe(
      "First paragraph\n\nSecond paragraph\n\nThird paragraph",
    );
  });

  it("removes lines that contain only a backslash", () => {
    expect(normalizeMarkdownHardBreaks("Line one\\\n\\\nLine two")).toBe("Line one\n\nLine two");
  });
});

describe("book description markdown rendering", () => {
  it("parses multi-line bold and hard breaks from the admin editor", () => {
    const source = [
      "**Based on Harvard's program, Manage Yourself to Lead Others provides guidance.**\\ ",
      "What is the best way to lead others?",
      "",
      "The basis for powerful leadership is *The Long Game*.",
    ].join("\n");

    const blocks = parseArticleContent(source);
    const paragraphs = blocks.filter((b) => b.type === "paragraph");

    expect(paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(paragraphs[0]?.type === "paragraph" && paragraphs[0].text).toContain("**Based on Harvard's");
    expect(paragraphs.some((b) => b.type === "paragraph" && b.text.includes("*The Long Game*"))).toBe(
      true,
    );
  });
});
