"use client";

import type { ReactNode } from "react";
import { StaggerContainer, StaggerItem } from "@/components/motion";

export function AnimatedContentSections({ children }: { children: ReactNode }) {
  const items = Array.isArray(children) ? children : [children];

  return (
    <StaggerContainer className="space-y-20" delay={0.05}>
      {items.filter(Boolean).map((child, i) => (
        <StaggerItem key={i}>{child}</StaggerItem>
      ))}
    </StaggerContainer>
  );
}
