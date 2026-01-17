"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

interface TypewriterTextProps {
    text: string;
    className?: string;
    speed?: number; // ms per character
    delay?: number; // initial delay in ms
    cursor?: boolean;
    once?: boolean; // if true, only animate once
}

export function TypewriterText({
    text,
    className = "",
    speed = 50,
    delay = 0,
    cursor = true,
    once = true,
}: TypewriterTextProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { amount: 0.3, once });
    const [displayedText, setDisplayedText] = useState("");
    const [showCursor, setShowCursor] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearTimers = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    useEffect(() => {
        // Only animate if in view and hasn't animated yet (when once=true)
        if (isInView && (!once || !hasAnimated)) {
            clearTimers();
            setDisplayedText("");
            setShowCursor(true);

            timeoutRef.current = setTimeout(() => {
                let currentIndex = 0;

                intervalRef.current = setInterval(() => {
                    currentIndex++;
                    if (currentIndex <= text.length) {
                        setDisplayedText(text.substring(0, currentIndex));
                    } else {
                        clearTimers();
                        setHasAnimated(true);
                        if (!cursor) {
                            setShowCursor(false);
                        }
                    }
                }, speed);
            }, delay);
        } else if (!isInView && !once) {
            // Only reset when out of view if once=false
            clearTimers();
            setDisplayedText("");
            setShowCursor(false);
        }

        return () => clearTimers();
    }, [isInView, text, speed, delay, cursor, clearTimers, once, hasAnimated]);

    return (
        <span ref={ref} className={`inline ${className}`}>
            <span className="whitespace-pre-wrap">{displayedText}</span>
            {showCursor && (
                <motion.span
                    className="inline-block w-[2px] h-[0.9em] bg-current ml-0.5 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.53, repeat: Infinity, repeatType: "reverse" }}
                />
            )}
        </span>
    );
}
