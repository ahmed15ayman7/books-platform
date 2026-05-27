"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, EyeOff, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminTable,
  AdminSearch,
  AdminPagination,
  AdminStatusBadge,
} from "@/components/admin/admin-table";

interface Comment {
  id: string;
  authorName: string;
  authorEmail: string;
  body: string;
  status: string;
  createdAt: string;
  targetTitle?: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) q.set("search", search.trim());
      const res = await fetch(`/api/v1/admin/comments?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Comment[]; pagination?: { totalPages: number; total: number } };
      if (data.success && data.data) {
        setComments(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { void load(); }, [load]);

  async function action(id: string, act: "approve" | "hide" | "delete") {
    const method = act === "delete" ? "DELETE" : "PATCH";
    const body = act !== "delete" ? JSON.stringify({ status: act === "approve" ? "approved" : "hidden" }) : undefined;
    await fetch(`/api/v1/admin/comments/${id}`, {
      method,
      headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
      body,
    });
    await load();
  }

  const columns = [
    {
      key: "authorName",
      label: "المعلق",
      render: (row: Comment) => (
        <div>
          <p className="font-medium">{row.authorName}</p>
          <p className="text-xs text-[var(--brand-gray-400)]">{row.authorEmail}</p>
        </div>
      ),
    },
    {
      key: "body",
      label: "التعليق",
      render: (row: Comment) => (
        <p className="max-w-xs truncate text-sm text-[var(--brand-gray-300)]">{row.body}</p>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: Comment) => <AdminStatusBadge status={row.status.toLowerCase()} />,
    },
    {
      key: "createdAt",
      label: "التاريخ",
      render: (row: Comment) => (
        <span className="text-xs text-[var(--brand-gray-400)]">
          {new Date(row.createdAt).toLocaleDateString("ar-EG")}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      headerClassName: "w-28",
      render: (row: Comment) => (
        <div className="flex items-center gap-1">
          {row.status === "pending" && (
            <Button
              size="sm"
              className="bg-[var(--success)] hover:bg-[var(--success)]/90 text-xs p-1.5"
              onClick={() => void action(row.id, "approve")}
              aria-label="قبول"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            size="sm"
            variant="outline"
            className="text-xs p-1.5"
            onClick={() => void action(row.id, "hide")}
            aria-label="إخفاء"
          >
            <EyeOff className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-[var(--error)]/40 text-[var(--error)] hover:bg-[var(--error)]/10 text-xs p-1.5"
            onClick={() => confirm("حذف التعليق؟") && void action(row.id, "delete")}
            aria-label="حذف"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="text-white">
      <AdminPageHeader
        title="التعليقات"
        subtitle="مراجعة وإدارة تعليقات الزوار"
        actions={
          <AdminSearch
            value={search}
            onChange={(v) => { setSearch(v); setPage(1); }}
            onSubmit={() => void load()}
            placeholder="بحث في التعليقات..."
          />
        }
      />
      <AdminTable columns={columns} data={comments} loading={loading} emptyMessage="لا توجد تعليقات بعد" />
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={20} />
    </div>
  );
}
