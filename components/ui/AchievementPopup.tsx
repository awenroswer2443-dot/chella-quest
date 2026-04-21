"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useGame } from "@/lib/game-state";
import messages from "@/lib/content";
import { StarIcon } from "./Icons";

export default function AchievementPopup() {
  const { achievementsQueue, dismissAchievement } = useGame();
  const current = achievementsQueue[0];

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(dismissAchievement, 2600);
    return () => clearTimeout(t);
  }, [current, dismissAchievement]);

  const label = current ? messages.achievements[current] ?? current : "";

  return (
    <div className="pointer-events-none fixed top-6 right-4 left-4 z-[70] flex justify-center sm:justify-end">
      <AnimatePresence>
        {current && (
          <motion.div
            key={current}
            initial={{ opacity: 0, y: -30, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className="pointer-events-auto relative flex items-center gap-3 rounded-full bg-white/90 py-2 pr-5 pl-2 shadow-dreamy backdrop-blur"
          >
            <motion.div
              initial={{ rotate: -40, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-gold-200 to-gold-400 shadow-inner"
            >
              <StarIcon size={22} color="#fff" />
            </motion.div>
            <div className="leading-tight">
              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-blush-500">
                Achievement
              </div>
              <div className="font-display text-base font-semibold text-[#3b1e3a]">
                {label}
              </div>
            </div>
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-full"
              initial={{ boxShadow: "0 0 0 0 rgba(255, 200, 100, 0.8)" }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255, 200, 100, 0.8)",
                  "0 0 0 12px rgba(255, 200, 100, 0)",
                ],
              }}
              transition={{ duration: 1, repeat: 1 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
