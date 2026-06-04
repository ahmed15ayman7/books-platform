"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatedCard, IconPulse, StaggerContainer, StaggerItem, BlurIn } from "@/components/motion";

interface ValueCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
  className?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function ValueCard({ icon: Icon, title, body, className, imageUrl, imageAlt }: ValueCardProps) {
  return (
    <AnimatedCard>
      <article
        className={cn(
          "rounded-2xl border border-[var(--brand-gray-200)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md h-full",
          className,
        )}
      >
        {imageUrl && (
          <BlurIn className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl">
            <Image src={imageUrl} alt={imageAlt ?? title} fill className="object-cover" sizes="(max-width:768px) 100vw, 25vw" />
          </BlurIn>
        )}
        <IconPulse>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-red-soft)] text-[var(--brand-red)]">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
        </IconPulse>
        <h3 className="mt-4 font-bold text-[var(--brand-gray-900)]">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-[var(--brand-gray-600)] md:text-base">{body}</p>
      </article>
    </AnimatedCard>
  );
}

interface ValueCardGridProps {
  children: React.ReactNode;
  className?: string;
}

export function ValueCardGrid({ children, className }: ValueCardGridProps) {
  return (
    <StaggerContainer className={cn("grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {Array.isArray(children)
        ? children.map((child, i) => <StaggerItem key={i}>{child}</StaggerItem>)
        : children}
    </StaggerContainer>
  );
}
