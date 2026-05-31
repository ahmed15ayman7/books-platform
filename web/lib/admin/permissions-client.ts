import {
  NAV_PERMISSION_BY_HREF,
  type Permission,
} from "@/lib/auth/permissions";

const SESSION_KEY = "admin_session";

export interface AdminSession {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isSuperAdmin: boolean;
  permissions: Permission[];
}

export function saveAdminSession(session: AdminSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadAdminSession(): AdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AdminSession;
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function can(permission: Permission): boolean {
  const session = loadAdminSession();
  if (!session) return false;
  if (session.isSuperAdmin) return true;
  return session.permissions.includes(permission);
}

export function canAccessNav(href: string): boolean {
  const session = loadAdminSession();
  if (!session) return false;
  if (session.isSuperAdmin) return true;

  const required = NAV_PERMISSION_BY_HREF[href];
  if (!required) return true;
  return session.permissions.includes(required);
}
