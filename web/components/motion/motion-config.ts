export const MOTION = {
  duration: { fast: 0.18, base: 0.32, slow: 0.52, page: 0.3 },
  ease: [0.25, 0.8, 0.25, 1] as const,
  easeSpring: { type: "spring" as const, stiffness: 380, damping: 22 },
  stagger: { children: 0.08, delayChildren: 0.05 },
  inViewMargin: "-60px 0px",
  sectionMargin: "-80px 0px",
  parallaxY: ["0%", "8%"] as const,
  blurFrom: "blur(8px)",
  blurTo: "blur(0px)",
} as const;
