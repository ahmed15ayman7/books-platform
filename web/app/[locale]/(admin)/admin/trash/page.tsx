"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { RotateCcw, Loader2, Pencil } from "lucide-react";
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
import { formatAdminDateTime } from "@/lib/admin/format-dates";
import { usePasskeyGate } from "@/lib/admin/use-passkey-gate";
import { PasskeyGateDialog } from "@/components/admin/passkey-gate-dialog";

interface TrashItem {
  id: string;
  type: TrashType;
  title: string;
  subtitle?: string;
  slug?: string;
  deletedAt?: string;
  updatedAt: string;
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
      return `/${locale}/admin/articles/${id}`;
    case "publishers":
      return `/${locale}/admin/publishers/${id}`;
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
  const [error, setError] = useState("");
  const [restoreTarget, setRestoreTarget] = useState<TrashItem | null>(null);
  const [passkeyOpen, setPasskeyOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { busy: passkeyBusy, error: passkeyError, runWithPasskey } = usePasskeyGate();

  const tabs = accessibleTypes.map((id) => ({
    id,
    label: TRASH_TYPE_LABELS[id],
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
        setError("تعذّر تحميل سلة المحذوفات");
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
    setRestoreTarget(item);
    setPasskeyOpen(true);
  }

  async function confirmRestore() {
    if (!restoreTarget) return;
    await runWithPasskey(async () => {
      setPasskeyOpen(false);
      startTransition(async () => {
        setError("");
        try {
          const res = await fetch("/api/v1/admin/trash/restore", {
            method: "POST",
            headers: { ...adminAuthHeaders(), "Content-Type": "application/json" },
            body: JSON.stringify({ type: restoreTarget.type, id: restoreTarget.id }),
          });
          const data = (await res.json()) as { success?: boolean; error?: { message?: string } };
          if (!res.ok || !data.success) {
            setError(data.error?.message ?? "فشل الاستعادة");
            return;
          }
          setRestoreTarget(null);
          await load();
        } catch {
          setError("حدث خطأ في الاتصال");
        }
      });
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
        subtitle={`${total} عنصر محذوف — يمكن استعادته في أي وقت`}
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
                تاريخ الحذف
              </th>
              <th className="px-4 py-3 text-end font-medium text-[var(--admin-text-muted)]">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-[var(--admin-text-muted)]">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-[var(--admin-text-muted)]">
                  سلة المحذوفات فارغة في هذا القسم
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const href = editHref(locale, item.type, item.id);
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
                          disabled={isPending}
                          onClick={() => handleRestore(item)}
                        >
                          {isPending && restoreTarget?.id === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4" />
                          )}
                          استعادة
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

      <PasskeyGateDialog
        open={passkeyOpen}
        onOpenChange={setPasskeyOpen}
        busy={passkeyBusy || isPending}
        error={passkeyError}
        onConfirm={() => void confirmRestore()}
        title="تأكيد الاستعادة بـ Passkey"
      />
    </div>
  );
}
