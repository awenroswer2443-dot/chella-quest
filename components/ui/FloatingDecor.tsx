"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { HeartIcon, StarIcon, SparkleIcon, BowIcon } from "./Icons";

const Icons = [HeartIcon, StarIcon, SparkleIcon, BowIcon];
const colors = ["#ff97b8", "#ffd35c", "#a77dff", "#ffae82", "#ff7aa0"];

interface Props {
  count?: number;
  seed?: number;
}

/** Soft floating decorations in the background. Seeded so layout stays stable per mount. */
export default function FloatingDecor({ count = 18, seed = 1 }: Props) {
  const decor = useMemo(() => {
    const rand = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => {
      const Icon = Icons[Math.floor(rand() * Icons.length)];
      return {
        key: i,
        Icon,
        x: rand() * 100,
        y: rand() * 100,
        size: 14 + Math.floor(rand() * 26),
        color: colors[Math.floor(rand() * colors.length)],
        delay: rand() * 4,
        duration: 5 + rand() * 5,
        rotate: rand() * 360,
        opacity: 0.35 + rand() * 0.45,
      };
    });
  }, [count, seed]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {decor.map((d) => (
        <motion.div
          key={d.key}
          className="absolute"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            opacity: d.opacity,
            transform: `rotate(${d.rotate}deg)`,
          }}
          animate={{
            y: [0, -18, 0],
            rotate: [d.rotate, d.rotate + 12, d.rotate],
          }}
          transition={{
            duration: d.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: d.delay,
          }}
        >
          <d.Icon size={d.size} color={d.color} />
        </motion.div>
      ))}
    </div>
  );
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
