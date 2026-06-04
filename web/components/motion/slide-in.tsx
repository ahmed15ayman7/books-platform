"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLocale } from "next-intl";
import { MOTION } from "./motion-config";
import { useReducedMotion } from "./use-reduced-motion";

interface SlideInProps {
  children: React.ReactNode;
  className?: string;
  from?: "start" | "end";
  delay?: number;
  once?: boolean;
}

export function SlideIn({
  children,
  className,
  from = "start",
  delay = 0,
  once = true,
}: SlideInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: MOTION.inViewMargin });
  const reduced = useReducedMotion();
  const locale = useLocale();
  const isRtl = locale === "ar";

  const getX = () => {
    if (from === "start") return isRtl ? 24 : -24;
    return isRtl ? -24 : 24;
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: getX() }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: getX() }}
      transition={{ duration: MOTION.duration.base, delay, ease: MOTION.ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
