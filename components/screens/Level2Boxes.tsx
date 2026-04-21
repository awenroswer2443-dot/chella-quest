"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import messages from "@/lib/content";
import { useGame } from "@/lib/game-state";
import LevelShell from "./LevelShell";
import CandyButton from "@/components/ui/CandyButton";
import GemReward from "@/components/ui/GemReward";
import ProgressBar from "@/components/ui/ProgressBar";
import { iconByName, SparkleIcon } from "@/components/ui/Icons";
import { play } from "@/lib/sounds";

const ribbonColors = [
  "from-blush-300 to-blush-500",
  "from-gold-200 to-gold-400",
  "from-lilac-200 to-lilac-400",
  "from-peach-200 to-peach-300",
  "from-blush-200 to-blush-400",
  "from-cream-100 to-blush-200",
];

const boxColors = [
  "from-blush-200 to-blush-400",
  "from-cream-100 to-peach-200",
  "from-lilac-100 to-lilac-300",
  "from-peach-100 to-peach-300",
  "from-blush-100 to-blush-300",
  "from-gold-100 to-gold-300",
];

export default function Level2Boxes() {
  const { goto, completeLevel, awardGem, earn } = useGame();
  const level = messages.levels.boxes;
  const [opened, setOpened] = useState<boolean[]>(
    Array(level.wishes.length).fill(false)
  );
  const [revealed, setRevealed] = useState<number | null>(null);
  const [gemOpen, setGemOpen] = useState(false);

  const count = opened.filter(Boolean).length;
  const complete = count === level.wishes.length;

  const openBox = (idx: number) => {
    if (opened[idx]) {
      setRevealed(idx);
      return;
    }
    play("unlock");
    setOpened((arr) => arr.map((v, i) => (i === idx ? true : v)));
    setRevealed(idx);
  };

  const closeReveal = () => setRevealed(null);

  const finish = () => {
    completeLevel("boxes");
    awardGem("boxes");
    earn("allBoxes");
    setGemOpen(true);
  };

  return (
    <LevelShell
      title={level.title}
      instruction={level.instruction}
      background="bg-dreamy-gradient"
      rightStat={
        <span className="rounded-full bg-white/80 px-3 py-1 font-display text-sm font-bold text-[#3b1e3a] shadow">
          {count}/{level.wishes.length}
        </span>
      }
    >
      <div className="relative flex-1 px-4 pb-8 pt-4">
        <div className="mx-auto mb-4 max-w-md">
          <ProgressBar value={count} max={level.wishes.length} accent="pink" />
        </div>

        <div className="mx-auto grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3">
          {level.wishes.map((w, idx) => {
            const Icon = iconByName(w.emoji);
            const isOpen = opened[idx];
            return (
              <motion.button
                key={idx}
                layout
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.94 }}
                onClick={() => openBox(idx)}
                className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white/60 p-3 shadow-dreamy"
              >
                <GiftBox
                  open={isOpen}
                  bow={ribbonColors[idx % ribbonColors.length]}
                  base={boxColors[idx % boxColors.length]}
                  Icon={Icon}
                />
                <motion.div
                  initial={false}
                  animate={{ opacity: isOpen ? 1 : 0 }}
                  className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-xl bg-white/85 px-2 py-1 text-center text-[10px] font-bold uppercase tracking-widest text-blush-500 shadow"
                >
                  Opened
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center">
          <AnimatePresence>
            {complete && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="font-display text-lg font-bold text-[#3b1e3a]">
                  {level.successMessage}
                </div>
                <CandyButton
                  onClick={finish}
                  variant="gold"
                  size="lg"
                  icon={<SparkleIcon size={18} color="#6b3a00" />}
                  sound="success"
                >
                  Claim the gem
                </CandyButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {revealed !== null && (
            <motion.div
              className="fixed inset-0 z-[75] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-[#3b1e3a]/40 backdrop-blur-sm"
                onClick={closeReveal}
              />
              <motion.div
                initial={{ scale: 0.4, y: 40, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-cream-50 to-blush-50 p-6 text-center shadow-dreamy"
              >
                <motion.div
                  animate={{ rotate: [0, -6, 6, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-200 to-blush-400 text-white shadow-candy"
                >
                  {(() => {
                    const Icon = iconByName(level.wishes[revealed].emoji);
                    return <Icon size={36} color="#fff" />;
                  })()}
                </motion.div>
                <h3 className="mb-2 font-display text-xl font-bold text-[#3b1e3a]">
                  {level.wishes[revealed].title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-[#5a3a5a]">
                  {level.wishes[revealed].text}
                </p>
                <CandyButton onClick={closeReveal} variant="pink" size="sm">
                  Keep going
                </CandyButton>
              </motion.div>
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

type IconCmp = React.ComponentType<{ size?: number; color?: string }>;

function GiftBox({
  open,
  bow,
  base,
  Icon,
}: {
  open: boolean;
  bow: string;
  base: string;
  Icon: IconCmp;
}) {
  return (
    <div className="relative h-full w-full">
      {/* Box base */}
      <div
        className={`absolute bottom-0 left-0 right-0 top-[32%] rounded-2xl bg-gradient-to-b ${base} shadow-inner`}
      />
      {/* Vertical ribbon */}
      <div className="absolute bottom-0 left-1/2 top-[32%] w-[14%] -translate-x-1/2 bg-gradient-to-b from-white/70 to-white/40" />
      {/* Lid */}
      <motion.div
        animate={{
          rotate: open ? -28 : 0,
          y: open ? -16 : 0,
          x: open ? 8 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        style={{ transformOrigin: "90% 100%" }}
        className={`absolute left-0 right-0 top-[14%] h-[24%] rounded-2xl bg-gradient-to-b ${base} shadow`}
      >
        <div className="absolute bottom-[12%] left-0 right-0 h-[22%] bg-white/70" />
      </motion.div>
      {/* Bow */}
      <motion.div
        animate={{
          y: open ? -40 : 0,
          rotate: open ? 20 : 0,
          opacity: open ? 0.85 : 1,
        }}
        transition={{ type: "spring", stiffness: 260 }}
        className="absolute left-1/2 top-0 flex h-[30%] w-[60%] -translate-x-1/2 items-center justify-center"
      >
        <div className={`h-4 w-4 rounded-full bg-gradient-to-b ${bow} shadow`} />
        <div
          className={`absolute left-1 h-3 w-[40%] rounded-full bg-gradient-to-b ${bow} shadow`}
        />
        <div
          className={`absolute right-1 h-3 w-[40%] rounded-full bg-gradient-to-b ${bow} shadow`}
        />
      </motion.div>
      {/* Inside sparkle */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0, y: 10 }}
            animate={{ scale: 1, y: -8 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 260 }}
            className="absolute left-1/2 top-[48%] -translate-x-1/2 drop-shadow-[0_4px_8px_rgba(255,82,136,0.5)]"
          >
            <Icon size={40} color="#fff" />
          </motion.div>
        )}
      </AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute left-1/2 top-[40%] h-2 w-2 rounded-full bg-white"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos((i / 8) * Math.PI * 2) * 60,
                y: Math.sin((i / 8) * Math.PI * 2) * 60,
                opacity: 0,
              }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
