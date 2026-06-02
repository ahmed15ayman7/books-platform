"use client";

export interface LoginHistoryRow {
  id: string;
  action: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
}

const actionLabel: Record<string, string> = {
  LOGIN: "تسجيل دخول",
  LOGOUT: "تسجيل خروج",
  LOGIN_FAILED: "محاولة فاشلة",
};

export function LoginHistoryTable({ logs }: { logs: LoginHistoryRow[] }) {
  if (logs.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-[var(--admin-text-subtle)]">
        لا توجد سجلات بعد
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--admin-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--admin-surface-muted)]">
          <tr>
            <th className="px-4 py-3 text-start text-xs font-medium text-[var(--admin-text-muted)]">
              الإجراء
            </th>
            <th className="px-4 py-3 text-start text-xs font-medium text-[var(--admin-text-muted)]">
              IP
            </th>
            <th className="px-4 py-3 text-start text-xs font-medium text-[var(--admin-text-muted)]">
              المتصفح
            </th>
            <th className="px-4 py-3 text-start text-xs font-medium text-[var(--admin-text-muted)]">
              التاريخ
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--admin-border)] bg-[var(--admin-surface)]">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-4 py-3 text-[var(--admin-text)]">
                {actionLabel[log.action] ?? log.action}
              </td>
              <td className="px-4 py-3 text-[var(--admin-text-muted)]">
                {log.ipAddress ?? "—"}
              </td>
              <td
                className="max-w-[200px] truncate px-4 py-3 text-[var(--admin-text-subtle)]"
                title={log.userAgent ?? undefined}
              >
                {log.userAgent ? log.userAgent.slice(0, 60) : "—"}
              </td>
              <td className="px-4 py-3 text-[var(--admin-text-muted)]">
                {new Date(log.createdAt).toLocaleString("ar-EG")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
