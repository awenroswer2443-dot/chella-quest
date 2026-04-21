"use client";

import { motion, type Variants } from "framer-motion";

interface Props {
  mood?: "happy" | "wink" | "shocked" | "sleepy";
  size?: number;
  className?: string;
}

const bob: Variants = {
  float: {
    y: [0, -8, 0],
    rotate: [-3, 3, -3],
    transition: {
      duration: 3.8,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * Twinkle — the tiny pink-star companion.
 * A sweet SVG face with cheek blushes and a tiny mouth.
 */
export default function Mascot({
  mood = "happy",
  size = 120,
  className = "",
}: Props) {
  return (
    <motion.div
      variants={bob}
      animate="float"
      className={`select-none ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 120 120" width={size} height={size}>
        <defs>
          <radialGradient id="star-body" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0%" stopColor="#fff5f7" />
            <stop offset="55%" stopColor="#ffb0c8" />
            <stop offset="100%" stopColor="#ff7aa0" />
          </radialGradient>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Glow */}
        <circle cx="60" cy="60" r="50" fill="#ffd3e4" opacity="0.6" filter="url(#soft)" />

        {/* Star body */}
        <path
          d="M60 12l10 22 24 3-17 17 4 24-21-11-21 11 4-24-17-17 24-3 10-22Z"
          fill="url(#star-body)"
          stroke="#e83a75"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Cheek blushes */}
        <ellipse cx="45" cy="60" rx="5" ry="3" fill="#ff7aa0" opacity="0.55" />
        <ellipse cx="75" cy="60" rx="5" ry="3" fill="#ff7aa0" opacity="0.55" />

        {/* Eyes */}
        {mood === "happy" && (
          <>
            <circle cx="50" cy="52" r="2.6" fill="#3b1e3a" />
            <circle cx="70" cy="52" r="2.6" fill="#3b1e3a" />
            <circle cx="50.8" cy="51" r="0.9" fill="#fff" />
            <circle cx="70.8" cy="51" r="0.9" fill="#fff" />
          </>
        )}
        {mood === "wink" && (
          <>
            <circle cx="50" cy="52" r="2.6" fill="#3b1e3a" />
            <circle cx="50.8" cy="51" r="0.9" fill="#fff" />
            <path
              d="M66 53c1.5-2 5-2 7 0"
              stroke="#3b1e3a"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}
        {mood === "shocked" && (
          <>
            <circle cx="50" cy="52" r="3.2" fill="#3b1e3a" />
            <circle cx="70" cy="52" r="3.2" fill="#3b1e3a" />
          </>
        )}
        {mood === "sleepy" && (
          <>
            <path d="M46 53c1.5-1.5 5-1.5 7 0" stroke="#3b1e3a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
            <path d="M66 53c1.5-1.5 5-1.5 7 0" stroke="#3b1e3a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          </>
        )}

        {/* Smile */}
        <path
          d="M54 64c2 3 8 3 10 0"
          stroke="#3b1e3a"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Sparkle on tip */}
        <g transform="translate(60 18)">
          <path
            d="M0 -6L1.5 -1.5L6 0L1.5 1.5L0 6L-1.5 1.5L-6 0L-1.5 -1.5Z"
            fill="#fff"
            opacity="0.85"
          />
        </g>
      </svg>
    </motion.div>
  );
}
