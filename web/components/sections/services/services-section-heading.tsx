import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServicesSectionHeadingProps {
  title: string;
  className?: string;
  id?: string;
}

export function ServicesSectionHeading({ title, className, id }: ServicesSectionHeadingProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 text-center", className)}>
      <h2
        id={id}
        className="font-display text-display-sm font-bold text-[var(--brand-red)] md:text-display-md"
      >
        {title}
      </h2>
      <div className="flex items-center gap-2">
        <Bookmark className="h-5 w-4 shrink-0 fill-[var(--brand-red)] text-[var(--brand-red)]" aria-hidden="true" />
        <div className="h-1 w-14 rounded-full bg-[var(--brand-red)]" aria-hidden="true" />
      </div>
    </div>
  );
}
