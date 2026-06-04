"use client";

import { useCallback, useEffect, useState } from "react";
import { getAdminAccessToken } from "@/lib/admin/auth-client";
import {
  loadAdminSession,
  type AdminSession,
} from "@/lib/admin/permissions-client";
import type { Permission } from "@/lib/auth/permissions";

export interface AdminSessionState {
  isAdmin: boolean;
  isLoading: boolean;
  can: (permission: Permission) => boolean;
  session: AdminSession | null;
}

export function useAdminSession(): AdminSessionState {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(() => {
    const token = getAdminAccessToken();
    const loaded = loadAdminSession();
    if (token && loaded?.role === "ADMIN") {
      setSession(loaded);
    } else {
      setSession(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "admin_session" || e.key === "admin_access_token") {
        refresh();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  const can = useCallback(
    (permission: Permission) => {
      if (!session) return false;
      if (session.isSuperAdmin) return true;
      return session.permissions.includes(permission);
    },
    [session],
  );

  return {
    isAdmin: Boolean(session),
    isLoading,
    can,
    session,
  };
}
