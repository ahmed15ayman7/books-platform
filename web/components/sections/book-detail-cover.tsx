"use client";

import { BookOpen } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { ParallaxLayer } from "@/components/motion";
import { cn } from "@/lib/utils";

interface BookDetailCoverProps {
  src: string | null;
  alt: string;
  width: number;
  height: number;
}

export function BookDetailCover({ src, alt, width, height }: BookDetailCoverProps) {
  return (
    <div
      className={cn(
        "mx-auto sm:mx-0",
      )}
      style={{ width, height, maxWidth: "100%" }}
    >
      <ParallaxLayer
        className="relative h-full w-full overflow-hidden rounded-xl bg-[var(--brand-gray-100)] shadow-md ring-1 ring-[var(--brand-gray-200)]"
      >
        {src ? (
          <SafeImage src={src} alt={alt} fill sizes={`${width}px`} className="object-cover" priority />
        ) : (
          <div className="flex h-full items-center justify-center text-[var(--brand-gray-400)]">
            <BookOpen className="h-16 w-16" strokeWidth={1.25} aria-hidden="true" />
          </div>
        )}
      </ParallaxLayer>
    </div>
  );
}
