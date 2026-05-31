import { Info } from "lucide-react";

export function AdminMarkdownHint() {
  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-accent-soft)]/50 p-4 text-xs leading-relaxed text-[var(--admin-text-muted)]">
      <div className="mb-2 flex items-center gap-2 font-semibold text-[var(--admin-text)]">
        <Info className="h-4 w-4 text-[var(--admin-accent)]" aria-hidden="true" />
        تنسيق ملخص الكتاب (Markdown)
      </div>
      <p className="mb-2 text-[var(--admin-text-muted)]">
        يظهر الملخص في صفحة الكتاب بعنوان أحمر كبير ونص منسّق. استخدم الصيغ التالية:
      </p>
      <ul className="space-y-1 font-mono text-[11px] text-[var(--admin-text-muted)]">
        <li>
          <span className="text-[var(--admin-accent)]">## عنوان فرعي</span> — يظهر باللون الأحمر وبخط عريض
        </li>
        <li>
          <span className="text-[var(--admin-accent)]">### عنوان أصغر</span> — للأقسام الداخلية
        </li>
        <li>
          <span className="font-semibold text-[var(--admin-text)]">**كلمة مفتاحية**</span> — خط عريض لإبراز مصطلح
        </li>
        <li>
          <span className="italic text-[var(--admin-text)]">*تمييز خفيف*</span> — مائل
        </li>
        <li>
          <span className="text-[var(--admin-text)]">- عنصر قائمة</span> — نقاط تعداد
        </li>
        <li>
          <span className="text-[var(--admin-accent)]">[رابط](https://...)</span> — رابط خارجي
        </li>
      </ul>
      <p className="mt-2 text-[var(--admin-text-subtle)]">
        اترك سطراً فارغاً بين الفقرات. لا حاجة لـ HTML — النص العادي والرموز أعلاه كافية.
      </p>
    </div>
  );
}
