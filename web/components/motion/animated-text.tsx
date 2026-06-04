"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MOTION } from "./motion-config";
import { useReducedMotion } from "./use-reduced-motion";

interface RevealTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "blockquote";
  delay?: number;
}

export function RevealText({
  text,
  className,
  as: Tag = "span",
  delay = 0,
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: MOTION.inViewMargin });
  const reduced = useReducedMotion();
  const words = text.split(/\s+/).filter(Boolean).slice(0, 24);

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <div ref={ref}>
      <Tag className={className} aria-label={text}>
        {words.map((word, i) => (
          <motion.span
            key={`${word}-${i}`}
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{
              duration: MOTION.duration.base,
              delay: delay + i * 0.04,
              ease: MOTION.ease,
            }}
            className="inline-block"
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        ))}
      </Tag>
    </div>
  );
}

interface RevealLinesProps {
  lines: string[];
  className?: string;
  lineClassName?: string;
  delay?: number;
}

export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
}: RevealLinesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: MOTION.inViewMargin });
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className={className}>
        {lines.map((line) => (
          <p key={line} className={lineClassName}>
            {line}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{
            duration: MOTION.duration.slow,
            delay: delay + i * 0.12,
            ease: MOTION.ease,
          }}
          className={lineClassName}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}
