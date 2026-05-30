"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import {
  AdminInput,
  AdminTextarea,
  AdminSelect,
} from "@/components/admin/admin-form-field";
import { AdminTimestamps } from "@/components/admin/admin-timestamps";

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

type LangTab = "ar" | "en";

export default function AdminArticleEditPage() {
  const params = useParams<{ locale?: string; id: string }>();
  const locale = params.locale ?? "ar";
  const id = params.id;
  const isNew = id === "new";

  const [form, setForm] = useState<ArticleForm>(empty);
  const [tab, setTab] = useState<LangTab>("ar");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timestamps, setTimestamps] = useState<{
    createdAt?: string;
    updatedAt?: string;
  }>({});

  const load = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/articles/${id}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Record<string, unknown> };
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
          date: d.date ? (new Date(d.date as string).toISOString().split("T")[0] ?? "") : empty.date,
        });
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
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const url = isNew ? "/api/v1/admin/articles" : `/api/v1/admin/articles/${id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, date: form.date ? new Date(form.date) : null }),
      });
      const data = await res.json() as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) { setError(data.error?.message ?? "فشل الحفظ"); return; }
      setSuccess(true);
    } catch { setError("حدث خطأ في الاتصال"); }
    finally { setSaving(false); }
  }

  const set = (k: keyof ArticleForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  if (loading) return <div className="text-[var(--brand-gray-400)]">جاري التحميل...</div>;

  return (
    <div className="text-white">
      <Link
        href={`/${locale}/admin/articles`}
        className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--brand-gray-400)] hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        العودة للمقالات
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

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-5">
        <AdminCard title="الإعدادات">
          <div className="grid gap-4 sm:grid-cols-3">
            <AdminSelect
              label="القناة"
              value={form.channel}
              onChange={set("channel")}
              options={channelOptions}
              required
            />
            <AdminSelect
              label="الحالة"
              value={form.status}
              onChange={set("status")}
              options={statusOptions}
            />
            <AdminInput
              label="تاريخ النشر"
              type="date"
              value={form.date}
              onChange={set("date")}
            />
          </div>
          <div className="mt-4">
            <AdminInput
              label="رابط صورة المقال"
              value={form.imageUrl}
              onChange={set("imageUrl")}
              placeholder="https://..."
            />
          </div>
        </AdminCard>

        {/* Language tabs */}
        <AdminCard>
          <div className="mb-4 flex gap-2 border-b border-[var(--brand-gray-800)] pb-3">
            {(["ar", "en"] as LangTab[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setTab(l)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === l
                    ? "bg-[var(--brand-red)] text-white"
                    : "text-[var(--brand-gray-400)] hover:text-white"
                }`}
              >
                {l === "ar" ? "العربية" : "English"}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {tab === "ar" ? (
              <>
                <AdminInput label="العنوان (عربي) *" value={form.title} onChange={set("title")} required />
                <AdminTextarea label="المقتطف (عربي)" rows={2} value={form.excerpt} onChange={set("excerpt")} />
                <AdminTextarea label="المحتوى الكامل (عربي)" rows={12} value={form.body} onChange={set("body")} />
              </>
            ) : (
              <>
                <AdminInput label="Title (English)" value={form.titleEn} onChange={set("titleEn")} />
                <AdminTextarea label="Excerpt (English)" rows={2} value={form.excerptEn} onChange={set("excerptEn")} />
                <AdminTextarea label="Full body (English)" rows={12} value={form.bodyEn} onChange={set("bodyEn")} />
              </>
            )}
          </div>
        </AdminCard>

        {error && <p className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 px-4 py-2 text-sm text-[var(--error)]">{error}</p>}
        {success && <p className="rounded-lg bg-[var(--success-soft)] border border-[var(--success)]/30 px-4 py-2 text-sm text-[var(--success)]">تم الحفظ بنجاح</p>}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>{saving ? "جاري الحفظ..." : isNew ? "نشر المقال" : "حفظ التغييرات"}</Button>
          <Link href={`/${locale}/admin/articles`}><Button variant="outline" type="button">إلغاء</Button></Link>
        </div>
      </form>
    </div>
  );
}
