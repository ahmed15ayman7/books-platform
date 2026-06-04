"use client";

import { cn } from "@/lib/utils";
import { StaggerContainer, StaggerItem, ScaleIn, SlideIn } from "@/components/motion";

interface NumberedFeatureListProps {
  items: string[];
  columns?: 1 | 2;
  className?: string;
}

export function NumberedFeatureList({
  items,
  columns = 2,
  className,
}: NumberedFeatureListProps) {
  return (
    <StaggerContainer
      className={cn("grid gap-4", columns === 2 && "md:grid-cols-2", className)}
    >
      {items.map((item, index) => (
        <StaggerItem key={index}>
          <SlideIn from={index % 2 === 0 ? "start" : "end"}>
            <li className="flex items-start gap-4 rounded-xl border border-[var(--brand-gray-200)] bg-white p-5 shadow-sm list-none">
              <ScaleIn delay={index * 0.06}>
                <span
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand-red)] text-sm font-bold text-white"
                  aria-hidden="true"
                >
                  {index + 1}
                </span>
              </ScaleIn>
              <p className="text-sm leading-relaxed text-[var(--brand-gray-700)] md:text-base">{item}</p>
            </li>
          </SlideIn>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
