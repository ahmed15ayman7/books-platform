"use client";

import Link from "next/link";
import { Eye, Pencil, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminEntityActionsProps {
  viewHref?: string;
  editHref: string;
  publicHref?: string;
  onDelete?: () => void;
  canView?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function AdminEntityActions({
  viewHref,
  editHref,
  publicHref,
  onDelete,
  canView = true,
  canEdit = true,
  canDelete = true,
  size = "sm",
  className,
}: AdminEntityActionsProps) {
  const iconSize = size === "sm" ? "h-8 w-8" : "h-9 w-9";
  const iconClass = size === "sm" ? "h-4 w-4" : "h-4 w-4";

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {canView && viewHref && (
        <Link href={viewHref} aria-label="عرض" title="عرض">
          <Button
            size="icon"
            variant="ghost"
            className={cn(iconSize, "text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]")}
          >
            <Eye className={iconClass} />
          </Button>
        </Link>
      )}
      {canEdit && (
        <Link href={editHref} aria-label="تعديل" title="تعديل">
          <Button
            size="icon"
            variant="ghost"
            className={cn(iconSize, "text-[var(--admin-text-muted)] hover:text-[var(--admin-accent)]")}
          >
            <Pencil className={iconClass} />
          </Button>
        </Link>
      )}
      {publicHref && (
        <a
          href={publicHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="عرض على الموقع"
          title="عرض على الموقع"
        >
          <Button
            size="icon"
            variant="ghost"
            className={cn(iconSize, "text-[var(--admin-text-muted)] hover:text-[var(--brand-red)]")}
          >
            <ExternalLink className={iconClass} />
          </Button>
        </a>
      )}
      {canDelete && onDelete && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className={cn(iconSize, "text-[var(--admin-text-muted)] hover:text-[var(--error)]")}
          onClick={onDelete}
          aria-label="حذف"
          title="حذف"
        >
          <Trash2 className={iconClass} />
        </Button>
      )}
    </div>
  );
}
