"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { slugify, autoSlugFromEnglish } from "@/lib/admin/slugify";
import { AdminSlugInput } from "@/components/admin/admin-form-field";
import { AdminBilingualField } from "@/components/admin/admin-bilingual-field";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";
import { adminToast } from "@/lib/admin/admin-toast";

export interface AuthorFormValues {
  id?: string;
  name: string;
  nameAr: string;
  slug: string;
  bio: string;
  bioAr: string;
}

export interface AuthorSavedPayload {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  bio?: string | null;
  bioAr?: string | null;
}

const emptyForm: AuthorFormValues = {
  name: "",
  nameAr: "",
  slug: "",
  bio: "",
  bioAr: "",
};

interface AuthorFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** بيانات للتعديل؛ `null` = إنشاء جديد */
  author: AuthorFormValues | null;
  initialName?: string;
  onSaved?: (author: AuthorSavedPayload) => void;
  createSubmitLabel?: string;
}

export function AuthorFormDialog({
  open,
  onOpenChange,
  author,
  initialName = "",
  onSaved,
  createSubmitLabel = "إنشاء",
}: AuthorFormDialogProps) {
  const isEdit = Boolean(author?.id);
  const [form, setForm] = useState<AuthorFormValues>(emptyForm);
  const draft = useFormDraft(formDraftId.adminAuthor(author?.id), form, setForm, { enabled: open });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (author?.id) {
      setForm({
        id: author.id,
        name: author.name,
        nameAr: author.nameAr ?? "",
        slug: author.slug,
        bio: author.bio ?? "",
        bioAr: author.bioAr ?? "",
      });
    } else {
      const seed = initialName.trim();
      setForm({
        name: seed,
        nameAr: "",
        slug: seed ? slugify(seed) : "",
        bio: "",
        bioAr: "",
      });
    }
  }, [open, author, initialName]);

  const set = (key: keyof AuthorFormValues) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const finalSlug = form.slug.trim() || slugify(form.name);
    if (!form.name.trim() && !form.nameAr.trim()) {
      adminToast.error("أدخل اسم المؤلف بالعربية أو الإنجليزية");
      setSaving(false);
      return;
    }
    if (!finalSlug) {
      adminToast.error("الرابط المختصر (Slug) مطلوب");
      setSaving(false);
      return;
    }

    try {
      const url = isEdit ? `/api/v1/admin/authors/${author!.id}` : "/api/v1/admin/authors";
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim() || form.nameAr.trim(),
          nameAr: form.nameAr.trim() || undefined,
          slug: finalSlug,
          bio: form.bio.trim() || undefined,
          bioAr: form.bioAr.trim() || undefined,
        }),
      });
      const data = await res.json() as {
        success: boolean;
        data?: AuthorSavedPayload;
        error?: { message: string };
      };
      if (!res.ok || !data.success || !data.data) {
        adminToast.error(data.error?.message ?? "فشل الحفظ");
        return;
      }
      adminToast.success(isEdit ? "update" : "create", "المؤلف");
      onSaved?.(data.data);
      draft.clearDraft();
      onOpenChange(false);
      setForm(emptyForm);
    } catch {
      adminToast.error("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[var(--admin-border)] bg-white text-[var(--admin-text)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "تعديل المؤلف" : "مؤلف جديد"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormDraftNotice
            showBanner={draft.showBanner}
            status={draft.status}
            onResume={draft.resume}
            onDismiss={draft.dismiss}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminBilingualField
              arValue={form.nameAr}
              enValue={form.name}
              onArChange={(v) => set("nameAr")(v)}
              onEnChange={(v) => {
                setForm((prev) => ({
                  ...prev,
                  name: v,
                  slug: autoSlugFromEnglish(v, prev.slug, prev.name),
                }));
              }}
              labels={{ ar: "الاسم (عربي)", en: "الاسم (إنجليزي) *" }}
              layout="half"
              enRequired
            />
          </div>

          <AdminSlugInput
            label="الرابط المختصر (Slug) *"
            value={form.slug}
            onChange={(e) => set("slug")(e.target.value)}
            required
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <AdminBilingualField
              arValue={form.bioAr}
              enValue={form.bio}
              onArChange={(v) => set("bioAr")(v)}
              onEnChange={(v) => set("bio")(v)}
              labels={{ ar: "نبذة (عربي)", en: "نبذة (إنجليزي)" }}
              multiline
              rows={4}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "جارٍ الحفظ…" : isEdit ? "حفظ التغييرات" : createSubmitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
