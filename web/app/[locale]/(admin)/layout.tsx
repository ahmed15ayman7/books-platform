import { AdminChromeShell } from "@/components/admin/admin-chrome-shell";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

/** Admin UI is authenticated and DB-backed — never prerender at build time. */
export const dynamic = "force-dynamic";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminChromeShell>
      <div className="admin-shell flex min-h-screen bg-[var(--admin-bg)] text-[var(--admin-text)]">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminTopbar />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </AdminChromeShell>
  );
}
