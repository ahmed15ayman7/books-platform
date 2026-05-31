"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { AdminCard } from "@/components/admin/admin-card";
import { AdminInput, AdminTextarea, AdminSlugInput } from "@/components/admin/admin-form-field";
import { autoSlugFromEnglish } from "@/lib/admin/slugify";

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

interface AuthorForm {
  name: string;
  nameAr: string;
  slug: string;
  bio: string;
  bioAr: string;
}

const emptyForm: AuthorForm = { name: "", nameAr: "", slug: "", bio: "", bioAr: "" };
const PAGE_SIZE = 20;

export default function AdminAuthorsPage() {
  const { viewMode, setViewMode } = useAdminViewMode("authors");
  const formRef = useRef<HTMLDivElement>(null);

  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name:asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AuthorForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [listError, setListError] = useState("");

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

  function openEdit(author: Author) {
    if (!canUpdate) return;
    setEditingId(author.id);
    setForm({
      name: author.name,
      nameAr: author.nameAr ?? "",
      slug: author.slug,
      bio: author.bio ?? "",
      bioAr: author.bioAr ?? "",
    });
    setError("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function startCreate() {
    if (!canCreate) return;
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editingId ? !canUpdate : !canCreate) return;

    setSaving(true);
    setError("");
    try {
      const url = editingId ? `/api/v1/admin/authors/${editingId}` : "/api/v1/admin/authors";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          nameAr: form.nameAr.trim() || undefined,
          slug: form.slug.trim(),
          bio: form.bio.trim() || undefined,
          bioAr: form.bioAr.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { success: boolean; error?: { message: string } };
      if (!res.ok || !data.success) {
        setError(data.error?.message ?? "فشل الحفظ");
        return;
      }
      setForm(emptyForm);
      setEditingId(null);
      await load();
    } catch {
      setError("حدث خطأ في الاتصال");
    } finally {
      setSaving(false);
    }
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
      if (editingId === row.id) {
        setEditingId(null);
        setForm(emptyForm);
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

  const set = (k: keyof AuthorForm) => (v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  const rowActions = (row: Author) => (
    <div className="flex items-center gap-1">
      {canUpdate && (
        <Button
          size="sm"
          variant="outline"
          className="gap-1 text-xs"
          onClick={() => openEdit(row)}
          aria-label="تعديل"
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
          aria-label="حذف"
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
        <h3 className="font-semibold text-white">{row.nameAr ?? row.name}</h3>
        {row.nameAr && <p className="text-xs text-[var(--brand-gray-500)]">{row.name}</p>}
        <code className="text-[10px] text-[var(--brand-gray-600)]">{row.slug}</code>
        <p className="text-sm text-[var(--brand-gray-400)]">{row._count?.products ?? 0} كتاب</p>
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
        <span className="text-[var(--brand-gray-300)]">{row.nameAr ?? "—"}</span>
      ),
    },
    {
      key: "slug",
      label: "Slug",
      render: (row: Author) => (
        <code className="text-xs text-[var(--brand-gray-400)]">{row.slug}</code>
      ),
    },
    {
      key: "products",
      label: "الكتب",
      render: (row: Author) => (
        <span className="text-[var(--brand-gray-300)]">{row._count?.products ?? 0}</span>
      ),
    },
    adminCreatedAtColumn<Author>(),
    adminUpdatedAtColumn<Author>(),
    ...(canUpdate || canDelete
      ? [{ key: "actions", label: "إجراءات", headerClassName: "w-36", render: rowActions }]
      : []),
  ];

  const showForm = canCreate || canUpdate;

  return (
    <div className="text-white">
      <AdminPageHeader
        title="المؤلفون"
        subtitle="إدارة مؤلفي الكتب"
        actions={
          <div className="flex items-center gap-2">
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
              <Button size="sm" className="gap-1.5" onClick={startCreate}>
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

      <div className="grid gap-6 lg:grid-cols-3">
        {showForm && (
          <div ref={formRef} className="lg:col-span-1">
            <AdminCard title={editingId ? "تعديل المؤلف" : "إضافة مؤلف"}>
              <form onSubmit={handleSubmit} className="space-y-3">
                <AdminInput
                  label="الاسم (EN) *"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((p) => ({
                      ...p,
                      name,
                      slug: autoSlugFromEnglish(name, p.slug, p.name),
                    }));
                  }}
                  dir="ltr"
                  required
                  disabled={!!editingId && !canUpdate}
                />
                <AdminInput
                  label="الاسم (AR)"
                  value={form.nameAr}
                  onChange={(e) => set("nameAr")(e.target.value)}
                  disabled={!!editingId && !canUpdate}
                />
                <AdminSlugInput
                  label="Slug *"
                  value={form.slug}
                  onChange={(e) => set("slug")(e.target.value)}
                  required
                  disabled={!!editingId && !canUpdate}
                />
                <AdminTextarea
                  label="نبذة (EN)"
                  value={form.bio}
                  onChange={(e) => set("bio")(e.target.value)}
                  rows={3}
                  dir="ltr"
                  disabled={!!editingId && !canUpdate}
                />
                <AdminTextarea
                  label="نبذة (AR)"
                  value={form.bioAr}
                  onChange={(e) => set("bioAr")(e.target.value)}
                  rows={3}
                  disabled={!!editingId && !canUpdate}
                />
                {error && <p className="text-xs text-[var(--error)]">{error}</p>}
                <div className="flex gap-2 pt-1">
                  {(editingId ? canUpdate : canCreate) && (
                    <Button type="submit" size="sm" disabled={saving}>
                      {saving ? "..." : editingId ? "تحديث" : "إضافة"}
                    </Button>
                  )}
                  {editingId && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingId(null);
                        setForm(emptyForm);
                        setError("");
                      }}
                    >
                      إلغاء
                    </Button>
                  )}
                </div>
              </form>
            </AdminCard>
          </div>
        )}

        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
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
          />
          <AdminPagination
            page={page}
            totalPages={totalPages}
            onPage={setPage}
            total={total}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </div>
  );
}
