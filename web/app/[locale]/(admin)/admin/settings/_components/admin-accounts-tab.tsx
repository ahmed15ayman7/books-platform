"use client";

import { useEffect, useState } from "react";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminCard } from "@/components/admin/admin-card";
import {
  LoginHistoryTable,
  type LoginHistoryRow,
} from "@/components/admin/login-history-table";
import { loadAdminSession } from "@/lib/admin/permissions-client";

interface AdminRow {
  id: string;
  email: string;
  fullName: string;
  isSuperAdmin: boolean;
  lastLoginAt: string | null;
  isActive: boolean;
}

export function AdminAccountsTab() {
  const session = loadAdminSession();
  const [users, setUsers] = useState<AdminRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [logs, setLogs] = useState<LoginHistoryRow[]>([]);

  useEffect(() => {
    if (!session?.isSuperAdmin) return;
    void fetch("/api/v1/admin/settings/login-history", {
      headers: adminAuthHeaders(),
    })
      .then((r) => r.json())
      .then((d: { success: boolean; data?: { users: AdminRow[] } }) => {
        if (d.success && d.data?.users) setUsers(d.data.users);
      });
  }, [session?.isSuperAdmin]);

  useEffect(() => {
    if (!selectedId) return;
    void fetch(`/api/v1/admin/settings/login-history?userId=${selectedId}`, {
      headers: adminAuthHeaders(),
    })
      .then((r) => r.json())
      .then(
        (d: {
          success: boolean;
          data?: { logs: LoginHistoryRow[] };
        }) => {
          if (d.success && d.data?.logs) setLogs(d.data.logs);
        }
      );
  }, [selectedId]);

  if (!session?.isSuperAdmin) {
    return (
      <p className="text-sm text-[var(--admin-text-subtle)]">
        هذا القسم متاح للمدير الرئيسي فقط.
      </p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <AdminCard title="حسابات المديرين">
        <ul className="divide-y divide-[var(--admin-border)]">
          {users.map((u) => (
            <li key={u.id}>
              <button
                type="button"
                onClick={() => setSelectedId(u.id)}
                className={`w-full px-3 py-3 text-start text-sm transition-colors hover:bg-[var(--admin-hover)] ${
                  selectedId === u.id ? "bg-[var(--admin-surface-muted)]" : ""
                }`}
              >
                <p className="font-medium text-[var(--admin-text)]">
                  {u.fullName}
                  {u.isSuperAdmin && (
                    <span className="ms-2 text-xs text-[var(--brand-red)]">رئيسي</span>
                  )}
                </p>
                <p className="text-xs text-[var(--admin-text-subtle)]">{u.email}</p>
                {u.lastLoginAt && (
                  <p className="mt-1 text-xs text-[var(--admin-text-subtle)]">
                    آخر دخول: {new Date(u.lastLoginAt).toLocaleString("ar-EG")}
                  </p>
                )}
              </button>
            </li>
          ))}
        </ul>
      </AdminCard>

      <AdminCard title="سجل تسجيل الدخول">
        {selectedId ? (
          <LoginHistoryTable logs={logs} />
        ) : (
          <p className="py-8 text-center text-sm text-[var(--admin-text-subtle)]">
            اختر حساباً لعرض السجل
          </p>
        )}
      </AdminCard>
    </div>
  );
}
