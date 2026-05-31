import { Info } from "lucide-react";

export function AdminMarkdownHint() {
  return (
    <div className="rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)]/80 p-4 text-xs leading-relaxed text-[var(--brand-gray-300)]">
      <div className="mb-2 flex items-center gap-2 font-semibold text-[var(--brand-gray-200)]">
        <Info className="h-4 w-4 text-[var(--brand-red)]" aria-hidden="true" />
        تنسيق ملخص الكتاب (Markdown)
      </div>
      <p className="mb-2 text-[var(--brand-gray-400)]">
        يظهر الملخص في صفحة الكتاب بعنوان أحمر كبير ونص منسّق. استخدم الصيغ التالية:
      </p>
      <ul className="space-y-1 font-mono text-[11px] text-[var(--brand-gray-400)]">
        <li>
          <span className="text-white">## عنوان فرعي</span> — يظهر باللون الأحمر وبخط عريض
        </li>
        <li>
          <span className="text-white">### عنوان أصغر</span> — للأقسام الداخلية
        </li>
        <li>
          <span className="text-white">**كلمة مفتاحية**</span> — خط عريض لإبراز مصطلح
        </li>
        <li>
          <span className="text-white">*تمييز خفيف*</span> — مائل
        </li>
        <li>
          <span className="text-white">- عنصر قائمة</span> — نقاط تعداد
        </li>
        <li>
          <span className="text-white">[رابط](https://...)</span> — رابط خارجي
        </li>
      </ul>
      <p className="mt-2 text-[var(--brand-gray-500)]">
        اترك سطراً فارغاً بين الفقرات. لا حاجة لـ HTML — النص العادي والرموز أعلاه كافية.
      </p>
    </div>
  );
}
