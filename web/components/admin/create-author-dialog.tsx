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
import { Textarea } from "@/components/ui/textarea";
import { adminFieldClass } from "@/components/admin/admin-form-field";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { slugify } from "@/lib/admin/slugify";
import type { EntityOption } from "@/components/admin/admin-entity-combobox";

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
  const [name, setName] = useState(initialName);
  const [nameAr, setNameAr] = useState("");
  const [slug, setSlug] = useState(initialName ? slugify(initialName) : "");
  const [bio, setBio] = useState("");
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
    if (!name.trim() && !nameAr.trim()) {
      setError("أدخل اسم المؤلف بالعربية أو الإنجليزية");
      setSaving(false);
      return;
    }
    if (!finalSlug) {
      setError("الرابط المختصر مطلوب");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("/api/v1/admin/authors", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || nameAr.trim(),
          nameAr: nameAr.trim() || undefined,
          slug: finalSlug,
          bio: bio.trim() || undefined,
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
      setName("");
      setNameAr("");
      setSlug("");
      setBio("");
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
          <DialogTitle>مؤلف جديد</DialogTitle>
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
          <div>
            <Label className="text-[var(--brand-gray-300)]">نبذة</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className={adminFieldClass} />
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
