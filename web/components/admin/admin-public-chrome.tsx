"use client";

import { createContext, useContext } from "react";
import Link from "next/link";
import { Pencil, ExternalLink, Eye, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EntityShareDialog } from "@/components/share/entity-share-dialog";
import { useAdminSession } from "@/hooks/use-admin-session";
import { cn } from "@/lib/utils";

export type AdminPageEntityType = "book" | "article" | "media" | "publisher" | "author";

export interface AdminPageContextValue {
  entityType: AdminPageEntityType;
  entityId: string;
  editHref: string;
  adminViewHref?: string;
  publicHref: string;
  title?: string;
  imageUrl?: string | null;
  sharePublicUrl?: string;
}

const AdminPageContext = createContext<AdminPageContextValue | null>(null);

export function AdminPageProvider({
  value,
  children,
}: {
  value: AdminPageContextValue;
  children: React.ReactNode;
}) {
  return <AdminPageContext.Provider value={value}>{children}</AdminPageContext.Provider>;
}

export function useAdminPageContext() {
  return useContext(AdminPageContext);
}

interface AdminInlineEditProps {
  editHref?: string;
  adminViewHref?: string;
  className?: string;
}

export function AdminInlineEdit({ editHref, adminViewHref, className }: AdminInlineEditProps) {
  const ctx = useAdminPageContext();
  const { isAdmin, isLoading } = useAdminSession();

  const edit = editHref ?? ctx?.editHref;
  const view = adminViewHref ?? ctx?.adminViewHref;

  if (isLoading || !isAdmin || !edit) return null;

  const shareUrl = ctx?.sharePublicUrl;
  const shareTitle = ctx?.title;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {shareUrl && shareTitle && (
        <EntityShareDialog
          title={shareTitle}
          publicUrl={shareUrl}
          imageUrl={ctx?.imageUrl}
          variant="admin"
          size="sm"
          triggerLabel="مشاركة"
        />
      )}
      {view && (
        <Link href={view}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5 border-[var(--brand-red)]/40 text-[var(--brand-red)] hover:bg-[var(--brand-red-soft)]"
          >
            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
            عرض في لوحة التحكم
          </Button>
        </Link>
      )}
      <Link href={edit}>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-1.5 border-[var(--brand-red)]/40 text-[var(--brand-red)] hover:bg-[var(--brand-red-soft)]"
        >
          <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
          تعديل في لوحة التحكم
        </Button>
      </Link>
    </div>
  );
}

export function AdminFloatingBar() {
  const ctx = useAdminPageContext();
  const { isAdmin, isLoading } = useAdminSession();

  if (isLoading || !isAdmin || !ctx) return null;

  const localeMatch = ctx.editHref.match(/^\/([^/]+)\//);
  const locale = localeMatch?.[1] ?? "ar";
  const dashboardHref = `/${locale}/admin`;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[var(--brand-black)]/95 backdrop-blur-md"
      role="navigation"
      aria-label="أدوات المسؤول"
    >
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <Link href={dashboardHref}>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="gap-1.5 text-white/90 hover:bg-white/10 hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4" />
            لوحة التحكم
          </Button>
        </Link>
        {ctx.adminViewHref && (
          <Link href={ctx.adminViewHref}>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="gap-1.5 text-white/90 hover:bg-white/10 hover:text-white"
            >
              <Eye className="h-4 w-4" />
              عرض في الأدمن
            </Button>
          </Link>
        )}
        <Link href={ctx.editHref}>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="gap-1.5 text-white/90 hover:bg-white/10 hover:text-white"
          >
            <Pencil className="h-4 w-4" />
            تعديل
          </Button>
        </Link>
        <a href={ctx.publicHref} target="_blank" rel="noopener noreferrer">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="gap-1.5 text-white/90 hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            الموقع
          </Button>
        </a>
      </div>
    </div>
  );
}

export function AdminPublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AdminFloatingBar />
    </>
  );
}
