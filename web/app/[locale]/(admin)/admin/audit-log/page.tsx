import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPaginationServer } from "@/components/admin/admin-table";

export const metadata: Metadata = {
  title: "سجل الأحداث — Admin",
};

const actionColor: Record<string, string> = {
  CREATE: "text-[var(--success)]",
  UPDATE: "text-[var(--info)]",
  DELETE: "text-[var(--error)]",
  APPROVE: "text-[var(--success)]",
  REJECT: "text-[var(--error)]",
  LOGIN: "text-[var(--admin-text-muted)]",
  LOGOUT: "text-[var(--admin-text-muted)]",
};

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedSearch = await searchParams;
  const page = Math.max(1, parseInt(resolvedSearch.page ?? "1", 10));
  const limit = 30;

  const [logs, total] = await Promise.all([
    db.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { email: true } } },
    }).catch(() => []),
    db.auditLog.count().catch(() => 0),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader title="سجل الأحداث" subtitle={`${total.toLocaleString("ar-EG")} حدث مسجل`} />

      <div className="overflow-hidden rounded-xl border border-[var(--admin-border)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--admin-surface-muted)]">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-medium text-[var(--admin-text-muted)]">الإجراء</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-[var(--admin-text-muted)]">الكيان</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-[var(--admin-text-muted)]">المسؤول</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-[var(--admin-text-muted)]">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--admin-border)] bg-[var(--admin-surface)]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[var(--admin-text-subtle)]">
                  لا توجد أحداث مسجلة بعد
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--admin-hover)]/40">
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs font-semibold ${actionColor[log.action] ?? "text-[var(--admin-text-muted)]"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[var(--admin-text-muted)]">{log.entity}</span>
                    {log.entityId && (
                      <span className="ms-1 text-[var(--admin-text-subtle)] text-xs">#{log.entityId.slice(0, 8)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--admin-text-muted)]">
                    {(log.user as { email: string } | null)?.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--admin-text-subtle)]">
                    {new Date(log.createdAt).toLocaleString("ar-EG")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPaginationServer
        page={page}
        totalPages={totalPages}
        buildHref={(p) => `?page=${p}`}
        total={total}
        pageSize={limit}
      />
    </div>
  );
}
