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
import { AdminInput, AdminSlugInput } from "@/components/admin/admin-form-field";
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      const seed = initialName.trim();
      setForm({
        name: seed,
        nameAr: "",
        slug: seed ? slugify(seed) : "",
      });
      setError("");
    }
  }, [open, initialName]);

  const set = (key: keyof CategoryFormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const finalSlug = form.slug.trim() || slugify(form.name);
    if (!form.name.trim()) {
      setError("الاسم بالإنجليزية مطلوب");
      setSaving(false);
      return;
    }
    if (!finalSlug) {
      setError("Slug مطلوب");
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
        setError(data.error?.message ?? "فشل إنشاء التصنيف");
        return;
      }
      onCreated({
        id: data.data.id,
        name: data.data.name,
        nameAr: data.data.nameAr,
        slug: data.data.slug,
      });
      onOpenChange(false);
      setForm(emptyForm);
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-[var(--brand-gray-700)] bg-[var(--brand-gray-900)] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تصنيف جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <AdminInput
            label="الاسم (EN) *"
            value={form.name}
            onChange={(e) => {
              const name = e.target.value;
              setForm((prev) => ({
                ...prev,
                name,
                slug: autoSlugFromEnglish(name, prev.slug, prev.name),
              }));
            }}
            dir="ltr"
            required
          />
          <AdminInput
            label="الاسم (AR)"
            value={form.nameAr}
            onChange={(e) => set("nameAr")(e.target.value)}
          />
          <AdminSlugInput
            label="Slug"
            value={form.slug}
            onChange={(e) => set("slug")(e.target.value)}
          />
          {error && <p className="text-xs text-[var(--error)]">{error}</p>}
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
