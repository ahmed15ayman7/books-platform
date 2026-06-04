"use client";

import { StaggerContainer, StaggerItem } from "@/components/motion";

interface BooksCatalogBodyProps {
  children: React.ReactNode;
}

export function BooksCatalogBody({ children }: BooksCatalogBodyProps) {
  return (
    <StaggerContainer className="grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
      {Array.isArray(children)
        ? children.map((child, i) => <StaggerItem key={i}>{child}</StaggerItem>)
        : children}
    </StaggerContainer>
  );
}
