"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION } from "./motion-config";
import { useReducedMotion } from "./use-reduced-motion";

interface HoverLiftProps {
  children: React.ReactNode;
  className?: string;
}

export function HoverLift({ children, className }: HoverLiftProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={MOTION.easeSpring}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

interface PressScaleProps {
  children: React.ReactNode;
  className?: string;
}

export function PressScale({ children, className }: PressScaleProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={MOTION.easeSpring}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface IconPulseProps {
  children: React.ReactNode;
  className?: string;
}

export function IconPulse({ children, className }: IconPulseProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className}>{children}</span>;
  }

  return (
    <motion.span
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 400, damping: 12 }}
      className={cn("inline-flex", className)}
    >
      {children}
    </motion.span>
  );
}
