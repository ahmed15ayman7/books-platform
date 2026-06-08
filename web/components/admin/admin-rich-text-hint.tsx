import { Info } from "lucide-react";

export function AdminRichTextHint() {
  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-accent-soft)]/50 p-4 text-xs leading-relaxed text-[var(--admin-text-muted)]">
      <div className="flex items-center gap-2 font-semibold text-[var(--admin-text)]">
        <Info className="h-4 w-4 shrink-0 text-[var(--admin-accent)]" aria-hidden="true" />
        محرر مرئي — يُحفظ تلقائياً بصيغة Markdown متوافقة مع الموقع
      </div>
      <p className="mt-1.5 text-[var(--admin-text-subtle)]">
        استخدم شريط الأدوات أعلى حقل المحتوى للتنسيق (عناوين، عريض، قوائم، روابط، صور).
      </p>
    </div>
  );
}
