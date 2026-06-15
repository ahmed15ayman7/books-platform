"use client";

import { PAGINATION } from "@/lib/utils/constants";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Star, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { absoluteUrl } from "@/lib/seo/site";
import { AdminEntityActions } from "@/components/admin/admin-entity-actions";
import {
  adminPublisherEditPath,
  adminPublisherViewPath,
  publicPublisherUrl,
} from "@/lib/admin/public-urls";
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

interface Publisher {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  country: string | null;
  status: string;
  sponsored: boolean;
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

export default function AdminPublishersPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const { viewMode, setViewMode } = useAdminViewMode("publishers");

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("updatedAt:desc");
  const [status, setStatus] = useState("all");
  const [sponsored, setSponsored] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: String(PAGINATION.DEFAULT_PAGE_SIZE) });
      if (search.trim()) q.set("search", search.trim());
      appendListParams(q, { sort, status, sponsored });
      const res = await fetch(`/api/v1/admin/publishers?${q}`, {
        headers: adminAuthHeaders(),
      });
      const data = (await res.json()) as {
        success: boolean;
        data?: Publisher[];
        pagination?: { totalPages: number; total: number };
      };
      if (data.success && data.data) {
        setPublishers(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, sort, status, sponsored]);

  useEffect(() => {
    void load();
  }, [load]);

  const resetPage = () => setPage(1);

  const rowActions = (row: Publisher) => (
    <AdminEntityActions
      viewHref={adminPublisherViewPath(locale, row.id)}
      editHref={adminPublisherEditPath(locale, row.id)}
      publicHref={
        row.status === "publish"
          ? absoluteUrl(publicPublisherUrl(locale, row.slug))
          : undefined
      }
    />
  );

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
        <span className="text-[var(--admin-text-muted)]">{row.country ?? "—"}</span>
      ),
    },
    {
      key: "products",
      label: "الكتب",
      render: (row: Publisher) => (
        <span className="text-[var(--admin-text-muted)]">{row._count?.products ?? 0}</span>
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
          <span className="text-xs text-[var(--admin-text-subtle)]">—</span>
        ),
    },
    adminCreatedAtColumn<Publisher>(),
    adminUpdatedAtColumn<Publisher>(),
    { key: "actions", label: "", headerClassName: "w-28", render: rowActions },
  ];

  const renderCard = (row: Publisher) => (
    <AdminGridCard>
      <AdminGridCardMedia
        src={row.imageUrl}
        alt={row.name}
        fallback={<Building2 className="h-10 w-10" />}
        href={adminPublisherViewPath(locale, row.id)}
      />
      <AdminGridCardBody>
        <div className="flex items-start gap-1">
          <h3 className="line-clamp-2 flex-1 font-semibold text-[var(--admin-text)]">{row.name}</h3>
          {row.sponsored && <Star className="h-4 w-4 shrink-0 text-[var(--warning)]" />}
        </div>
        <p className="text-xs text-[var(--admin-text-subtle)]">{row.country ?? "—"}</p>
        <p className="text-xs text-[var(--admin-text-muted)]">
          {row._count?.products ?? 0} كتاب
        </p>
        <AdminStatusBadge status={row.status === "publish" ? "published" : "draft"} />
      </AdminGridCardBody>
      <AdminGridCardFooter>{rowActions(row)}</AdminGridCardFooter>
    </AdminGridCard>
  );

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader
        title="الناشرون"
        subtitle="إدارة دور النشر وحالة التمويل"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch
              value={search}
              onChange={(v) => {
                setSearch(v);
                resetPage();
              }}
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
              ]}
            />
            <AdminFilterSelect
              label="التمويل"
              value={sponsored}
              onChange={(v) => {
                setSponsored(v);
                resetPage();
              }}
              options={[
                { value: "all", label: "الكل" },
                { value: "true", label: "مموّل" },
                { value: "false", label: "غير مموّل" },
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
              { value: "title:asc", label: "الاسم أ–ي" },
            ]}
          />
        }
      />

      <AdminListView
        viewMode={viewMode}
        columns={columns}
        data={publishers}
        loading={loading}
        emptyMessage="لا يوجد ناشرون بعد"
        renderCard={renderCard}
      />
      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} total={total} pageSize={PAGINATION.DEFAULT_PAGE_SIZE} />
    </div>
  );
}
