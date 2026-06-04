"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminSelect, AdminCheckbox } from "@/components/admin/admin-form-field";
import { AdminTimestamps } from "@/components/admin/admin-timestamps";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";
import { AdminBilingualField } from "@/components/admin/admin-bilingual-field";
import { adminPublisherViewPath } from "@/lib/admin/public-urls";

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

interface PublisherEditFormProps {
  locale: string;
  id: string;
}

export function PublisherEditForm({ locale, id }: PublisherEditFormProps) {
  const router = useRouter();
  const isNew = id === "new";

  const [form, setForm] = useState<PublisherForm>(empty);
  const [loading, setLoading] = useState(!isNew);
  const draft = useFormDraft(formDraftId.adminPublisher(id), form, setForm, { ready: !loading });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timestamps, setTimestamps] = useState<{ createdAt?: string; updatedAt?: string }>({});

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

  useEffect(() => {
    void load();
  }, [load]);

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
      const data = await res.json() as { success: boolean; error?: { message: string }; data?: { id: string } };
      if (!res.ok || !data.success) {
        setError(data.error?.message ?? "فشل الحفظ");
        return;
      }
      setSuccess(true);
      draft.clearDraft();
      const savedId = isNew ? data.data?.id : id;
      if (savedId && isNew) {
        router.push(adminPublisherViewPath(locale, savedId));
      }
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  const set = (key: keyof PublisherForm) => (v: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  if (loading) return <div className="text-[var(--admin-text-muted)]">جاري التحميل...</div>;

  const viewHref = !isNew ? adminPublisherViewPath(locale, id) : undefined;

  return (
    <div className="text-[var(--admin-text)]">
      <Link
        href={viewHref ?? `/${locale}/admin/publishers`}
        className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {isNew ? "العودة للناشرين" : "العودة للعرض"}
      </Link>

      <h1 className="mb-2 text-2xl font-bold">{isNew ? "إضافة ناشر جديد" : "تعديل الناشر"}</h1>
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
            <AdminBilingualField
              arValue={form.nameAr}
              enValue={form.name}
              onArChange={(v) => set("nameAr")(v)}
              onEnChange={(v) => set("name")(v)}
              labels={{ ar: "الاسم (عربي)", en: "الاسم (إنجليزي)" }}
              layout="half"
              arRequired
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
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminBilingualField
              arValue={form.contentAr}
              enValue={form.content}
              onArChange={(v) => set("contentAr")(v)}
              onEnChange={(v) => set("content")(v)}
              labels={{ ar: "الوصف (عربي)", en: "الوصف (إنجليزي)" }}
              multiline
              rows={4}
              layout="full"
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
          <p className="form-error-banner rounded-lg px-4 py-2 text-sm">
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
          {viewHref && (
            <Link href={viewHref}>
              <Button variant="outline" type="button">
                عرض
              </Button>
            </Link>
          )}
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
