"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Pencil, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { appendListParams } from "@/lib/admin/list-query";
import { useAdminViewMode } from "@/lib/admin/use-admin-view-mode";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch, AdminPagination, AdminStatusBadge } from "@/components/admin/admin-table";
import {
  AdminFilterSelect,
  AdminListToolbar,
  AdminSortSelect,
} from "@/components/admin/admin-list-controls";
import {
  AdminGridCard,
  AdminGridCardBody,
  AdminGridCardFooter,
  AdminGridCardMedia,
} from "@/components/admin/admin-data-grid";
import { AdminListView } from "@/components/admin/admin-list-view";
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
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const channelLabel: Record<string, string> = {
  harvest: "حصاد الكتب",
  ideas: "زبدة الأفكار",
  "world-reads": "العالم يقرأ",
  "watch-your-book": "شاهد كتابك",
  "books-talk": "حديث الكتب",
  "novel-story": "رواية فحكاية",
};

const articleStatus = (s: string) =>
  s === "publish" ? "published" : s === "scheduled" ? "pending" : "draft";

export default function AdminArticlesPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const { viewMode, setViewMode } = useAdminViewMode("articles");

  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("updatedAt:desc");
  const [status, setStatus] = useState("all");
  const [channel, setChannel] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) q.set("search", search.trim());
      appendListParams(q, { sort, status, channel });
      const res = await fetch(`/api/v1/admin/articles?${q}`, { headers: adminAuthHeaders() });
      const data = (await res.json()) as {
        success: boolean;
        data?: Article[];
        pagination?: { totalPages: number; total: number };
      };
      if (data.success && data.data) {
        setArticles(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, sort, status, channel]);

  useEffect(() => {
    void load();
  }, [load]);

  const resetPage = () => setPage(1);

  const editBtn = (row: Article) => (
    <Link href={`/${locale}/admin/articles/${row.id}`}>
      <Button size="sm" variant="outline" className="gap-1.5 text-xs">
        <Pencil className="h-3 w-3" />
        تعديل
      </Button>
    </Link>
  );

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
        <span className="text-xs text-[var(--brand-gray-300)]">
          {row.channel ? (channelLabel[row.channel] ?? row.channel) : "—"}
        </span>
      ),
    },
    {
      key: "date",
      label: "التاريخ",
      render: (row: Article) => (
        <span className="text-xs text-[var(--brand-gray-400)]">
          {row.date ? new Date(row.date).toLocaleDateString("ar-EG") : "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "الحالة",
      render: (row: Article) => (
        <AdminStatusBadge status={articleStatus(row.status)} />
      ),
    },
    adminCreatedAtColumn<Article>(),
    adminUpdatedAtColumn<Article>(),
    { key: "actions", label: "", headerClassName: "w-16", render: editBtn },
  ];

  const renderCard = (row: Article) => (
    <AdminGridCard>
      <AdminGridCardMedia src={row.imageUrl} alt={row.title} fallback={<FileText className="h-10 w-10" />} />
      <AdminGridCardBody>
        <h3 className="line-clamp-2 font-semibold text-white">{row.title}</h3>
        <p className="text-xs text-[var(--brand-gray-500)]">
          {row.channel ? (channelLabel[row.channel] ?? row.channel) : "—"}
        </p>
        <AdminStatusBadge status={articleStatus(row.status)} />
      </AdminGridCardBody>
      <AdminGridCardFooter>{editBtn(row)}</AdminGridCardFooter>
    </AdminGridCard>
  );

  return (
    <div className="text-white">
      <AdminPageHeader
        title="المقالات"
        subtitle="إدارة المقالات التحريرية والميديا"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch
              value={search}
              onChange={(v) => {
                setSearch(v);
                resetPage();
              }}
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

      <AdminListToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={
          <>
            <AdminFilterSelect
              label="الحالة"
              value={status}
              onChange={(v) => {
                setStatus(v);
                resetPage();
              }}
              options={[
                { value: "all", label: "الكل" },
                { value: "publish", label: "منشور" },
                { value: "draft", label: "مسودة" },
                { value: "scheduled", label: "مجدول" },
              ]}
            />
            <AdminFilterSelect
              label="القناة"
              value={channel}
              onChange={(v) => {
                setChannel(v);
                resetPage();
              }}
              options={[
                { value: "all", label: "الكل" },
                ...Object.entries(channelLabel).map(([value, label]) => ({ value, label })),
              ]}
            />
          </>
        }
        sort={
          <AdminSortSelect
            value={sort}
            onChange={(v) => {
              setSort(v);
              resetPage();
            }}
            options={[
              { value: "updatedAt:desc", label: "آخر تحديث" },
              { value: "createdAt:desc", label: "الأحدث" },
              { value: "title:asc", label: "العنوان أ–ي" },
              { value: "date:desc", label: "تاريخ النشر" },
            ]}
          />
        }
      />

      <AdminListView
        viewMode={viewMode}
        columns={columns}
        data={articles}
        loading={loading}
        emptyMessage="لا توجد مقالات بعد"
        renderCard={renderCard}
      />
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={20} />
    </div>
  );
}
