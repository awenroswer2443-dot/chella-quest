"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { play } from "@/lib/sounds";
import CandyButton from "./CandyButton";
import { SparkleIcon } from "./Icons";

interface Props {
  open: boolean;
  title: string;
  text: string;
  onContinue: () => void;
  continueLabel?: string;
}

export default function GemReward({
  open,
  title,
  text,
  onContinue,
  continueLabel = "Keep going",
}: Props) {
  useEffect(() => {
    if (open) play("unlock");
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-[#3b1e3a]/40 backdrop-blur-sm"
            onClick={onContinue}
          />
          <motion.div
            initial={{ scale: 0.6, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-white/95 to-blush-50/95 p-6 text-center shadow-dreamy sm:p-8"
          >
            <motion.div
              className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            >
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gold-200 via-blush-200 to-lilac-200 opacity-70 blur-xl" />
            </motion.div>

            <motion.div
              className="relative mx-auto -mt-14 mb-4 flex h-24 w-24 items-center justify-center"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity }}
            >
              <Gem />
            </motion.div>

            <div className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-blush-500">
              New Memory Gem
            </div>
            <h3 className="mb-3 font-display text-2xl font-bold text-[#3b1e3a]">
              {title}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-[#5a3a5a] sm:text-base">
              {text}
            </p>

            <CandyButton
              onClick={onContinue}
              variant="pink"
              size="md"
              iconRight={<SparkleIcon size={18} color="#fff" />}
            >
              {continueLabel}
            </CandyButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Gem() {
  return (
    <svg viewBox="0 0 100 100" className="h-24 w-24 drop-shadow-lg">
      <defs>
        <linearGradient id="gem-main" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd3e4" />
          <stop offset="60%" stopColor="#ff7aa0" />
          <stop offset="100%" stopColor="#c3329a" />
        </linearGradient>
        <linearGradient id="gem-shine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points="50,8 82,34 72,82 28,82 18,34"
        fill="url(#gem-main)"
        stroke="#e83a75"
        strokeWidth="2"
      />
      <polygon points="50,8 82,34 50,38" fill="url(#gem-shine)" opacity="0.7" />
      <polygon points="50,8 18,34 50,38" fill="url(#gem-shine)" opacity="0.5" />
      <polygon
        points="50,38 82,34 72,82"
        fill="#3b1e3a"
        opacity="0.08"
      />
      <line x1="50" y1="8" x2="50" y2="38" stroke="#fff" strokeOpacity="0.5" strokeWidth="1.5" />
    </svg>
  );
}
