"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  FadeIn,
  RevealText,
} from "@/components/motion";

interface SectionBlockProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  lead?: string;
  variant?: "transparent" | "card" | "dark";
  children?: ReactNode;
  className?: string;
  animate?: boolean;
  staggerChildren?: boolean;
}

export function SectionBlock({
  id,
  eyebrow,
  title,
  lead,
  variant = "transparent",
  children,
  className,
  animate = true,
}: SectionBlockProps) {
  const inner = (
    <>
      {eyebrow && (
        <FadeIn delay={0}>
          <p
            className={cn(
              "mb-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-red)]",
            )}
          >
            {eyebrow}
          </p>
        </FadeIn>
      )}
      {title && (
        <RevealText
          text={title}
          as="h2"
          className={cn(
            "font-display text-display-xs font-bold md:text-display-sm block",
            variant === "dark" ? "text-white" : "text-[var(--brand-gray-900)]",
          )}
          delay={0.08}
        />
      )}
      {lead && (
        <FadeIn delay={0.16}>
          <p
            className={cn(
              "mt-4 max-w-3xl text-base leading-relaxed md:text-lg",
              variant === "dark" ? "text-[var(--brand-gray-300)]" : "text-[var(--brand-gray-700)]",
            )}
          >
            {lead}
          </p>
        </FadeIn>
      )}
      {children && (
        <div className={cn(title || lead ? "mt-6" : "")}>{children}</div>
      )}
    </>
  );

  if (!animate) {
    return (
      <section
        id={id}
        className={cn(
          variant === "card" && "rounded-2xl border border-[var(--brand-gray-200)] bg-white p-6 md:p-8 shadow-sm",
          variant === "dark" &&
            "rounded-2xl bg-[var(--brand-black)] px-6 py-10 text-white md:px-10 md:py-12",
          className,
        )}
      >
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[var(--brand-red)]">{eyebrow}</p>
        )}
        {title && (
          <h2 className={cn("font-display text-display-xs font-bold md:text-display-sm", variant === "dark" ? "text-white" : "text-[var(--brand-gray-900)]")}>{title}</h2>
        )}
        {lead && <p className={cn("mt-4 max-w-3xl text-base leading-relaxed md:text-lg", variant === "dark" ? "text-[var(--brand-gray-300)]" : "text-[var(--brand-gray-700)]")}>{lead}</p>}
        {children && <div className={cn(title || lead ? "mt-6" : "")}>{children}</div>}
      </section>
    );
  }

  return (
    <FadeIn direction="up" once>
      <section
        id={id}
        className={cn(
          variant === "card" && "rounded-2xl border border-[var(--brand-gray-200)] bg-white p-6 md:p-8 shadow-sm",
          variant === "dark" &&
            "rounded-2xl bg-[var(--brand-black)] px-6 py-10 text-white md:px-10 md:py-12",
          className,
        )}
      >
        {inner}
      </section>
    </FadeIn>
  );
}

export { StaggerItem } from "@/components/motion";
