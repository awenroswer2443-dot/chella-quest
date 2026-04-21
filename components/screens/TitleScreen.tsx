"use client";

import { motion } from "framer-motion";
import { useGame } from "@/lib/game-state";
import messages from "@/lib/content";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import FloatingDecor from "@/components/ui/FloatingDecor";
import Mascot from "@/components/ui/Mascot";
import { HeartIcon, SparkleIcon } from "@/components/ui/Icons";

export default function TitleScreen() {
  const { goto } = useGame();

  return (
    <Screen background="bg-dreamy-gradient">
      <FloatingDecor count={26} seed={3} />

      <div className="relative z-10 flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-8 px-6 py-14 text-center">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-blush-500">
            <SparkleIcon size={14} color="#ff5288" />
            Press Start
            <SparkleIcon size={14} color="#ff5288" />
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-2">
          <TitleLetters text={messages.title.heading} />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-md font-display text-lg italic text-[#7a4a72] sm:text-xl"
          >
            {messages.title.subheading}
          </motion.p>
        </div>

        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.9, type: "spring", stiffness: 220 }}
          className="flex flex-col items-center gap-2"
        >
          <Mascot size={140} />
          <div className="rounded-full bg-white/80 px-4 py-1 text-sm text-[#7a4a72] shadow backdrop-blur">
            Hi — I'm <span className="font-bold text-blush-500">{messages.meta.mascotName}</span>. Tap things. I dare you.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="flex flex-col items-center gap-3"
        >
          <CandyButton
            onClick={() => goto("hub")}
            variant="pink"
            size="lg"
            icon={<HeartIcon size={20} color="#fff" />}
            iconRight={<SparkleIcon size={18} color="#fff" />}
            sound="success"
          >
            {messages.title.startButton}
          </CandyButton>
          <div className="text-sm text-[#7a4a72]">
            {messages.title.tagline}
          </div>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-0 right-0 text-center text-[11px] uppercase tracking-[0.3em] text-[#b06a90]/70">
        made with heart by {messages.meta.maker}
      </div>
    </Screen>
  );
}

function TitleLetters({ text }: { text: string }) {
  return (
    <h1
      className="font-display text-5xl font-extrabold leading-none tracking-tight text-transparent sm:text-6xl md:text-7xl"
      aria-label={text}
    >
      <span className="rainbow-text">
        {text.split("").map((ch, i) => (
          <motion.span
            key={i}
            initial={{ y: 40, opacity: 0, rotate: -8 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{
              delay: 0.1 + i * 0.06,
              type: "spring",
              stiffness: 300,
              damping: 16,
            }}
            style={{ display: "inline-block", whiteSpace: "pre" }}
          >
            {ch}
          </motion.span>
        ))}
      </span>
    </h1>
  );
}
