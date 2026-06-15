"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { can, loadAdminSession } from "@/lib/admin/permissions-client";
import { PERMISSIONS } from "@/lib/auth/permissions";
import { PlatformSettingsTab } from "./_components/platform-settings-tab";
import { AccountSettingsTab } from "./_components/account-settings-tab";
import { NotificationsSettingsTab } from "./_components/notifications-settings-tab";
import { AdminAccountsTab } from "./_components/admin-accounts-tab";

const TABS = [
  { id: "platform", label: "المنصة", permission: PERMISSIONS.settings.view },
  { id: "account", label: "حسابي", permission: PERMISSIONS.account.view },
  { id: "notifications", label: "إشعارات الموقع", permission: PERMISSIONS.settings.view },
  { id: "admin-accounts", label: "حسابات المديرين", superOnly: true },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminSettingsPage() {
  const params = useParams();
  const locale = (params.locale as string) ?? "ar";
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as TabId) || "platform";
  const session = loadAdminSession();

  const visibleTabs = TABS.filter((t) => {
    if ("superOnly" in t && t.superOnly) return session?.isSuperAdmin ?? false;
    if ("permission" in t) return can(t.permission) || session?.isSuperAdmin;
    return true;
  });

  const activeTab = visibleTabs.some((t) => t.id === tab)
    ? tab
    : (visibleTabs[0]?.id ?? "platform");

  return (
    <div className="text-[var(--admin-text)]">
      <AdminPageHeader
        title="الإعدادات"
        subtitle="إعدادات المنصة، حسابك، والإشعارات"
      />

      <nav className="mb-8 flex flex-wrap gap-2 border-b border-[var(--admin-border)] pb-4">
        {visibleTabs.map((t) => (
          <Link
            key={t.id}
            href={`/${locale}/admin/settings?tab=${t.id}`}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              activeTab === t.id
                ? "bg-[var(--brand-red)] text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)]"
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      {activeTab === "platform" && <PlatformSettingsTab />}
      {activeTab === "account" && <AccountSettingsTab />}
      {activeTab === "notifications" && <NotificationsSettingsTab />}
      {activeTab === "admin-accounts" && <AdminAccountsTab />}
    </div>
  );
}
