"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminTable,
  AdminSearch,
  AdminPagination,
  AdminStatusBadge,
} from "@/components/admin/admin-table";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminSelect } from "@/components/admin/admin-form-field";

interface Ambassador {
  id: string;
  name: string;
  email: string;
  commissionRate: number;
  status: string;
  totalClicks: number;
  totalSales: number;
  totalEarnings: number;
}

const emptyForm = {
  name: "",
  email: "",
  commissionRate: "10",
  status: "active",
};

export default function AdminAmbassadorsPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) q.set("search", search.trim());
      const res = await fetch(`/api/v1/admin/ambassadors?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Ambassador[]; pagination?: { totalPages: number } };
      if (data.success && data.data) {
        setAmbassadors(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { void load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/v1/admin/ambassadors/${editingId}` : "/api/v1/admin/ambassadors";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, commissionRate: parseFloat(form.commissionRate) }),
      });
      const data = await res.json() as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) { setError(data.error?.message ?? "فشل الحفظ"); return; }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch { setError("حدث خطأ"); }
    finally { setSaving(false); }
  }

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const columns = [
    {
      key: "name",
      label: "السفير",
      render: (row: Ambassador) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-[var(--brand-gray-400)]">{row.email}</p>
        </div>
      ),
    },
    {
      key: "commissionRate",
      label: "العمولة",
      render: (row: Ambassador) => (
        <span className="font-semibold text-[var(--warning)]">{row.commissionRate}%</span>
      ),
    },
    {
      key: "totalClicks",
      label: "النقرات",
      render: (row: Ambassador) => (
        <span className="text-[var(--brand-gray-300)]">{row.totalClicks ?? 0}</span>
      ),
    },
    {
      key: "totalEarnings",
      label: "الأرباح",
      render: (row: Ambassador) => (
        <span className="font-semibold text-[var(--success)]">
          {Number(row.totalEarnings ?? 0).toFixed(2)} ج.م
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: Ambassador) => <AdminStatusBadge status={row.status.toLowerCase()} />,
    },
    {
      key: "actions",
      label: "",
      headerClassName: "w-20",
      render: (row: Ambassador) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="outline"
            className="text-xs p-1.5"
            onClick={() => {
              setEditingId(row.id);
              setForm({ name: row.name, email: row.email, commissionRate: String(row.commissionRate), status: row.status });
            }}
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs p-1.5"
            title="روابط الإحالة"
            onClick={() => alert(`سيتم عرض روابط ${row.name}`)}
          >
            <Link2 className="h-3 w-3" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="text-white">
      <AdminPageHeader
        title="السفراء"
        subtitle="إدارة برنامج الإحالة والعمولات"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch value={search} onChange={(v) => { setSearch(v); setPage(1); }} onSubmit={() => void load()} placeholder="بحث..." />
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard title={editingId ? "تعديل السفير" : "سفير جديد"} className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            <AdminInput label="الاسم *" value={form.name} onChange={set("name")} required />
            <AdminInput label="البريد الإلكتروني *" type="email" value={form.email} onChange={set("email")} required />
            <AdminInput label="نسبة العمولة %" type="number" value={form.commissionRate} onChange={set("commissionRate")} min="0" max="100" />
            <AdminSelect
              label="الحالة"
              value={form.status}
              onChange={set("status")}
              options={[
                { value: "active", label: "نشط" },
                { value: "inactive", label: "موقوف" },
                { value: "pending", label: "قيد المراجعة" },
              ]}
            />
            {error && <p className="text-xs text-[var(--error)]">{error}</p>}
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={saving} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                {saving ? "..." : editingId ? "تحديث" : "إضافة"}
              </Button>
              {editingId && (
                <Button type="button" size="sm" variant="outline" onClick={() => { setEditingId(null); setForm(emptyForm); }}>
                  إلغاء
                </Button>
              )}
            </div>
          </form>
        </AdminCard>

        <div className="lg:col-span-2">
          <AdminTable columns={columns} data={ambassadors} loading={loading} emptyMessage="لا يوجد سفراء بعد" />
          <AdminPagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </div>
    </div>
  );
}
