"use client";

import type { ReactNode } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { ABOUT_IMAGES } from "@/lib/content/image-assets";
import { FadeIn } from "@/components/motion";

interface AuthSplitLayoutProps {
  children: ReactNode;
  quote: string;
  imageAlt: string;
}

export function AuthSplitLayout({ children, quote, imageAlt }: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <SafeImage src={ABOUT_IMAGES.auth} alt={imageAlt} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-black)]/80 via-[var(--brand-black)]/40 to-transparent" />
        <FadeIn className="absolute inset-x-0 bottom-0 p-10">
          <blockquote className="font-display text-xl font-bold leading-snug text-white md:text-2xl">
            {quote}
          </blockquote>
        </FadeIn>
      </div>
      <div className="flex items-center justify-center p-6 md:p-8">{children}</div>
    </div>
  );
}
