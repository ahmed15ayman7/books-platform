"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Trash2, FilePenLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminAuthHeaders } from "@/lib/admin/auth-client";
import { canAccessTrashNav, canAccessDraftsNav } from "@/lib/admin/permissions-client";

interface HubCounts {
  trash: number;
  drafts: number;
}

export function AdminHubLinks({ className }: { className?: string }) {
  const params = useParams<{ locale?: string }>();
  const pathname = usePathname();
  const locale = params.locale ?? "ar";
  const [counts, setCounts] = useState<HubCounts>({ trash: 0, drafts: 0 });

  const showTrash = canAccessTrashNav();
  const showDrafts = canAccessDraftsNav();

  useEffect(() => {
    if (!showTrash && !showDrafts) return;

    void fetch("/api/v1/admin/hub-counts", { headers: adminAuthHeaders() })
      .then((r) => r.json())
      .then((d: { success: boolean; data?: HubCounts }) => {
        if (d.success && d.data) setCounts(d.data);
      })
      .catch(() => null);
  }, [showTrash, showDrafts]);

  if (!showTrash && !showDrafts) return null;

  const trashHref = `/${locale}/admin/trash`;
  const draftsHref = `/${locale}/admin/drafts`;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {showDrafts && (
        <Link
          href={draftsHref}
          className={cn(
            "relative flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
            pathname.startsWith(draftsHref)
              ? "bg-[var(--brand-red)]/15 text-[var(--brand-red)]"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-[var(--admin-accent)]",
          )}
          title="المسودات"
        >
          <FilePenLine className="h-4 w-4" />
          <span className="hidden sm:inline">المسودات</span>
          {counts.drafts > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/20 px-1 text-[10px] font-bold text-amber-400">
              {counts.drafts > 99 ? "99+" : counts.drafts}
            </span>
          )}
        </Link>
      )}
      {showTrash && (
        <Link
          href={trashHref}
          className={cn(
            "relative flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors",
            pathname.startsWith(trashHref)
              ? "bg-red-950/40 text-red-400"
              : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-hover)] hover:text-red-400",
          )}
          title="سلة المحذوفات"
        >
          <Trash2 className="h-4 w-4" />
          <span className="hidden sm:inline">سلة المحذوفات</span>
          {counts.trash > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-950/50 px-1 text-[10px] font-bold text-red-400">
              {counts.trash > 99 ? "99+" : counts.trash}
            </span>
          )}
        </Link>
      )}
    </div>
  );
}
