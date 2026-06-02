"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination, AdminStatusBadge } from "@/components/admin/admin-table";
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
import {
  AdminInput,
  AdminSelect,
} from "@/components/admin/admin-form-field";
import { FormDraftNotice } from "@/components/forms/form-draft-notice";
import { formDraftId, useFormDraft } from "@/lib/forms/use-form-autosave";

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
  const { viewMode, setViewMode } = useAdminViewMode("b2b");
  const [subscriptions, setSubscriptions] = useState<B2BSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const draft = useFormDraft(formDraftId.adminB2b(editingId), form, setForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("createdAt:desc");
  const [isActive, setIsActive] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      appendListParams(q, { sort, isActive });
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
  }, [page, sort, isActive]);

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
      draft.clearDraft();
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch { setError("حدث خطأ"); }
    finally { setSaving(false); }
  }

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const editBtn = (row: B2BSubscription) => (
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
  );

  const renderCard = (row: B2BSubscription) => (
    <AdminGridCard>
      <AdminGridCardBody>
        <h3 className="font-semibold text-[var(--admin-text)]">{row.clientName}</h3>
        <p className="text-xs text-[var(--admin-text-subtle)]" dir="ltr">
          {row.clientEmail}
        </p>
        <p className="text-xs text-[var(--admin-text-muted)]">
          {packageOptions.find((p) => p.value === row.packageType)?.label ?? row.packageType}
        </p>
        <AdminStatusBadge status={row.status.toLowerCase()} />
        <p className="text-[10px] text-[var(--admin-text-subtle)]">
          ينتهي {new Date(row.endDate).toLocaleDateString("ar-EG")}
        </p>
      </AdminGridCardBody>
      <AdminGridCardFooter>{editBtn(row)}</AdminGridCardFooter>
    </AdminGridCard>
  );

  const columns = [
    {
      key: "clientName",
      label: "العميل",
      render: (row: B2BSubscription) => (
        <div>
          <p className="font-medium">{row.clientName}</p>
          <p className="text-xs text-[var(--admin-text-muted)]">{row.clientEmail}</p>
        </div>
      ),
    },
    {
      key: "packageType",
      label: "الحزمة",
      render: (row: B2BSubscription) => (
        <span className="text-[var(--admin-text-muted)] text-xs">
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
        <span className="text-xs text-[var(--admin-text-muted)]">
          {new Date(row.endDate).toLocaleDateString("ar-EG")}
        </span>
      ),
    },
    adminCreatedAtColumn<B2BSubscription>(),
    adminUpdatedAtColumn<B2BSubscription>(),
    { key: "actions", label: "", headerClassName: "w-16", render: editBtn },
  ];

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader title="B2B المؤسسي" subtitle="إدارة اشتراكات المؤسسات والمكتبات" />

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminCard title={editingId ? "تعديل الاشتراك" : "اشتراك جديد"} className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="space-y-3">
            <FormDraftNotice
              showBanner={draft.showBanner}
              status={draft.status}
              onResume={draft.resume}
              onDismiss={draft.dismiss}
            />
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
          <AdminListToolbar
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            filters={
              <AdminFilterSelect
                label="الحالة"
                value={isActive}
                onChange={(v) => {
                  setIsActive(v);
                  setPage(1);
                }}
                options={[
                  { value: "all", label: "الكل" },
                  { value: "true", label: "نشط" },
                  { value: "false", label: "معطّل" },
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
                  { value: "endsAt:asc", label: "ينتهي قريباً" },
                  { value: "endsAt:desc", label: "ينتهي لاحقاً" },
                ]}
              />
            }
          />
          <AdminListView
            viewMode={viewMode}
            columns={columns}
            data={subscriptions}
            loading={loading}
            emptyMessage="لا توجد اشتراكات بعد"
            renderCard={renderCard}
          />
          <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={20} />
        </div>
      </div>
    </div>
  );
}
