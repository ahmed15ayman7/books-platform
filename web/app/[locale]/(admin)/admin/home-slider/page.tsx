"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Plus, Pencil, Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFieldClass, AdminInput } from "@/components/admin/admin-form-field";
import { AdminBilingualField } from "@/components/admin/admin-bilingual-field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageUploadField } from "@/components/forms/image-upload-field";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { formatAdminDateTime } from "@/lib/admin/format-dates";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";
import { adminToast } from "@/lib/admin/admin-toast";

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
  const draft = useFormDraft(formDraftId.adminHomeSlide(editingId), form, setForm);
  const [saving, setSaving] = useState(false);

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
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
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
        adminToast.error(data.error?.message ?? "فشل الحفظ");
        return;
      }
      adminToast.success(editingId ? "update" : "create", "الشريحة");
      setForm(emptyForm);
      setEditingId(null);
      draft.clearDraft();
      await loadSlides();
    } catch {
      adminToast.error("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(locale === "ar" ? "حذف هذه الشريحة؟" : "Delete this slide?")) return;
    try {
      const res = await fetch(`/api/v1/admin/hero-slides/${id}`, {
        method: "DELETE",
        headers: adminAuthHeaders(),
      });
      const data = (await res.json()) as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) {
        adminToast.error(data.error?.message ?? "فشل الحذف");
        return;
      }
      adminToast.success("delete", "الشريحة");
      await loadSlides();
    } catch {
      adminToast.error("حدث خطأ في الاتصال");
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--admin-text)]">سلايدر الرئيسية</h1>
          <p className="text-sm text-[var(--admin-text-muted)]">
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
        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6">
          <h2 className="mb-4 font-semibold text-[var(--admin-text)]">
            {editingId ? "تعديل الشريحة" : "إضافة شريحة"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3" data-admin-save-form>
            <FormDraftNotice
              showBanner={draft.showBanner}
              status={draft.status}
              onResume={draft.resume}
              onDismiss={draft.dismiss}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminBilingualField
                arValue={form.titleAr}
                enValue={form.titleEn}
                onArChange={(v) => setForm((p) => ({ ...p, titleAr: v }))}
                onEnChange={(v) => setForm((p) => ({ ...p, titleEn: v }))}
                labels={{ ar: "العنوان (عربي) *", en: "العنوان (إنجليزي)" }}
                arRequired
              />
              <AdminBilingualField
                arValue={form.subtitleAr}
                enValue={form.subtitleEn}
                onArChange={(v) => setForm((p) => ({ ...p, subtitleAr: v }))}
                onEnChange={(v) => setForm((p) => ({ ...p, subtitleEn: v }))}
                labels={{ ar: "الوصف (عربي)", en: "الوصف (إنجليزي)" }}
                multiline
                rows={2}
              />
            </div>
            <ImageUploadField
              label="صورة الخلفية *"
              folder="hero"
              field="image_url"
              entityId={editingId ?? undefined}
              value={form.imageUrl}
              onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
              headers={adminAuthHeaders()}
              disabled={!editingId}
            />
            {!editingId && (
              <p className="text-xs text-[var(--admin-text-muted)]">
                احفظ الشريحة أولاً لرفع الصورة
              </p>
            )}
            <ImageUploadField
              label="صورة الكتاب (أمامية)"
              folder="hero"
              field="foreground_image_url"
              entityId={editingId ?? undefined}
              value={form.foregroundImageUrl}
              onChange={(url) => setForm((p) => ({ ...p, foregroundImageUrl: url }))}
              headers={adminAuthHeaders()}
              disabled={!editingId}
            />
            <AdminInput label="رابط عند النقر" value={form.linkUrl} onChange={(e) => setForm({ ...form, linkUrl: e.target.value })} />
            <div className="flex gap-4">
              <div className="flex-1">
                <Label className="mb-1 text-xs text-[var(--admin-text-muted)]">الترتيب</Label>
                <Input
                  type="number"
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: parseInt(e.target.value, 10) || 0 })}
                  className={adminFieldClass}
                />
              </div>
              <div className="flex items-center gap-2 pt-6 text-sm text-[var(--admin-text)]">
                <Checkbox
                  id="slide-active"
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, isActive: checked === true })
                  }
                  className="border-[var(--admin-input-border)] data-[state=checked]:bg-[var(--brand-red)]"
                />
                <Label htmlFor="slide-active" className="cursor-pointer font-normal">
                  نشط
                </Label>
              </div>
            </div>
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
            <p className="text-[var(--admin-text-muted)]">جاري التحميل...</p>
          ) : slides.length === 0 ? (
            <p className="text-[var(--admin-text-muted)]">لا توجد شرائح. أضف شريحة للبدء.</p>
          ) : (
            slides.map((slide) => (
              <div
                key={slide.id}
                className="flex gap-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4"
              >
                <div className="relative h-20 w-32 flex-shrink-0 overflow-hidden rounded-md bg-[var(--admin-surface-muted)]">
                  {slide.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={slide.imageUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="m-auto h-8 w-8 text-[var(--admin-text-subtle)]" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-[var(--admin-text)]">{slide.titleAr}</p>
                  <p className="text-xs text-[var(--admin-text-subtle)]">
                    ترتيب {slide.position} · {slide.isActive ? "نشط" : "معطّل"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--admin-text-subtle)]">
                    أُنشئ: {formatAdminDateTime(slide.createdAt)} · آخر تحديث:{" "}
                    {formatAdminDateTime(slide.updatedAt)}
                  </p>
                </div>
                <div className="flex flex-shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(slide)}
                    className="rounded p-2 text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)]"
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
