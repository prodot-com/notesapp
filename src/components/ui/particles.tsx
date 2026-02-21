"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

export default function Particles() {
  const particles = useMemo(() => {
    return [...Array(50)].map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-amber-500 dark:bg-emerald-300 rounded-full"
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -100, opacity: [0, 1, 0] }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeOut",
          }}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
        />
      ))}
    </div>
  );
}