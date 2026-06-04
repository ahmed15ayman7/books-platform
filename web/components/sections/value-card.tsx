import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
}

export function ValueCard({ icon: Icon, title, body, className }: ValueCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-[var(--brand-gray-200)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        className,
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-[var(--brand-red)]">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mt-4 font-bold text-[var(--brand-gray-900)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--brand-gray-600)] md:text-base">
        {body}
      </p>
    </article>
  );
}

interface ValueCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export function ValueCardGrid({ children, className }: ValueCardGridProps) {
  return (
    <div className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {children}
    </div>
  );
}
