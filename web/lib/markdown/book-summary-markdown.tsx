import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Lightweight Markdown subset for book summaries (headings, bold, italic, lists, links). */
function inlineFormat(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      parts.push(text.slice(last, m.index));
    }
    const token = m[0];
    if (token.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-bold text-[var(--brand-gray-900)]">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*")) {
      parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
    } else if (token.startsWith("[")) {
      const linkMatch = /\[([^\]]+)\]\(([^)]+)\)/.exec(token);
      if (linkMatch) {
        parts.push(
          <a
            key={key++}
            href={linkMatch[2]}
            className="font-medium text-[var(--brand-red)] underline underline-offset-2 hover:text-[var(--brand-red-hover)]"
            rel="noopener noreferrer"
            target="_blank"
          >
            {linkMatch[1]}
          </a>,
        );
      }
    }
    last = m.index + token.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : [text];
}

function parseBlock(line: string): { type: "h1" | "h2" | "h3" | "li" | "p"; text: string } {
  const t = line.trim();
  if (t.startsWith("### ")) return { type: "h3", text: t.slice(4) };
  if (t.startsWith("## ")) return { type: "h2", text: t.slice(3) };
  if (t.startsWith("# ")) return { type: "h1", text: t.slice(2) };
  if (t.startsWith("- ") || t.startsWith("* ")) return { type: "li", text: t.slice(2) };
  return { type: "p", text: t };
}

interface BookSummaryMarkdownProps {
  content: string;
  className?: string;
}

export function BookSummaryMarkdown({ content, className }: BookSummaryMarkdownProps) {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) return null;

  const looksLikeHtml = /<[a-z][\s\S]*>/i.test(normalized);
  const source = looksLikeHtml
    ? normalized.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
    : normalized;

  const blocks = source.split(/\n\n+/);
  const nodes: ReactNode[] = [];
  let key = 0;

  blocks.forEach((block) => {
    const lines = block.split("\n").filter((l) => l.trim());
    if (lines.length === 0) return;

    const allList = lines.every((l) => /^[-*]\s/.test(l.trim()));
    if (allList) {
      nodes.push(
        <ul key={key++} className="my-3 list-disc space-y-1.5 ps-5 text-lg leading-relaxed">
          {lines.map((line, i) => (
            <li key={i} className="text-[var(--brand-gray-700)]">
              {inlineFormat(line.trim().replace(/^[-*]\s/, ""))}
            </li>
          ))}
        </ul>,
      );
      return;
    }

    lines.forEach((line) => {
      const { type, text } = parseBlock(line);
      if (!text) return;
      const inner = inlineFormat(text);
      switch (type) {
        case "h1":
          nodes.push(
            <h3
              key={key++}
              className="mt-4 mb-2 text-xl font-bold text-[var(--brand-red)] first:mt-0"
            >
              {inner}
            </h3>,
          );
          break;
        case "h2":
          nodes.push(
            <h4
              key={key++}
              className="mt-4 mb-2 text-xl font-bold text-[var(--brand-red)] first:mt-0"
            >
              {inner}
            </h4>,
          );
          break;
        case "h3":
          nodes.push(
            <h5
              key={key++}
              className="mt-3 mb-1.5 text-lg font-bold text-[var(--brand-gray-900)]"
            >
              {inner}
            </h5>,
          );
          break;
        case "li":
          nodes.push(
            <ul key={key++} className="my-2 list-disc ps-5">
              <li className="text-lg leading-relaxed text-[var(--brand-gray-700)]">{inner}</li>
            </ul>,
          );
          break;
        default:
          nodes.push(
            <p key={key++} className="text-lg leading-relaxed text-[var(--brand-gray-700)]">
              {inner}
            </p>,
          );
      }
    });
  });

  return (
    <div className={cn("book-summary-prose space-y-1", className)} dir="auto">
      {nodes}
    </div>
  );
}
