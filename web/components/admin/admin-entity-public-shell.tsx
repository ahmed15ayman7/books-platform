"use client";

import {
  AdminPageProvider,
  AdminInlineEdit,
  AdminFloatingBar,
  type AdminPageContextValue,
} from "@/components/admin/admin-public-chrome";

interface AdminEntityPublicShellProps extends AdminPageContextValue {
  children: React.ReactNode;
  showInlineEdit?: boolean;
}

export function AdminEntityPublicShell({
  children,
  showInlineEdit = true,
  ...context
}: AdminEntityPublicShellProps) {
  return (
    <AdminPageProvider value={context}>
      {showInlineEdit && (
        <div className="container-platform flex justify-end pt-2">
          <AdminInlineEdit />
        </div>
      )}
      {children}
      <AdminFloatingBar />
    </AdminPageProvider>
  );
}
