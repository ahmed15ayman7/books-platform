"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import { ArticleContent } from "@/lib/markdown/article-content";
import { cn } from "@/lib/utils";

interface ArticleLivePreviewProps {
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  body: string;
  bodyEn?: string;
  imageUrl?: string;
  className?: string;
}

export function ArticleLivePreview({
  title,
  titleEn,
  excerpt,
  excerptEn,
  body,
  bodyEn,
  imageUrl,
  className,
}: ArticleLivePreviewProps) {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  const displayTitle = lang === "ar" ? title : titleEn || title;
  const displayExcerpt = lang === "ar" ? excerpt : excerptEn || excerpt;
  const displayBody = lang === "ar" ? body : bodyEn || body;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--admin-border)] bg-[var(--brand-gray-50)]",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-subtle)]">
          <Eye className="h-4 w-4" aria-hidden="true" />
          معاينة المقال
        </div>
        <div className="flex rounded-lg border border-[var(--admin-border)] p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setLang("ar")}
            className={cn(
              "rounded-md px-2.5 py-1 transition-colors",
              lang === "ar"
                ? "bg-[var(--admin-accent)] text-white"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]",
            )}
          >
            عربي
          </button>
          <button
            type="button"
            onClick={() => setLang("en")}
            className={cn(
              "rounded-md px-2.5 py-1 transition-colors",
              lang === "en"
                ? "bg-[var(--admin-accent)] text-white"
                : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]",
            )}
          >
            EN
          </button>
        </div>
      </div>

      <div className="max-h-[70vh] overflow-y-auto p-5" dir={lang === "ar" ? "rtl" : "ltr"}>
        {imageUrl && (
          <div className="relative mb-5 aspect-video overflow-hidden rounded-lg bg-[var(--brand-gray-200)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          </div>
        )}

        {displayTitle ? (
          <h1 className="font-display text-xl font-bold leading-snug text-[var(--brand-gray-900)]">
            {displayTitle}
          </h1>
        ) : (
          <p className="text-sm italic text-[var(--brand-gray-400)]">العنوان يظهر هنا...</p>
        )}

        {displayExcerpt && (
          <p className="mt-3 text-sm leading-relaxed text-[var(--brand-gray-600)]">
            {displayExcerpt}
          </p>
        )}

        <hr className="my-5 border-[var(--brand-gray-200)]" />

        {displayBody ? (
          <ArticleContent content={displayBody} />
        ) : (
          <p className="text-sm italic text-[var(--brand-gray-400)]">
            اكتب المحتوى لرؤية المعاينة — الصور والروابط تظهر كما في الموقع.
          </p>
        )}
      </div>
    </div>
  );
}
