import Link from "next/link";
import { ArrowLeft, Pencil, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminTimestamps } from "@/components/admin/admin-timestamps";

interface AdminDetailShellProps {
  locale: string;
  backHref: string;
  backLabel?: string;
  title: string;
  subtitle?: string;
  badges?: React.ReactNode;
  timestamps?: { createdAt?: Date | string | null; updatedAt?: Date | string | null };
  editHref?: string;
  publicHref?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function AdminDetailShell({
  backHref,
  backLabel = "العودة للقائمة",
  title,
  subtitle,
  badges,
  timestamps,
  editHref,
  publicHref,
  actions,
  children,
}: AdminDetailShellProps) {
  return (
    <div className="text-[var(--admin-text)]">
      <Link
        href={backHref}
        className="mb-6 inline-flex items-center gap-2 text-sm text-[var(--admin-text-muted)] transition-colors hover:text-[var(--admin-accent)]"
      >
        <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
        {backLabel}
      </Link>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {timestamps && (
            <AdminTimestamps
              createdAt={timestamps.createdAt ?? undefined}
              updatedAt={timestamps.updatedAt ?? undefined}
              compact
              className="mt-2"
            />
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-[var(--admin-text-muted)]" dir="ltr">
              {subtitle}
            </p>
          )}
          {badges && <div className="mt-3 flex flex-wrap gap-2">{badges}</div>}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {editHref && (
            <Link href={editHref}>
              <Button className="gap-2">
                <Pencil className="h-4 w-4" />
                تعديل
              </Button>
            </Link>
          )}
          {publicHref && (
            <a href={publicHref} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                الموقع
              </Button>
            </a>
          )}
          {actions}
        </div>
      </div>

      {children}
    </div>
  );
}
