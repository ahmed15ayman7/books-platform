"use client";

import { BookOpen } from "lucide-react";
import { SafeImage } from "@/components/ui/safe-image";
import { ParallaxLayer } from "@/components/motion";

interface BookDetailCoverProps {
  src: string | null;
  alt: string;
  width: number;
  height: number;
}

export function BookDetailCover({ src, alt, width, height }: BookDetailCoverProps) {
  return (
    <div
      className="mx-auto sm:mx-0"
      style={{ width, height, maxWidth: "100%" }}
    >
      <ParallaxLayer className="relative h-full w-full overflow-hidden rounded-xl bg-[var(--brand-gray-100)] shadow-md ring-1 ring-[var(--brand-gray-200)]">
        <div className="relative h-full w-full">
          {src ? (
            <SafeImage
              src={src}
              alt={alt}
              width={width}
              height={height}
              className="h-full w-full rounded-xl object-contain p-2"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-xl text-[var(--brand-gray-400)]">
              <BookOpen className="h-16 w-16" strokeWidth={1.25} aria-hidden="true" />
            </div>
          )}
        </div>
      </ParallaxLayer>
    </div>
  );
}
