"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { normalizeImageSrc } from "./normalize-image-url";
import { resolveArticleImageSrc } from "./article-media-url";
import { resolveLinkLabel } from "./normalize-article-source";
import { parseArticleContent } from "./parse-article-content";

function ExternalLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="font-medium text-[var(--brand-red)] underline underline-offset-2 hover:text-[var(--brand-red-hover)]"
      rel="noopener noreferrer"
      target="_blank"
    >
      {label}
    </a>
  );
}

function createInlineRegex(): RegExp {
  return /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|\*\*([\s\S]+?)\*\*|__([\s\S]+?)__|\*([^*]+?)\*|_([^_]+?)_/g;
}

function renderInlineLink(
  href: string,
  label: string,
  key: number,
  compact?: boolean,
): ReactNode {
  const imageSrc = resolveArticleImageSrc(href);
  if (imageSrc) {
    return (
      <InlineArticleImage key={key} src={imageSrc} alt={label || "صورة"} compact={compact} />
    );
  }
  return <ExternalLink key={key} href={href} label={resolveLinkLabel(label, href)} />;
}

function inlineFormat(text: string): ReactNode[] {
  let key = 0;

  function parseSegment(segment: string): ReactNode[] {
    const parts: ReactNode[] = [];
    const inlineRe = createInlineRegex();
    let last = 0;
    let m: RegExpExecArray | null;

    while ((m = inlineRe.exec(segment)) !== null) {
      if (m.index > last) parts.push(segment.slice(last, m.index));

      if (m[1] !== undefined && m[2] !== undefined) {
        parts.push(renderInlineLink(m[2].trim(), m[1].trim(), key++, true));
      } else if (m[3] !== undefined && m[4] !== undefined) {
        parts.push(renderInlineLink(m[4].trim(), m[3].trim(), key++));
      } else if (m[5] !== undefined) {
        parts.push(
          <strong key={key++} className="font-bold text-[var(--brand-gray-900)]">
            {parseSegment(m[5])}
          </strong>,
        );
      } else if (m[6] !== undefined) {
        parts.push(
          <strong key={key++} className="font-bold text-[var(--brand-gray-900)]">
            {parseSegment(m[6])}
          </strong>,
        );
      } else if (m[7] !== undefined) {
        parts.push(
          <em key={key++} className="italic">
            {parseSegment(m[7])}
          </em>,
        );
      } else if (m[8] !== undefined) {
        parts.push(
          <em key={key++} className="italic">
            {parseSegment(m[8])}
          </em>,
        );
      }

      last = m.index + m[0].length;
      inlineRe.lastIndex = last;
    }

    if (last < segment.length) parts.push(segment.slice(last));
    return parts.length ? parts : [segment];
  }

  return parseSegment(text);
}

function InlineArticleImage({
  src,
  alt,
  caption,
  compact,
}: {
  src: string;
  alt: string;
  caption?: string;
  compact?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const resolvedSrc = resolveArticleImageSrc(src) ?? normalizeImageSrc(src) ?? src;
  const figcaption = caption ?? (alt !== "صورة" && alt !== "image" ? alt : null);

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
      {figcaption && (
        <figcaption className="mt-2 text-sm text-[var(--brand-gray-500)]">{figcaption}</figcaption>
      )}
    </figure>
  );
}

interface ArticleContentProps {
  content: string;
  className?: string;
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  const blocks = useMemo(() => parseArticleContent(content), [content]);
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
                className="text-lg leading-[1.9] text-[var(--brand-gray-800)] md:text-xl"
              >
                {inlineFormat(block.text)}
              </p>
            );
          case "list":
            return (
              <ul key={index} className="my-3 list-disc space-y-2 ps-6 md:text-xl">
                {block.items.map((item, i) => (
                  <li key={i} className="text-lg leading-relaxed text-[var(--brand-gray-700)] md:text-xl">
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
                caption={block.caption}
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
