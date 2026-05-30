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
      <p className="py-6 text-center text-sm text-[var(--brand-gray-500)]">
        لا توجد سجلات بعد
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--brand-gray-800)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--brand-gray-800)]">
          <tr>
            <th className="px-4 py-3 text-start text-xs font-medium text-[var(--brand-gray-400)]">
              الإجراء
            </th>
            <th className="px-4 py-3 text-start text-xs font-medium text-[var(--brand-gray-400)]">
              IP
            </th>
            <th className="px-4 py-3 text-start text-xs font-medium text-[var(--brand-gray-400)]">
              المتصفح
            </th>
            <th className="px-4 py-3 text-start text-xs font-medium text-[var(--brand-gray-400)]">
              التاريخ
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--brand-gray-800)] bg-[var(--brand-gray-900)]">
          {logs.map((log) => (
            <tr key={log.id}>
              <td className="px-4 py-3 text-white">
                {actionLabel[log.action] ?? log.action}
              </td>
              <td className="px-4 py-3 text-[var(--brand-gray-400)]">
                {log.ipAddress ?? "—"}
              </td>
              <td
                className="max-w-[200px] truncate px-4 py-3 text-[var(--brand-gray-500)]"
                title={log.userAgent ?? undefined}
              >
                {log.userAgent ? log.userAgent.slice(0, 60) : "—"}
              </td>
              <td className="px-4 py-3 text-[var(--brand-gray-400)]">
                {new Date(log.createdAt).toLocaleString("ar-EG")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
