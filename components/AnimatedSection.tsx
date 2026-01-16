"use client";

import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "scale";

const directionVariants: Record<Direction, Variants> = {
  up: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  down: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  left: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  right: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { opacity: 1, scale: 1 },
  },
};

type AnimatedSectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
  /**
   * Slide / reveal direction. Controls initial offset.
   */
  direction?: Direction;
  /**
   * Additional delay in seconds. Useful for staggering between sections.
   */
  delay?: number;
};

export function AnimatedSection({
  id,
  className = "",
  children,
  direction = "up",
  delay = 0,
}: AnimatedSectionProps) {
  const variants = directionVariants[direction] ?? directionVariants.up;

  return (
    <motion.section
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      animate="visible"
      whileInView="visible"
      viewport={{ amount: 0.25, once: false }}
      transition={{
        duration: 0.7,
        ease: [0.22, 0.61, 0.36, 1],
        delay,
      }}
    >
      {children}
    </motion.section>
  );
}
