import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminReadOnlyFieldProps {
  label: string;
  value?: React.ReactNode;
  variant?: "text" | "prose" | "url" | "badge";
  bilingual?: { ar?: string | null; en?: string | null };
  className?: string;
  dir?: "ltr" | "rtl" | "auto";
}

function EmptyDash() {
  return <span className="text-[var(--admin-text-subtle)]">—</span>;
}

export function AdminReadOnlyField({
  label,
  value,
  variant = "text",
  bilingual,
  className,
  dir,
}: AdminReadOnlyFieldProps) {
  if (bilingual) {
    const ar = bilingual.ar?.trim();
    const en = bilingual.en?.trim();
    if (!ar && !en) return null;
    return (
      <div className={cn("border-b border-[var(--admin-border)] py-3 last:border-0", className)}>
        <dt className="mb-2 text-xs font-medium text-[var(--admin-text-subtle)]">{label}</dt>
        <dd className="grid gap-3 sm:grid-cols-2">
          <div>
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--admin-text-subtle)]">
              عربي
            </span>
            {ar ? (
              <ProseOrText variant={variant} value={ar} />
            ) : (
              <EmptyDash />
            )}
          </div>
          <div dir="ltr">
            <span className="mb-1 block text-[10px] uppercase tracking-wider text-[var(--admin-text-subtle)]">
              English
            </span>
            {en ? (
              <ProseOrText variant={variant} value={en} />
            ) : (
              <EmptyDash />
            )}
          </div>
        </dd>
      </div>
    );
  }

  if (value === null || value === undefined || value === "" || value === "—") {
    return null;
  }

  return (
    <div className={cn("border-b border-[var(--admin-border)] py-3 last:border-0", className)}>
      <dt className="mb-1 text-xs font-medium text-[var(--admin-text-subtle)]">{label}</dt>
      <dd className="text-sm text-[var(--admin-text)]" dir={dir}>
        {variant === "url" && typeof value === "string" ? (
          <Link
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all text-[var(--brand-red)] hover:underline"
          >
            {value}
          </Link>
        ) : variant === "badge" ? (
          <span className="inline-flex rounded-full bg-[var(--admin-surface-muted)] px-2.5 py-0.5 text-xs font-medium">
            {value}
          </span>
        ) : (
          <ProseOrText variant={variant} value={value} />
        )}
      </dd>
    </div>
  );
}

function ProseOrText({
  variant,
  value,
}: {
  variant: "text" | "prose" | "url" | "badge";
  value: React.ReactNode;
}) {
  if (variant === "prose" && typeof value === "string") {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--admin-text-muted)]">
        {value}
      </p>
    );
  }
  return <span className="text-sm text-[var(--admin-text)]">{value}</span>;
}
