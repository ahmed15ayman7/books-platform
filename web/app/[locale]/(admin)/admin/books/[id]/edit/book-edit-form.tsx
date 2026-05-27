"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { updateBook, type BookEditData } from "./actions";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Publisher  { id: string; title: string; slug: string }
interface Category   { id: string; name: string; nameAr: string | null; slug: string }
interface Author     { id: string; name: string; nameAr: string | null; slug: string }

interface BookEditFormProps {
  book: BookEditData & { id: string };
  publishers: Publisher[];
  categories: Category[];
  authors: Author[];
  locale: string;
}

/* ─── Small UI helpers ───────────────────────────────────────────────── */
const inputCls = [
  "w-full rounded-lg border border-[var(--brand-gray-300)] bg-white px-3 py-2 text-sm text-[var(--brand-gray-900)]",
  "placeholder:text-[var(--brand-gray-400)]",
  "focus:outline-none focus:ring-2 focus:ring-[var(--brand-red)] focus:border-transparent",
  "disabled:bg-[var(--brand-gray-50)] disabled:cursor-not-allowed",
].join(" ");

const textareaCls = inputCls + " min-h-[100px] resize-y";

function Label({ children, htmlFor, required }: { children: React.ReactNode; htmlFor?: string; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-[var(--brand-gray-700)]">
      {children}
      {required && <span className="ms-0.5 text-[var(--brand-red)]">*</span>}
    </label>
  );
}

function Field({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--brand-gray-200)] bg-white shadow-sm">
      <div className="border-b border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] px-5 py-3">
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-500)]">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function CheckboxField({
  id, label, checked, onChange,
}: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[var(--brand-gray-200)] px-4 py-3 transition-colors hover:bg-[var(--brand-gray-50)]">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded accent-[var(--brand-red)]"
      />
      <span className="text-sm font-medium text-[var(--brand-gray-700)]">{label}</span>
    </label>
  );
}

