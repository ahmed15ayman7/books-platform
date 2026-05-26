"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";

interface BookForm {
  nameEn: string;
  nameAr: string;
  shortDesc: string;
  shortDescAr: string;
  description: string;
  descriptionAr: string;
  language: string;
  translationStatus: string;
  imageUrl: string;
  published: boolean;
  featured: boolean;
}

const emptyForm: BookForm = {
  nameEn: "",
  nameAr: "",
  shortDesc: "",
  shortDescAr: "",
  description: "",
  descriptionAr: "",
  language: "",
  translationStatus: "NOT_TRANSLATED",
  imageUrl: "",
  published: true,
  featured: false,
};

type LangTab = "ar" | "en";

export default function AdminBookEditPage() {
  const params = useParams<{ locale?: string; id: string }>();
  const locale = params.locale ?? "ar";
  const id = params.id;
  const [form, setForm] = useState<BookForm>(emptyForm);
  const [slug, setSlug] = useState("");
  const [tab, setTab] = useState<LangTab>("ar");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadBook = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/books/${id}`, {
        headers: adminAuthHeaders(),
      });
      const data = (await res.json()) as {
        success: boolean;
        data?: Record<string, unknown>;
        error?: { message: string };
      };
      if (!res.ok || !data.success || !data.data) {
        setError(data.error?.message ?? "لم يُعثر على الكتاب");
        return;
      }
      const book = data.data;
      setSlug(String(book["slug"] ?? ""));
      setForm({
        nameEn: String(book["nameEn"] ?? ""),
        nameAr: String(book["nameAr"] ?? ""),
        shortDesc: String(book["shortDesc"] ?? ""),
        shortDescAr: String(book["shortDescAr"] ?? ""),
        description: String(book["description"] ?? ""),
        descriptionAr: String(book["descriptionAr"] ?? ""),
        language: String(book["language"] ?? ""),
        translationStatus: String(book["translationStatus"] ?? "NOT_TRANSLATED"),
        imageUrl: String(book["imageUrl"] ?? ""),
        published: Boolean(book["published"]),
        featured: Boolean(book["featured"]),
      });
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadBook();
  }, [loadBook]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/books/${id}`, {
        method: "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn: form.nameEn,
          nameAr: form.nameAr || null,
          shortDesc: form.shortDesc || null,
          shortDescAr: form.shortDescAr || null,
          description: form.description || null,
          descriptionAr: form.descriptionAr || null,
          language: form.language || null,
          translationStatus: form.translationStatus,
          imageUrl: form.imageUrl || null,
          published: form.published,
          featured: form.featured,
        }),
      });
      const data = (await res.json()) as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) {
        setError(data.error?.message ?? "فشل الحفظ");
        return;
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-[var(--brand-gray-400)]">جاري التحميل...</div>;
  }

  return (
    <div className="p-8">
      <Link
        href={`/${locale}/admin/books`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--brand-gray-400)] hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        العودة للقائمة
      </Link>

      <h1 className="mb-2 text-2xl font-bold text-white">تعديل كتاب</h1>
      {slug && (
        <p className="mb-6 text-sm text-[var(--brand-gray-500)]" dir="ltr">
          /books/{slug}
        </p>
      )}

      <div className="max-w-3xl rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] p-6">
        <div className="mb-6 flex gap-2 border-b border-[var(--brand-gray-800)] pb-4">
          <button
            type="button"
            onClick={() => setTab("ar")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              tab === "ar"
                ? "bg-[var(--brand-red)] text-white"
                : "text-[var(--brand-gray-400)] hover:text-white"
            }`}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => setTab("en")}
            className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
              tab === "en"
                ? "bg-[var(--brand-red)] text-white"
                : "text-[var(--brand-gray-400)] hover:text-white"
            }`}
          >
            English
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === "ar" ? (
            <>
              <AdminField
                label="العنوان (عربي)"
                value={form.nameAr}
                onChange={(v) => setForm({ ...form, nameAr: v })}
              />
              <AdminField
                label="وصف مختصر (عربي)"
                value={form.shortDescAr}
                onChange={(v) => setForm({ ...form, shortDescAr: v })}
                multiline
              />
              <AdminField
                label="الوصف الكامل (عربي)"
                value={form.descriptionAr}
                onChange={(v) => setForm({ ...form, descriptionAr: v })}
                multiline
                rows={8}
              />
            </>
          ) : (
            <>
              <AdminField
                label="Title (English) *"
                value={form.nameEn}
                onChange={(v) => setForm({ ...form, nameEn: v })}
                required
              />
              <AdminField
                label="Short description (EN)"
                value={form.shortDesc}
                onChange={(v) => setForm({ ...form, shortDesc: v })}
                multiline
              />
              <AdminField
                label="Full description (EN)"
                value={form.description}
                onChange={(v) => setForm({ ...form, description: v })}
                multiline
                rows={8}
              />
            </>
          )}

          <hr className="border-[var(--brand-gray-800)]" />

          <div className="grid gap-4 sm:grid-cols-2">
            <AdminField
              label="لغة الكتاب"
              value={form.language}
              onChange={(v) => setForm({ ...form, language: v })}
            />
            <div>
              <label className="mb-1 block text-xs text-[var(--brand-gray-400)]">حالة الترجمة</label>
              <select
                value={form.translationStatus}
                onChange={(e) => setForm({ ...form, translationStatus: e.target.value })}
                className="w-full rounded-md border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] px-3 py-2 text-sm text-white"
              >
                <option value="NOT_TRANSLATED">NOT_TRANSLATED</option>
                <option value="NOMINATED">NOMINATED</option>
                <option value="TRANSLATED">TRANSLATED</option>
              </select>
            </div>
          </div>

          <AdminField
            label="رابط صورة الغلاف"
            value={form.imageUrl}
            onChange={(v) => setForm({ ...form, imageUrl: v })}
          />

          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => setForm({ ...form, published: e.target.checked })}
              />
              منشور
            </label>
            <label className="flex items-center gap-2 text-sm text-white">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              مميز
            </label>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" disabled={saving}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function AdminField({
  label,
  value,
  onChange,
  multiline,
  rows = 3,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
}) {
  const className =
    "w-full rounded-md border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] px-3 py-2 text-sm text-white focus:border-[var(--brand-red)] focus:outline-none";
  return (
    <div>
      <label className="mb-1 block text-xs text-[var(--brand-gray-400)]">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className={className}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={className}
        />
      )}
    </div>
  );
}
