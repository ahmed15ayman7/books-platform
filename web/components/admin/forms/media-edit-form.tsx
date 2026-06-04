"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminSelect } from "@/components/admin/admin-form-field";
import { AdminTimestamps } from "@/components/admin/admin-timestamps";
import { BookMultiPicker, type BookPickerItem } from "@/components/admin/book-multi-picker";
import { YoutubeEmbed } from "@/components/sections/youtube-embed";
import { parseYoutubeUrl, youtubeThumbnail } from "@/lib/media/youtube";
import {
  AdminBilingualField,
  AdminBilingualToolbar,
} from "@/components/admin/admin-bilingual-field";
import { useBilingualAutoTranslate } from "@/hooks/use-bilingual-auto-translate";
import { adminMediaViewPath } from "@/lib/admin/public-urls";
import { ArticleLivePreview } from "@/components/admin/article-live-preview";
import { ArticleMarkdownHint } from "@/components/admin/article-markdown-hint";

interface MediaForm {
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

const empty: MediaForm = {
  title: "",
  titleEn: "",
  excerpt: "",
  excerptEn: "",
  body: "",
  bodyEn: "",
  channel: "watch-your-book",
  status: "draft",
  imageUrl: "",
  youtubeUrl: "",
  date: new Date().toISOString().split("T")[0] ?? "",
};

const channelOptions = [
  { value: "watch-your-book", label: "شاهد كتابك" },
  { value: "books-talk", label: "حديث الكتب" },
  { value: "novel-story", label: "رواية فحكاية" },
];

const statusOptions = [
  { value: "draft", label: "مسودة" },
  { value: "publish", label: "منشور" },
  { value: "scheduled", label: "مجدول" },
];

interface MediaEditFormProps {
  locale: string;
  id: string;
}

export function MediaEditForm({ locale, id }: MediaEditFormProps) {
  const router = useRouter();
  const isNew = id === "new";

  const [form, setForm] = useState<MediaForm>(empty);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<BookPickerItem[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timestamps, setTimestamps] = useState<{ createdAt?: string; updatedAt?: string }>({});

  const previewVideoId = useMemo(() => parseYoutubeUrl(form.youtubeUrl).videoId, [form.youtubeUrl]);

  const titleTranslate = useBilingualAutoTranslate({
    ar: form.title,
    en: form.titleEn,
    onArChange: (v) => setForm((p) => ({ ...p, title: v })),
    onEnChange: (v) => setForm((p) => ({ ...p, titleEn: v })),
  });

  const load = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/articles/${id}`, { headers: adminAuthHeaders() });
      const data = await res.json() as {
        success: boolean;
        data?: Record<string, unknown> & { products?: BookPickerItem[] };
      };
      if (data.success && data.data) {
        const d = data.data;
        setForm({
          title: String(d.title ?? ""),
          titleEn: String(d.titleEn ?? ""),
          excerpt: String(d.excerpt ?? ""),
          excerptEn: String(d.excerptEn ?? ""),
          body: String(d.body ?? d.content ?? ""),
          bodyEn: String(d.bodyEn ?? ""),
          channel: String(d.channel ?? "watch-your-book"),
          status: String(d.status ?? "draft"),
          imageUrl: String(d.imageUrl ?? ""),
          youtubeUrl: String(d.youtubeUrl ?? ""),
          date: d.date ? (new Date(d.date as string).toISOString().split("T")[0] ?? "") : empty.date,
        });
        const products = (d.products ?? []) as BookPickerItem[];
        setProductIds(products.map((p) => p.id));
        setSelectedBooks(products);
        setTimestamps({
          createdAt: d.createdAt as string | undefined,
          updatedAt: d.updatedAt as string | undefined,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!previewVideoId) {
      setError("رابط YouTube غير صالح");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const payload = {
        ...form,
        body: form.body,
        bodyEn: form.bodyEn,
        productIds,
        date: form.date ? new Date(form.date) : null,
        imageUrl: form.imageUrl || youtubeThumbnail(previewVideoId),
      };
      const url = isNew ? "/api/v1/admin/articles" : `/api/v1/admin/articles/${id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json() as { success: boolean; error?: { message: string }; data?: { id: string } };
      if (!res.ok || !data.success) {
        setError(data.error?.message ?? "فشل الحفظ");
        return;
      }
      setSuccess(true);
      const savedId = isNew ? data.data?.id : id;
      if (savedId && isNew) {
        router.push(adminMediaViewPath(locale, savedId));
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  const set =
    (k: keyof MediaForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  if (loading) return <div className="text-[var(--admin-text-muted)]">جاري التحميل...</div>;

  const viewHref = !isNew ? adminMediaViewPath(locale, id) : undefined;

  return (
    <div className="text-[var(--admin-text)]">
      <Link
        href={viewHref ?? `/${locale}/admin/media`}
        className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {isNew ? "العودة للميديا" : "العودة للعرض"}
      </Link>

      <h1 className="mb-2 text-2xl font-bold">{isNew ? "إضافة فيديو" : "تعديل فيديو"}</h1>
      {!isNew && (
        <AdminTimestamps
          createdAt={timestamps.createdAt}
          updatedAt={timestamps.updatedAt}
          compact
          className="mb-5"
        />
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <AdminCard title="بيانات الفيديو">
            <div className="space-y-4">
              <AdminInput
                label="رابط YouTube *"
                value={form.youtubeUrl}
                onChange={set("youtubeUrl")}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <ArticleMarkdownHint />
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <AdminBilingualToolbar
                  translating={titleTranslate.translating}
                  autoEnabled={titleTranslate.autoEnabled}
                  onToggleAuto={() => titleTranslate.setAutoEnabled((v) => !v)}
                  onArToEn={() => void titleTranslate.forceTranslateArToEn()}
                  onEnToAr={() => void titleTranslate.forceTranslateEnToAr()}
                  arDisabled={!form.title.trim()}
                  enDisabled={!form.titleEn.trim()}
                />
                <AdminBilingualField
                  arValue={form.title}
                  enValue={form.titleEn}
                  onArChange={(v) => setForm((p) => ({ ...p, title: v }))}
                  onEnChange={(v) => setForm((p) => ({ ...p, titleEn: v }))}
                  labels={{ ar: "العنوان (عربي) *", en: "Title (English)" }}
                  arRequired
                  showToolbar={false}
                  layout="full"
                />
                <AdminBilingualField
                  arValue={form.excerpt}
                  enValue={form.excerptEn}
                  onArChange={(v) => setForm((p) => ({ ...p, excerpt: v }))}
                  onEnChange={(v) => setForm((p) => ({ ...p, excerptEn: v }))}
                  labels={{ ar: "المقتطف (عربي)", en: "Excerpt (English)" }}
                  multiline
                  rows={2}
                  showToolbar={false}
                  layout="full"
                />
                <AdminBilingualField
                  arValue={form.body}
                  enValue={form.bodyEn}
                  onArChange={(v) => setForm((p) => ({ ...p, body: v }))}
                  onEnChange={(v) => setForm((p) => ({ ...p, bodyEn: v }))}
                  labels={{ ar: "الوصف (عربي)", en: "Description (English)" }}
                  multiline
                  rows={4}
                  showToolbar={false}
                  layout="full"
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="الربط والإعدادات">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminSelect label="القناة" value={form.channel} onChange={set("channel")} options={channelOptions} />
              <AdminSelect label="الحالة" value={form.status} onChange={set("status")} options={statusOptions} />
              <AdminInput label="تاريخ النشر" type="date" value={form.date} onChange={set("date")} />
              <AdminInput label="صورة الغلاف" value={form.imageUrl} onChange={set("imageUrl")} placeholder="تلقائي من YouTube" />
            </div>
            <div className="mt-4">
              <BookMultiPicker
                value={productIds}
                selectedBooks={selectedBooks}
                onChange={(ids, books) => {
                  setProductIds(ids);
                  setSelectedBooks(books);
                }}
                label="الكتاب المرتبط (اختياري)"
                placeholder="ابحث عن كتاب..."
              />
            </div>
          </AdminCard>

          {error && (
            <p className="rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-2 text-sm text-[var(--error)]">
              {error}
            </p>
          )}
          {success && (
            <p className="rounded-lg border border-[var(--success)]/30 bg-[var(--success-soft)] px-4 py-2 text-sm text-[var(--success)]">
              تم الحفظ بنجاح
            </p>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving || !previewVideoId}>
              {saving ? "جاري الحفظ..." : isNew ? "نشر" : "حفظ"}
            </Button>
            {viewHref && (
              <Link href={viewHref}>
                <Button variant="outline" type="button">
                  عرض
                </Button>
              </Link>
            )}
            <Link href={`/${locale}/admin/media`}>
              <Button variant="outline" type="button">
                إلغاء
              </Button>
            </Link>
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <AdminCard title="معاينة">
            {previewVideoId ? (
              <YoutubeEmbed videoId={previewVideoId} title={form.title || "YouTube preview"} />
            ) : (
              <p className="text-sm text-[var(--admin-text-muted)]">الصق رابط YouTube للمعاينة</p>
            )}
          </AdminCard>
          {selectedBooks[0] && (
            <AdminCard title="الكتاب">
              <p className="text-sm font-medium">{selectedBooks[0].nameAr ?? selectedBooks[0].nameEn}</p>
            </AdminCard>
          )}
          {(form.body || form.bodyEn) && (
            <ArticleLivePreview
              title={form.title}
              titleEn={form.titleEn}
              excerpt={form.excerpt}
              excerptEn={form.excerptEn}
              body={form.body}
              bodyEn={form.bodyEn}
              imageUrl={form.imageUrl || undefined}
            />
          )}
        </aside>
      </form>
    </div>
  );
}
