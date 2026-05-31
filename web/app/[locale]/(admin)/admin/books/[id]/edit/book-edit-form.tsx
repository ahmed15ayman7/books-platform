"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { createBook, updateBook, type BookEditData } from "./actions";
import { adminFieldClass } from "@/components/admin/admin-form-field";
import { AdminMarkdownHint } from "@/components/admin/admin-markdown-hint";
import { AdminEntityCombobox } from "@/components/admin/admin-entity-combobox";
import { CreateAuthorDialog } from "@/components/admin/create-author-dialog";
import { CreatePublisherDialog } from "@/components/admin/create-publisher-dialog";
import { CreateCategoryDialog } from "@/components/admin/create-category-dialog";
import { slugify, autoSlugFromEnglish, AUTO_SLUG_HINT } from "@/lib/admin/slugify";
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
  const [authorsList, setAuthorsList] = useState(authors);
  const [publishersList, setPublishersList] = useState(publishers);
  const [categoriesList, setCategoriesList] = useState(categories);

  const [authorDialogOpen, setAuthorDialogOpen] = useState(false);
  const [publisherDialogOpen, setPublisherDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [createQuery, setCreateQuery] = useState("");
  const [categoryCreateTarget, setCategoryCreateTarget] = useState<"primary" | "extra">("primary");

  const authorOptions = authorsList.map((a) => ({
    id: a.id,
    name: a.name,
    nameAr: a.nameAr,
    slug: a.slug,
  }));
  const publisherOptions = publishersList.map((p) => ({
    id: p.id,
    name: p.title,
    slug: p.slug,
  }));
  const categoryOptions = categoriesList.map((c) => ({
    id: c.id,
    name: c.name,
    nameAr: c.nameAr,
    slug: c.slug,
  }));

  const entityLabel = (o: { name: string; nameAr?: string | null }) => o.nameAr ?? o.name;

  function set<K extends keyof BookEditData>(key: K, value: BookEditData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    const nameEn = form.nameEn.trim();
    const nameAr = form.nameAr.trim();
    const slug = form.slug.trim() || slugify(form.nameEn) || slugify(form.nameAr);

    if (!nameEn && !nameAr) {
      setStatus("error");
      setErrorMsg("الاسم بالعربية أو الإنجليزية مطلوب");
      return;
    }
    if (!slug) {
      setStatus("error");
      setErrorMsg("الرابط المختصر (Slug) مطلوب");
      return;
    }

    const payload: BookEditData = {
      ...form,
      nameEn: nameEn || nameAr,
      slug,
    };

    startTransition(async () => {
      if (bookId) {
        const result = await updateBook(bookId, payload);
        if (!result.ok) {
          setStatus("error");
          setErrorMsg(result.error);
          return;
        }
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
        return;
      }

      const result = await createBook(payload);
      if (!result.ok) {
        setStatus("error");
        setErrorMsg(result.error);
        return;
      }
      if (result.id) {
        setStatus("success");
        setTimeout(() => {
          router.push(`/${locale}/admin/books/${result.id}`);
        }, 1500);
      }
    });
  }

  const successMessage = isCreate ? "تم إنشاء الكتاب بنجاح" : "تم حفظ التغييرات بنجاح";

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* ── 1. Book Identity ─────────────────────────────────────── */}
      <SectionCard title="بيانات الكتاب الأساسية">
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="nameAr" required>الاسم بالعربية</FieldLabel>
          <Input id="nameAr" className={fieldCls} value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} placeholder="اسم الكتاب بالعربية" />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="nameEn" required>الاسم بالإنجليزية</FieldLabel>
          <Input
            id="nameEn"
            className={fieldCls}
            value={form.nameEn}
            onChange={(e) => {
              const nameEn = e.target.value;
              setForm((prev) => ({
                ...prev,
                nameEn,
                slug: autoSlugFromEnglish(nameEn, prev.slug, prev.nameEn),
              }));
            }}
            placeholder="Book name in English"
            dir="ltr"
          />
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="slug" required>الرابط المختصر (Slug)</FieldLabel>
          <Input
            id="slug"
            className={fieldCls}
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="book-slug-url"
            dir="ltr"
          />
          <p className="mt-1 text-[11px] text-[var(--brand-gray-500)]">{AUTO_SLUG_HINT}</p>
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
          <AdminEntityCombobox
            id="authors"
            label="المؤلفون"
            mode="multi"
            options={authorOptions}
            value={form.authorIds}
            onChange={(v) => set("authorIds", v as string[])}
            getLabel={entityLabel}
            onCreateNew={(q) => {
              setCreateQuery(q);
              setAuthorDialogOpen(true);
            }}
          />
        </div>
      </div>

      {/* ── 4. Publisher & Categories ────────────────────────────── */}
      <SectionCard title="دار النشر والتصنيفات">
        <Field className="sm:col-span-2">
          <AdminEntityCombobox
            id="publisherId"
            label="دار النشر"
            mode="single"
            options={publisherOptions}
            value={form.publisherId}
            onChange={(v) => set("publisherId", v as string)}
            getLabel={entityLabel}
            placeholder="ابحث عن دار نشر…"
            onCreateNew={(q) => {
              setCreateQuery(q);
              setPublisherDialogOpen(true);
            }}
          />
        </Field>

        <Field className="sm:col-span-2">
          <AdminEntityCombobox
            id="primaryCategoryId"
            label="التصنيف الرئيسي"
            mode="single"
            options={categoryOptions}
            value={form.primaryCategoryId}
            onChange={(v) => set("primaryCategoryId", v as string)}
            getLabel={entityLabel}
            placeholder="ابحث عن تصنيف…"
            onCreateNew={(q) => {
              setCreateQuery(q);
              setCategoryCreateTarget("primary");
              setCategoryDialogOpen(true);
            }}
          />
        </Field>

        <Field className="sm:col-span-2">
          <AdminEntityCombobox
            id="categories"
            label="تصنيفات إضافية"
            mode="multi"
            options={categoryOptions}
            value={form.categoryIds}
            onChange={(v) => set("categoryIds", v as string[])}
            getLabel={entityLabel}
            onCreateNew={(q) => {
              setCreateQuery(q);
              setCategoryCreateTarget("extra");
              setCategoryDialogOpen(true);
            }}
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

      {/* ── Status (أسفل النموذج) ─────────────────────────────────── */}
      {status === "success" && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green-800/50 bg-green-950/40 px-4 py-3 text-sm text-green-400"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}
      {status === "error" && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-800/50 bg-red-950/40 px-4 py-3 text-sm text-red-400"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {errorMsg}
        </div>
      )}

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

      <CreateAuthorDialog
        open={authorDialogOpen}
        onOpenChange={setAuthorDialogOpen}
        initialName={createQuery}
        onCreated={(author) => {
          const entry = {
            id: author.id,
            name: author.name,
            nameAr: author.nameAr ?? null,
            slug: author.slug ?? "",
          };
          setAuthorsList((prev) => [...prev, entry]);
          set("authorIds", [...form.authorIds, author.id]);
        }}
      />
      <CreatePublisherDialog
        open={publisherDialogOpen}
        onOpenChange={setPublisherDialogOpen}
        initialName={createQuery}
        onCreated={(publisher) => {
          setPublishersList((prev) => [...prev, publisher]);
          set("publisherId", publisher.id);
        }}
      />
      <CreateCategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        initialName={createQuery}
        onCreated={(category) => {
          const entry = {
            id: category.id,
            name: category.name,
            nameAr: category.nameAr ?? null,
            slug: category.slug ?? "",
          };
          setCategoriesList((prev) => [...prev, entry]);
          if (categoryCreateTarget === "primary") {
            set("primaryCategoryId", category.id);
          } else {
            set("categoryIds", [...form.categoryIds, category.id]);
          }
        }}
      />
    </form>
  );
}
