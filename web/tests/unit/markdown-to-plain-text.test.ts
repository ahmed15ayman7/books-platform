import { describe, expect, it } from "vitest";
import { markdownExcerpt, markdownToPlainText } from "@/lib/markdown/markdown-to-plain-text";

describe("markdownToPlainText", () => {
  it("strips headings, bold, links, and list markers", () => {
    const input = "## عن الدار\n\n**ناشر عالمي** يقدم [موقعنا](https://example.com)\n\n- كتب\n- ترجمات";
    expect(markdownToPlainText(input)).toBe(
      "عن الدار ناشر عالمي يقدم موقعنا كتب ترجمات",
    );
  });

  it("returns excerpt with ellipsis", () => {
    const input = "**Hello** world ".repeat(20);
    const excerpt = markdownExcerpt(input, 40);
    expect(excerpt.endsWith("…")).toBe(true);
    expect(excerpt.length).toBeLessThanOrEqual(41);
  });
});
