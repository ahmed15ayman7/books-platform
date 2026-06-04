"use client";

import { motion } from "framer-motion";
import { MOTION } from "./motion-config";
import { useReducedMotion } from "./use-reduced-motion";

export function PublicPageTransition({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduced ? 0 : 12 }}
      transition={{
        duration: reduced ? 0.15 : MOTION.duration.page,
        ease: MOTION.ease,
      }}
    >
      {children}
    </motion.div>
  );
}
