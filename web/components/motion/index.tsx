"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  type Variants,
  type MotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

// ─── Shared Variants ──────────────────────────────────────────────

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
};

const slideInFromLeftVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0 },
};

const slideInFromRightVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.8, 0.25, 1] },
  },
};

// ─── FadeIn ──────────────────────────────────────────────────────

interface FadeInProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  once?: boolean;
}

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  direction = "up",
  once = true,
  ...props
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-60px 0px" });

  const variants =
    direction === "up"
      ? fadeUpVariants
      : direction === "left"
        ? slideInFromLeftVariants
        : direction === "right"
          ? slideInFromRightVariants
          : direction === "none"
            ? fadeInVariants
            : fadeUpVariants;

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration, delay, ease: [0.25, 0.8, 0.25, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerContainer ────────────────────────────────────────────

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  delay?: number;
}

export function StaggerContainer({
  children,
  className,
  once = true,
  delay = 0,
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── StaggerItem ─────────────────────────────────────────────────

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

// ─── ScaleIn ─────────────────────────────────────────────────────

interface ScaleInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function ScaleIn({
  children,
  className,
  delay = 0,
  once = true,
}: ScaleInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: "-40px 0px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={scaleInVariants}
      transition={{ duration: 0.45, delay, ease: [0.25, 0.8, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── AnimatedSection ─────────────────────────────────────────────
// Drop-in replacement for <section> with scroll-triggered fade-up

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  id?: string;
}

export function AnimatedSection({
  children,
  className,
  delay = 0,
  ...props
}: AnimatedSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.8, 0.25, 1] as [number, number, number, number] }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

// ─── AnimatedCard ─────────────────────────────────────────────────
// Spring hover card with depth shadow

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className }: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

// ─── MotionButton ─────────────────────────────────────────────────

export const MotionButton = motion.button;
export const MotionDiv = motion.div;
export const MotionH1 = motion.h1;
export const MotionP = motion.p;
export const MotionSpan = motion.span;

// ─── PageTransition ───────────────────────────────────────────────

export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─── Exports ──────────────────────────────────────────────────────

export {
  fadeUpVariants,
  fadeInVariants,
  scaleInVariants,
  staggerContainerVariants,
  staggerItemVariants,
};
