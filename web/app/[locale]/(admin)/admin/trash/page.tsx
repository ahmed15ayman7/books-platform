"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RotateCcw, Loader2, Pencil, Trash2, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPagination } from "@/components/admin/admin-table";
import { AdminHubTabs } from "@/components/admin/admin-hub-tabs";
import { AdminHubLinks } from "@/components/admin/admin-hub-links";
import {
  TRASH_TYPE_LABELS,
  type TrashType,
} from "@/lib/admin/content-hub-permissions";
import { loadAdminSession } from "@/lib/admin/permissions-client";
import { getAccessibleTrashTypes } from "@/lib/admin/content-hub-permissions";
import { TRASH_RETENTION_DAYS } from "@/lib/admin/trash-config";
import { formatAdminDateTime } from "@/lib/admin/format-dates";
import { adminToast } from "@/lib/admin/admin-toast";

interface TrashItem {
  id: string;
  type: TrashType;
  title: string;
  subtitle?: string;
  slug?: string;
  deletedAt?: string;
  updatedAt: string;
  autoPurgeAt?: string | null;
  daysRemaining?: number | null;
}

interface PaginatedResponse {
  success: boolean;
  data?: TrashItem[];
  pagination?: { total: number; page: number; totalPages: number };
}

function editHref(locale: string, type: TrashType, id: string): string | null {
  switch (type) {
    case "books":
      return `/${locale}/admin/books/${id}/edit`;
    case "articles":
      return `/${locale}/admin/articles/${id}/edit`;
    case "publishers":
      return `/${locale}/admin/publishers/${id}/edit`;
    case "hero":
      return `/${locale}/admin/home-slider`;
    case "users":
      return `/${locale}/admin/users`;
    default:
      return null;
  }
}

