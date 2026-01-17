"use client";

import { motion } from "framer-motion";

const blobs = [
    // Large ambient blobs
    {
        color: "bg-gradient-to-br from-sky-400/25 to-blue-500/20",
        size: "h-[500px] w-[500px]",
        initialPos: { x: "-15%", y: "5%" },
        animate: { x: ["0%", "8%", "-5%", "0%"], y: ["0%", "-10%", "6%", "0%"] },
        duration: 25,
    },
    {
        color: "bg-gradient-to-br from-rose-400/25 to-pink-500/18",
        size: "h-[450px] w-[450px]",
        initialPos: { x: "65%", y: "15%" },
        animate: { x: ["0%", "-8%", "6%", "0%"], y: ["0%", "8%", "-6%", "0%"] },
        duration: 28,
    },
    {
        color: "bg-gradient-to-br from-violet-400/20 to-purple-500/15",
        size: "h-[400px] w-[400px]",
        initialPos: { x: "25%", y: "55%" },
        animate: { x: ["0%", "10%", "-6%", "0%"], y: ["0%", "-8%", "10%", "0%"] },
        duration: 22,
    },
    // Medium accent blobs
    {
        color: "bg-gradient-to-br from-amber-300/20 to-orange-400/12",
        size: "h-72 w-72",
        initialPos: { x: "75%", y: "65%" },
        animate: { x: ["0%", "-6%", "4%", "0%"], y: ["0%", "6%", "-4%", "0%"] },
        duration: 18,
    },
    {
        color: "bg-gradient-to-br from-teal-300/18 to-cyan-400/12",
        size: "h-64 w-64",
        initialPos: { x: "10%", y: "70%" },
        animate: { x: ["0%", "5%", "-3%", "0%"], y: ["0%", "-5%", "3%", "0%"] },
        duration: 20,
    },
    // Small highlight blobs
    {
        color: "bg-gradient-to-br from-blue-300/30 to-indigo-400/20",
        size: "h-48 w-48",
        initialPos: { x: "50%", y: "20%" },
        animate: { x: ["0%", "-4%", "6%", "0%"], y: ["0%", "5%", "-3%", "0%"] },
        duration: 15,
    },
    {
        color: "bg-gradient-to-br from-pink-300/22 to-rose-400/15",
        size: "h-56 w-56",
        initialPos: { x: "85%", y: "40%" },
        animate: { x: ["0%", "-5%", "3%", "0%"], y: ["0%", "-4%", "5%", "0%"] },
        duration: 17,
    },
];

export function DynamicBackground() {
    return (
        <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden">
            {/* Base gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20" />

            {blobs.map((blob, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full blur-3xl ${blob.color} ${blob.size}`}
                    style={{
                        left: blob.initialPos.x,
                        top: blob.initialPos.y,
                    }}
                    animate={blob.animate}
                    transition={{
                        duration: blob.duration,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Subtle noise texture overlay for depth */}
            <div className="absolute inset-0 opacity-[0.015] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
        </div>
    );
}
