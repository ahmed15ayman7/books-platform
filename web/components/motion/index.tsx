"use client";

import { useRef } from "react";
import {
  motion,
  useInView,
  type Variants,
  type MotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { MOTION } from "./motion-config";
import { useReducedMotion } from "./use-reduced-motion";
import { PublicPageTransition } from "./page-transition";

export { MOTION } from "./motion-config";
export { useReducedMotion } from "./use-reduced-motion";
export { ParallaxLayer } from "./parallax-layer";
export { RevealText, RevealLines } from "./animated-text";
export { BlurIn } from "./blur-in";
export { SlideIn } from "./slide-in";
export { PublicPageTransition } from "./page-transition";
export { HoverLift, PressScale, IconPulse } from "./micro-interactions";

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
      staggerChildren: MOTION.stagger.children,
      delayChildren: MOTION.stagger.delayChildren,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: MOTION.ease },
  },
};

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
  const inView = useInView(ref, { once, margin: MOTION.inViewMargin });
  const reduced = useReducedMotion();

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

  if (reduced) {
    return (
      <div className={className} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration, delay, ease: MOTION.ease }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

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
  const inView = useInView(ref, { once, margin: MOTION.inViewMargin });
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: MOTION.stagger.children,
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

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

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
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={scaleInVariants}
      transition={{ duration: 0.45, delay, ease: MOTION.ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
  const inView = useInView(ref, { once: true, margin: MOTION.sectionMargin });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <section className={className} {...props}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: MOTION.ease }}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedCard({ children, className }: AnimatedCardProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={MOTION.easeSpring}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}

export const MotionButton = motion.button;
export const MotionDiv = motion.div;
export const MotionH1 = motion.h1;
export const MotionP = motion.p;
export const MotionSpan = motion.span;

export function PageTransition({ children }: { children: React.ReactNode }) {
  return <PublicPageTransition>{children}</PublicPageTransition>;
}

export {
  fadeUpVariants,
  fadeInVariants,
  scaleInVariants,
  staggerContainerVariants,
  staggerItemVariants,
};
