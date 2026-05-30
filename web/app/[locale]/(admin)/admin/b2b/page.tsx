"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminTable,
  AdminPagination,
  AdminStatusBadge,
} from "@/components/admin/admin-table";
import {
  adminCreatedAtColumn,
  adminUpdatedAtColumn,
} from "@/components/admin/admin-timestamps";
import { AdminCard } from "@/components/admin/admin-card";
import {
  AdminInput,
  AdminSelect,
} from "@/components/admin/admin-form-field";

interface B2BSubscription {
  id: string;
  clientName: string;
  clientEmail: string;
  packageType: string;
  status: string;
  startDate: string;
  endDate: string;
  renewalDate: string | null;
  createdAt: string;
  updatedAt: string;
}

const packageOptions = [
  { value: "BIBLIOGRAPHIC", label: "الببليوغرافيا" },
  { value: "RESEARCH", label: "التقارير البحثية" },
  { value: "NEWS", label: "الخدمة الإخبارية" },
  { value: "MEDIA", label: "الحزمة الإعلامية" },
  { value: "FULL", label: "الحزمة الكاملة" },
];

const emptyForm = {
  clientName: "",
  clientEmail: "",
  packageType: "FULL",
  startDate: new Date().toISOString().split("T")[0],
  endDate: "",
  notes: "",
};

export default function AdminB2BPage() {
  const [subscriptions, setSubscriptions] = useState<B2BSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      const res = await fetch(`/api/v1/admin/b2b?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: B2BSubscription[]; pagination?: { totalPages: number; total: number } };
      if (data.success && data.data) {
        setSubscriptions(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { void load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/v1/admin/b2b/${editingId}` : "/api/v1/admin/b2b";
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
    } catch { setError("حدث خطأ"); }
    finally { setSaving(false); }
  }

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const columns = [
    {
      key: "clientName",
      label: "العميل",
      render: (row: B2BSubscription) => (
        <div>
          <p className="font-medium">{row.clientName}</p>
          <p className="text-xs text-[var(--brand-gray-400)]">{row.clientEmail}</p>
        </div>
      ),
    },
    {
      key: "packageType",
      label: "الحزمة",
      render: (row: B2BSubscription) => (
        <span className="text-[var(--brand-gray-300)] text-xs">
          {packageOptions.find((p) => p.value === row.packageType)?.label ?? row.packageType}
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: B2BSubscription) => <AdminStatusBadge status={row.status.toLowerCase()} />,
    },
    {
      key: "endDate",
      label: "تاريخ الانتهاء",
      render: (row: B2BSubscription) => (
        <span className="text-xs text-[var(--brand-gray-400)]">
          {new Date(row.endDate).toLocaleDateString("ar-EG")}
        </span>
      ),
    },
    adminCreatedAtColumn<B2BSubscription>(),
    adminUpdatedAtColumn<B2BSubscription>(),
    {
      key: "actions",
      label: "",
      headerClassName: "w-16",
      render: (row: B2BSubscription) => (
        <Button
          size="sm"
          variant="outline"
          className="gap-1 text-xs"
          onClick={() => {
            setEditingId(row.id);
            setForm({
              clientName: row.clientName,
              clientEmail: row.clientEmail,
              packageType: row.packageType,
              startDate: new Date(row.startDate).toISOString().split("T")[0] ?? "",
              endDate: new Date(row.endDate).toISOString().split("T")[0] ?? "",
              notes: "",
            });
          }}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      ),
    },
  ];

  return (
    <div className="text-white">
      <AdminPageHeader title="B2B المؤسسي" subtitle="إدارة اشتراكات المؤسسات والمكتبات" />

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard title={editingId ? "تعديل الاشتراك" : "اشتراك جديد"} className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            <AdminInput label="اسم العميل *" value={form.clientName} onChange={set("clientName")} required />
            <AdminInput label="البريد الإلكتروني *" type="email" value={form.clientEmail} onChange={set("clientEmail")} required />
            <AdminSelect label="نوع الحزمة" value={form.packageType} onChange={set("packageType")} options={packageOptions} />
            <AdminInput label="تاريخ البداية" type="date" value={form.startDate} onChange={set("startDate")} />
            <AdminInput label="تاريخ الانتهاء *" type="date" value={form.endDate} onChange={set("endDate")} required />
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
          <AdminTable columns={columns} data={subscriptions} loading={loading} emptyMessage="لا توجد اشتراكات بعد" />
          <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={20} />
        </div>
      </div>
    </div>
  );
}
