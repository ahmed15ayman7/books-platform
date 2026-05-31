"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch } from "@/components/admin/admin-table";
import { useAdminViewMode } from "@/lib/admin/use-admin-view-mode";
import { AdminListToolbar, AdminSortSelect } from "@/components/admin/admin-list-controls";
import {
  AdminGridCard,
  AdminGridCardBody,
  AdminGridCardFooter,
} from "@/components/admin/admin-data-grid";
import { AdminListView } from "@/components/admin/admin-list-view";
import { sortClientList } from "@/lib/admin/client-list-sort";
import {
  adminCreatedAtColumn,
  adminUpdatedAtColumn,
} from "@/components/admin/admin-timestamps";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminTextarea, AdminSlugInput } from "@/components/admin/admin-form-field";
import { autoSlugFromEnglish } from "@/lib/admin/slugify";

interface Author {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  bio: string | null;
  bioAr: string | null;
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

interface AuthorForm {
  name: string;
  nameAr: string;
  slug: string;
  bio: string;
  bioAr: string;
}

const emptyForm: AuthorForm = { name: "", nameAr: "", slug: "", bio: "", bioAr: "" };

export default function AdminAuthorsPage() {
  const { viewMode, setViewMode } = useAdminViewMode("authors");
  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name:asc");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AuthorForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      q.set("sort", sort);
      const res = await fetch(`/api/v1/admin/authors?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Author[] };
      if (data.success && data.data) setAuthors(data.data);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  const displayed = useMemo(() => {
    const filtered = search.trim()
      ? authors.filter(
          (a) =>
            a.name.toLowerCase().includes(search.toLowerCase()) ||
            (a.nameAr ?? "").includes(search) ||
            a.slug.toLowerCase().includes(search.toLowerCase()),
        )
      : authors;
    return sortClientList(filtered, sort, {
      name: (a) => a.name,
      updatedAt: (a) => a.updatedAt,
      createdAt: (a) => a.createdAt,
    }, "name");
  }, [authors, search, sort]);

  useEffect(() => { void load(); }, [load]);

  function openEdit(author: Author) {
    setEditingId(author.id);
    setForm({
      name: author.name,
      nameAr: author.nameAr ?? "",
      slug: author.slug,
      bio: author.bio ?? "",
      bioAr: author.bioAr ?? "",
    });
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/v1/admin/authors/${editingId}` : "/api/v1/admin/authors";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          nameAr: form.nameAr || undefined,
          slug: form.slug,
          bio: form.bio || undefined,
          bioAr: form.bioAr || undefined,
        }),
      });
      const data = await res.json() as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) { setError(data.error?.message ?? "فشل الحفظ"); return; }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch { setError("حدث خطأ في الاتصال"); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("حذف هذا المؤلف؟")) return;
    await fetch(`/api/v1/admin/authors/${id}`, { method: "DELETE", headers: adminAuthHeaders() });
    await load();
  }

  const set = (k: keyof AuthorForm) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const rowActions = (row: Author) => (
    <div className="flex items-center gap-1">
      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => openEdit(row)}>
        <Pencil className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="gap-1 border-[var(--error)]/40 text-[var(--error)] text-xs hover:bg-[var(--error)]/10"
        onClick={() => void handleDelete(row.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );

  const renderCard = (row: Author) => (
    <AdminGridCard>
      <AdminGridCardBody>
        <h3 className="font-semibold text-white">{row.nameAr ?? row.name}</h3>
        {row.nameAr && <p className="text-xs text-[var(--brand-gray-500)]">{row.name}</p>}
        <code className="text-[10px] text-[var(--brand-gray-600)]">{row.slug}</code>
        <p className="text-sm text-[var(--brand-gray-400)]">{row._count?.products ?? 0} كتاب</p>
      </AdminGridCardBody>
      <AdminGridCardFooter>{rowActions(row)}</AdminGridCardFooter>
    </AdminGridCard>
  );

  const columns = [
    {
      key: "name",
      label: "الاسم (EN)",
      render: (row: Author) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "nameAr",
      label: "الاسم (AR)",
      render: (row: Author) => (
        <span className="text-[var(--brand-gray-300)]">{row.nameAr ?? "—"}</span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (row: Author) => (
        <code className="text-xs text-[var(--brand-gray-400)]">{row.slug}</code>
      ),
    },
    {
      key: "products",
      label: "الكتب",
      render: (row: Author) => (
        <span className="text-[var(--brand-gray-300)]">{row._count?.products ?? 0}</span>
      ),
    },
    adminCreatedAtColumn<Author>(),
    adminUpdatedAtColumn<Author>(),
    { key: "actions", label: "", headerClassName: "w-20", render: rowActions },
  ];

  return (
    <div className="text-white">
      <AdminPageHeader
        title="المؤلفون"
        subtitle="إدارة مؤلفي الكتب"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch
              value={search}
              onChange={setSearch}
              placeholder="بحث..."
            />
            <Button size="sm" className="gap-1.5" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              <Plus className="h-4 w-4" />
              مؤلف جديد
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard title={editingId ? "تعديل المؤلف" : "إضافة مؤلف"} className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            <AdminInput
              label="الاسم (EN) *"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((p) => ({
                  ...p,
                  name,
                  slug: autoSlugFromEnglish(name, p.slug, p.name),
                }));
              }}
              dir="ltr"
              required
            />
            <AdminInput
              label="الاسم (AR)"
              value={form.nameAr}
              onChange={(e) => set("nameAr")(e.target.value)}
            />
            <AdminSlugInput
              label="Slug *"
              value={form.slug}
              onChange={(e) => set("slug")(e.target.value)}
              required
            />
            <AdminTextarea
              label="نبذة (EN)"
              value={form.bio}
              onChange={(e) => set("bio")(e.target.value)}
              rows={3}
            />
            <AdminTextarea
              label="نبذة (AR)"
              value={form.bioAr}
              onChange={(e) => set("bioAr")(e.target.value)}
              rows={3}
            />
            {error && <p className="text-xs text-[var(--error)]">{error}</p>}
            <div className="flex gap-2 pt-1">
              <Button type="submit" size="sm" disabled={saving}>
                {saving ? "..." : editingId ? "تحديث" : "إضافة"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => { setEditingId(null); setForm(emptyForm); }}
                >
                  إلغاء
                </Button>
              )}
            </div>
          </form>
        </AdminCard>

        <div className="lg:col-span-2">
          <AdminListToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sort={
              <AdminSortSelect
                value={sort}
                onChange={setSort}
                options={[
                  { value: "name:asc", label: "الاسم أ–ي" },
                  { value: "updatedAt:desc", label: "آخر تحديث" },
                  { value: "createdAt:desc", label: "الأحدث" },
                ]}
              />
            }
          />
          <AdminListView
            viewMode={viewMode}
            columns={columns}
            data={displayed}
            loading={loading}
            emptyMessage="لا يوجد مؤلفون بعد"
            renderCard={renderCard}
          />
        </div>
      </div>
    </div>
  );
}
