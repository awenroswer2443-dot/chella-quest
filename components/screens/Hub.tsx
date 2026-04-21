"use client";

import { motion } from "framer-motion";
import type { LevelId } from "@/lib/content";
import messages from "@/lib/content";
import { useGame, type Screen as ScreenName } from "@/lib/game-state";
import Screen from "@/components/ui/Screen";
import CandyButton from "@/components/ui/CandyButton";
import FloatingDecor from "@/components/ui/FloatingDecor";
import Mascot from "@/components/ui/Mascot";
import { iconByName, SparkleIcon, HeartIcon } from "@/components/ui/Icons";

const levelMap: Record<number, LevelId> = {
  1: "catch",
  2: "boxes",
  3: "memory",
  4: "constellation",
  5: "cake",
};

const screenMap: Record<LevelId, ScreenName> = {
  catch: "catch",
  boxes: "boxes",
  memory: "memory",
  constellation: "constellation",
  cake: "cake",
};

export default function Hub() {
  const { goto, completed, gems, allLevelsDone, secretFound, findSecret, earn } =
    useGame();
  const collectedGems = Object.values(gems).filter(Boolean).length;

  return (
    <Screen background="bg-sunset-gradient">
      <FloatingDecor count={18} seed={12} />

      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center gap-6 px-4 py-10">
        <div className="flex w-full flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-blush-500">
            Chapter Select
          </div>
          <h2 className="font-display text-3xl font-bold text-[#3b1e3a] sm:text-4xl">
            {messages.hub.heading}
          </h2>
          <p className="text-sm text-[#7a4a72] sm:text-base">
            {messages.hub.subheading}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-[#3b1e3a] shadow backdrop-blur">
            <SparkleIcon size={16} color="#ff5288" />
            <span className="font-bold">{collectedGems}</span>
            <span className="text-[#7a4a72]">/ 5 memory gems</span>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
          {messages.hub.levels.map((lvl) => {
            const id = levelMap[lvl.id];
            const done = completed[id];
            const Icon = iconByName(lvl.emoji);
            const prevId = levelMap[lvl.id - 1];
            const locked = lvl.id > 1 && !completed[prevId];

            return (
              <motion.button
                key={lvl.id}
                layout
                disabled={locked}
                onClick={() => !locked && goto(screenMap[id])}
                whileHover={!locked ? { y: -4, scale: 1.02 } : {}}
                whileTap={!locked ? { scale: 0.98 } : {}}
                className={`group relative overflow-hidden rounded-3xl border-2 p-5 text-left transition-all ${
                  locked
                    ? "border-white/40 bg-white/40 text-[#8a6a8a] opacity-70"
                    : done
                    ? "border-gold-300/80 bg-gradient-to-br from-cream-50 to-blush-100 shadow-candy"
                    : "border-white bg-white/95 shadow-dreamy"
                }`}
              >
                {done && (
                  <motion.div
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-gradient-to-r from-gold-300 to-gold-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-[#6b3a00] shadow"
                  >
                    <SparkleIcon size={12} color="#6b3a00" />
                    Gem
                  </motion.div>
                )}
                <div className="mb-3 flex items-center gap-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                      locked
                        ? "bg-gray-200/60 text-gray-400"
                        : done
                        ? "bg-gradient-to-br from-gold-200 to-gold-400 text-[#6b3a00]"
                        : "bg-gradient-to-br from-blush-200 to-blush-400 text-white"
                    } shadow-inner`}
                  >
                    <Icon size={26} />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-blush-500">
                      Level {lvl.id}
                    </div>
                    <div className="font-display text-lg font-bold text-[#3b1e3a]">
                      {lvl.name}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#7a4a72]">{lvl.blurb}</p>
                {locked && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <span className="rotate-[-8deg] rounded-full bg-[#3b1e3a]/80 px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-white">
                      Locked
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <motion.div
          className="mt-4 flex w-full flex-col items-center gap-3"
          layout
        >
          <div className="flex items-center gap-2">
            <Mascot size={72} mood={allLevelsDone ? "wink" : "happy"} />
            <div className="max-w-xs rounded-2xl bg-white/85 px-4 py-2 text-sm text-[#3b1e3a] shadow backdrop-blur">
              {allLevelsDone
                ? "You unlocked every gem. Shall we read the last letter?"
                : "Finish each level to unlock a new Memory Gem."}
            </div>
          </div>

          <CandyButton
            onClick={() => allLevelsDone && goto("finale")}
            variant={allLevelsDone ? "gold" : "cream"}
            size="lg"
            disabled={!allLevelsDone}
            icon={<HeartIcon size={18} color={allLevelsDone ? "#6b3a00" : "#b08aa0"} />}
            sound={allLevelsDone ? "unlock" : null}
          >
            {allLevelsDone
              ? messages.hub.finaleUnlocked
              : messages.hub.finaleLocked}
          </CandyButton>

          {/* Hidden achievement easter egg */}
          <button
            aria-label="secret"
            className="mt-2 h-2 w-2 rounded-full bg-blush-200/80 transition hover:scale-150"
            onClick={() => {
              if (!secretFound) {
                findSecret();
                earn("secretFound");
              }
            }}
          />
        </motion.div>
      </div>
    </Screen>
  );
}
