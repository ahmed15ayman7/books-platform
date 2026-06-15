"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { localeHref } from "@/lib/i18n/href";
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
} from "@/components/admin/admin-bilingual-field";
import { adminMediaViewPath } from "@/lib/admin/public-urls";
import { ArticleLivePreview } from "@/components/admin/article-live-preview";
import { AdminRichTextHint } from "@/components/admin/admin-rich-text-hint";
import { useAdminFormShortcuts } from "@/hooks/use-admin-form-shortcuts";
import { adminToast } from "@/lib/admin/admin-toast";
import { ImageUploadField } from "@/components/forms/image-upload-field";

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
  channel: "books-talk",
  status: "draft",
  imageUrl: "",
  youtubeUrl: "",
  date: new Date().toISOString().split("T")[0] ?? "",
};

const channelOptions = [
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
  const [timestamps, setTimestamps] = useState<{ createdAt?: string; updatedAt?: string }>({});
  const [originalId, setOriginalId] = useState<number | null>(null);

  const previewVideoId = useMemo(() => parseYoutubeUrl(form.youtubeUrl).videoId, [form.youtubeUrl]);

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
          channel: String(d.channel ?? "books-talk"),
          status: String(d.status ?? "draft"),
          imageUrl: String(d.imageUrl ?? ""),
          youtubeUrl: String(d.youtubeUrl ?? ""),
          date: d.date ? (new Date(d.date as string).toISOString().split("T")[0] ?? "") : empty.date,
        });
        setOriginalId(typeof d.originalId === "number" ? d.originalId : null);
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

  async function submitMedia(asDraft = false) {
    if (!previewVideoId) {
      adminToast.error("رابط YouTube غير صالح");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        status: asDraft ? "draft" : form.status,
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
        adminToast.error(data.error?.message ?? "فشل الحفظ");
        return;
      }
      adminToast.success(asDraft ? "draft" : isNew ? "create" : "update", "الفيديو");
      const savedId = isNew ? data.data?.id : id;
      if (savedId && isNew) {
        router.push(adminMediaViewPath(locale, savedId));
      }
    } catch {
      adminToast.error("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitMedia(false);
  }

  useAdminFormShortcuts({
    onSave: () => void submitMedia(false),
    onSaveDraft: () => void submitMedia(true),
  });

  const set =
    (k: keyof MediaForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  if (loading) return <div className="text-[var(--admin-text-muted)]">جاري التحميل...</div>;

  const viewHref = !isNew ? adminMediaViewPath(locale, id) : undefined;

  return (
    <div className="text-[var(--admin-text)]">
      <Link
        href={viewHref ?? localeHref(locale, "/admin/media")}
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

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_360px]" data-admin-save-form>
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
              <AdminRichTextHint />
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
                  labels={{ ar: "الوصف (عربي)", en: "Description (English)" }}
                  richText={{ image: true }}
                  editorMinHeight={200}
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard title="الربط والإعدادات">
            <div className="grid gap-4 sm:grid-cols-2">
              <AdminSelect label="القناة" value={form.channel} onChange={set("channel")} options={channelOptions} />
              <AdminSelect label="الحالة" value={form.status} onChange={set("status")} options={statusOptions} />
              <AdminInput label="تاريخ النشر" type="date" value={form.date} onChange={set("date")} />
              <ImageUploadField
                label="صورة الغلاف"
                folder="articles"
                field="image_url"
                originalId={originalId}
                value={form.imageUrl}
                onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                headers={adminAuthHeaders()}
                disabled={isNew}
                placeholder="تلقائي من YouTube"
              />
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
            <Link href={localeHref(locale, "/admin/media")}>
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
