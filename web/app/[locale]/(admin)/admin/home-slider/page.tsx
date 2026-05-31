"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFieldClass } from "@/components/admin/admin-form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { formatAdminDateTime } from "@/lib/admin/format-dates";

interface HeroSlide {
  id: string;
  titleAr: string;
  titleEn: string | null;
  subtitleAr: string | null;
  subtitleEn: string | null;
  imageUrl: string;
  foregroundImageUrl: string | null;
  linkUrl: string | null;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  titleAr: "",
  titleEn: "",
  subtitleAr: "",
  subtitleEn: "",
  imageUrl: "",
  foregroundImageUrl: "",
  linkUrl: "",
  position: 0,
  isActive: true,
};

export default function AdminHomeSliderPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadSlides = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/hero-slides", {
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
      });
      const data = (await res.json()) as { success: boolean; data?: HeroSlide[] };
      if (data.success && data.data) setSlides(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSlides();
  }, [loadSlides]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function openEdit(slide: HeroSlide) {
    setEditingId(slide.id);
    setForm({
      titleAr: slide.titleAr,
      titleEn: slide.titleEn ?? "",
      subtitleAr: slide.subtitleAr ?? "",
      subtitleEn: slide.subtitleEn ?? "",
      imageUrl: slide.imageUrl,
      foregroundImageUrl: slide.foregroundImageUrl ?? "",
      linkUrl: slide.linkUrl ?? "",
      position: slide.position,
      isActive: slide.isActive,
    });
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      titleAr: form.titleAr,
      titleEn: form.titleEn || null,
      subtitleAr: form.subtitleAr || null,
      subtitleEn: form.subtitleEn || null,
      imageUrl: form.imageUrl,
      foregroundImageUrl: form.foregroundImageUrl || null,
      linkUrl: form.linkUrl || null,
      position: form.position,
      isActive: form.isActive,
    };

    try {
      const url = editingId
        ? `/api/v1/admin/hero-slides/${editingId}`
        : "/api/v1/admin/hero-slides";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) {
        setError(data.error?.message ?? "فشل الحفظ");
        return;
      }
      setForm(emptyForm);
      setEditingId(null);
      await loadSlides();
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(locale === "ar" ? "حذف هذه الشريحة؟" : "Delete this slide?")) return;
    await fetch(`/api/v1/admin/hero-slides/${id}`, {
      method: "DELETE",
      headers: adminAuthHeaders(),
    });
    await loadSlides();
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">سلايدر الرئيسية</h1>
          <p className="text-sm text-[var(--brand-gray-400)]">
            إدارة شرائح الكاروسيل في الصفحة الرئيسية
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          شريحة جديدة
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
        {/* Form */}
        <div className="rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] p-6">
          <h2 className="mb-4 font-semibold text-white">
            {editingId ? "تعديل الشريحة" : "إضافة شريحة"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="العنوان (عربي) *" value={form.titleAr} onChange={(v) => setForm({ ...form, titleAr: v })} required />
            <Field label="العنوان (إنجليزي)" value={form.titleEn} onChange={(v) => setForm({ ...form, titleEn: v })} />
            <Field label="الوصف (عربي)" value={form.subtitleAr} onChange={(v) => setForm({ ...form, subtitleAr: v })} multiline />
            <Field label="الوصف (إنجليزي)" value={form.subtitleEn} onChange={(v) => setForm({ ...form, subtitleEn: v })} multiline />
            <Field label="رابط صورة الخلفية *" value={form.imageUrl} onChange={(v) => setForm({ ...form, imageUrl: v })} />
            <Field label="رابط صورة الكتاب (أمامية)" value={form.foregroundImageUrl} onChange={(v) => setForm({ ...form, foregroundImageUrl: v })} />
            <Field label="رابط عند النقر" value={form.linkUrl} onChange={(v) => setForm({ ...form, linkUrl: v })} />
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="mb-1 text-xs text-[var(--brand-gray-400)]">الترتيب</Label>
                <Input
                  type="number"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: parseInt(e.target.value, 10) || 0 })}
                  className={adminFieldClass}
                />
              </div>
              <div className="flex items-center gap-2 pt-6 text-sm text-white">
                <Checkbox
                  id="slide-active"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isActive: checked === true })
                  }
                  className="border-[var(--brand-gray-600)] data-[state=checked]:bg-[var(--brand-red)]"
                />
                <Label htmlFor="slide-active" className="cursor-pointer font-normal">
                  نشط
                </Label>
              </div>
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? "جاري الحفظ..." : editingId ? "تحديث" : "إضافة"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={openCreate}>
                  إلغاء
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-[var(--brand-gray-400)]">جاري التحميل...</p>
          ) : slides.length === 0 ? (
            <p className="text-[var(--brand-gray-400)]">لا توجد شرائح. أضف شريحة للبدء.</p>
          ) : (
            slides.map((slide) => (
              <div
                key={slide.id}
                className="flex gap-4 rounded-xl border border-[var(--brand-gray-800)] bg-[var(--brand-gray-900)] p-4"
              >
                <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-md bg-[var(--brand-gray-800)]">
                  {slide.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="m-auto h-8 w-8 text-[var(--brand-gray-600)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-white">{slide.titleAr}</p>
                  <p className="text-xs text-[var(--brand-gray-500)]">
                    ترتيب {slide.position} · {slide.isActive ? "نشط" : "معطّل"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--brand-gray-600)]">
                    أُنشئ: {formatAdminDateTime(slide.createdAt)} · آخر تحديث:{" "}
                    {formatAdminDateTime(slide.updatedAt)}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(slide)}
                    className="rounded p-2 text-[var(--brand-gray-400)] hover:bg-[var(--brand-gray-800)] hover:text-white"
                    aria-label="تعديل"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(slide.id)}
                    className="rounded p-2 text-red-400 hover:bg-red-950/50"
                    aria-label="حذف"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  multiline?: boolean;
}) {
  return (
    <div>
      <Label className="mb-1 text-xs text-[var(--brand-gray-400)]">{label}</Label>
      {multiline ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={2}
          className={adminFieldClass}
          required={required}
        />
      ) : (
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={adminFieldClass}
          required={required}
        />
      )}
    </div>
  );
}
