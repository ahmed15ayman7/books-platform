"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminBilingualField } from "@/components/admin/admin-bilingual-field";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";
import { adminToast } from "@/lib/admin/admin-toast";

interface StaticPage {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  bodyAr: string;
  bodyEn: string;
}

const PAGE_SLUGS = [
  { slug: "about", label: "من نحن" },
  { slug: "team", label: "فريق العمل" },
  { slug: "services", label: "خدماتنا" },
  { slug: "privacy", label: "سياسة الخصوصية" },
  { slug: "terms", label: "الشروط والأحكام" },
  { slug: "contact", label: "اتصل بنا" },
];

export default function AdminPagesPage() {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StaticPage | null>(null);
  const [saving, setSaving] = useState(false);

  const pageDraftValues: StaticPage = editing ?? {
    id: "",
    slug: "_none",
    titleAr: "",
    titleEn: "",
    bodyAr: "",
    bodyEn: "",
  };
  const draft = useFormDraft(
    formDraftId.adminPage(editing?.slug ?? "_none"),
    pageDraftValues,
    (v) => setEditing(v),
    { enabled: !!editing, ready: !loading },
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/static-pages", { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: StaticPage[] };
      if (data.success && data.data) setPages(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/static-pages/${editing.id}`, {
        method: "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json() as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) {
        adminToast.error(data.error?.message ?? "فشل الحفظ");
        return;
      }
      draft.clearDraft();
      adminToast.success("save", "الصفحة");
      await load();
    } catch {
      adminToast.error("حدث خطأ");
    }
    finally { setSaving(false); }
  }

  if (loading) return <div className="text-[var(--admin-text-muted)]">جاري التحميل...</div>;

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader title="الصفحات الثابتة" subtitle="تحرير محتوى صفحات المنصة الثابتة" />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Page list */}
        <div className="space-y-2 lg:col-span-1">
          {PAGE_SLUGS.map(({ slug, label }) => {
            const page = pages.find((p) => p.slug === slug);
            return (
              <button
                key={slug}
                onClick={() => {
                  setEditing(
                    page ?? {
                      id: slug,
                      slug,
                      titleAr: label,
                      titleEn: "",
                      bodyAr: "",
                      bodyEn: "",
                    }
                  );
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
                  editing?.slug === slug
                    ? "border-[var(--brand-red)] bg-[var(--brand-red)]/10 font-medium text-[var(--admin-accent)]"
                    : "border-[var(--admin-border)] text-[var(--admin-text-muted)] hover:border-[var(--admin-border-strong)] hover:text-[var(--admin-accent)]"
                }`}
              >
                <span>{label}</span>
                <Pencil className="h-3.5 w-3.5 opacity-50" />
              </button>
            );
          })}
        </div>

        {/* Editor */}
        <div className="lg:col-span-2">
          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <FormDraftNotice
                showBanner={draft.showBanner}
                status={draft.status}
                onResume={draft.resume}
                onDismiss={draft.dismiss}
              />
              <AdminCard>
                <div className="grid gap-4 sm:grid-cols-2">
                  <AdminBilingualField
                    arValue={editing.titleAr}
                    enValue={editing.titleEn}
                    onArChange={(v) => setEditing((p) => (p ? { ...p, titleAr: v } : p))}
                    onEnChange={(v) => setEditing((p) => (p ? { ...p, titleEn: v } : p))}
                    labels={{ ar: "العنوان (عربي)", en: "Title (English)" }}
                  />
                  <AdminBilingualField
                    arValue={editing.bodyAr}
                    enValue={editing.bodyEn}
                    onArChange={(v) => setEditing((p) => (p ? { ...p, bodyAr: v } : p))}
                    onEnChange={(v) => setEditing((p) => (p ? { ...p, bodyEn: v } : p))}
                    labels={{ ar: "المحتوى (عربي)", en: "Content (English)" }}
                    multiline
                    rows={12}
                  />
                </div>
              </AdminCard>

              <Button type="submit" disabled={saving}>
                {saving ? "جاري الحفظ..." : "حفظ الصفحة"}
              </Button>
            </form>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-[var(--admin-border-strong)] text-[var(--admin-text-subtle)]">
              اختر صفحة من القائمة لتحريرها
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
