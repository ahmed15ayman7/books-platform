"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminTable,
  AdminSearch,
  AdminPagination,
  AdminStatusBadge,
} from "@/components/admin/admin-table";

interface AdminBook {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  translationStatus: string;
  published: boolean;
  featured: boolean;
  language: string | null;
}

interface PaginatedResponse {
  success: boolean;
  data?: AdminBook[];
  pagination?: { total: number; page: number; totalPages: number };
}

export default function AdminBooksPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const [books, setBooks] = useState<AdminBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) q.set("search", search.trim());
      const res = await fetch(`/api/v1/admin/books?${q}`, {
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
      });
      const data = (await res.json()) as PaginatedResponse;
      if (data.success && data.data) {
        setBooks(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const columns = [
    {
      key: "nameEn",
      label: "العنوان (EN)",
      className: "max-w-[200px] truncate font-medium",
      render: (row: AdminBook) => (
        <span className="truncate block max-w-[200px]">{row.nameEn}</span>
      ),
    },
    {
      key: "nameAr",
      label: "العنوان (AR)",
      className: "max-w-[200px]",
      render: (row: AdminBook) => (
        <span className="truncate block max-w-[200px] text-[var(--brand-gray-300)]">
          {row.nameAr ?? "—"}
        </span>
      ),
    },
    {
      key: "translationStatus",
      label: "حالة الترجمة",
      render: (row: AdminBook) => (
        <AdminStatusBadge
          status={row.translationStatus.toLowerCase()}
          customLabel={
            row.translationStatus === "NOT_TRANSLATED"
              ? "غير مترجم"
              : row.translationStatus === "NOMINATED"
                ? "مرشح"
                : "مترجم"
          }
        />
      ),
    },
    {
      key: "published",
      label: "الحالة",
      render: (row: AdminBook) => (
        <AdminStatusBadge status={row.published ? "published" : "draft"} />
      ),
    },
    {
      key: "actions",
      label: "",
      headerClassName: "w-16",
      render: (row: AdminBook) => (
        <Link href={`/${locale}/admin/books/${row.id}`}>
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
        title="الكتب"
        subtitle="إدارة كتالوج الكتب بجميع التفاصيل"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              onSubmit={() => void loadBooks()}
              placeholder="بحث بالعنوان..."
            />
            <Link href={`/${locale}/admin/books/new`}>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                إضافة كتاب
              </Button>
            </Link>
          </div>
        }
      />

      <AdminTable
        columns={columns}
        data={books}
        loading={loading}
        emptyMessage="لا توجد كتب — ابدأ بإضافة كتاب جديد"
      />

      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={20} />
    </div>
  );
}
