"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MOTION } from "./motion-config";
import { useReducedMotion } from "./use-reduced-motion";

interface BlurInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function BlurIn({
  children,
  className,
  delay = 0,
  once = true,
}: BlurInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: MOTION.inViewMargin });
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, filter: MOTION.blurFrom }}
      animate={
        inView
          ? { opacity: 1, filter: MOTION.blurTo }
          : { opacity: 0, filter: MOTION.blurFrom }
      }
      transition={{ duration: MOTION.duration.slow, delay, ease: MOTION.ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
