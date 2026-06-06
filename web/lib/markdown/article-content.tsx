"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { isImageUrl } from "./is-image-url";
import { normalizeImageSrc } from "./normalize-image-url";
import { parseArticleContent } from "./parse-article-content";

const INLINE_TOKEN =
  /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*|_[^_]+_)/g;

function inlineFormat(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;

  while ((m = INLINE_TOKEN.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));

    if (m[1] !== undefined && m[2] !== undefined) {
      const src = normalizeImageSrc(m[2].trim()) ?? m[2].trim();
      parts.push(
        <InlineArticleImage key={key++} src={src} alt={m[1].trim() || "صورة"} compact />,
      );
    } else if (m[3] !== undefined && m[4] !== undefined) {
      const label = m[3].trim();
      const href = normalizeImageSrc(m[4].trim()) ?? m[4].trim();
      if (isImageUrl(href)) {
        parts.push(
          <InlineArticleImage key={key++} src={href} alt={label || "صورة"} compact />,
        );
      } else {
        parts.push(
          <a
            key={key++}
            href={href}
            className="font-medium text-[var(--brand-red)] underline underline-offset-2 hover:text-[var(--brand-red-hover)]"
            rel="noopener noreferrer"
            target="_blank"
          >
            {label || href}
          </a>,
        );
      }
    } else if (m[5]) {
      const token = m[5];
      if (token.startsWith("**") || token.startsWith("__")) {
        parts.push(
          <strong key={key++} className="font-bold text-[var(--brand-gray-900)]">
            {token.slice(2, -2)}
          </strong>,
        );
      } else {
        parts.push(<em key={key++}>{token.slice(1, -1)}</em>);
      }
    }

    last = m.index + m[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : [text];
}

function InlineArticleImage({
  src,
  alt,
  compact,
}: {
  src: string;
  alt: string;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = normalizeImageSrc(src) ?? src;

  return (
    <figure className={cn("my-6 w-full text-center", compact && "my-4")}>
      <div
        className={cn(
          "relative mx-auto overflow-hidden rounded-lg border border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)]",
          compact ? "max-w-[min(100%,420px)] max-h-[500px]" : "max-w-[min(100%,520px)] max-h-[500px]",
        )}
      >
        {!failed ? (
          // Native img — article URLs are external/dynamic (gstatic, wp, etc.)
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedSrc}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="h-auto w-full object-contain max-h-[500px]"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="flex min-h-[120px] items-center justify-center px-4 py-8 text-sm text-[var(--brand-gray-500)]">
            {alt || "صورة"}
          </div>
        )}
      </div>
      {alt && alt !== "صورة" && alt !== "image" && (
        <figcaption className="mt-2 text-sm text-[var(--brand-gray-500)]">{alt}</figcaption>
      )}
    </figure>
  );
}

interface ArticleContentProps {
  content: string;
  className?: string;
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  const blocks = parseArticleContent(content);
  if (blocks.length === 0) return null;

  return (
    <article className={cn("article-prose prose-brand space-y-5", className)}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading": {
            const inner = inlineFormat(block.text);
            const headingClass: Record<number, string> = {
              1: "mt-10 mb-4 font-display text-3xl font-bold text-[var(--brand-gray-900)] first:mt-0 md:text-4xl",
              2: "mt-8 mb-3 font-display text-2xl font-bold text-[var(--brand-red)] first:mt-0 md:text-3xl",
              3: "mt-7 mb-3 text-xl font-bold text-[var(--brand-gray-900)] first:mt-0 md:text-2xl",
              4: "mt-6 mb-2 text-lg font-bold text-[var(--brand-gray-900)] first:mt-0 md:text-xl",
              5: "mt-5 mb-2 text-base font-bold text-[var(--brand-gray-900)] first:mt-0 md:text-lg",
              6: "mt-4 mb-2 text-sm font-bold uppercase tracking-wide text-[var(--brand-gray-700)] first:mt-0",
            };
            const Tag = (`h${Math.min(block.level, 6)}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6");
            return (
              <Tag key={index} className={headingClass[block.level] ?? headingClass[4]}>
                {inner}
              </Tag>
            );
          }
          case "paragraph":
            return (
              <p
                key={index}
                className="text-base leading-[1.9] text-[var(--brand-gray-800)] md:text-[17px]"
              >
                {inlineFormat(block.text)}
              </p>
            );
          case "list":
            return (
              <ul key={index} className="my-3 list-disc space-y-2 ps-6 md:text-lg">
                {block.items.map((item, i) => (
                  <li key={i} className="text-base leading-relaxed text-[var(--brand-gray-700)]">
                    {inlineFormat(item)}
                  </li>
                ))}
              </ul>
            );
          case "image":
            return (
              <InlineArticleImage
                key={index}
                src={block.src}
                alt={block.alt}
              />
            );
          case "html":
            return (
              <div
                key={index}
                className="prose-brand"
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            );
          default:
            return null;
        }
      })}
    </article>
  );
}
