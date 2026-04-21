"use client";

import { motion, useAnimate } from "framer-motion";
import { useEffect, useState } from "react";
import { useGame } from "@/lib/game-state";
import messages from "@/lib/content";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import { HeartIcon, SparkleIcon } from "@/components/ui/Icons";
import { play } from "@/lib/sounds";
import FloatingDecor from "../ui/FloatingDecor";

export default function LoadingScreen() {
  const { goto } = useGame();
  const [ready, setReady] = useState(false);
  const [scope, animate] = useAnimate();
  const name = messages.meta.player;

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2600);
    return () => clearTimeout(t);
  }, []);

  const openEnvelope = async () => {
    play("whoosh");
    await animate(
      ".flap",
      { rotateX: -175 },
      { duration: 0.7, ease: "easeInOut" }
    );
    await animate(
      ".letter",
      { y: -60, opacity: 1 },
      { duration: 0.6, ease: "easeOut" }
    );
    await new Promise((r) => setTimeout(r, 400));
    play("sparkle");
    goto("title");
  };

  return (
    <Screen background="bg-dreamy-gradient">
      <FloatingDecor count={20} seed={7} />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="space-y-2"
        >
          <div className="text-xs font-bold uppercase tracking-[0.3em] text-blush-500">
            Incoming transmission
          </div>
          <h1 className="font-display text-3xl font-semibold text-[#3b1e3a] sm:text-4xl">
            {messages.loading.line1}
          </h1>
          <p className="text-[#7a4a72] sm:text-lg">
            {messages.loading.line2}
          </p>
        </motion.div>

        <motion.div
          ref={scope}
          className="relative"
          style={{ perspective: 1000 }}
        >
          <Envelope name={name} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="min-h-[60px]"
        >
          {ready ? (
            <CandyButton
              onClick={openEnvelope}
              variant="pink"
              size="lg"
              icon={<SparkleIcon size={20} color="#fff" />}
              sound={null}
            >
              Open letter
            </CandyButton>
          ) : (
            <div className="flex items-center gap-2 text-blush-500">
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                className="block h-2 w-2 rounded-full bg-blush-400"
              />
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                className="block h-2 w-2 rounded-full bg-blush-400"
              />
              <motion.span
                animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                className="block h-2 w-2 rounded-full bg-blush-400"
              />
            </div>
          )}
        </motion.div>
      </div>
    </Screen>
  );
}

function Envelope({ name }: { name: string }) {
  return (
    <div className="relative h-[230px] w-[320px] sm:h-[280px] sm:w-[400px]">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 animate-glow rounded-[40px] bg-gradient-to-br from-blush-200 via-cream-100 to-lilac-200 opacity-70 blur-3xl" />

      {/* Letter peeking out */}
      <motion.div
        className="letter absolute inset-x-6 top-5 flex h-[82%] flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-cream-50 to-cream-100 px-6 text-center shadow-inner"
        initial={{ y: 0, opacity: 0.95 }}
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mb-1"
        >
          <HeartIcon size={28} color="#ff5288" />
        </motion.div>
        <div className="font-display text-2xl font-bold tracking-wide text-[#3b1e3a]">
          For {name}
        </div>
        <div className="text-xs uppercase tracking-[0.25em] text-blush-500">
          with love
        </div>
      </motion.div>

      {/* Envelope base */}
      <div className="absolute inset-0 rounded-[28px] bg-gradient-to-b from-blush-200 to-blush-300 shadow-dreamy" />

      {/* Back triangle edges */}
      <div
        className="absolute inset-x-0 bottom-0 h-[65%] rounded-b-[28px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,198,215,0.1) 0%, #ff97b8 100%)",
          clipPath: "polygon(0 0, 50% 80%, 100% 0, 100% 100%, 0 100%)",
        }}
      />

      {/* Flap */}
      <motion.div
        className="flap absolute inset-x-0 top-0 z-20 h-[60%] origin-top"
        style={{
          background: "linear-gradient(180deg, #ffb0c8 0%, #ff97b8 100%)",
          clipPath: "polygon(0 0, 50% 100%, 100% 0)",
          transformOrigin: "top center",
          transformStyle: "preserve-3d",
        }}
      />

      {/* Wax seal */}
      <div className="pointer-events-none absolute left-1/2 top-[45%] z-30 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          animate={{ rotate: [0, 4, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="relative h-14 w-14 rounded-full bg-gradient-to-br from-blush-500 to-blush-600 shadow-candy"
        >
          <div className="absolute inset-2 rounded-full border-2 border-white/60 flex items-center justify-center font-display text-lg font-bold text-white">
            E
          </div>
        </motion.div>
      </div>
    </div>
  );
}
