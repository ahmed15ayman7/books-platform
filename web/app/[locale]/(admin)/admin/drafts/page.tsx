"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, Pencil, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination, AdminStatusBadge } from "@/components/admin/admin-table";
import { AdminHubTabs } from "@/components/admin/admin-hub-tabs";
import { AdminHubLinks } from "@/components/admin/admin-hub-links";
import {
  DRAFT_TYPE_LABELS,
  type DraftType,
  getAccessibleDraftTypes,
} from "@/lib/admin/content-hub-permissions";
import { loadAdminSession, can } from "@/lib/admin/permissions-client";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { formatAdminDateTime } from "@/lib/admin/format-dates";

interface DraftItem {
  id: string;
  type: DraftType;
  title: string;
  subtitle?: string;
  slug?: string;
  status?: string;
  updatedAt: string;
}

interface PaginatedResponse {
  success: boolean;
  data?: DraftItem[];
  pagination?: { total: number; page: number; totalPages: number };
}

function editHref(locale: string, type: DraftType, id: string): string {
  switch (type) {
    case "books":
      return `/${locale}/admin/books/${id}/edit`;
    case "articles":
      return `/${locale}/admin/articles/${id}`;
    case "publishers":
      return `/${locale}/admin/publishers/${id}`;
    case "submissions":
      return `/${locale}/admin/submissions`;
  }
}

function canPublishType(type: DraftType): boolean {
  if (type === "submissions") return false;
  if (type === "books") return can(PERMISSIONS.books.update);
  if (type === "articles") return can(PERMISSIONS.articles.update);
  if (type === "publishers") return can(PERMISSIONS.publishers.update);
  return false;
}

export default function AdminDraftsPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";

  const session = loadAdminSession();
  const accessibleTypes = useMemo(
    () => (session ? getAccessibleDraftTypes(session) : []),
    [session],
  );

  const [activeType, setActiveType] = useState<DraftType>(
    accessibleTypes[0] ?? "books",
  );
  const [items, setItems] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const tabs = accessibleTypes.map((id) => ({
    id,
    label: DRAFT_TYPE_LABELS[id],
  }));

  const load = useCallback(async () => {
    if (accessibleTypes.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const q = new URLSearchParams({
        type: activeType,
        page: String(page),
        limit: "20",
      });
      const res = await fetch(`/api/v1/admin/drafts?${q}`, {
        headers: adminAuthHeaders(),
      });
      const data = (await res.json()) as PaginatedResponse;
      if (data.success && data.data) {
        setItems(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      } else {
        setItems([]);
        setError("تعذّر تحميل المسودات");
      }
    } finally {
      setLoading(false);
    }
  }, [activeType, page, accessibleTypes.length]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (accessibleTypes.length > 0 && !accessibleTypes.includes(activeType)) {
      const next = accessibleTypes[0];
      if (next) {
        setActiveType(next);
        setPage(1);
      }
    }
  }, [accessibleTypes, activeType]);

  function handlePublish(item: DraftItem) {
    if (item.type === "submissions") return;
    setPublishingId(item.id);
    startTransition(async () => {
      setError("");
      try {
        const res = await fetch("/api/v1/admin/drafts/publish", {
          method: "POST",
          headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ type: item.type, id: item.id }),
        });
        const data = (await res.json()) as { success?: boolean; error?: { message?: string } };
        if (!res.ok || !data.success) {
          setError(data.error?.message ?? "فشل النشر");
          return;
        }
        await load();
      } catch {
        setError("حدث خطأ في الاتصال");
      } finally {
        setPublishingId(null);
      }
    });
  }

  if (accessibleTypes.length === 0) {
    return (
      <div>
        <AdminPageHeader title="المسودات" subtitle="لا تملك صلاحية الوصول" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="المسودات"
        subtitle={`${total} عنصر غير منشور — كتب ومقالات وناشرون وطلبات`}
        actions={<AdminHubLinks />}
      />

      <div className="mb-4">
        <AdminHubTabs
          tabs={tabs}
          active={activeType}
          onChange={(type) => {
            setActiveType(type);
            setPage(1);
          }}
        />
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-[var(--admin-border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-[var(--admin-text-muted)]">العنوان</th>
              <th className="hidden px-4 py-3 text-start font-medium text-[var(--admin-text-muted)] md:table-cell">
                الحالة
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-[var(--admin-text-muted)] lg:table-cell">
                آخر تحديث
              </th>
              <th className="px-4 py-3 text-end font-medium text-[var(--admin-text-muted)]">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-[var(--admin-text-muted)]">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-[var(--admin-text-muted)]">
                  لا توجد مسودات في هذا القسم
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const href = editHref(locale, item.type, item.id);
                const showPublish = canPublishType(item.type);
                const isPublishing = isPending && publishingId === item.id;

                return (
                  <tr
                    key={item.id}
                    className="border-b border-[var(--admin-border)] last:border-0 hover:bg-[var(--admin-hover)]/50"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-[var(--admin-text)]">{item.title}</p>
                      {item.subtitle && (
                        <p className="mt-0.5 text-xs text-[var(--admin-text-subtle)]">{item.subtitle}</p>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <AdminStatusBadge
                        status={item.status === "scheduled" ? "pending" : "draft"}
                        customLabel={item.status === "scheduled" ? "مجدول" : undefined}
                      />
                    </td>
                    <td className="hidden px-4 py-3 text-[var(--admin-text-muted)] lg:table-cell">
                      {formatAdminDateTime(item.updatedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={href} aria-label="تعديل">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        {showPublish && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 border-[var(--admin-border-strong)] text-[var(--admin-accent)] hover:bg-[var(--admin-hover)]"
                            disabled={isPublishing}
                            onClick={() => handlePublish(item)}
                          >
                            {isPublishing ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Send className="h-4 w-4" />
                            )}
                            نشر
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination page={page} totalPages={totalPages} onPage={setPage} />
    </div>
  );
}
