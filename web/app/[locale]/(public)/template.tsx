"use client";

import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { PublicPageTransition } from "@/components/motion/page-transition";

export default function PublicTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <PublicPageTransition key={pathname}>{children}</PublicPageTransition>
    </AnimatePresence>
  );
}