export default function AdminTrashPage() {
  const params = useParams<{ locale?: string }>();
  const locale = params.locale ?? "ar";

  const session = loadAdminSession();
  const accessibleTypes = useMemo(
    () => (session ? getAccessibleTrashTypes(session) : []),
    [session],
  );

  const [activeType, setActiveType] = useState<TrashType>(
    accessibleTypes[0] ?? "books",
  );
  const [items, setItems] = useState<TrashItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionTarget, setActionTarget] = useState<TrashItem | null>(null);
  const [purgeOpen, setPurgeOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const tabs = accessibleTypes.map((id) => ({
    id,
    label: TRASH_TYPE_LABELS[id],
  }));

  const load = useCallback(async () => {
    if (accessibleTypes.length === 0) return;
    setLoading(true);
    try {
      const q = new URLSearchParams({
        type: activeType,
        page: String(page),
        limit: "20",
      });
      const res = await fetch(`/api/v1/admin/trash?${q}`, {
        headers: adminAuthHeaders(),
      });
      const data = (await res.json()) as PaginatedResponse;
      if (data.success && data.data) {
        setItems(data.data);
        setTotalPages(data.pagination?.totalPages ?? 1);
        setTotal(data.pagination?.total ?? 0);
      } else {
        setItems([]);
        adminToast.error("تعذّر تحميل سلة المحذوفات");
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

  function handleRestore(item: TrashItem) {
    setActionTarget(item);
    startTransition(async () => {
      try {
        const res = await fetch("/api/v1/admin/trash/restore", {
          method: "POST",
          headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ type: item.type, id: item.id }),
        });
        const data = (await res.json()) as { success?: boolean; error?: { message?: string } };
        if (!res.ok || !data.success) {
          adminToast.error(data.error?.message ?? "فشل الاستعادة");
          return;
        }
        adminToast.success("restore", item.title);
        setActionTarget(null);
        await load();
      } catch {
        adminToast.error("حدث خطأ في الاتصال");
      }
    });
  }

  function openPurgeConfirm(item: TrashItem) {
    setActionTarget(item);
    setPurgeOpen(true);
  }

  function executePurge() {
    if (!actionTarget) return;
    startTransition(async () => {
      try {
        const res = await fetch("/api/v1/admin/trash/purge", {
          method: "POST",
          headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ type: actionTarget.type, id: actionTarget.id }),
        });
        const data = (await res.json()) as {
          success?: boolean;
          error?: { message?: string };
        };
        if (!res.ok || !data.success) {
          adminToast.error(data.error?.message ?? "فشل الحذف النهائي");
          return;
        }
        adminToast.success("delete", actionTarget.title);
        setPurgeOpen(false);
        setActionTarget(null);
        await load();
      } catch {
        adminToast.error("حدث خطأ في الاتصال");
      }
    });
  }

  if (accessibleTypes.length === 0) {
    return (
      <div>
        <AdminPageHeader title="سلة المحذوفات" subtitle="لا تملك صلاحية الوصول" />
      </div>
    );
  }

  return (
    <div>
      <AdminPageHeader
        title="سلة المحذوفات"
        subtitle={`${total} عنصر — تُحذف تلقائياً بعد ${TRASH_RETENTION_DAYS} يوماً من تاريخ الحذف`}
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

      <div className="overflow-hidden rounded-xl border border-[var(--admin-border)]">
        <table className="w-full text-sm">
          <thead className="border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-[var(--admin-text-muted)]">العنوان</th>
              <th className="hidden px-4 py-3 text-start font-medium text-[var(--admin-text-muted)] md:table-cell">
                تاريخ الحذف
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-[var(--admin-text-muted)] lg:table-cell">
                الحذف التلقائي
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
                  سلة المحذوفات فارغة في هذا القسم
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const href = editHref(locale, item.type, item.id);
                const isBusy = isPending && actionTarget?.id === item.id;
                const daysLeft = item.daysRemaining ?? null;

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
                    <td className="hidden px-4 py-3 text-[var(--admin-text-muted)] md:table-cell">
                      {item.deletedAt ? formatAdminDateTime(item.deletedAt) : "—"}
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      {daysLeft !== null ? (
                        <span
                          className={
                            daysLeft === 0
                              ? "text-xs font-medium text-red-400"
                              : daysLeft <= 7
                                ? "text-xs text-amber-400"
                                : "text-xs text-[var(--admin-text-muted)]"
                          }
                        >
                          {daysLeft === 0
                            ? "يُحذف قريباً"
                            : `بعد ${daysLeft} ${daysLeft === 1 ? "يوم" : "أيام"}`}
                          {item.autoPurgeAt && (
                            <span className="mt-0.5 block text-[10px] text-[var(--admin-text-subtle)]">
                              {formatAdminDateTime(item.autoPurgeAt)}
                            </span>
                          )}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {href && (
                          <Link href={href} aria-label="تعديل">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </Link>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 border-[var(--admin-border-strong)] text-emerald-400 hover:border-emerald-800/60 hover:bg-emerald-950/30"
                          disabled={isBusy}
                          onClick={() => handleRestore(item)}
                        >
                          {isBusy && !purgeOpen ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          استعادة
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 border-[var(--admin-border-strong)] text-red-400 hover:border-red-800/60 hover:bg-red-950/30"
                          disabled={isBusy}
                          onClick={() => openPurgeConfirm(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                          حذف نهائي
                        </Button>
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

      {purgeOpen && actionTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="purge-trash-title"
        >
          <div className="w-full max-w-md rounded-xl border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] shadow-2xl">
            <div className="flex items-start justify-between gap-3 border-b border-[var(--admin-border)] px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-950/50 text-red-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h2 id="purge-trash-title" className="text-lg font-bold text-[var(--admin-text)]">
                    حذف نهائي
                  </h2>
                  <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                    لا يمكن التراجع عن هذا الإجراء.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => !isPending && setPurgeOpen(false)}
                disabled={isPending}
                className="rounded-lg p-1 text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] disabled:opacity-50"
                aria-label="إغلاق"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-5">
              <p className="text-sm text-[var(--admin-text-muted)]">
                سيتم مسح العنصر نهائياً من قاعدة البيانات:
              </p>
              <p className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] px-3 py-2 text-sm font-medium text-[var(--admin-text)]">
                {actionTarget.title}
              </p>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => setPurgeOpen(false)}
                >
                  إلغاء
                </Button>
                <Button
                  type="button"
                  className="gap-2 bg-red-700 text-white hover:bg-red-600"
                  disabled={isPending}
                  onClick={executePurge}
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  نعم، احذف نهائياً
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
