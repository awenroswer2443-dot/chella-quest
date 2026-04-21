"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import messages from "@/lib/content";
import { useGame } from "@/lib/game-state";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import Confetti from "@/components/ui/Confetti";
import Mascot from "@/components/ui/Mascot";
import FloatingDecor from "@/components/ui/FloatingDecor";
import {
  HeartIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/ui/Icons";
import { play } from "@/lib/sounds";

export default function Finale() {
  const { reset, earn, goto, achievements, secretFound, findSecret } = useGame();
  const [burst, setBurst] = useState(0);
  const [showSecretMsg, setShowSecretMsg] = useState(false);

  useEffect(() => {
    setBurst((b) => b + 1);
    play("win");
    earn("questComplete");
    const t = setInterval(() => setBurst((b) => b + 1), 3500);
    return () => clearInterval(t);
  }, [earn]);

  const onReplay = () => {
    reset();
    goto("title");
  };

  const onSecret = () => {
    if (!secretFound) {
      findSecret();
      earn("secretFound");
    }
    setShowSecretMsg(true);
    setTimeout(() => setShowSecretMsg(false), 3500);
  };

  return (
    <Screen background="bg-sunset-gradient">
      <FloatingDecor count={22} seed={42} />
      <Confetti fire={burst} continuous intensity={0.8} />

      <div className="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-6 py-12 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220 }}
          className="flex items-center gap-2"
        >
          <SparkleIcon size={28} color="#ff5288" />
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-blush-500">
            The Final Letter
          </span>
          <SparkleIcon size={28} color="#ff5288" />
        </motion.div>

        <motion.h1
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 180 }}
          className="font-display text-4xl font-extrabold text-[#3b1e3a] sm:text-6xl"
        >
          <span className="rainbow-text">{messages.finale.heading}</span>
        </motion.h1>

        <div className="flex items-center gap-3">
          <Mascot size={80} mood="wink" />
          <div className="rounded-2xl bg-white/85 p-4 text-left text-sm text-[#3b1e3a] shadow-dreamy backdrop-blur sm:text-base">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-blush-500">
              {messages.meta.mascotName} says
            </div>
            <div>All five gems, collected. Press play again, or stay right here.</div>
          </div>
        </div>

        <div className="relative w-full overflow-hidden rounded-3xl bg-white/90 p-6 text-left shadow-dreamy backdrop-blur sm:p-8">
          <div className="pointer-events-none absolute -left-8 -top-8 h-24 w-24 rounded-full bg-blush-200 opacity-40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gold-200 opacity-40 blur-2xl" />
          <div className="space-y-4 text-[#3b1e3a]">
            {messages.finale.body.map((p, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.25, duration: 0.6 }}
                className="text-base leading-relaxed sm:text-lg"
              >
                {p}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="pt-2 text-right font-display text-2xl italic text-blush-500"
            >
              {messages.finale.signature}
            </motion.p>
          </div>
        </div>

        {achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="w-full"
          >
            <div className="mb-2 text-xs font-bold uppercase tracking-widest text-blush-500">
              Achievements Unlocked · {achievements.length}
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {achievements.map((name) => (
                <motion.span
                  key={name}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#3b1e3a] shadow backdrop-blur"
                >
                  <StarIcon size={12} color="#ffbf2e" />
                  {messages.achievements[name] ?? name}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <CandyButton
            onClick={onReplay}
            variant="pink"
            size="lg"
            icon={<HeartIcon size={20} color="#fff" />}
            sound="success"
          >
            {messages.finale.replay}
          </CandyButton>
          <CandyButton
            onClick={() => goto("hub")}
            variant="cream"
            size="md"
            sound="tap"
          >
            Browse the hub
          </CandyButton>
        </motion.div>

        <div className="mt-4 flex items-center gap-3 text-xs text-[#7a4a72]">
          <span>made for</span>
          <span className="font-display font-bold text-blush-500">
            {messages.meta.player}
          </span>
          <span>·</span>
          <span>by</span>
          <span className="font-display font-bold text-blush-500">
            {messages.meta.maker}
          </span>
          <button
            aria-label="tiny secret"
            onClick={onSecret}
            className="ml-2 h-3 w-3 rounded-full bg-blush-200 transition hover:scale-150 hover:bg-blush-400"
          />
        </div>

        {showSecretMsg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-8 left-1/2 z-[90] -translate-x-1/2 rounded-full bg-gradient-to-r from-blush-400 to-blush-600 px-5 py-2 text-sm font-bold text-white shadow-candy"
          >
            {messages.finale.secret}
          </motion.div>
        )}
      </div>

      <div className="pointer-events-none absolute bottom-2 left-0 right-0 text-center text-[10px] uppercase tracking-[0.3em] text-[#b06a90]/60">
        {messages.meta.domain}
      </div>
    </Screen>
  );
}
