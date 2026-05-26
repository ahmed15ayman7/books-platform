import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminPageHeader } from "@/components/admin/admin-page-header";

export const metadata: Metadata = {
  title: "سجل الأحداث — Admin",
};

const actionColor: Record<string, string> = {
  CREATE: "text-[var(--success)]",
  UPDATE: "text-[var(--info)]",
  DELETE: "text-[var(--error)]",
  APPROVE: "text-[var(--success)]",
  REJECT: "text-[var(--error)]",
  LOGIN: "text-[var(--brand-gray-400)]",
  LOGOUT: "text-[var(--brand-gray-400)]",
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
    <div className="text-white">
      <AdminPageHeader title="سجل الأحداث" subtitle={`${total.toLocaleString("ar-EG")} حدث مسجل`} />

      <div className="overflow-hidden rounded-xl border border-[var(--brand-gray-800)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--brand-gray-800)]">
            <tr>
              <th className="px-4 py-3 text-start text-xs font-medium text-[var(--brand-gray-400)]">الإجراء</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-[var(--brand-gray-400)]">الكيان</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-[var(--brand-gray-400)]">المسؤول</th>
              <th className="px-4 py-3 text-start text-xs font-medium text-[var(--brand-gray-400)]">التاريخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--brand-gray-800)] bg-[var(--brand-gray-900)]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-[var(--brand-gray-500)]">
                  لا توجد أحداث مسجلة بعد
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-[var(--brand-gray-800)]/40">
                  <td className="px-4 py-3">
                    <span className={`font-mono text-xs font-semibold ${actionColor[log.action] ?? "text-[var(--brand-gray-300)]"}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[var(--brand-gray-300)]">{log.entity}</span>
                    {log.entityId && (
                      <span className="ms-1 text-[var(--brand-gray-600)] text-xs">#{log.entityId.slice(0, 8)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--brand-gray-400)]">
                    {(log.user as { email: string } | null)?.email ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-[var(--brand-gray-500)]">
                    {new Date(log.createdAt).toLocaleString("ar-EG")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center gap-2">
          {page > 1 && (
            <a
              href={`?page=${page - 1}`}
              className="rounded-lg border border-[var(--brand-gray-700)] px-3 py-1.5 text-sm text-[var(--brand-gray-300)] hover:bg-[var(--brand-gray-800)] transition-colors"
            >
              السابق
            </a>
          )}
          <span className="text-xs text-[var(--brand-gray-400)]">{page} / {totalPages}</span>
          {page < totalPages && (
            <a
              href={`?page=${page + 1}`}
              className="rounded-lg border border-[var(--brand-gray-700)] px-3 py-1.5 text-sm text-[var(--brand-gray-300)] hover:bg-[var(--brand-gray-800)] transition-colors"
            >
              التالي
            </a>
          )}
        </div>
      )}
    </div>
  );
}
