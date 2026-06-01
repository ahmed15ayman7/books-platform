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
import {
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminCheckbox,
} from "@/components/admin/admin-form-field";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";

export interface PublisherOption {
  id: string;
  title: string;
  slug: string;
}

interface PublisherFormState {
  name: string;
  nameAr: string;
  country: string;
  websiteUrl: string;
  contactEmail: string;
  content: string;
  contentAr: string;
  imageUrl: string;
  status: string;
  sponsored: boolean;
}

const emptyForm: PublisherFormState = {
  name: "",
  nameAr: "",
  country: "",
  websiteUrl: "",
  contactEmail: "",
  content: "",
  contentAr: "",
  imageUrl: "",
  status: "publish",
  sponsored: false,
};

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
  const [form, setForm] = useState<PublisherFormState>(emptyForm);
  const draft = useFormDraft(formDraftId.adminPublisherDialog(), form, setForm, { enabled: open });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({ ...emptyForm, nameAr: initialName.trim() });
      setError("");
    }
  }, [open, initialName]);

  const set = (key: keyof PublisherFormState) => (value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameAr.trim() && !form.name.trim()) {
      setError("اسم دار النشر (عربي أو إنجليزي) مطلوب");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/publishers", {
        method: "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as {
        success: boolean;
        data?: { id: string; title?: string; nameAr?: string; name?: string; slug?: string };
        error?: { message: string };
      };
      if (!res.ok || !data.success || !data.data) {
        setError(data.error?.message ?? "فشل إنشاء دار النشر");
        return;
      }
      onCreated({
        id: data.data.id,
        title: data.data.title ?? data.data.nameAr ?? data.data.name ?? form.nameAr.trim(),
        slug: data.data.slug ?? "",
      });
      draft.clearDraft();
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
      <DialogContent className="max-h-[90vh] overflow-y-auto border-[var(--admin-border)] bg-white text-[var(--admin-text)] sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>دار نشر جديدة</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <FormDraftNotice
            showBanner={draft.showBanner}
            status={draft.status}
            onResume={draft.resume}
            onDismiss={draft.dismiss}
          />
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-subtle)]">
              البيانات الأساسية
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminInput
                label="الاسم (عربي) *"
                value={form.nameAr}
                onChange={(e) => set("nameAr")(e.target.value)}
                required
              />
              <AdminInput
                label="الاسم (إنجليزي)"
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                dir="ltr"
              />
              <AdminInput
                label="الدولة"
                value={form.country}
                onChange={(e) => set("country")(e.target.value)}
              />
              <AdminInput
                label="رابط الموقع"
                type="url"
                value={form.websiteUrl}
                onChange={(e) => set("websiteUrl")(e.target.value)}
                dir="ltr"
              />
              <AdminInput
                label="البريد الإلكتروني للتواصل"
                type="email"
                value={form.contactEmail}
                onChange={(e) => set("contactEmail")(e.target.value)}
                dir="ltr"
              />
              <AdminInput
                label="رابط صورة الغلاف"
                type="url"
                value={form.imageUrl}
                onChange={(e) => set("imageUrl")(e.target.value)}
                dir="ltr"
              />
            </div>
            {form.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.imageUrl}
                alt=""
                className="mt-2 h-20 w-auto rounded border border-[var(--admin-border)] object-contain"
              />
            )}
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-subtle)]">
              الوصف
            </p>
            <div className="space-y-3">
              <AdminTextarea
                label="الوصف (عربي)"
                rows={4}
                value={form.contentAr}
                onChange={(e) => set("contentAr")(e.target.value)}
              />
              <AdminTextarea
                label="الوصف (إنجليزي)"
                rows={4}
                value={form.content}
                onChange={(e) => set("content")(e.target.value)}
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-subtle)]">
              الإعدادات
            </p>
            <div className="flex flex-wrap items-end gap-4">
              <AdminSelect
                label="حالة النشر"
                value={form.status}
                onChange={(e) => set("status")(e.target.value)}
                options={[
                  { value: "publish", label: "منشور" },
                  { value: "draft", label: "مسودة" },
                ]}
              />
              <AdminCheckbox
                label="ناشر مموّل (Sponsored)"
                checked={form.sponsored}
                onChange={(e) => set("sponsored")(e.target.checked)}
              />
            </div>
          </div>

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
