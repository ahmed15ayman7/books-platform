"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminSelect } from "@/components/admin/admin-form-field";
import { AdminTimestamps } from "@/components/admin/admin-timestamps";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";
import { BookMultiPicker, type BookPickerItem } from "@/components/admin/book-multi-picker";
import { isMediaChannel } from "@/lib/media/youtube";
import {
  AdminBilingualField,
} from "@/components/admin/admin-bilingual-field";
import {
  adminArticleViewPath,
} from "@/lib/admin/public-urls";
import { ArticleLivePreview } from "@/components/admin/article-live-preview";
import { ArticleMarkdownHint } from "@/components/admin/article-markdown-hint";

interface ArticleForm {
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  body: string;
  bodyEn: string;
  channel: string;
  status: string;
  imageUrl: string;
  youtubeUrl: string;
  date: string;
}

const empty: ArticleForm = {
  title: "",
  titleEn: "",
  excerpt: "",
  excerptEn: "",
  body: "",
  bodyEn: "",
  channel: "harvest",
  status: "draft",
  imageUrl: "",
  youtubeUrl: "",
  date: new Date().toISOString().split("T")[0] ?? "",
};

const channelOptions = [
  { value: "harvest", label: "حصاد الكتب" },
  { value: "ideas", label: "زبدة الأفكار" },
  { value: "world-reads", label: "العالم يقرأ" },
  { value: "watch-your-book", label: "شاهد كتابك" },
  { value: "books-talk", label: "حديث الكتب" },
  { value: "novel-story", label: "رواية فحكاية" },
];

const statusOptions = [
  { value: "draft", label: "مسودة" },
  { value: "publish", label: "منشور" },
  { value: "scheduled", label: "مجدول" },
];

interface ArticleEditFormProps {
  locale: string;
  id: string;
  initialBookId?: string;
}

