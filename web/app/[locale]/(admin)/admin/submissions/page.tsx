"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminTable,
  AdminSearch,
  AdminPagination,
  AdminStatusBadge,
} from "@/components/admin/admin-table";
import {
  adminCreatedAtColumn,
  adminUpdatedAtColumn,
} from "@/components/admin/admin-timestamps";

interface Submission {
  id: string;
  authorName: string;
  authorEmail: string;
  workTitle: string;
  workType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DetailModal {
  open: boolean;
  item: Submission | null;
  rejectReason: string;
}

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [modal, setModal] = useState<DetailModal>({ open: false, item: null, rejectReason: "" });
  const [actioning, setActioning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) q.set("search", search.trim());
      const res = await fetch(`/api/v1/admin/submissions?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Submission[]; pagination?: { totalPages: number; total: number } };
      if (data.success && data.data) {
        setSubmissions(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { void load(); }, [load]);

  async function handleApprove(id: string) {
    setActioning(true);
    await fetch(`/api/v1/admin/submissions/${id}/approve`, {
      method: "POST",
      headers: adminAuthHeaders(),
    });
    setModal({ open: false, item: null, rejectReason: "" });
    await load();
    setActioning(false);
  }

  async function handleReject(id: string, reason: string) {
    if (!reason.trim()) { alert("يجب إدخال سبب الرفض"); return; }
    setActioning(true);
    await fetch(`/api/v1/admin/submissions/${id}/reject`, {
      method: "POST",
      headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    setModal({ open: false, item: null, rejectReason: "" });
    await load();
    setActioning(false);
  }

  const workTypeLabel: Record<string, string> = {
    NOVEL: "رواية",
    SHORT_STORIES: "قصص قصيرة",
    POETRY: "شعر",
    ACADEMIC: "دراسة أكاديمية",
    OTHER: "أخرى",
  };

  const columns = [
    {
      key: "authorName",
      label: "الكاتب",
      render: (row: Submission) => (
        <div>
          <p className="font-medium">{row.authorName}</p>
          <p className="text-xs text-[var(--brand-gray-400)]">{row.authorEmail}</p>
        </div>
      ),
    },
    {
      key: "workTitle",
      label: "العمل",
      render: (row: Submission) => (
        <div>
          <p className="max-w-[200px] truncate">{row.workTitle}</p>
          <p className="text-xs text-[var(--brand-gray-400)]">{workTypeLabel[row.workType] ?? row.workType}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: Submission) => <AdminStatusBadge status={row.status.toLowerCase()} />,
    },
    adminCreatedAtColumn<Submission>(),
    adminUpdatedAtColumn<Submission>(),
    {
      key: "actions",
      label: "",
      headerClassName: "w-28",
      render: (row: Submission) => (
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="outline"
            className="gap-1 text-xs"
            onClick={() => setModal({ open: true, item: row, rejectReason: "" })}
          >
            <Eye className="h-3 w-3" />
            عرض
          </Button>
          {row.status === "pending" && (
            <>
              <Button
                size="sm"
                className="gap-1 text-xs bg-[var(--success)] hover:bg-[var(--success)]/90"
                onClick={() => void handleApprove(row.id)}
              >
                <Check className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="text-white">
      <AdminPageHeader
        title="طلبات النشر"
        subtitle="مراجعة الأعمال المقدمة من الكتّاب"
        actions={
          <AdminSearch
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            onSubmit={() => void load()}
            placeholder="بحث..."
          />
        }
      />

      <AdminTable
        columns={columns}
        data={submissions}
        loading={loading}
        emptyMessage="لا توجد طلبات بعد"
      />
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={20} />

      {/* Detail Modal */}
      {modal.open && modal.item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[var(--brand-gray-700)] bg-[var(--brand-gray-900)] p-6">
            <h2 className="mb-4 text-lg font-bold">{modal.item.workTitle}</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="text-[var(--brand-gray-400)] w-28 shrink-0">الكاتب</dt>
                <dd>{modal.item.authorName}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-[var(--brand-gray-400)] w-28 shrink-0">البريد</dt>
                <dd>{modal.item.authorEmail}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-[var(--brand-gray-400)] w-28 shrink-0">نوع العمل</dt>
                <dd>{modal.item.workType}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="text-[var(--brand-gray-400)] w-28 shrink-0">الحالة</dt>
                <dd><AdminStatusBadge status={modal.item.status.toLowerCase()} /></dd>
              </div>
            </dl>

            {modal.item.status === "pending" && (
              <div className="mt-5 space-y-3">
                <textarea
                  placeholder="سبب الرفض (مطلوب عند الرفض)"
                  value={modal.rejectReason}
                  onChange={(e) => setModal((p) => ({ ...p, rejectReason: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-[var(--brand-gray-700)] bg-[var(--brand-gray-800)] px-3 py-2 text-sm text-white focus:outline-none"
                />
                <div className="flex gap-2">
                  <Button
                    className="gap-1.5 bg-[var(--success)] hover:bg-[var(--success)]/90"
                    disabled={actioning}
                    onClick={() => void handleApprove(modal.item!.id)}
                  >
                    <Check className="h-4 w-4" />
                    قبول
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-1.5 border-[var(--error)]/40 text-[var(--error)] hover:bg-[var(--error)]/10"
                    disabled={actioning}
                    onClick={() => void handleReject(modal.item!.id, modal.rejectReason)}
                  >
                    <X className="h-4 w-4" />
                    رفض
                  </Button>
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setModal({ open: false, item: null, rejectReason: "" })}
            >
              إغلاق
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
