"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { can } from "@/lib/admin/permissions-client";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminSearch, AdminPagination } from "@/components/admin/admin-table";
import { useAdminViewMode } from "@/lib/admin/use-admin-view-mode";
import { AdminListToolbar, AdminSortSelect } from "@/components/admin/admin-list-controls";
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
import {
  AuthorFormDialog,
  type AuthorFormValues,
} from "@/components/admin/author-form-dialog";

interface Author {
  id: string;
  name: string;
  nameAr: string | null;
  slug: string;
  bio: string | null;
  bioAr: string | null;
  _count?: { products: number };
  createdAt: string;
  updatedAt: string;
}

const PAGE_SIZE = 20;

export default function AdminAuthorsPage() {
  const { viewMode, setViewMode } = useAdminViewMode("authors");

  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name:asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorFormValues | null>(null);

  const canCreate = can(PERMISSIONS.authors.create);
  const canUpdate = can(PERMISSIONS.authors.update);
  const canDelete = can(PERMISSIONS.authors.delete);

  const load = useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const q = new URLSearchParams({
        page: String(page),
        limit: String(PAGE_SIZE),
        sort,
      });
      if (search.trim()) q.set("search", search.trim());

      const res = await fetch(`/api/v1/admin/authors?${q}`, { headers: adminAuthHeaders() });
      const data = (await res.json()) as {
        success: boolean;
        data?: Author[];
        pagination?: { totalPages: number; total: number };
        error?: { message: string };
      };
      if (!res.ok || !data.success) {
        setListError(data.error?.message ?? "فشل تحميل المؤلفين");
        return;
      }
      if (data.data) setAuthors(data.data);
      setTotalPages(data.pagination?.totalPages ?? 1);
      setTotal(data.pagination?.total ?? 0);
    } catch {
      setListError("حدث خطأ في الاتصال");
    } finally {
      setLoading(false);
    }
  }, [page, search, sort]);

  useEffect(() => {
    void load();
  }, [load]);

  const resetPage = () => setPage(1);

  function openCreate() {
    if (!canCreate) return;
    setEditingAuthor(null);
    setDialogOpen(true);
  }

  function openEdit(author: Author) {
    if (!canUpdate) return;
    setEditingAuthor({
      id: author.id,
      name: author.name,
      nameAr: author.nameAr ?? "",
      slug: author.slug,
      bio: author.bio ?? "",
      bioAr: author.bioAr ?? "",
    });
    setDialogOpen(true);
  }

  async function handleDelete(row: Author) {
    if (!canDelete) return;
    const bookCount = row._count?.products ?? 0;
    const msg =
      bookCount > 0
        ? `حذف المؤلف «${row.nameAr ?? row.name}»؟ سيُزال من ${bookCount} كتاب مرتبط.`
        : `حذف المؤلف «${row.nameAr ?? row.name}»؟`;
    if (!confirm(msg)) return;

    setListError("");
    try {
      const res = await fetch(`/api/v1/admin/authors/${row.id}`, {
        method: "DELETE",
        headers: adminAuthHeaders(),
      });
      const data = (await res.json()) as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) {
        setListError(data.error?.message ?? "فشل حذف المؤلف");
        return;
      }
      if (editingAuthor?.id === row.id) {
        setDialogOpen(false);
        setEditingAuthor(null);
      }
      if (authors.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await load();
      }
    } catch {
      setListError("حدث خطأ في الاتصال");
    }
  }

  const rowActions = (row: Author) => (
    <div className="flex items-center gap-1">
      {canUpdate && (
        <Button
          size="sm"
          variant="outline"
          className="gap-1 text-xs"
          onClick={() => openEdit(row)}
        >
          <Pencil className="h-3 w-3" />
          تعديل
        </Button>
      )}
      {canDelete && (
        <Button
          size="sm"
          variant="outline"
          className="gap-1 border-[var(--error)]/40 text-[var(--error)] text-xs hover:bg-[var(--error)]/10"
          onClick={() => void handleDelete(row)}
        >
          <Trash2 className="h-3 w-3" />
          حذف
        </Button>
      )}
    </div>
  );

  const renderCard = (row: Author) => (
    <AdminGridCard>
      <AdminGridCardBody>
        <h3 className="font-semibold text-[var(--admin-text)]">{row.nameAr ?? row.name}</h3>
        {row.nameAr && <p className="text-xs text-[var(--admin-text-subtle)]">{row.name}</p>}
        <code className="text-[10px] text-[var(--admin-text-subtle)]">{row.slug}</code>
        <p className="text-sm text-[var(--admin-text-muted)]">{row._count?.products ?? 0} كتاب</p>
      </AdminGridCardBody>
      <AdminGridCardFooter>{rowActions(row)}</AdminGridCardFooter>
    </AdminGridCard>
  );

  const columns = [
    {
      key: "name",
      label: "الاسم (EN)",
      render: (row: Author) => <span className="font-medium">{row.name}</span>,
    },
    {
      key: "nameAr",
      label: "الاسم (AR)",
      render: (row: Author) => (
        <span className="text-[var(--admin-text-muted)]">{row.nameAr ?? "—"}</span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (row: Author) => (
        <code className="text-xs text-[var(--admin-text-muted)]">{row.slug}</code>
      ),
    },
    {
      key: "products",
      label: "الكتب",
      render: (row: Author) => (
        <span className="text-[var(--admin-text-muted)]">{row._count?.products ?? 0}</span>
      ),
    },
    adminCreatedAtColumn<Author>(),
    adminUpdatedAtColumn<Author>(),
    ...(canUpdate || canDelete
      ? [{ key: "actions", label: "إجراءات", headerClassName: "w-36", render: rowActions }]
      : []),
  ];

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader
        title="المؤلفون"
        subtitle="إدارة مؤلفي الكتب"
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <AdminSearch
              value={search}
              onChange={(v) => {
                setSearch(v);
                resetPage();
              }}
              onSubmit={() => void load()}
              placeholder="بحث بالاسم أو Slug..."
            />
            {canCreate && (
              <Button size="sm" className="gap-1.5" onClick={openCreate}>
                <Plus className="h-4 w-4" />
                مؤلف جديد
              </Button>
            )}
          </div>
        }
      />

      {listError && (
        <p className="mb-4 rounded-lg border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-2 text-sm text-[var(--error)]">
          {listError}
        </p>
      )}

      <AdminListToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sort={
          <AdminSortSelect
            value={sort}
            onChange={(v) => {
              setSort(v);
              resetPage();
            }}
            options={[
              { value: "name:asc", label: "الاسم أ–ي" },
              { value: "updatedAt:desc", label: "آخر تحديث" },
              { value: "createdAt:desc", label: "الأحدث" },
            ]}
          />
        }
      />

      <AdminListView
        viewMode={viewMode}
        columns={columns}
        data={authors}
        loading={loading}
        emptyMessage="لا يوجد مؤلفون بعد"
        renderCard={renderCard}
        onRowClick={canUpdate ? openEdit : undefined}
      />

      <AdminPagination
        page={page}
        totalPages={totalPages}
        onPage={setPage}
        total={total}
        pageSize={PAGE_SIZE}
      />

      {(canCreate || canUpdate) && (
        <AuthorFormDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          author={editingAuthor}
          onSaved={() => void load()}
        />
      )}
    </div>
  );
}
