"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminTable, AdminStatusBadge } from "@/components/admin/admin-table";
import {
  adminCreatedAtColumn,
  adminUpdatedAtColumn,
} from "@/components/admin/admin-timestamps";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminCheckbox } from "@/components/admin/admin-form-field";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CatForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/admin/categories", { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Category[] };
      if (data.success && data.data) setCategories(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

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
        <span className="text-[var(--brand-gray-300)]">{row.nameAr ?? "—"}</span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (row: Category) => (
        <code className="text-xs text-[var(--brand-gray-400)]">{row.slug}</code>
      ),
    },
    {
      key: "products",
      label: "الكتب",
      render: (row: Category) => (
        <span className="text-[var(--brand-gray-300)]">{row._count?.products ?? 0}</span>
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
    {
      key: "actions",
      label: "",
      headerClassName: "w-20",
      render: (row: Category) => (
        <div className="flex items-center gap-1">
          <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => openEdit(row)}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1 border-[var(--error)]/40 text-[var(--error)] hover:bg-[var(--error)]/10 text-xs"
            onClick={() => void handleDelete(row.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="text-white">
      <AdminPageHeader
        title="التصنيفات"
        subtitle="إدارة تصنيفات الكتب السبعة"
        actions={
          <Button size="sm" className="gap-1.5" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
            <Plus className="h-4 w-4" />
            تصنيف جديد
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form */}
        <AdminCard title={editingId ? "تعديل التصنيف" : "إضافة تصنيف"} className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            <AdminInput
              label="الاسم (EN) *"
              value={form.name}
              onChange={(e) => set("name")(e.target.value)}
              required
            />
            <AdminInput
              label="الاسم (AR)"
              value={form.nameAr}
              onChange={(e) => set("nameAr")(e.target.value)}
            />
            <AdminInput
              label="Slug *"
              value={form.slug}
              onChange={(e) => set("slug")(e.target.value)}
              required
              dir="ltr"
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
          <AdminTable
            columns={columns}
            data={categories}
            loading={loading}
            emptyMessage="لا توجد تصنيفات بعد"
          />
        </div>
      </div>
    </div>
  );
}
