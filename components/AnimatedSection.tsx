"use client";

import { ReactNode } from "react";
import { motion, Variants, HTMLMotionProps } from "framer-motion";

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

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
    hidden: { opacity: 0, scale: 0.92 },
    visible: { opacity: 1, scale: 1 },
  },
  none: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
};

interface AnimatedSectionProps extends HTMLMotionProps<"section"> {
  children: ReactNode;
  /**
   * Slide / reveal direction. Controls initial offset.
   * Default: "up"
   */
  direction?: Direction;
  /**
   * Delay in seconds before animation starts.
   */
  delay?: number;
  /**
   * Duration of the animation in seconds.
   */
  duration?: number;
  /**
   * If true, children elements will stagger their animations.
   */
  staggerChildren?: number;
  /**
   * If true, animation only plays once. Default: false (replays on scroll)
   */
  once?: boolean;
}

export function AnimatedSection({
  className = "",
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  staggerChildren,
  once = false,
  ...props
}: AnimatedSectionProps) {
  const baseVariants = directionVariants[direction];

  const variants: Variants = {
    hidden: {
      ...baseVariants.hidden,
    },
    visible: {
      ...baseVariants.visible,
      transition: {
        duration,
        ease: [0.22, 0.61, 0.36, 1],
        delay,
        staggerChildren: staggerChildren,
      },
    },
  };

  return (
    <motion.section
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ amount: 0.2, once }}
      {...props}
    >
      {children}
    </motion.section>
  );
}
