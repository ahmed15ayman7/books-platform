"use client";

import { useCallback, useEffect, useState } from "react";
import { localeHref } from "@/lib/i18n/href";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminSlugInput } from "@/components/admin/admin-form-field";
import { AdminTimestamps } from "@/components/admin/admin-timestamps";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";
import { autoSlugFromEnglish } from "@/lib/admin/slugify";
import { AdminBilingualField } from "@/components/admin/admin-bilingual-field";
import { adminAuthorViewPath } from "@/lib/admin/public-urls";
import { useAdminFormShortcuts } from "@/hooks/use-admin-form-shortcuts";
import { adminToast } from "@/lib/admin/admin-toast";

interface AuthorForm {
  name: string;
  nameAr: string;
  slug: string;
  bio: string;
  bioAr: string;
}

const empty: AuthorForm = {
  name: "",
  nameAr: "",
  slug: "",
  bio: "",
  bioAr: "",
};

interface AuthorEditFormProps {
  locale: string;
  id: string;
}

export function AuthorEditForm({ locale, id }: AuthorEditFormProps) {
  const router = useRouter();
  const isNew = id === "new";

  const [form, setForm] = useState<AuthorForm>(empty);
  const [loading, setLoading] = useState(!isNew);
  const draft = useFormDraft(formDraftId.adminAuthor(id), form, setForm, { ready: !loading });
  const [saving, setSaving] = useState(false);
  const [timestamps, setTimestamps] = useState<{ createdAt?: string; updatedAt?: string }>({});

  const load = useCallback(async () => {
    if (isNew) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/authors/${id}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Record<string, unknown> };
      if (data.success && data.data) {
        const d = data.data;
        setForm({
          name: String(d.name ?? ""),
          nameAr: String(d.nameAr ?? ""),
          slug: String(d.slug ?? ""),
          bio: String(d.bio ?? ""),
          bioAr: String(d.bioAr ?? ""),
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

  async function submitAuthor() {
    if (!form.name.trim()) {
      adminToast.error("الاسم الإنجليزي مطلوب");
      return;
    }
    setSaving(true);
    try {
      const url = isNew ? "/api/v1/admin/authors" : `/api/v1/admin/authors/${id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success: boolean; error?: { message: string }; data?: { id: string } };
      if (!res.ok || !data.success) {
        adminToast.error(data.error?.message ?? "فشل الحفظ");
        return;
      }
      draft.clearDraft();
      adminToast.success(isNew ? "create" : "update", "المؤلف");
      const savedId = isNew ? data.data?.id : id;
      if (savedId && isNew) {
        router.push(adminAuthorViewPath(locale, savedId));
      }
    } catch {
      adminToast.error("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await submitAuthor();
  }

  useAdminFormShortcuts({
    onSave: () => void submitAuthor(),
  });

  if (loading) return <div className="text-[var(--admin-text-muted)]">جاري التحميل...</div>;

  const viewHref = !isNew ? adminAuthorViewPath(locale, id) : undefined;

  return (
    <div className="text-[var(--admin-text)]">
      <Link
        href={viewHref ?? localeHref(locale, "/admin/authors")}
        className="mb-5 inline-flex items-center gap-2 text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)] transition-colors"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {isNew ? "العودة للمؤلفين" : "العودة للعرض"}
      </Link>

      <h1 className="mb-2 text-2xl font-bold">{isNew ? "إضافة مؤلف" : "تعديل المؤلف"}</h1>
      {!isNew && (
        <AdminTimestamps
          createdAt={timestamps.createdAt}
          updatedAt={timestamps.updatedAt}
          compact
          className="mb-5"
        />
      )}

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-5" data-admin-save-form>
        <FormDraftNotice
          showBanner={draft.showBanner}
          status={draft.status}
          onResume={draft.resume}
          onDismiss={draft.dismiss}
        />
        <AdminCard title="بيانات المؤلف">
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminBilingualField
              arValue={form.nameAr}
              enValue={form.name}
              onArChange={(v) => setForm((p) => ({ ...p, nameAr: v }))}
              onEnChange={(v) => {
                setForm((p) => ({
                  ...p,
                  name: v,
                  slug: autoSlugFromEnglish(v, p.slug, p.name),
                }));
              }}
              labels={{ ar: "الاسم (عربي)", en: "الاسم (إنجليزي) *" }}
              layout="half"
              enRequired
            />
            <AdminSlugInput
              label="Slug"
              value={form.slug}
              onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
              dir="ltr"
            />
            <AdminBilingualField
              arValue={form.bioAr}
              enValue={form.bio}
              onArChange={(v) => setForm((p) => ({ ...p, bioAr: v }))}
              onEnChange={(v) => setForm((p) => ({ ...p, bio: v }))}
              labels={{ ar: "السيرة (عربي)", en: "Bio (English)" }}
              richText={{ image: false }}
              editorMinHeight={160}
              layout="full"
            />
          </div>
        </AdminCard>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "جاري الحفظ..." : isNew ? "إضافة" : "حفظ التغييرات"}
          </Button>
          {viewHref && (
            <Link href={viewHref}>
              <Button variant="outline" type="button">
                عرض
              </Button>
            </Link>
          )}
          <Link href={localeHref(locale, "/admin/authors")}>
            <Button variant="outline" type="button">
              إلغاء
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
