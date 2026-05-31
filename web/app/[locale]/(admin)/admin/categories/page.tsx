"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch, AdminStatusBadge } from "@/components/admin/admin-table";
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
import { AdminInput, AdminCheckbox, AdminSlugInput } from "@/components/admin/admin-form-field";
import { autoSlugFromEnglish } from "@/lib/admin/slugify";

interface Category {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  active: boolean;
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

interface CatForm {
  name: string;
  nameAr: string;
  slug: string;
  active: boolean;
}

const emptyForm: CatForm = { name: "", nameAr: "", slug: "", active: true };

export default function AdminCategoriesPage() {
  const { viewMode, setViewMode } = useAdminViewMode("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name:asc");
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CatForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      q.set("sort", sort);
      const res = await fetch(`/api/v1/admin/categories?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Category[] };
      if (data.success && data.data) setCategories(data.data);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  const displayed = useMemo(() => {
    const filtered = search.trim()
      ? categories.filter(
          (c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            (c.nameAr ?? "").includes(search) ||
            c.slug.toLowerCase().includes(search.toLowerCase()),
        )
      : categories;
    return sortClientList(filtered, sort, {
      name: (c) => c.name,
      updatedAt: (c) => c.updatedAt,
      createdAt: (c) => c.createdAt,
    }, "name");
  }, [categories, search, sort]);

  useEffect(() => { void load(); }, [load]);

  function openEdit(cat: Category) {
    setEditingId(cat.id);
    setForm({ name: cat.name, nameAr: cat.nameAr ?? "", slug: cat.slug, active: cat.active });
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/v1/admin/categories/${editingId}` : "/api/v1/admin/categories";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
    if (!confirm("حذف هذا التصنيف؟")) return;
    await fetch(`/api/v1/admin/categories/${id}`, { method: "DELETE", headers: adminAuthHeaders() });
    await load();
  }

  const set = (k: keyof CatForm) => (v: string | boolean) =>
    setForm((p) => ({ ...p, [k]: v }));

  const rowActions = (row: Category) => (
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

  const renderCard = (row: Category) => (
    <AdminGridCard>
      <AdminGridCardBody>
        <h3 className="font-semibold text-[var(--admin-text)]">{row.nameAr ?? row.name}</h3>
        {row.nameAr && <p className="text-xs text-[var(--admin-text-subtle)]">{row.name}</p>}
        <code className="text-[10px] text-[var(--admin-text-subtle)]">{row.slug}</code>
        <p className="text-sm text-[var(--admin-text-muted)]">{row._count?.products ?? 0} كتاب</p>
        <AdminStatusBadge status={row.active ? "active" : "inactive"} />
      </AdminGridCardBody>
      <AdminGridCardFooter>{rowActions(row)}</AdminGridCardFooter>
    </AdminGridCard>
  );

  const columns = [
    {
      key: "name",
      label: "الاسم (EN)",
      render: (row: Category) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "nameAr",
      label: "الاسم (AR)",
      render: (row: Category) => (
        <span className="text-[var(--admin-text-muted)]">{row.nameAr ?? "—"}</span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (row: Category) => (
        <code className="text-xs text-[var(--admin-text-muted)]">{row.slug}</code>
      ),
    },
    {
      key: "products",
      label: "الكتب",
      render: (row: Category) => (
        <span className="text-[var(--admin-text-muted)]">{row._count?.products ?? 0}</span>
      ),
    },
    {
      key: "active",
      label: "الحالة",
      render: (row: Category) => (
        <AdminStatusBadge status={row.active ? "active" : "inactive"} />
      ),
    },
    adminCreatedAtColumn<Category>(),
    adminUpdatedAtColumn<Category>(),
    { key: "actions", label: "", headerClassName: "w-20", render: rowActions },
  ];

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader
        title="التصنيفات"
        subtitle="إدارة تصنيفات الكتب السبعة"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch
              value={search}
              onChange={setSearch}
              placeholder="بحث..."
            />
            <Button size="sm" className="gap-1.5" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
              <Plus className="h-4 w-4" />
              تصنيف جديد
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <AdminCard title={editingId ? "تعديل التصنيف" : "إضافة تصنيف"} className="lg:col-span-1">
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
            <AdminCheckbox
              label="نشط"
              checked={form.active}
              onChange={(e) => set("active")(e.target.checked)}
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

        {/* Table */}
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
            emptyMessage="لا توجد تصنيفات بعد"
            renderCard={renderCard}
          />
        </div>
      </div>
    </div>
  );
}
