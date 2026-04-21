"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import messages from "@/lib/content";
import { useGame } from "@/lib/game-state";
import LevelShell from "./LevelShell";
import CandyButton from "@/components/ui/CandyButton";
import GemReward from "@/components/ui/GemReward";
import { play } from "@/lib/sounds";

interface StarPoint {
  x: number; // %
  y: number; // %
  n: number; // order
}

/**
 * Shape: a heart traced by 12 points in order.
 * Coordinates in 0-100 viewport space — scales with container.
 */
const heartStars: StarPoint[] = [
  { x: 50, y: 82, n: 1 },
  { x: 68, y: 70, n: 2 },
  { x: 82, y: 55, n: 3 },
  { x: 85, y: 38, n: 4 },
  { x: 76, y: 24, n: 5 },
  { x: 62, y: 22, n: 6 },
  { x: 50, y: 34, n: 7 },
  { x: 38, y: 22, n: 8 },
  { x: 24, y: 24, n: 9 },
  { x: 15, y: 38, n: 10 },
  { x: 18, y: 55, n: 11 },
  { x: 32, y: 70, n: 12 },
];

export default function Level4Constellation() {
  const { goto, completeLevel, awardGem, earn } = useGame();
  const level = messages.levels.constellation;
  const [connected, setConnected] = useState<number[]>([]);
  const [error, setError] = useState<number | null>(null);
  const [gemOpen, setGemOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  const done = connected.length === heartStars.length;

  useEffect(() => {
    if (!done) return;
    play("win");
    completeLevel("constellation");
    awardGem("constellation");
    earn("constellation");
    const t = setTimeout(() => setGemOpen(true), 1200);
    return () => clearTimeout(t);
  }, [done, completeLevel, awardGem, earn]);

  const onStar = (n: number) => {
    const next = connected.length + 1;
    if (n === next) {
      play("sparkle");
      setConnected((arr) => [...arr, n]);
      setError(null);
    } else {
      play("pop");
      setError(n);
      setTimeout(() => setError(null), 500);
    }
  };

  const path = useMemo(() => {
    const points = connected
      .map((n) => heartStars.find((s) => s.n === n))
      .filter(Boolean) as StarPoint[];
    if (points.length < 2) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x} ${p.y}`)
      .join(" ") + (done ? " Z" : "");
  }, [connected, done]);

  return (
    <LevelShell
      title={level.title}
      instruction={level.instruction}
      background="starfield"
      rightStat={
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white shadow backdrop-blur">
          {connected.length}/{heartStars.length}
        </span>
      }
    >
      <div
        ref={wrapRef}
        className="relative flex flex-1 items-center justify-center p-4"
      >
        {/* Sky background glow */}
        <motion.div
          className="pointer-events-none absolute left-1/2 top-[20%] h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-br from-lilac-300/40 to-blush-300/40 blur-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="relative aspect-square w-full max-w-md">
          {/* SVG connecting line */}
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            aria-hidden
          >
            <motion.path
              d={path}
              stroke="url(#line-grad)"
              strokeWidth={0.8}
              fill={done ? "rgba(255, 151, 184, 0.18)" : "none"}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              transition={{ duration: 0.5 }}
            />
            <defs>
              <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffd3e4" />
                <stop offset="100%" stopColor="#ffbf2e" />
              </linearGradient>
            </defs>
          </svg>

          {/* Stars */}
          {heartStars.map((s) => {
            const isDone = connected.includes(s.n);
            const isNext = connected.length + 1 === s.n;
            const isError = error === s.n;
            return (
              <motion.button
                key={s.n}
                onClick={() => onStar(s.n)}
                disabled={isDone}
                whileHover={isNext ? { scale: 1.15 } : {}}
                whileTap={{ scale: 0.92 }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-label={`Star ${s.n}`}
              >
                <motion.div
                  className="relative flex h-10 w-10 items-center justify-center rounded-full sm:h-12 sm:w-12"
                  animate={
                    isError
                      ? { x: [-4, 4, -4, 4, 0] }
                      : isNext
                      ? { scale: [1, 1.18, 1] }
                      : { scale: 1 }
                  }
                  transition={
                    isNext
                      ? { duration: 1.4, repeat: Infinity }
                      : { duration: 0.3 }
                  }
                >
                  <div
                    className={`absolute inset-0 rounded-full ${
                      isDone
                        ? "bg-gold-300/80"
                        : isNext
                        ? "bg-blush-300/80"
                        : "bg-white/25"
                    } blur-md`}
                  />
                  <svg
                    width={36}
                    height={36}
                    viewBox="0 0 32 32"
                    className={`relative drop-shadow ${
                      isDone ? "text-gold-200" : "text-white"
                    }`}
                    fill="currentColor"
                  >
                    <path d="M16 3l3.7 7.9 8.6 1.2-6.2 6.1 1.5 8.7L16 22.8 8.4 26.9l1.5-8.7-6.2-6.1 8.6-1.2L16 3Z" />
                  </svg>
                  <span className="absolute -bottom-4 text-[10px] font-bold text-white/80">
                    {s.n}
                  </span>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-4 right-4 flex flex-col items-center gap-2 text-center text-white"
            >
              <div className="font-display text-2xl font-bold">
                {level.successMessage}
              </div>
              <CandyButton
                onClick={() => setGemOpen(true)}
                variant="lilac"
                size="md"
                sound="unlock"
              >
                Open the gem
              </CandyButton>
            </motion.div>
          )}
        </AnimatePresence>

        <GemReward
          open={gemOpen}
          title={level.gem.title}
          text={level.gem.text}
          onContinue={() => {
            setGemOpen(false);
            goto("hub");
          }}
          continueLabel="Back to the hub"
        />
      </div>
    </LevelShell>
  );
}
