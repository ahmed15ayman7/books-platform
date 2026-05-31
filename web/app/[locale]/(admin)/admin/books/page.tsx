"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Plus, Pencil, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { appendListParams } from "@/lib/admin/list-query";
import { useAdminViewMode } from "@/lib/admin/use-admin-view-mode";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  AdminSearch,
  AdminPagination,
  AdminStatusBadge,
} from "@/components/admin/admin-table";
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
import { BookDeleteButton } from "./[id]/book-delete-button";
import {
  adminCreatedAtColumn,
  adminUpdatedAtColumn,
} from "@/components/admin/admin-timestamps";
import { formatAdminDateTime } from "@/lib/admin/format-dates";

interface AdminBook {
  id: string;
  slug: string;
  nameEn: string;
  nameAr: string | null;
  translationStatus: string;
  published: boolean;
  featured: boolean;
  language: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  success: boolean;
  data?: AdminBook[];
  pagination?: { total: number; page: number; totalPages: number };
}

const translationLabel = (s: string) =>
  s === "NOT_TRANSLATED"
    ? "غير مترجم"
    : s === "NOMINATED" || s === "PARTIAL"
      ? "مرشح"
      : "مترجم";

export default function AdminBooksPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";
  const { viewMode, setViewMode } = useAdminViewMode("books");

  const [books, setBooks] = useState<AdminBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const [sort, setSort] = useState("updatedAt:desc");
  const [published, setPublished] = useState("all");
  const [translationStatus, setTranslationStatus] = useState("all");
  const [featured, setFeatured] = useState("all");

  const loadBooks = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams({ page: String(page), limit: "20" });
      if (search.trim()) q.set("search", search.trim());
      appendListParams(q, { sort, published, translationStatus, featured });
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
  }, [page, search, sort, published, translationStatus, featured]);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const resetPage = () => setPage(1);

  const bookActions = (row: AdminBook) => (
    <div className="flex items-center gap-1">
      <Link href={`/${locale}/admin/books/${row.id}`} aria-label="عرض">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/${locale}/admin/books/${row.id}/edit`} aria-label="تعديل">
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </Link>
      <BookDeleteButton
        bookId={row.id}
        bookTitle={row.nameAr ?? row.nameEn}
        locale={locale}
        variant="icon"
        onDeleted={() => void loadBooks()}
        isBooksPage={true}
      />
    </div>
  );

  const columns = [
    {
      key: "nameEn",
      label: "العنوان (EN)",
      className: "max-w-[200px] truncate font-medium",
      render: (row: AdminBook) => (
        <span className="block max-w-[200px] truncate">{row.nameEn}</span>
      ),
    },
    {
      key: "nameAr",
      label: "العنوان (AR)",
      className: "max-w-[200px]",
      render: (row: AdminBook) => (
        <span className="block max-w-[200px] truncate text-[var(--admin-text-muted)]">
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
          customLabel={translationLabel(row.translationStatus)}
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
    adminCreatedAtColumn<AdminBook>(),
    adminUpdatedAtColumn<AdminBook>(),
    {
      key: "actions",
      label: "",
      headerClassName: "w-24",
      render: (row: AdminBook) => bookActions(row),
    },
  ];

  const renderCard = (row: AdminBook) => (
    <AdminGridCard>
      <AdminGridCardMedia src={row.imageUrl} alt={row.nameAr ?? row.nameEn} />
      <AdminGridCardBody>
        <h3 className="line-clamp-2 font-semibold text-[var(--admin-text)]">
          {row.nameAr ?? row.nameEn}
        </h3>
        {row.nameAr && row.nameEn && (
          <p className="line-clamp-1 text-xs text-[var(--admin-text-subtle)]" dir="ltr">
            {row.nameEn}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5">
          <AdminStatusBadge
            status={row.translationStatus.toLowerCase()}
            customLabel={translationLabel(row.translationStatus)}
          />
          <AdminStatusBadge status={row.published ? "published" : "draft"} />
          {row.featured && <AdminStatusBadge status="nominated" customLabel="مميز" />}
        </div>
        <p className="mt-auto truncate text-[10px] text-[var(--admin-text-subtle)]" dir="ltr">
          /{row.slug}
        </p>
        <p className="text-[10px] text-[var(--admin-text-subtle)]">
          {formatAdminDateTime(row.updatedAt)}
        </p>
      </AdminGridCardBody>
      <AdminGridCardFooter>{bookActions(row)}</AdminGridCardFooter>
    </AdminGridCard>
  );

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader
        title="الكتب"
        subtitle="إدارة كتالوج الكتب بجميع التفاصيل"
        actions={
          <div className="flex items-center gap-2">
            <AdminSearch
              value={search}
              onChange={(v) => {
                setSearch(v);
                resetPage();
              }}
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

      <AdminListToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        filters={
          <>
            <AdminFilterSelect
              label="النشر"
              value={published}
              onChange={(v) => {
                setPublished(v);
                resetPage();
              }}
              options={[
                { value: "all", label: "الكل" },
                { value: "true", label: "منشور" },
                { value: "false", label: "مسودة" },
              ]}
            />
            <AdminFilterSelect
              label="الترجمة"
              value={translationStatus}
              onChange={(v) => {
                setTranslationStatus(v);
                resetPage();
              }}
              options={[
                { value: "all", label: "الكل" },
                { value: "NOT_TRANSLATED", label: "غير مترجم" },
                { value: "NOMINATED", label: "مرشح" },
                { value: "TRANSLATED", label: "مترجم" },
                { value: "PARTIAL", label: "جزئي" },
              ]}
            />
            <AdminFilterSelect
              label="مميز"
              value={featured}
              onChange={(v) => {
                setFeatured(v);
                resetPage();
              }}
              options={[
                { value: "all", label: "الكل" },
                { value: "true", label: "مميز" },
                { value: "false", label: "عادي" },
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
              { value: "createdAt:desc", label: "الأحدث إضافة" },
              { value: "nameEn:asc", label: "الاسم (EN) أ–ي" },
              { value: "nameAr:asc", label: "الاسم (AR) أ–ي" },
              { value: "position:desc", label: "الترتيب" },
            ]}
          />
        }
      />

      <AdminListView
        viewMode={viewMode}
        columns={columns}
        data={books}
        loading={loading}
        emptyMessage="لا توجد كتب — ابدأ بإضافة كتاب جديد"
        renderCard={renderCard}
      />

      <AdminPagination
        page={page}
        totalPages={totalPages}
        onPage={setPage}
        total={total}
        pageSize={20}
      />
    </div>
  );
}
