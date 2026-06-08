"use client";

import { PAGINATION } from "@/lib/utils/constants";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch, AdminPagination, AdminStatusBadge } from "@/components/admin/admin-table";
import { appendListParams } from "@/lib/admin/list-query";
import { useAdminViewMode } from "@/lib/admin/use-admin-view-mode";
import {
  AdminFilterSelect,
  AdminListToolbar,
  AdminSortSelect,
} from "@/components/admin/admin-list-controls";
import {
  AdminGridCard,
  AdminGridCardBody,
  AdminGridCardFooter,
} from "@/components/admin/admin-data-grid";
import { AdminListView } from "@/components/admin/admin-list-view";
import {
  adminCreatedAtColumn,
  adminUpdatedAtColumn,
} from "@/components/admin/admin-timestamps";
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminSelect } from "@/components/admin/admin-form-field";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";
import { adminToast } from "@/lib/admin/admin-toast";

interface Ambassador {
  id: string;
  name: string;
  email: string;
  commissionRate: number;
  status: string;
  totalClicks: number;
  totalSales: number;
  totalEarnings: number;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = {
  name: "",
  email: "",
  commissionRate: "10",
  status: "active",
};

export default function AdminAmbassadorsPage() {
  const { viewMode, setViewMode } = useAdminViewMode("ambassadors");
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const draft = useFormDraft(formDraftId.adminAmbassador(editingId), form, setForm);
  const [saving, setSaving] = useState(false);
  const [sort, setSort] = useState("createdAt:desc");
  const [status, setStatus] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: String(PAGINATION.DEFAULT_PAGE_SIZE) });
      if (search.trim()) q.set("search", search.trim());
      appendListParams(q, { sort, status });
      const res = await fetch(`/api/v1/admin/ambassadors?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Ambassador[]; pagination?: { totalPages: number; total: number } };
      if (data.success && data.data) {
        setAmbassadors(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, sort, status]);

  useEffect(() => { void load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const url = editingId ? `/api/v1/admin/ambassadors/${editingId}` : "/api/v1/admin/ambassadors";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, commissionRate: parseFloat(form.commissionRate) }),
      });
      const data = await res.json() as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) {
        adminToast.error(data.error?.message ?? "فشل الحفظ");
        return;
      }
      adminToast.success(editingId ? "update" : "create", "السفير");
      draft.clearDraft();
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch {
      adminToast.error("حدث خطأ");
    }
    finally { setSaving(false); }
  }

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const rowActions = (row: Ambassador) => (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="outline"
        className="p-1.5 text-xs"
        onClick={() => {
          setEditingId(row.id);
          setForm({
            name: row.name,
            email: row.email,
            commissionRate: String(row.commissionRate),
            status: row.status,
          });
        }}
      >
        <Pencil className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="p-1.5 text-xs"
        title="روابط الإحالة"
        onClick={() => alert(`سيتم عرض روابط ${row.name}`)}
      >
        <Link2 className="h-3 w-3" />
      </Button>
    </div>
  );

  const renderCard = (row: Ambassador) => (
    <AdminGridCard>
      <AdminGridCardBody>
        <h3 className="font-semibold text-[var(--admin-text)]">{row.name}</h3>
        <p className="text-xs text-[var(--admin-text-subtle)]" dir="ltr">
          {row.email}
        </p>
        <p className="text-lg font-bold text-[var(--warning)]">{row.commissionRate}%</p>
        <AdminStatusBadge status={row.status.toLowerCase()} />
      </AdminGridCardBody>
      <AdminGridCardFooter>{rowActions(row)}</AdminGridCardFooter>
    </AdminGridCard>
  );

  const columns = [
    {
      key: "name",
      label: "السفير",
      render: (row: Ambassador) => (
        <div>
          <p className="font-medium">{row.name}</p>
          <p className="text-xs text-[var(--admin-text-muted)]">{row.email}</p>
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
        <span className="text-[var(--admin-text-muted)]">{row.totalClicks ?? 0}</span>
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
    adminCreatedAtColumn<Ambassador>(),
    adminUpdatedAtColumn<Ambassador>(),
    { key: "actions", label: "", headerClassName: "w-20", render: rowActions },
  ];

  return (
    <div className="text-[var(--admin-text)]">
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
            <FormDraftNotice
              showBanner={draft.showBanner}
              status={draft.status}
              onResume={draft.resume}
              onDismiss={draft.dismiss}
            />
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
          <AdminListToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filters={
              <AdminFilterSelect
                label="الحالة"
                value={status}
                onChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "الكل" },
                  { value: "active", label: "نشط" },
                  { value: "inactive", label: "موقوف" },
                  { value: "pending", label: "قيد المراجعة" },
                ]}
              />
            }
            sort={
              <AdminSortSelect
                value={sort}
                onChange={(v) => {
                  setSort(v);
                  setPage(1);
                }}
                options={[
                  { value: "createdAt:desc", label: "الأحدث" },
                  { value: "updatedAt:desc", label: "آخر تحديث" },
                ]}
              />
            }
          />
          <AdminListView
            viewMode={viewMode}
            columns={columns}
            data={ambassadors}
            loading={loading}
            emptyMessage="لا يوجد سفراء بعد"
            renderCard={renderCard}
          />
          <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={PAGINATION.DEFAULT_PAGE_SIZE} />
        </div>
      </div>
    </div>
  );
}
