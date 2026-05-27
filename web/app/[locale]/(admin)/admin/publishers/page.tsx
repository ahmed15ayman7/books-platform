"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminTable,
  AdminSearch,
  AdminPagination,
  AdminStatusBadge,
} from "@/components/admin/admin-table";

interface Publisher {
  id: string;
  slug: string;
  name: string;
  country: string | null;
  status: string;
  sponsored: boolean;
  _count?: { products: number };
}

export default function AdminPublishersPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const [publishers, setPublishers] = useState<Publisher[]>([]);
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
      const res = await fetch(`/api/v1/admin/publishers?${q}`, {
        headers: adminAuthHeaders(),
      });
      const data = await res.json() as { success: boolean; data?: Publisher[]; pagination?: { totalPages: number; total: number } };
      if (data.success && data.data) {
        setPublishers(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => { void load(); }, [load]);

  const columns = [
    {
      key: "name",
      label: "الناشر",
      render: (row: Publisher) => (
        <div className="flex items-center gap-2">
          <span className="font-medium">{row.name}</span>
          {row.sponsored && (
            <Star className="h-3.5 w-3.5 text-[var(--warning)]" aria-label="مموّل" />
          )}
        </div>
      ),
    },
    {
      key: "country",
      label: "الدولة",
      render: (row: Publisher) => (
        <span className="text-[var(--brand-gray-300)]">{row.country ?? "—"}</span>
      ),
    },
    {
      key: "products",
      label: "الكتب",
      render: (row: Publisher) => (
        <span className="text-[var(--brand-gray-300)]">{row._count?.products ?? 0}</span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: Publisher) => (
        <AdminStatusBadge status={row.status === "publish" ? "published" : "draft"} />
      ),
    },
    {
      key: "sponsored",
      label: "التمويل",
      render: (row: Publisher) =>
        row.sponsored ? (
          <AdminStatusBadge status="sponsored" />
        ) : (
          <span className="text-[var(--brand-gray-600)] text-xs">—</span>
        ),
    },
    {
      key: "actions",
      label: "",
      headerClassName: "w-16",
      render: (row: Publisher) => (
        <Link href={`/${locale}/admin/publishers/${row.id}`}>
          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
            <Pencil className="h-3 w-3" />
            تعديل
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="text-white">
      <AdminPageHeader
        title="الناشرون"
        subtitle="إدارة دور النشر وحالة التمويل"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              onSubmit={() => void load()}
              placeholder="بحث بالاسم..."
            />
            <Link href={`/${locale}/admin/publishers/new`}>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                إضافة ناشر
              </Button>
            </Link>
          </div>
        }
      />
      <AdminTable columns={columns} data={publishers} loading={loading} emptyMessage="لا يوجد ناشرون بعد" />
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={20} />
    </div>
  );
}
