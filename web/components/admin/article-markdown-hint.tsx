import { Info } from "lucide-react";

export function ArticleMarkdownHint() {
  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-accent-soft)]/50 p-4 text-xs leading-relaxed text-[var(--admin-text-muted)]">
      <div className="mb-2 flex items-center gap-2 font-semibold text-[var(--admin-text)]">
        <Info className="h-4 w-4 text-[var(--admin-accent)]" aria-hidden="true" />
        تنسيق المحتوى (Markdown)
      </div>
      <ul className="space-y-1 font-mono text-[11px]">
        <li>
          <span className="text-[var(--admin-accent)]">## عنوان</span> — عنوان فرعي
        </li>
        <li>
          <span className="text-[var(--admin-accent)]">**نص عريض**</span> — تمييز
        </li>
        <li>
          <span className="text-[var(--admin-accent)]">- عنصر قائمة</span>
        </li>
        <li>
          <span className="text-[var(--admin-accent)]">![وصف](https://...jpg)</span> — صورة في
          وسط المقال
        </li>
        <li>
          <span className="text-[var(--admin-accent)]">[https://...jpg](https://...jpg)</span> —
          رابط صورة يُعرض كصورة
        </li>
        <li>
          <span className="text-[var(--admin-text)]">سطر يحتوي رابط صورة فقط</span> — يُعرض كصورة
        </li>
      </ul>
      <p className="mt-2 text-[var(--admin-text-subtle)]">
        المعاينة على اليمين تُحدَّث مباشرة أثناء الكتابة.
      </p>
    </div>
  );
}
