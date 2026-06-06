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
import type { EntityOption } from "@/components/admin/admin-entity-combobox";

interface CategoryFormState {
  name: string;
  nameAr: string;
  slug: string;
}

const emptyForm: CategoryFormState = { name: "", nameAr: "", slug: "" };

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  onCreated: (category: EntityOption) => void;
}

export function CreateCategoryDialog({
  open,
  onOpenChange,
  initialName = "",
  onCreated,
}: CreateCategoryDialogProps) {
  const [form, setForm] = useState<CategoryFormState>(emptyForm);
  const draft = useFormDraft(formDraftId.adminCategoryDialog(), form, setForm, { enabled: open });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      const seed = initialName.trim();
      setForm({
        name: seed,
        nameAr: "",
        slug: seed ? slugify(seed) : "",
      });
    }
  }, [open, initialName]);

  const set = (key: keyof CategoryFormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const finalSlug = form.slug.trim() || slugify(form.name);
    if (!form.name.trim()) {
      adminToast.error("الاسم بالإنجليزية مطلوب");
      setSaving(false);
      return;
    }
    if (!finalSlug) {
      adminToast.error("Slug مطلوب");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("/api/v1/admin/categories", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          nameAr: form.nameAr.trim() || undefined,
          slug: finalSlug,
          active: true,
        }),
      });
      const data = await res.json() as {
        success: boolean;
        data?: EntityOption;
        error?: { message: string };
      };
      if (!res.ok || !data.success || !data.data) {
        adminToast.error(data.error?.message ?? "فشل إنشاء التصنيف");
        return;
      }
      adminToast.success("create", "التصنيف");
      onCreated({
        id: data.data.id,
        name: data.data.name,
        nameAr: data.data.nameAr,
        slug: data.data.slug,
      });
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
      <DialogContent className="border-[var(--admin-border)] bg-white text-[var(--admin-text)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تصنيف جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
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
              onArChange={(v) => setForm((prev) => ({ ...prev, nameAr: v }))}
              onEnChange={(v) => {
                setForm((prev) => ({
                  ...prev,
                  name: v,
                  slug: autoSlugFromEnglish(v, prev.slug, prev.name),
                }));
              }}
              labels={{ ar: "الاسم (AR)", en: "الاسم (EN) *" }}
              layout="half"
              enRequired
            />
          </div>
          <AdminSlugInput
            label="Slug"
            value={form.slug}
            onChange={(e) => set("slug")(e.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "جارٍ الحفظ…" : "إنشاء وتحديد"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
