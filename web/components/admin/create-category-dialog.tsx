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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminFieldClass } from "@/components/admin/admin-form-field";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { slugify } from "@/lib/admin/slugify";
import type { EntityOption } from "@/components/admin/admin-entity-combobox";

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
  const [name, setName] = useState(initialName);
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState(initialName ? slugify(initialName) : "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(initialName);
      setSlug(initialName ? slugify(initialName) : "");
      setError("");
    }
  }, [open, initialName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const finalSlug = slug.trim() || slugify(name) || slugify(nameAr);
    if (!name.trim()) {
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
          name: name.trim(),
          nameAr: nameAr.trim() || undefined,
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
      setName("");
      setNameAr("");
      setSlug("");
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
          <div>
            <Label className="text-[var(--brand-gray-300)]">الاسم (EN) *</Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!slug || slug === slugify(name)) setSlug(slugify(e.target.value));
              }}
              className={adminFieldClass}
              dir="ltr"
            />
          </div>
          <div>
            <Label className="text-[var(--brand-gray-300)]">الاسم (AR)</Label>
            <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} className={adminFieldClass} />
          </div>
          <div>
            <Label className="text-[var(--brand-gray-300)]">Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} className={adminFieldClass} dir="ltr" />
          </div>
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
