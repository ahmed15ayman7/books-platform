import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "start" | "center" | "end";
  withLine?: boolean;
  id?: string;
  /** default = red title; onDark = white on black hero; onLight = dark title on light bg */
  tone?: "default" | "onDark" | "onLight";
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = "start",
  withLine = true,
  id,
  tone = "default",
}: SectionHeadingProps) {
  const titleColor =
    tone === "onDark"
      ? "text-white"
      : tone === "onLight"
        ? "text-[var(--brand-gray-900)]"
        : "text-[var(--brand-red)]";
  const accentColor = tone === "onDark" ? "text-white/90" : "text-[var(--brand-red)]";
  const lineColor = tone === "onDark" ? "bg-white/80" : "bg-[var(--brand-red)]";
  const subtitleColor =
    tone === "onDark" ? "text-white/75" : "text-[var(--brand-gray-500)]";

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        align === "center" && "items-center text-center",
        align === "end" && "items-end text-end",
        className
      )}
    >
      <h2 id={id} className={cn("text-display-xs font-bold font-display", titleColor)}>
        {title}
      </h2>
      {withLine && (
        <div className="flex items-center gap-2">
          <Bookmark className={cn("h-5 w-4 flex-shrink-0", accentColor)} aria-hidden="true" />
          <div className={cn("h-1 w-12 rounded-full", lineColor)} />
        </div>
      )}
      {subtitle && (
        <p className={cn("mt-1 text-base", subtitleColor)}>{subtitle}</p>
      )}
    </div>
  );
}
