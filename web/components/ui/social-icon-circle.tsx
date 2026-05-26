import * as React from "react";
import { cn } from "@/lib/utils";

interface SocialIconCircleProps {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function SocialIconCircle({
  href,
  label,
  children,
  className,
}: SocialIconCircleProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full",
        "bg-[var(--brand-red)] text-white",
        "transition-all duration-[var(--motion-base)] ease-[var(--motion-spring)]",
        "hover:scale-110 hover:bg-[var(--brand-red-hover)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-black)]",
        className
      )}
    >
      {children}
    </a>
  );
}
