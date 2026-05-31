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
import { AdminInput, AdminTextarea, AdminSlugInput } from "@/components/admin/admin-form-field";
import type { EntityOption } from "@/components/admin/admin-entity-combobox";

interface AuthorFormState {
  name: string;
  nameAr: string;
  slug: string;
  bio: string;
  bioAr: string;
}

const emptyForm: AuthorFormState = {
  name: "",
  nameAr: "",
  slug: "",
  bio: "",
  bioAr: "",
};

interface CreateAuthorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  onCreated: (author: EntityOption) => void;
}

export function CreateAuthorDialog({
  open,
  onOpenChange,
  initialName = "",
  onCreated,
}: CreateAuthorDialogProps) {
  const [form, setForm] = useState<AuthorFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      const seed = initialName.trim();
      setForm({
        name: seed,
        nameAr: "",
        slug: seed ? slugify(seed) : "",
        bio: "",
        bioAr: "",
      });
      setError("");
    }
  }, [open, initialName]);

  const set = (key: keyof AuthorFormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const finalSlug = form.slug.trim() || slugify(form.name);
    if (!form.name.trim() && !form.nameAr.trim()) {
      setError("أدخل اسم المؤلف بالعربية أو الإنجليزية");
      setSaving(false);
      return;
    }
    if (!finalSlug) {
      setError("الرابط المختصر (Slug) مطلوب");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/v1/admin/authors", {
        method: "POST",
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
        data?: EntityOption;
        error?: { message: string };
      };
      if (!res.ok || !data.success || !data.data) {
        setError(data.error?.message ?? "فشل إنشاء المؤلف");
        return;
      }
      onCreated(data.data);
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
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[var(--brand-gray-700)] bg-[var(--brand-gray-900)] text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>مؤلف جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminInput
              label="الاسم (إنجليزي) *"
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
              label="الاسم (عربي)"
              value={form.nameAr}
              onChange={(e) => set("nameAr")(e.target.value)}
            />
          </div>

          <AdminSlugInput
            label="الرابط المختصر (Slug) *"
            value={form.slug}
            onChange={(e) => set("slug")(e.target.value)}
            required
          />

          <AdminTextarea
            label="نبذة (إنجليزي)"
            value={form.bio}
            onChange={(e) => set("bio")(e.target.value)}
            rows={4}
            dir="ltr"
          />
          <AdminTextarea
            label="نبذة (عربي)"
            value={form.bioAr}
            onChange={(e) => set("bioAr")(e.target.value)}
            rows={4}
          />

          {error && <p className="text-xs text-[var(--error)]">{error}</p>}
          <DialogFooter className="gap-2 sm:gap-0">
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
