"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import messages from "@/lib/content";
import { useGame } from "@/lib/game-state";
import LevelShell from "./LevelShell";
import ProgressBar from "@/components/ui/ProgressBar";
import CandyButton from "@/components/ui/CandyButton";
import GemReward from "@/components/ui/GemReward";
import {
  CupcakeIcon,
  HeartIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/ui/Icons";
import { play } from "@/lib/sounds";

type ItemKind = "heart" | "star" | "sparkle" | "cupcake";

interface FloatItem {
  id: number;
  kind: ItemKind;
  x: number; // 0-100 %
  size: number;
  color: string;
  drift: number;
  duration: number;
  startedAt: number;
}

type IconCmp = React.ComponentType<{ size?: number; color?: string }>;

const iconMap: Record<ItemKind, IconCmp> = {
  heart: HeartIcon,
  star: StarIcon,
  sparkle: SparkleIcon,
  cupcake: CupcakeIcon,
};

const colors: Record<ItemKind, string[]> = {
  heart: ["#ff5288", "#ff7aa0", "#e83a75"],
  star: ["#ffbf2e", "#ffd35c", "#ffae82"],
  sparkle: ["#a77dff", "#c3a2ff", "#ff97b8"],
  cupcake: ["#ff97b8", "#ffae82", "#ffd35c"],
};

const kinds: ItemKind[] = ["heart", "star", "sparkle", "cupcake"];

export default function Level1Catch() {
  const { goto, completeLevel, awardGem, earn, addSparkles } = useGame();
  const level = messages.levels.catch;
  const [status, setStatus] = useState<"intro" | "playing" | "done" | "fail">(
    "intro"
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(level.timer);
  const [items, setItems] = useState<FloatItem[]>([]);
  const [gemOpen, setGemOpen] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const idRef = useRef(0);
  const spawnRef = useRef<number | null>(null);
  const areaRef = useRef<HTMLDivElement | null>(null);

  const spawn = useCallback(() => {
    const kind = kinds[Math.floor(Math.random() * kinds.length)];
    const palette = colors[kind];
    const color = palette[Math.floor(Math.random() * palette.length)];
    const item: FloatItem = {
      id: ++idRef.current,
      kind,
      x: 6 + Math.random() * 88,
      size: 40 + Math.random() * 26,
      color,
      drift: (Math.random() - 0.5) * 40,
      duration: 4 + Math.random() * 2.5,
      startedAt: Date.now(),
    };
    setItems((arr) => [...arr.slice(-24), item]);
  }, []);

  const startGame = () => {
    setStatus("playing");
    setScore(0);
    setCombo(0);
    setTimeLeft(level.timer);
    setItems([]);
  };

  // spawn loop
  useEffect(() => {
    if (status !== "playing") return;
    spawnRef.current = window.setInterval(spawn, 520) as unknown as number;
    return () => {
      if (spawnRef.current) window.clearInterval(spawnRef.current);
    };
  }, [status, spawn]);

  // timer loop
  useEffect(() => {
    if (status !== "playing") return;
    const t = window.setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          window.clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(t);
  }, [status]);

  // end conditions
  useEffect(() => {
    if (status !== "playing") return;
    if (score >= level.goal) {
      setStatus("done");
      play("win");
      completeLevel("catch");
      awardGem("catch");
      setTimeout(() => setGemOpen(true), 500);
    } else if (timeLeft <= 0) {
      setStatus("fail");
    }
  }, [score, timeLeft, status, level.goal, completeLevel, awardGem]);

  const catchItem = (id: number, rect: DOMRect) => {
    setItems((arr) => arr.filter((i) => i.id !== id));
    play("pop");
    setScore((s) => s + 1);
    addSparkles(1);
    setCombo((c) => {
      const next = c + 1;
      if (next === 1) earn("firstCatch");
      if (next === 5) earn("comboCatch");
      return next;
    });
    const area = areaRef.current?.getBoundingClientRect();
    if (area) {
      const burstId = Date.now() + Math.random();
      setBursts((b) => [
        ...b,
        {
          id: burstId,
          x: rect.left + rect.width / 2 - area.left,
          y: rect.top + rect.height / 2 - area.top,
          color: colors.heart[0],
        },
      ]);
      setTimeout(
        () => setBursts((b) => b.filter((x) => x.id !== burstId)),
        700
      );
    }
  };

  const onGemClose = () => {
    setGemOpen(false);
    goto("hub");
  };

  return (
    <LevelShell
      title={level.title}
      instruction={level.instruction}
      background="bg-dreamy-gradient"
      rightStat={
        <span className="rounded-full bg-white/80 px-3 py-1 font-display text-sm font-bold text-[#3b1e3a] shadow">
          {timeLeft}s
        </span>
      }
    >
      <div
        ref={areaRef}
        className="relative flex-1 overflow-hidden"
        style={{ touchAction: "manipulation" }}
      >
        {/* Scene */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#ffe4ec] to-transparent" />
          <Cloud className="left-[8%] top-[10%] opacity-80" delay={0} />
          <Cloud className="right-[12%] top-[28%] opacity-70" delay={2} scale={0.7} />
          <Cloud className="left-[25%] bottom-[20%] opacity-60" delay={1} scale={0.8} />
        </div>

        {/* Items */}
        <AnimatePresence>
          {items.map((item) => (
            <FloatingItem
              key={item.id}
              item={item}
              onCatch={(rect) => catchItem(item.id, rect)}
              onEnd={() =>
                setItems((arr) => arr.filter((i) => i.id !== item.id))
              }
            />
          ))}
        </AnimatePresence>

        {/* Burst effects */}
        <AnimatePresence>
          {bursts.map((b) => (
            <motion.div
              key={b.id}
              className="pointer-events-none absolute"
              style={{ left: b.x, top: b.y }}
              initial={{ opacity: 1, scale: 0.6 }}
              animate={{ opacity: 0, scale: 2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div
                className="h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* HUD */}
        <div className="pointer-events-none absolute inset-x-0 top-0 p-4">
          <div className="mx-auto max-w-md">
            <ProgressBar value={score} max={level.goal} accent="pink" />
            {combo > 1 && (
              <motion.div
                key={combo}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mx-auto mt-2 w-fit rounded-full bg-gradient-to-r from-blush-400 to-blush-600 px-3 py-1 text-xs font-bold text-white shadow"
              >
                COMBO ×{combo}
              </motion.div>
            )}
          </div>
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {status === "intro" && (
            <Overlay>
              <h3 className="font-display text-2xl font-bold text-[#3b1e3a]">
                Ready?
              </h3>
              <p className="max-w-xs text-center text-sm text-[#7a4a72]">
                Catch {level.goal} sparkles in {level.timer} seconds. Bigger
                ones are easier to nab — tap with rhythm for a combo.
              </p>
              <CandyButton onClick={startGame} variant="pink" size="lg" sound="success">
                Start catching
              </CandyButton>
            </Overlay>
          )}

          {status === "fail" && (
            <Overlay>
              <h3 className="font-display text-2xl font-bold text-[#3b1e3a]">
                Almost!
              </h3>
              <p className="text-center text-sm text-[#7a4a72]">
                {level.failMessage}
              </p>
              <div className="flex gap-3">
                <CandyButton onClick={startGame} variant="pink">
                  Try again
                </CandyButton>
                <CandyButton onClick={() => goto("hub")} variant="cream">
                  Back to hub
                </CandyButton>
              </div>
            </Overlay>
          )}

          {status === "done" && !gemOpen && (
            <Overlay>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 240 }}
                className="rounded-3xl bg-gradient-to-b from-gold-200 to-blush-300 p-4 shadow-candy"
              >
                <SparkleIcon size={44} color="#fff" />
              </motion.div>
              <h3 className="font-display text-2xl font-bold text-[#3b1e3a]">
                {level.successMessage}
              </h3>
            </Overlay>
          )}
        </AnimatePresence>

        <GemReward
          open={gemOpen}
          title={level.gem.title}
          text={level.gem.text}
          onContinue={onGemClose}
          continueLabel="Back to the hub"
        />
      </div>
    </LevelShell>
  );
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-white/70 p-6 backdrop-blur-md"
    >
      {children}
    </motion.div>
  );
}

function FloatingItem({
  item,
  onCatch,
  onEnd,
}: {
  item: FloatItem;
  onCatch: (rect: DOMRect) => void;
  onEnd: () => void;
}) {
  const Icon = iconMap[item.kind];
  const ref = useRef<HTMLButtonElement | null>(null);
  const travel =
    typeof window !== "undefined" ? window.innerHeight + 140 : 900;
  return (
    <motion.button
      ref={ref}
      className="absolute z-10 select-none rounded-full p-2 transition-transform"
      style={{ left: `${item.x}%`, bottom: -item.size }}
      initial={{ y: 0, opacity: 0, rotate: -15 }}
      animate={{
        y: -travel,
        x: item.drift,
        opacity: [0, 1, 1, 0.9, 0],
        rotate: [-15, 15, -10, 10],
      }}
      transition={{
        duration: item.duration,
        ease: "easeOut",
      }}
      onAnimationComplete={onEnd}
      onTouchStart={(e) => {
        e.preventDefault();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        onCatch(rect);
      }}
      onClick={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        onCatch(rect);
      }}
      aria-label="catch sparkle"
    >
      <motion.span
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="block drop-shadow-[0_6px_10px_rgba(255,82,136,0.35)]"
      >
        <Icon size={item.size} color={item.color} />
      </motion.span>
    </motion.button>
  );
}

function Cloud({
  className = "",
  delay = 0,
  scale = 1,
}: {
  className?: string;
  delay?: number;
  scale?: number;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{ x: [0, 12, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay }}
      style={{ transform: `scale(${scale})` }}
    >
      <svg width={120} height={52} viewBox="0 0 120 52" fill="none">
        <ellipse cx="30" cy="32" rx="26" ry="18" fill="#fff" />
        <ellipse cx="60" cy="26" rx="30" ry="22" fill="#fff" />
        <ellipse cx="92" cy="32" rx="24" ry="18" fill="#fff" />
      </svg>
    </motion.div>
  );
}