export function ArticleEditForm({ locale, id, initialBookId }: ArticleEditFormProps) {
  const router = useRouter();
  const isNew = id === "new";

  const [form, setForm] = useState<ArticleForm>(empty);
  const [productIds, setProductIds] = useState<string[]>(initialBookId ? [initialBookId] : []);
  const [selectedBooks, setSelectedBooks] = useState<BookPickerItem[]>([]);
  const [loading, setLoading] = useState(!isNew || Boolean(initialBookId));
  const draft = useFormDraft(formDraftId.adminArticle(id), form, setForm, { ready: !loading });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timestamps, setTimestamps] = useState<{ createdAt?: string; updatedAt?: string }>({});

  const load = useCallback(async () => {
    if (isNew) {
      if (initialBookId) {
        try {
          const res = await fetch(`/api/v1/admin/books/${initialBookId}`, {
            headers: adminAuthHeaders(),
          });
          const data = (await res.json()) as {
            success: boolean;
            data?: { id: string; nameEn: string; nameAr: string | null; slug: string; imageUrl?: string | null };
          };
          if (data.success && data.data) {
            const b = data.data;
            setSelectedBooks([
              { id: b.id, nameEn: b.nameEn, nameAr: b.nameAr, slug: b.slug, imageUrl: b.imageUrl ?? null },
            ]);
          }
        } finally {
          setLoading(false);
        }
      }
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/articles/${id}`, { headers: adminAuthHeaders() });
      const data = await res.json() as {
        success: boolean;
        data?: Record<string, unknown> & { products?: BookPickerItem[]; productIds?: string[] };
      };
      if (data.success && data.data) {
        const d = data.data;
        setForm({
          title: String(d.title ?? ""),
          titleEn: String(d.titleEn ?? ""),
          excerpt: String(d.excerpt ?? ""),
          excerptEn: String(d.excerptEn ?? ""),
          body: String(d.body ?? ""),
          bodyEn: String(d.bodyEn ?? ""),
          channel: String(d.channel ?? "harvest"),
          status: String(d.status ?? "draft"),
          imageUrl: String(d.imageUrl ?? ""),
          youtubeUrl: String(d.youtubeUrl ?? ""),
          date: d.date ? (new Date(d.date as string).toISOString().split("T")[0] ?? "") : empty.date,
        });
        const products = (d.products ?? []) as BookPickerItem[];
        setProductIds(d.productIds ?? products.map((p) => p.id));
        setSelectedBooks(products);
        setTimestamps({
          createdAt: d.createdAt as string | undefined,
          updatedAt: d.updatedAt as string | undefined,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id, isNew, initialBookId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const url = isNew ? "/api/v1/admin/articles" : `/api/v1/admin/articles/${id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          productIds,
          date: form.date ? new Date(form.date) : null,
        }),
      });
      const data = await res.json() as {
        success: boolean;
        error?: { message: string };
        data?: { id: string; channel?: string | null };
      };
      if (!res.ok || !data.success) {
        setError(data.error?.message ?? "فشل الحفظ");
        return;
      }
      draft.clearDraft();
      setSuccess(true);
      const savedId = isNew ? data.data?.id : id;
      const channel = data.data?.channel ?? form.channel;
      if (savedId) {
        if (isNew) {
          router.push(adminArticleViewPath(locale, savedId, channel));
        }
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  const set =
    (k: keyof ArticleForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  if (loading) return <div className="text-[var(--admin-text-muted)]">جاري التحميل...</div>;

  const viewHref = !isNew ? adminArticleViewPath(locale, id, form.channel) : undefined;

  return (
    <div className="text-[var(--admin-text)]">
      <Link
        href={viewHref ?? `/${locale}/admin/articles`}
        className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {isNew ? "العودة للمقالات" : "العودة للعرض"}
      </Link>

      <h1 className="mb-2 text-2xl font-bold">{isNew ? "إضافة مقال جديد" : "تعديل المقال"}</h1>
      {!isNew && (
        <AdminTimestamps
          createdAt={timestamps.createdAt}
          updatedAt={timestamps.updatedAt}
          compact
          className="mb-5"
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormDraftNotice
          showBanner={draft.showBanner}
          status={draft.status}
          onResume={draft.resume}
          onDismiss={draft.dismiss}
        />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,420px)] xl:items-start">
          <div className="space-y-5">
        <AdminCard title="الإعدادات">
          <div className="grid gap-4 sm:grid-cols-3">
            <AdminSelect label="القناة" value={form.channel} onChange={set("channel")} options={channelOptions} required />
            <AdminSelect label="الحالة" value={form.status} onChange={set("status")} options={statusOptions} />
            <AdminInput label="تاريخ النشر" type="date" value={form.date} onChange={set("date")} />
          </div>
          <div className="mt-4">
            <AdminInput label="رابط صورة المقال" value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://..." />
          </div>
          {(isMediaChannel(form.channel) || form.youtubeUrl) && (
            <div className="mt-4">
              <AdminInput
                label="رابط YouTube"
                value={form.youtubeUrl}
                onChange={set("youtubeUrl")}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          )}
        </AdminCard>

        <AdminCard title="الكتب المرتبطة">
          <BookMultiPicker
            value={productIds}
            selectedBooks={selectedBooks}
            onChange={(ids, books) => {
              setProductIds(ids);
              setSelectedBooks(books);
            }}
            label="الكتب التابعة للمقالة"
          />
        </AdminCard>

        <AdminCard title="المحتوى">
          <ArticleMarkdownHint />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <AdminBilingualField
              arValue={form.title}
              enValue={form.titleEn}
              onArChange={(v) => setForm((p) => ({ ...p, title: v }))}
              onEnChange={(v) => setForm((p) => ({ ...p, titleEn: v }))}
              labels={{ ar: "العنوان (عربي) *", en: "Title (English)" }}
              arRequired
            />
            <AdminBilingualField
              arValue={form.excerpt}
              enValue={form.excerptEn}
              onArChange={(v) => setForm((p) => ({ ...p, excerpt: v }))}
              onEnChange={(v) => setForm((p) => ({ ...p, excerptEn: v }))}
              labels={{ ar: "المقتطف (عربي)", en: "Excerpt (English)" }}
              multiline
              rows={2}
            />
            <AdminBilingualField
              arValue={form.body}
              enValue={form.bodyEn}
              onArChange={(v) => setForm((p) => ({ ...p, body: v }))}
              onEnChange={(v) => setForm((p) => ({ ...p, bodyEn: v }))}
              labels={{ ar: "المحتوى الكامل (عربي)", en: "Full body (English)" }}
              multiline
              rows={16}
            />
          </div>
        </AdminCard>

        {error && (
          <p className="form-error-banner rounded-lg px-4 py-2 text-sm">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-[var(--success-soft)] border border-[var(--success)]/30 px-4 py-2 text-sm text-[var(--success)]">
            تم الحفظ بنجاح
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "جاري الحفظ..." : isNew ? "نشر المقال" : "حفظ التغييرات"}
          </Button>
          {viewHref && (
            <Link href={viewHref}>
              <Button variant="outline" type="button">
                عرض
              </Button>
            </Link>
          )}
          <Link href={`/${locale}/admin/articles`}>
            <Button variant="outline" type="button">
              إلغاء
            </Button>
          </Link>
        </div>
          </div>

          <aside className="hidden xl:block xl:sticky xl:top-4">
            <ArticleLivePreview
              title={form.title}
              titleEn={form.titleEn}
              excerpt={form.excerpt}
              excerptEn={form.excerptEn}
              body={form.body}
              bodyEn={form.bodyEn}
              imageUrl={form.imageUrl || undefined}
            />
          </aside>
        </div>

        <div className="xl:hidden">
          <ArticleLivePreview
            title={form.title}
            titleEn={form.titleEn}
            excerpt={form.excerpt}
            excerptEn={form.excerptEn}
            body={form.body}
            bodyEn={form.bodyEn}
            imageUrl={form.imageUrl || undefined}
          />
        </div>
      </form>
    </div>
  );
}
