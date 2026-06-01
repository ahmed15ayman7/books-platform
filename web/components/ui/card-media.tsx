import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

/** Unified 4:3 media strip for all site and admin cards */
export const cardMediaOuterClass =
  "relative w-full shrink-0 overflow-hidden aspect-[3/4]";

export function CardMedia({
  children,
  className,
  rounded = "top",
}: {
  children: ReactNode;
  className?: string;
  rounded?: "top" | "none" | "all";
}) {
  return (
    <div
      className={cn(
        cardMediaOuterClass,
        "bg-[var(--brand-gray-100)]",
        rounded === "top" && "rounded-t-2xl",
        rounded === "all" && "rounded-2xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardMediaImage({
  src,
  alt,
  objectFit = "cover",
  sizes = "(max-width: 640px) 50vw, 25vw",
  priority,
}: {
  src: string;
  alt: string;
  objectFit?: "cover" | "contain";
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn(
        "transition-transform duration-500 group-hover:scale-105",
        objectFit === "cover" ? "object-cover" : "object-contain p-4",
      )}
    />
  );
}

export function CardMediaPlaceholder({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-gray-100)] to-[var(--brand-gray-200)] text-[var(--brand-gray-400)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Use on grid containers that hold cards */
export const cardGridClass = "grid items-stretch gap-4";
