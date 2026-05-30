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
import {
  adminCreatedAtColumn,
  adminUpdatedAtColumn,
} from "@/components/admin/admin-timestamps";

interface Article {
  id: string;
  slug: string;
  title: string;
  channel: string | null;
  status: string;
  date: string | null;
  createdAt: string;
  updatedAt: string;
}

const channelLabel: Record<string, string> = {
  "harvest": "حصاد الكتب",
  "ideas": "زبدة الأفكار",
  "world-reads": "العالم يقرأ",
  "watch-your-book": "شاهد كتابك",
  "books-talk": "حديث الكتب",
  "novel-story": "رواية فحكاية",
};

export default function AdminArticlesPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const [articles, setArticles] = useState<Article[]>([]);
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
      const res = await fetch(`/api/v1/admin/articles?${q}`, { headers: adminAuthHeaders() });
      const data = await res.json() as { success: boolean; data?: Article[]; pagination?: { totalPages: number; total: number } };
      if (data.success && data.data) {
        setArticles(data.data);
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
      key: "title",
      label: "العنوان",
      render: (row: Article) => (
        <span className="block max-w-[280px] truncate font-medium">{row.title}</span>
      ),
    },
    {
      key: "channel",
      label: "القناة",
      render: (row: Article) => (
        <span className="text-[var(--brand-gray-300)] text-xs">
          {row.channel ? (channelLabel[row.channel] ?? row.channel) : "—"}
        </span>
      ),
    },
    {
      key: "date",
      label: "التاريخ",
      render: (row: Article) => (
        <span className="text-[var(--brand-gray-400)] text-xs">
          {row.date ? new Date(row.date).toLocaleDateString("ar-EG") : "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: Article) => (
        <AdminStatusBadge status={row.status === "publish" ? "published" : row.status === "scheduled" ? "pending" : "draft"} />
      ),
    },
    adminCreatedAtColumn<Article>(),
    adminUpdatedAtColumn<Article>(),
    {
      key: "actions",
      label: "",
      headerClassName: "w-16",
      render: (row: Article) => (
        <Link href={`/${locale}/admin/articles/${row.id}`}>
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
        title="المقالات"
        subtitle="إدارة المقالات التحريرية والميديا"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch
              value={search}
              onChange={(v) => { setSearch(v); setPage(1); }}
              onSubmit={() => void load()}
              placeholder="بحث بالعنوان..."
            />
            <Link href={`/${locale}/admin/articles/new`}>
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                إضافة مقال
              </Button>
            </Link>
          </div>
        }
      />
      <AdminTable columns={columns} data={articles} loading={loading} emptyMessage="لا توجد مقالات بعد" />
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={20} />
    </div>
  );
}
