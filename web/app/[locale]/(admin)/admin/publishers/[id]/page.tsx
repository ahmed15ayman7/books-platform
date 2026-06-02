"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import {
  AdminInput,
  AdminTextarea,
  AdminSelect,
  AdminCheckbox,
} from "@/components/admin/admin-form-field";
import { AdminTimestamps } from "@/components/admin/admin-timestamps";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";

interface PublisherForm {
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

const empty: PublisherForm = {
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

export default function AdminPublisherEditPage() {
  const params = useParams<{ locale?: string; id: string }>();
  const locale = params.locale ?? "ar";
  const id = params.id;
  const isNew = id === "new";

  const [form, setForm] = useState<PublisherForm>(empty);
  const [loading, setLoading] = useState(!isNew);
  const draft = useFormDraft(formDraftId.adminPublisher(id), form, setForm, { ready: !loading });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timestamps, setTimestamps] = useState<{
    createdAt?: string;
    updatedAt?: string;
  }>({});

  const load = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/publishers/${id}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Record<string, unknown> };
      if (data.success && data.data) {
        const d = data.data;
        setForm({
          name: String(d.name ?? ""),
          nameAr: String(d.nameAr ?? ""),
          country: String(d.country ?? ""),
          websiteUrl: String(d.websiteUrl ?? ""),
          contactEmail: String(d.contactEmail ?? ""),
          content: String(d.content ?? ""),
          contentAr: String(d.contentAr ?? ""),
          imageUrl: String(d.imageUrl ?? ""),
          status: String(d.status ?? "publish"),
          sponsored: Boolean(d.sponsored),
        });
        setTimestamps({
          createdAt: d.createdAt as string | undefined,
          updatedAt: d.updatedAt as string | undefined,
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id, isNew]);

  useEffect(() => { void load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameAr.trim() && !form.name.trim()) {
      setError("أدخل اسم الناشر بالعربية أو الإنجليزية");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const url = isNew ? "/api/v1/admin/publishers" : `/api/v1/admin/publishers/${id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) {
        setError(data.error?.message ?? "فشل الحفظ");
        return;
      }
      setSuccess(true);
      draft.clearDraft();
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  const set = (key: keyof PublisherForm) => (v: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  if (loading) return <div className="text-[var(--admin-text-muted)]">جاري التحميل...</div>;

  return (
    <div className="text-[var(--admin-text)]">
      <Link
        href={`/${locale}/admin/publishers`}
        className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        العودة للناشرين
      </Link>

      <h1 className="mb-2 text-2xl font-bold">
        {isNew ? "إضافة ناشر جديد" : "تعديل الناشر"}
      </h1>
      {!isNew && (
        <AdminTimestamps
          createdAt={timestamps.createdAt}
          updatedAt={timestamps.updatedAt}
          compact
          className="mb-5"
        />
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5">
        <FormDraftNotice
          showBanner={draft.showBanner}
          status={draft.status}
          onResume={draft.resume}
          onDismiss={draft.dismiss}
        />
        <AdminCard title="البيانات الأساسية">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminInput
              label="الاسم (عربي)"
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
              value={form.imageUrl}
              onChange={(e) => set("imageUrl")(e.target.value)}
              dir="ltr"
            />
          </div>
        </AdminCard>

        <AdminCard title="الوصف">
          <div className="space-y-4">
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
        </AdminCard>

        <AdminCard title="الإعدادات">
          <div className="flex flex-wrap gap-6">
            <AdminSelect
              label="حالة النشر"
              value={form.status}
              onChange={(e) => set("status")(e.target.value)}
              options={[
                { value: "publish", label: "منشور" },
                { value: "draft", label: "مسودة" },
              ]}
            />
            <div className="pt-5">
              <AdminCheckbox
                label="ناشر مموّل (Sponsored)"
                checked={form.sponsored}
                onChange={(e) => set("sponsored")(e.target.checked)}
              />
            </div>
          </div>
        </AdminCard>

        {error && (
          <p className="rounded-lg bg-[var(--error)]/10 border border-[var(--error)]/30 px-4 py-2 text-sm text-[var(--error)]">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-[var(--success-soft)] border border-[var(--success)]/30 px-4 py-2 text-sm text-[var(--success)]">
            تم الحفظ بنجاح
          </p>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "جاري الحفظ..." : isNew ? "إضافة الناشر" : "حفظ التغييرات"}
          </Button>
          <Link href={`/${locale}/admin/publishers`}>
            <Button variant="outline" type="button">
              إلغاء
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
