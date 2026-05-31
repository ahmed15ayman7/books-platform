"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { createBook, updateBook, type BookEditData } from "./actions";
import { adminFieldClass } from "@/components/admin/admin-form-field";
import { AdminMarkdownHint } from "@/components/admin/admin-markdown-hint";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Publisher  { id: string; title: string; slug: string }
interface Category   { id: string; name: string; nameAr: string | null; slug: string }
interface Author     { id: string; name: string; nameAr: string | null; slug: string }

interface BookEditFormProps {
  bookId?: string;
  locale: string;
  initial: BookEditData;
  publishers: Publisher[];
  categories: Category[];
  authors: Author[];
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const sectionCardCls =
  "overflow-hidden rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)]";
const sectionHeaderCls =
  "border-b border-[var(--brand-gray-800)] bg-[var(--brand-gray-800)] px-5 py-3";

const fieldCls = adminFieldClass;

function FieldLabel({
  children,
  htmlFor,
  required,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  required?: boolean;
}) {
  return (
    <Label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-[var(--brand-gray-300)]"
    >
      {children}
      {required && <span className="ms-0.5 text-[var(--brand-red)]">*</span>}
    </Label>
  );
}

function BookSelect({
  id,
  value,
  onValueChange,
  placeholder,
  children,
}: {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  children: React.ReactNode;
}) {
  return (
    <Select value={value || "_empty"} onValueChange={(v) => onValueChange(v === "_empty" ? "" : v)}>
      <SelectTrigger id={id} className={fieldCls}>
        <SelectValue placeholder={placeholder ?? "اختر..."} />
      </SelectTrigger>
      <SelectContent className="border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] text-white">
        {children}
      </SelectContent>
    </Select>
  );
}

function Field({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("flex flex-col", className)}>{children}</div>;
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={sectionCardCls}>
      <div className={sectionHeaderCls}>
        <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-400)]">{title}</h2>
      </div>
      <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function CheckboxField({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[var(--brand-gray-700)] px-4 py-3 transition-colors hover:bg-[var(--brand-gray-800)]">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(state) => onChange(state === true)}
        className="border-[var(--brand-gray-600)] data-[state=checked]:bg-[var(--brand-red)] data-[state=checked]:border-[var(--brand-red)]"
      />
      <Label htmlFor={id} className="cursor-pointer text-sm font-medium text-[var(--brand-gray-300)]">
        {label}
      </Label>
    </div>
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
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
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
      <Input
        id={id}
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={`ابحث في ${label}…`}
        className={cn(fieldCls, "mb-1")}
      />
      {/* List */}
      <div className="max-h-44 overflow-y-auto rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)]">
        {filtered.length === 0 ? (
          <p className="px-3 py-2 text-xs text-[var(--brand-gray-500)]">لا نتائج</p>
        ) : (
          filtered.slice(0, 30).map((o) => (
            <label
              key={o.id}
              className="flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm text-white hover:bg-[var(--brand-gray-700)] border-b border-[var(--brand-gray-700)] last:border-0"
            >
              <Checkbox
                checked={selected.includes(o.id)}
                onCheckedChange={() => toggle(o.id)}
                className="shrink-0 border-[var(--brand-gray-600)] data-[state=checked]:bg-[var(--brand-red)] data-[state=checked]:border-[var(--brand-red)]"
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
export function BookEditForm({
  bookId,
  locale,
  initial,
  publishers,
  categories,
  authors,
}: BookEditFormProps) {
  const router = useRouter();
  const isCreate = !bookId;
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState<BookEditData>(initial);

  function set<K extends keyof BookEditData>(key: K, value: BookEditData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");

    const payload: BookEditData = {
      ...form,
      slug: form.slug.trim() || slugify(form.nameEn),
    };

    startTransition(async () => {
      try {
        if (bookId) {
          await updateBook(bookId, payload);
          setStatus("success");
          setTimeout(() => setStatus("idle"), 3000);
        } else {
          const result = await createBook(payload);
          router.push(`/${locale}/admin/books/${result.id}`);
        }
      } catch (err) {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* ── Status banner ───────────────────────────────────────── */}
      {status === "success" && !isCreate && (
        <div className="flex items-center gap-2 rounded-xl border border-green-800/50 bg-green-950/40 px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          تم حفظ التغييرات بنجاح
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl border border-red-800/50 bg-red-950/40 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

      {/* ── 1. Book Identity ─────────────────────────────────────── */}
      <SectionCard title="بيانات الكتاب الأساسية">
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="nameAr" required>الاسم بالعربية</FieldLabel>
          <Input id="nameAr" className={fieldCls} value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} placeholder="اسم الكتاب بالعربية" />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="nameEn" required>الاسم بالإنجليزية</FieldLabel>
          <Input id="nameEn" className={fieldCls} value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} placeholder="Book name in English" dir="ltr" />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="slug" required>الرابط المختصر (Slug)</FieldLabel>
          <Input id="slug" className={fieldCls} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="book-slug-url" dir="ltr" />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="imageUrl">رابط صورة الغلاف</FieldLabel>
          <Input id="imageUrl" type="url" className={fieldCls} value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} placeholder="https://..." dir="ltr" />
          {form.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.imageUrl} alt="cover preview" className="mt-2 h-32 w-auto rounded-lg border border-[var(--brand-gray-700)] object-contain" />
          )}
        </Field>
      </SectionCard>

      {/* ── 2. Bibliographic Data ────────────────────────────────── */}
      <SectionCard title="البيانات الببليوغرافية">
        <Field>
          <FieldLabel htmlFor="isbn">ISBN</FieldLabel>
          <Input id="isbn" className={fieldCls} value={form.isbn} onChange={(e) => set("isbn", e.target.value)} placeholder="978-3-16-148410-0" dir="ltr" />
        </Field>

        <Field>
          <FieldLabel htmlFor="language">اللغة الأصلية</FieldLabel>
          <BookSelect
            id="language"
            value={form.language}
            onValueChange={(v) => set("language", v)}
            placeholder="— اختر اللغة —"
          >
            <SelectItem value="_empty" className="focus:bg-[var(--brand-gray-700)]">
              — اختر اللغة —
            </SelectItem>
            {(
              [
                ["ar", "العربية"],
                ["en", "الإنجليزية"],
                ["fr", "الفرنسية"],
                ["de", "الألمانية"],
                ["es", "الإسبانية"],
                ["it", "الإيطالية"],
                ["zh", "الصينية"],
                ["ja", "اليابانية"],
                ["ru", "الروسية"],
                ["pt", "البرتغالية"],
                ["tr", "التركية"],
                ["fa", "الفارسية"],
                ["ur", "الأردية"],
              ] as [string, string][]
            ).map(([code, name]) => (
              <SelectItem key={code} value={code} className="focus:bg-[var(--brand-gray-700)]">
                {name} ({code.toUpperCase()})
              </SelectItem>
            ))}
          </BookSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="publicationYear">سنة النشر</FieldLabel>
          <Input id="publicationYear" type="number" className={fieldCls} value={form.publicationYear} onChange={(e) => set("publicationYear", e.target.value)} placeholder="2024" min="1800" max="2100" dir="ltr" />
        </Field>

        <Field>
          <FieldLabel htmlFor="country">بلد النشر</FieldLabel>
          <Input id="country" className={fieldCls} value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="مثال: المملكة العربية السعودية" />
        </Field>

        <Field>
          <FieldLabel htmlFor="pageCount">عدد الصفحات</FieldLabel>
          <Input id="pageCount" type="number" className={fieldCls} value={form.pageCount} onChange={(e) => set("pageCount", e.target.value)} placeholder="320" min="1" dir="ltr" />
        </Field>

        <Field>
          <FieldLabel htmlFor="edition">الطبعة</FieldLabel>
          <Input id="edition" className={fieldCls} value={form.edition} onChange={(e) => set("edition", e.target.value)} placeholder="مثال: الطبعة الثالثة" />
        </Field>

        <Field>
          <FieldLabel htmlFor="dimensions">الحجم / المقاسات</FieldLabel>
          <Input id="dimensions" className={fieldCls} value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="مثال: 24 × 17 سم" />
        </Field>

        <Field>
          <FieldLabel htmlFor="translationStatus">حالة الترجمة</FieldLabel>
          <BookSelect
            id="translationStatus"
            value={form.translationStatus}
            onValueChange={(v) => set("translationStatus", v)}
          >
            <SelectItem value="NOT_TRANSLATED" className="focus:bg-[var(--brand-gray-700)]">غير مترجم</SelectItem>
            <SelectItem value="NOMINATED" className="focus:bg-[var(--brand-gray-700)]">مرشح للترجمة</SelectItem>
            <SelectItem value="TRANSLATED" className="focus:bg-[var(--brand-gray-700)]">مترجم</SelectItem>
          </BookSelect>
        </Field>
      </SectionCard>

      {/* ── 3. Authors ───────────────────────────────────────────── */}
      <div className={sectionCardCls}>
        <div className={sectionHeaderCls}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-400)]">المؤلفون</h2>
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
          <FieldLabel htmlFor="publisherId">دار النشر</FieldLabel>
          <BookSelect
            id="publisherId"
            value={form.publisherId}
            onValueChange={(v) => set("publisherId", v)}
            placeholder="— بدون دار نشر —"
          >
            <SelectItem value="_empty" className="focus:bg-[var(--brand-gray-700)]">
              — بدون دار نشر —
            </SelectItem>
            {publishers.map((p) => (
              <SelectItem key={p.id} value={p.id} className="focus:bg-[var(--brand-gray-700)]">
                {p.title}
              </SelectItem>
            ))}
          </BookSelect>
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="primaryCategoryId">التصنيف الرئيسي</FieldLabel>
          <BookSelect
            id="primaryCategoryId"
            value={form.primaryCategoryId}
            onValueChange={(v) => set("primaryCategoryId", v)}
            placeholder="— بدون تصنيف —"
          >
            <SelectItem value="_empty" className="focus:bg-[var(--brand-gray-700)]">
              — بدون تصنيف —
            </SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id} className="focus:bg-[var(--brand-gray-700)]">
                {c.nameAr ?? c.name}
              </SelectItem>
            ))}
          </BookSelect>
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
          <FieldLabel htmlFor="purchaseOption">خيار الشراء</FieldLabel>
          <BookSelect
            id="purchaseOption"
            value={form.purchaseOption}
            onValueChange={(v) => set("purchaseOption", v)}
          >
            <SelectItem value="NOT_AVAILABLE" className="focus:bg-[var(--brand-gray-700)]">غير متاح للشراء</SelectItem>
            <SelectItem value="DIRECT" className="focus:bg-[var(--brand-gray-700)]">شراء مباشر</SelectItem>
            <SelectItem value="REFERRAL" className="focus:bg-[var(--brand-gray-700)]">رابط إحالة</SelectItem>
          </BookSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="currency">العملة</FieldLabel>
          <BookSelect id="currency" value={form.currency} onValueChange={(v) => set("currency", v)}>
            {["USD","EUR","GBP","SAR","AED","EGP","KWD","BHD","QAR","OMR","JOD"].map((c) => (
              <SelectItem key={c} value={c} className="focus:bg-[var(--brand-gray-700)]">
                {c}
              </SelectItem>
            ))}
          </BookSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="price">السعر</FieldLabel>
          <Input id="price" type="number" className={fieldCls} value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0.00" step="0.01" min="0" dir="ltr" />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="referralLink">رابط الإحالة / رابط الشراء</FieldLabel>
          <Input id="referralLink" type="url" className={fieldCls} value={form.referralLink} onChange={(e) => set("referralLink", e.target.value)} placeholder="https://..." dir="ltr" />
        </Field>

        {/* Checkboxes row */}
        <div className="sm:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <CheckboxField id="published" label="منشور" checked={form.published} onChange={(v) => set("published", v)} />
          <CheckboxField id="featured" label="مميز / Featured" checked={form.featured} onChange={(v) => set("featured", v)} />
          <CheckboxField id="inStock" label="متوفر في المخزن" checked={form.inStock} onChange={(v) => set("inStock", v)} />
        </div>
      </SectionCard>

      {/* ── 6. Descriptions ──────────────────────────────────────── */}
      <div className={sectionCardCls}>
        <div className={sectionHeaderCls}>
          <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--brand-gray-400)]">الأوصاف والمحتوى</h2>
        </div>
        <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="shortDescAr">مقتطف قصير — عربي</FieldLabel>
            <Textarea
              id="shortDescAr"
              className={cn(fieldCls, "min-h-[100px] resize-y")}
              value={form.shortDescAr}
              onChange={(e) => set("shortDescAr", e.target.value)}
              placeholder="جملة أو فقرتان تظهران فوق الملخص في صفحة الكتاب…"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="shortDesc">مقتطف قصير — إنجليزي</FieldLabel>
            <Textarea
              id="shortDesc"
              className={cn(fieldCls, "min-h-[100px] resize-y")}
              value={form.shortDesc}
              onChange={(e) => set("shortDesc", e.target.value)}
              placeholder="Short lead text shown above the summary…"
              dir="ltr"
            />
          </Field>

          <Field className="lg:col-span-2">
            <AdminMarkdownHint />
          </Field>

          <Field>
            <FieldLabel htmlFor="descriptionAr">ملخص الكتاب (Markdown) — عربي</FieldLabel>
            <Textarea
              id="descriptionAr"
              className={cn(fieldCls, "min-h-[220px] resize-y font-mono text-[13px]")}
              value={form.descriptionAr}
              onChange={(e) => set("descriptionAr", e.target.value)}
              placeholder={"## فكرة الكتاب\n\n**كلمة مفتاحية** مهمة في السياق…\n\n- نقطة أولى\n- نقطة ثانية"}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="description">ملخص الكتاب (Markdown) — إنجليزي</FieldLabel>
            <Textarea
              id="description"
              className={cn(fieldCls, "min-h-[220px] resize-y font-mono text-[13px]")}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder={"## About this book\n\n**Keyword** highlighted in context…\n\n- First point\n- Second point"}
              dir="ltr"
            />
          </Field>

          <Field className="lg:col-span-2">
            <FieldLabel htmlFor="notes">ملاحظات داخلية</FieldLabel>
            <Textarea id="notes" className={cn(fieldCls, "min-h-[100px] resize-y")} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="ملاحظات للفريق الداخلي فقط…" />
          </Field>
        </div>
      </div>

      {/* ── Save bar ─────────────────────────────────────────────── */}
      <div className="sticky bottom-0 flex items-center justify-between gap-3 rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] px-5 py-3 shadow-lg">
        <p className="text-xs text-[var(--brand-gray-500)]">
          {isPending ? "جارٍ الحفظ…" : "تأكد من مراجعة البيانات قبل الحفظ"}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isPending}
            className="rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] px-4 py-2 text-sm font-medium text-[var(--brand-gray-300)] transition-colors hover:bg-[var(--brand-gray-700)] disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-red)] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-red)]/90 disabled:opacity-60"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isCreate ? "إنشاء الكتاب" : "حفظ التغييرات"}
          </button>
        </div>
      </div>
    </form>
  );
}
