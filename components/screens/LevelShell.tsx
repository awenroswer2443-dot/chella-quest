"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/game-state";
import CandyButton from "@/components/ui/CandyButton";

interface Props {
  title: string;
  instruction: string;
  children: React.ReactNode;
  background?: string;
  rightStat?: React.ReactNode;
  className?: string;
}

export default function LevelShell({
  title,
  instruction,
  children,
  background = "bg-dreamy-gradient",
  rightStat,
  className = "",
}: Props) {
  const { goto } = useGame();
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      className={`relative flex min-h-[100dvh] w-full flex-col overflow-hidden ${background} ${className}`}
    >
      <header className="relative z-20 flex items-center justify-between gap-3 px-4 pt-4 sm:px-6">
        <CandyButton
          onClick={() => goto("hub")}
          variant="cream"
          size="sm"
          sound="tap"
        >
          ← Hub
        </CandyButton>
        <div className="flex-1 text-center">
          <div className="font-display text-sm font-bold text-[#3b1e3a] sm:text-base">
            {title}
          </div>
          <div className="text-[11px] text-[#7a4a72] sm:text-xs">
            {instruction}
          </div>
        </div>
        <div className="min-w-[3.5rem] text-right">{rightStat}</div>
      </header>

      <div className="relative flex flex-1 flex-col">{children}</div>
    </motion.main>
  );
}
