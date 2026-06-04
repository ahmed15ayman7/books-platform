"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminTextarea, AdminSelect } from "@/components/admin/admin-form-field";
import { AdminTimestamps } from "@/components/admin/admin-timestamps";
import { BookMultiPicker, type BookPickerItem } from "@/components/admin/book-multi-picker";
import { YoutubeEmbed } from "@/components/sections/youtube-embed";
import { parseYoutubeUrl, youtubeThumbnail } from "@/lib/media/youtube";

interface MediaForm {
  title: string;
  excerpt: string;
  body: string;
  channel: string;
  status: string;
  imageUrl: string;
  youtubeUrl: string;
  date: string;
}

const empty: MediaForm = {
  title: "",
  excerpt: "",
  body: "",
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

export default function AdminMediaEditPage() {
  const params = useParams<{ locale?: string; id: string }>();
  const router = useRouter();
  const locale = params.locale ?? "ar";
  const id = params.id;
  const isNew = id === "new";

  const [form, setForm] = useState<MediaForm>(empty);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [selectedBooks, setSelectedBooks] = useState<BookPickerItem[]>([]);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timestamps, setTimestamps] = useState<{ createdAt?: string; updatedAt?: string }>({});

  const previewVideoId = useMemo(
    () => parseYoutubeUrl(form.youtubeUrl).videoId,
    [form.youtubeUrl],
  );

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
          excerpt: String(d.excerpt ?? ""),
          body: String(d.body ?? d.content ?? ""),
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

  useEffect(() => { void load(); }, [load]);

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
      if (isNew && data.data?.id) {
        router.push(`/${locale}/admin/media/${data.data.id}`);
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  const set = (k: keyof MediaForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  if (loading) return <div className="text-[var(--admin-text-muted)]">جاري التحميل...</div>;

  return (
    <div className="text-[var(--admin-text)]">
      <Link
        href={`/${locale}/admin/media`}
        className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        العودة للميديا
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
              <AdminInput label="العنوان *" value={form.title} onChange={set("title")} required />
              <AdminInput
                label="رابط YouTube *"
                value={form.youtubeUrl}
                onChange={set("youtubeUrl")}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
              <AdminTextarea label="المقتطف" rows={2} value={form.excerpt} onChange={set("excerpt")} />
              <AdminTextarea label="الوصف (اختياري)" rows={4} value={form.body} onChange={set("body")} />
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
            <Link href={`/${locale}/admin/media`}>
              <Button variant="outline" type="button">إلغاء</Button>
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
        </aside>
      </form>
    </div>
  );
}
