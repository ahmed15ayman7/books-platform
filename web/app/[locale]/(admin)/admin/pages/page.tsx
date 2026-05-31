"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminTextarea } from "@/components/admin/admin-form-field";

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

type LangTab = "ar" | "en";

export default function AdminPagesPage() {
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<StaticPage | null>(null);
  const [tab, setTab] = useState<LangTab>("ar");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
    setError("");
    setSuccess(false);
    try {
      const res = await fetch(`/api/v1/admin/static-pages/${editing.id}`, {
        method: "PATCH",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json() as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) { setError(data.error?.message ?? "فشل الحفظ"); return; }
      setSuccess(true);
      await load();
    } catch { setError("حدث خطأ"); }
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
                  setSuccess(false);
                  setError("");
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
              <AdminCard>
                <div className="mb-4 flex gap-2 border-b border-[var(--admin-border)] pb-3">
                  {(["ar", "en"] as LangTab[]).map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setTab(l)}
                      className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                        tab === l
                          ? "bg-[var(--brand-red)] text-white"
                          : "text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]"
                      }`}
                    >
                      {l === "ar" ? "العربية" : "English"}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {tab === "ar" ? (
                    <>
                      <AdminInput
                        label="العنوان (عربي)"
                        value={editing.titleAr}
                        onChange={(e) => setEditing((p) => p ? { ...p, titleAr: e.target.value } : p)}
                      />
                      <AdminTextarea
                        label="المحتوى (عربي)"
                        rows={12}
                        value={editing.bodyAr}
                        onChange={(e) => setEditing((p) => p ? { ...p, bodyAr: e.target.value } : p)}
                      />
                    </>
                  ) : (
                    <>
                      <AdminInput
                        label="Title (English)"
                        value={editing.titleEn}
                        onChange={(e) => setEditing((p) => p ? { ...p, titleEn: e.target.value } : p)}
                      />
                      <AdminTextarea
                        label="Content (English)"
                        rows={12}
                        value={editing.bodyEn}
                        onChange={(e) => setEditing((p) => p ? { ...p, bodyEn: e.target.value } : p)}
                      />
                    </>
                  )}
                </div>
              </AdminCard>

              {error && <p className="text-sm text-[var(--error)]">{error}</p>}
              {success && <p className="text-sm text-[var(--success)]">تم الحفظ بنجاح ✓</p>}

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