/* ─── Multi-select with search ───────────────────────────────────────── */
function MultiSelect({
  id,
  label,
  options,
  selected,
  onChange,
  getLabel,
}: {
  id: string;
  label: string;
  options: { id: string; name: string; nameAr?: string | null }[];
  selected: string[];
  onChange: (ids: string[]) => void;
  getLabel: (o: { id: string; name: string; nameAr?: string | null }) => string;
}) {
  const [q, setQ] = useState("");
  const filtered = q
    ? options.filter((o) => getLabel(o).toLowerCase().includes(q.toLowerCase()))
    : options;

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  }

  const selectedItems = options.filter((o) => selected.includes(o.id));

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      {/* Selected chips */}
      {selectedItems.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {selectedItems.map((o) => (
            <span
              key={o.id}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-red-soft)] px-2.5 py-0.5 text-xs font-medium text-[var(--brand-red)]"
            >
              {getLabel(o)}
              <button
                type="button"
                onClick={() => toggle(o.id)}
                className="hover:text-[var(--brand-red)] opacity-70 hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
      {/* Search */}
      <input
        id={id}
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`ابحث في ${label}…`}
        className={inputCls + " mb-1"}
      />
      {/* List */}
      <div className="max-h-44 overflow-y-auto rounded-lg border border-[var(--brand-gray-200)] bg-white">
        {filtered.length === 0 ? (
          <p className="px-3 py-2 text-xs text-[var(--brand-gray-400)]">لا نتائج</p>
        ) : (
          filtered.slice(0, 30).map((o) => (
            <label
              key={o.id}
              className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm hover:bg-[var(--brand-gray-50)] border-b border-[var(--brand-gray-100)] last:border-0"
            >
              <input
                type="checkbox"
                checked={selected.includes(o.id)}
                onChange={() => toggle(o.id)}
                className="h-4 w-4 rounded accent-[var(--brand-red)] shrink-0"
              />
              <span className="truncate">{getLabel(o)}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}

/* ─── Main form ──────────────────────────────────────────────────────── */
export function BookEditForm({ book, publishers, categories, authors }: BookEditFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Form state — mirrors BookEditData
  const [form, setForm] = useState<BookEditData>({
    nameEn: book.nameEn,
    nameAr: book.nameAr,
    slug: book.slug,
    isbn: book.isbn,
    imageUrl: book.imageUrl,
    language: book.language,
    publicationYear: book.publicationYear,
    country: book.country,
    pageCount: book.pageCount,
    edition: book.edition,
    dimensions: book.dimensions,
    translationStatus: book.translationStatus,
    purchaseOption: book.purchaseOption,
    price: book.price,
    currency: book.currency,
    referralLink: book.referralLink,
    shortDesc: book.shortDesc,
    shortDescAr: book.shortDescAr,
    description: book.description,
    descriptionAr: book.descriptionAr,
    notes: book.notes,
    published: book.published,
    featured: book.featured,
    inStock: book.inStock,
    publisherId: book.publisherId,
    primaryCategoryId: book.primaryCategoryId,
    categoryIds: book.categoryIds,
    authorIds: book.authorIds,
  });

  function set<K extends keyof BookEditData>(key: K, value: BookEditData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    startTransition(async () => {
      try {
        await updateBook(book.id, form);
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* ── Status banner ───────────────────────────────────────── */}
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          تم حفظ التغييرات بنجاح
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* ── 1. Book Identity ─────────────────────────────────────── */}
      <SectionCard title="بيانات الكتاب الأساسية">
        <Field className="sm:col-span-2">
          <Label htmlFor="nameAr" required>الاسم بالعربية</Label>
          <input id="nameAr" className={inputCls} value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} placeholder="اسم الكتاب بالعربية" />
        </Field>

        <Field className="sm:col-span-2">
          <Label htmlFor="nameEn" required>الاسم بالإنجليزية</Label>
          <input id="nameEn" className={inputCls} value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} placeholder="Book name in English" dir="ltr" />
        </Field>

        <Field className="sm:col-span-2">
          <Label htmlFor="slug" required>الرابط المختصر (Slug)</Label>
          <input id="slug" className={inputCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="book-slug-url" dir="ltr" />
        </Field>

        <Field className="sm:col-span-2">
          <Label htmlFor="imageUrl">رابط صورة الغلاف</Label>
          <input id="imageUrl" type="url" className={inputCls} value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." dir="ltr" />
          {form.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="cover preview" className="mt-2 h-32 w-auto rounded-lg border object-contain" />
          )}
        </Field>
      </SectionCard>

      {/* ── 2. Bibliographic Data ────────────────────────────────── */}
      <SectionCard title="البيانات الببليوغرافية">
        <Field>
          <Label htmlFor="isbn">ISBN</Label>
          <input id="isbn" className={inputCls} value={form.isbn} onChange={(e) => set("isbn", e.target.value)} placeholder="978-3-16-148410-0" dir="ltr" />
        </Field>

        <Field>
          <Label htmlFor="language">اللغة الأصلية</Label>
          <select id="language" className={inputCls} value={form.language} onChange={(e) => set("language", e.target.value)}>
            <option value="">— اختر اللغة —</option>
            {[
              ["ar", "العربية"],["en", "الإنجليزية"],["fr", "الفرنسية"],["de", "الألمانية"],
              ["es", "الإسبانية"],["it", "الإيطالية"],["zh", "الصينية"],["ja", "اليابانية"],
              ["ru", "الروسية"],["pt", "البرتغالية"],["tr", "التركية"],["fa", "الفارسية"],["ur", "الأردية"],
            ].map(([code, name]) => (
              <option key={code} value={code}>{name} ({code?.toUpperCase()})</option>
            ))}
          </select>
        </Field>

        <Field>
          <Label htmlFor="publicationYear">سنة النشر</Label>
          <input id="publicationYear" type="number" className={inputCls} value={form.publicationYear} onChange={(e) => set("publicationYear", e.target.value)} placeholder="2024" min="1800" max="2100" dir="ltr" />
        </Field>

        <Field>
          <Label htmlFor="country">بلد النشر</Label>
          <input id="country" className={inputCls} value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="مثال: المملكة العربية السعودية" />
        </Field>

        <Field>
          <Label htmlFor="pageCount">عدد الصفحات</Label>
          <input id="pageCount" type="number" className={inputCls} value={form.pageCount} onChange={(e) => set("pageCount", e.target.value)} placeholder="320" min="1" dir="ltr" />
        </Field>

        <Field>
          <Label htmlFor="edition">الطبعة</Label>
          <input id="edition" className={inputCls} value={form.edition} onChange={(e) => set("edition", e.target.value)} placeholder="مثال: الطبعة الثالثة" />
        </Field>

        <Field>
          <Label htmlFor="dimensions">الحجم / المقاسات</Label>
          <input id="dimensions" className={inputCls} value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="مثال: 24 × 17 سم" />
        </Field>

        <Field>
          <Label htmlFor="translationStatus">حالة الترجمة</Label>
          <select id="translationStatus" className={inputCls} value={form.translationStatus} onChange={(e) => set("translationStatus", e.target.value)}>
            <option value="NOT_TRANSLATED">غير مترجم</option>
            <option value="NOMINATED">مرشح للترجمة</option>
            <option value="TRANSLATED">مترجم</option>
          </select>
        </Field>
      </SectionCard>

      {/* ── 3. Authors ───────────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-[var(--brand-gray-200)] bg-white shadow-sm">
        <div className="border-b border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] px-5 py-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-500)]">المؤلفون</h2>
        </div>
        <div className="p-5">
          <MultiSelect
            id="authors"
            label="المؤلفون"
            options={authors}
            selected={form.authorIds}
            onChange={(ids) => set("authorIds", ids)}
            getLabel={(a) => a.nameAr ?? a.name}
          />
        </div>
      </div>

      {/* ── 4. Publisher & Categories ────────────────────────────── */}
      <SectionCard title="دار النشر والتصنيفات">
        <Field className="sm:col-span-2">
          <Label htmlFor="publisherId">دار النشر</Label>
          <select id="publisherId" className={inputCls} value={form.publisherId} onChange={(e) => set("publisherId", e.target.value)}>
            <option value="">— بدون دار نشر —</option>
            {publishers.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </Field>

        <Field className="sm:col-span-2">
          <Label htmlFor="primaryCategoryId">التصنيف الرئيسي</Label>
          <select id="primaryCategoryId" className={inputCls} value={form.primaryCategoryId} onChange={(e) => set("primaryCategoryId", e.target.value)}>
            <option value="">— بدون تصنيف —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.nameAr ?? c.name}</option>
            ))}
          </select>
        </Field>

        <Field className="sm:col-span-2">
          <MultiSelect
            id="categories"
            label="تصنيفات إضافية"
            options={categories}
            selected={form.categoryIds}
            onChange={(ids) => set("categoryIds", ids)}
            getLabel={(c) => c.nameAr ?? c.name}
          />
        </Field>
      </SectionCard>

      {/* ── 5. Status & Commerce ─────────────────────────────────── */}
      <SectionCard title="الحالة والتسعير">
        <Field>
          <Label htmlFor="purchaseOption">خيار الشراء</Label>
          <select id="purchaseOption" className={inputCls} value={form.purchaseOption} onChange={(e) => set("purchaseOption", e.target.value)}>
            <option value="NOT_AVAILABLE">غير متاح للشراء</option>
            <option value="DIRECT">شراء مباشر</option>
            <option value="REFERRAL">رابط إحالة</option>
          </select>
        </Field>

        <Field>
          <Label htmlFor="currency">العملة</Label>
          <select id="currency" className={inputCls} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
            {["USD","EUR","GBP","SAR","AED","EGP","KWD","BHD","QAR","OMR","JOD"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field>
          <Label htmlFor="price">السعر</Label>
          <input id="price" type="number" className={inputCls} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0.00" step="0.01" min="0" dir="ltr" />
        </Field>

        <Field className="sm:col-span-2">
          <Label htmlFor="referralLink">رابط الإحالة / رابط الشراء</Label>
          <input id="referralLink" type="url" className={inputCls} value={form.referralLink} onChange={(e) => set("referralLink", e.target.value)} placeholder="https://..." dir="ltr" />
        </Field>

        {/* Checkboxes row */}
        <div className="sm:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <CheckboxField id="published" label="منشور" checked={form.published} onChange={(v) => set("published", v)} />
          <CheckboxField id="featured" label="مميز / Featured" checked={form.featured} onChange={(v) => set("featured", v)} />
          <CheckboxField id="inStock" label="متوفر في المخزن" checked={form.inStock} onChange={(v) => set("inStock", v)} />
        </div>
      </SectionCard>

      {/* ── 6. Descriptions ──────────────────────────────────────── */}
      <div className="overflow-hidden rounded-xl border border-[var(--brand-gray-200)] bg-white shadow-sm">
        <div className="border-b border-[var(--brand-gray-200)] bg-[var(--brand-gray-50)] px-5 py-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-500)]">الأوصاف والمحتوى</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
          <Field>
            <Label htmlFor="shortDescAr">وصف قصير — عربي</Label>
            <textarea id="shortDescAr" className={textareaCls} value={form.shortDescAr} onChange={(e) => set("shortDescAr", e.target.value)} placeholder="ملخص قصير بالعربية…" />
          </Field>

          <Field>
            <Label htmlFor="shortDesc">وصف قصير — إنجليزي</Label>
            <textarea id="shortDesc" className={textareaCls} value={form.shortDesc} onChange={(e) => set("shortDesc", e.target.value)} placeholder="Short description in English…" dir="ltr" />
          </Field>

          <Field>
            <Label htmlFor="descriptionAr">الوصف الكامل — عربي</Label>
            <textarea id="descriptionAr" className={textareaCls + " min-h-[160px]"} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} placeholder="الوصف الكامل للكتاب بالعربية…" />
          </Field>

          <Field>
            <Label htmlFor="description">الوصف الكامل — إنجليزي</Label>
            <textarea id="description" className={textareaCls + " min-h-[160px]"} value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Full description in English…" dir="ltr" />
          </Field>

          <Field className="lg:col-span-2">
            <Label htmlFor="notes">ملاحظات داخلية</Label>
            <textarea id="notes" className={textareaCls} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="ملاحظات للفريق الداخلي فقط…" />
          </Field>
        </div>
      </div>

      {/* ── Save bar ─────────────────────────────────────────────── */}
      <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-xl border border-[var(--brand-gray-200)] bg-white px-5 py-3 shadow-lg">
        <p className="text-xs text-[var(--brand-gray-400)]">
          {isPending ? "جارٍ الحفظ…" : "تأكد من مراجعة البيانات قبل الحفظ"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className="rounded-lg border border-[var(--brand-gray-300)] bg-white px-4 py-2 text-sm font-medium text-[var(--brand-gray-700)] transition-colors hover:bg-[var(--brand-gray-50)] disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-red)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-red)]/90 disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            حفظ التغييرات
          </button>
        </div>
      </div>
    </form>
  );
}
