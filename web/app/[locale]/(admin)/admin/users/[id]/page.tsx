"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminCard } from "@/components/admin/admin-card";
import {
  LoginHistoryTable,
  type LoginHistoryRow,
} from "@/components/admin/login-history-table";
import { can } from "@/lib/admin/permissions-client";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { AdminTimestamps } from "@/components/admin/admin-timestamps";

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const locale = (params.locale as string) ?? "ar";
  const [user, setUser] = useState<{
    email: string;
    fullName: string;
    createdAt?: string;
    updatedAt?: string;
  } | null>(null);
  const [logs, setLogs] = useState<LoginHistoryRow[]>([]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/v1/admin/users/${id}/login-history`, {
      headers: adminAuthHeaders(),
    });
    const data = (await res.json()) as {
      success: boolean;
      data?: {
        user: { email: string; fullName: string };
        logs: LoginHistoryRow[];
      };
    };
    if (data.success && data.data) {
      setUser(data.data.user);
      setLogs(data.data.logs);
    }
  }, [id]);

  useEffect(() => {
    if (can(PERMISSIONS.users.view)) void load();
  }, [load]);

  if (!can(PERMISSIONS.users.view)) {
    return <p className="text-[var(--admin-text-subtle)]">لا صلاحية للعرض</p>;
  }

  return (
    <div className="text-[var(--admin-text)]">
      <Link
        href={`/${locale}/admin/users`}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]"
      >
        <ArrowLeft className="h-4 w-4" />
        العودة للمديرين
      </Link>

      <AdminPageHeader
        title={user?.fullName ?? "مدير"}
        subtitle={user?.email}
      />

      {user && (
        <AdminTimestamps
          createdAt={user.createdAt}
          updatedAt={user.updatedAt}
          className="mt-4"
        />
      )}

      <AdminCard title="سجل تسجيل الدخول" className="mt-6">
        <LoginHistoryTable logs={logs} />
      </AdminCard>
    </div>
  );
}
