"use client";

import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface TextRevealProps {
    children: string;
    className?: string;
    delay?: number;
    direction?: "up" | "down";
    stagger?: number;
}

export function TextReveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
    stagger = 0.05,
}: TextRevealProps) {
    const variants: Variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 20 : -20,
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 0.61, 0.36, 1],
            },
        },
    };

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: stagger,
                delayChildren: delay,
            },
        },
    };

    // Split text into words to keep semantic structure better than characters
    // but for "hero" impacts, characters are often requested.
    // Let's stick to words for better readability and accessibility unless requested otherwise.
    // Actually, let's do a character split for the "Precision" part if we want super fancy,
    // but preserving words is safer for accessibility and layout.
    // Let's do words.

    const words = children.split(" ");

    return (
        <motion.span
            className={`inline-block ${className}`}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible" // triggers when container comes into view
            viewport={{ once: false, amount: 0.2 }}
        >
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden align-top">
                    <motion.span
                        className="inline-block"
                        variants={variants}
                        style={{ marginRight: "0.25em" }} // space between words
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </motion.span>
    );
}
