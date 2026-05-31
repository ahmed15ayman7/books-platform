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

export interface PublisherOption {
  id: string;
  title: string;
  slug: string;
}

interface CreatePublisherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialName?: string;
  onCreated: (publisher: PublisherOption) => void;
}

export function CreatePublisherDialog({
  open,
  onOpenChange,
  initialName = "",
  onCreated,
}: CreatePublisherDialogProps) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(initialName);
      setError("");
    }
  }, [open, initialName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("اسم دار النشر مطلوب");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/publishers", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), status: "publish" }),
      });
      const data = await res.json() as {
        success: boolean;
        data?: { id: string; title?: string; slug?: string };
        error?: { message: string };
      };
      if (!res.ok || !data.success || !data.data) {
        setError(data.error?.message ?? "فشل إنشاء دار النشر");
        return;
      }
      onCreated({
        id: data.data.id,
        title: data.data.title ?? name.trim(),
        slug: data.data.slug ?? "",
      });
      onOpenChange(false);
      setName("");
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
          <DialogTitle>دار نشر جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label className="text-[var(--brand-gray-300)]">اسم دار النشر *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className={adminFieldClass} />
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
