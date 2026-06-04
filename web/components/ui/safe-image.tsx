"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fallbackSrc?: string;
  onFallback?: () => void;
}

export function SafeImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  fallbackSrc = ABOUT_IMAGES.placeholder,
  onFallback,
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      onFallback?.();
      return;
    }
    setFailed(true);
  }, [currentSrc, fallbackSrc, onFallback]);

  if (failed) {
    return (
      <div
        className={cn(
          "flex h-full w-full items-center justify-center bg-gradient-to-br from-[var(--brand-gray-100)] to-[var(--brand-gray-200)] text-[var(--brand-gray-400)]",
          className,
        )}
        role="img"
        aria-label={alt}
      >
        <BookOpen className="h-10 w-10 opacity-50" aria-hidden="true" />
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={currentSrc}
        alt={alt}
        fill
        className={className}
        sizes={sizes}
        priority={priority}
        onError={handleError}
      />
    );
  }

  return (
    <Image
      src={currentSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={handleError}
    />
  );
}
