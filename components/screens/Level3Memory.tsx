"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import messages from "@/lib/content";
import { useGame } from "@/lib/game-state";
import LevelShell from "./LevelShell";
import CandyButton from "@/components/ui/CandyButton";
import GemReward from "@/components/ui/GemReward";
import {
  BowIcon,
  CakeIcon,
  CrownIcon,
  CupcakeIcon,
  HeartIcon,
  RibbonIcon,
  SparkleIcon,
  StarIcon,
} from "@/components/ui/Icons";
import { play } from "@/lib/sounds";

type IconCmp = React.ComponentType<{ size?: number; color?: string }>;

interface Card {
  id: number;
  key: string;
  Icon: IconCmp;
  color: string;
  flipped: boolean;
  matched: boolean;
}

const deck: { key: string; Icon: IconCmp; color: string }[] = [
  { key: "heart", Icon: HeartIcon, color: "#ff5288" },
  { key: "star", Icon: StarIcon, color: "#ffbf2e" },
  { key: "cake", Icon: CakeIcon, color: "#a77dff" },
  { key: "crown", Icon: CrownIcon, color: "#ff97b8" },
  { key: "bow", Icon: BowIcon, color: "#ffae82" },
  { key: "cup", Icon: CupcakeIcon, color: "#e83a75" },
];

const emojiHint: Record<string, IconCmp> = {
  heart: HeartIcon,
  star: StarIcon,
  cake: CakeIcon,
  crown: CrownIcon,
  bow: BowIcon,
  cup: CupcakeIcon,
  ribbon: RibbonIcon,
};

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function Level3Memory() {
  const { goto, completeLevel, awardGem, earn } = useGame();
  const level = messages.levels.memory;
  const [cards, setCards] = useState<Card[]>(() => buildDeck());
  const [selected, setSelected] = useState<number[]>([]);
  const [flips, setFlips] = useState(0);
  const [misses, setMisses] = useState(0);
  const [gemOpen, setGemOpen] = useState(false);
  const [done, setDone] = useState(false);

  function buildDeck(): Card[] {
    const full = shuffle([...deck, ...deck]).map((c, i) => ({
      id: i,
      key: c.key,
      Icon: c.Icon,
      color: c.color,
      flipped: false,
      matched: false,
    }));
    // Initial peek: flip all for 1.5s then hide
    return full;
  }

  useEffect(() => {
    const show = setTimeout(() =>
      setCards((c) => c.map((card) => ({ ...card, flipped: true }))),
      200);
    const hide = setTimeout(
      () => setCards((c) => c.map((card) => ({ ...card, flipped: false }))),
      1800
    );
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  const allMatched = useMemo(
    () => cards.length > 0 && cards.every((c) => c.matched),
    [cards]
  );

  useEffect(() => {
    if (!allMatched || done) return;
    setDone(true);
    play("win");
    completeLevel("memory");
    awardGem("memory");
    earn("flawlessMemory");
    const t = setTimeout(() => setGemOpen(true), 700);
    return () => clearTimeout(t);
  }, [allMatched, done, completeLevel, awardGem, earn]);

  const flipCard = (id: number) => {
    if (selected.length >= 2) return;
    setCards((arr) =>
      arr.map((c) =>
        c.id === id && !c.matched && !c.flipped ? { ...c, flipped: true } : c
      )
    );
    play("tap");
    const nextSelected = [...selected, id];
    setSelected(nextSelected);
    setFlips((f) => f + 1);

    if (nextSelected.length === 2) {
      const [a, b] = nextSelected;
      const ca = cards.find((c) => c.id === a)!;
      const cb = cards.find((c) => c.id === b)!;
      if (ca.key === cb.key) {
        setTimeout(() => {
          setCards((arr) =>
            arr.map((c) =>
              c.id === a || c.id === b ? { ...c, matched: true } : c
            )
          );
          setSelected([]);
          play("chime");
          if (flips === 0) earn("firstMatch");
        }, 500);
      } else {
        setMisses((m) => m + 1);
        setTimeout(() => {
          setCards((arr) =>
            arr.map((c) =>
              c.id === a || c.id === b ? { ...c, flipped: false } : c
            )
          );
          setSelected([]);
        }, 900);
      }
    }
  };

  const reset = () => {
    setCards(buildDeck());
    setSelected([]);
    setFlips(0);
    setMisses(0);
    setDone(false);
  };

  return (
    <LevelShell
      title={level.title}
      instruction={level.instruction}
      background="bg-sunset-gradient"
      rightStat={
        <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-[#3b1e3a] shadow">
          {flips} flips
        </span>
      }
    >
      <div className="relative flex flex-1 flex-col items-center justify-center px-4 pb-6 pt-2">
        <div className="grid w-full max-w-md grid-cols-4 gap-3 sm:gap-4">
          {cards.map((card) => (
            <MemoryCard
              key={card.id}
              card={card}
              onFlip={() => flipCard(card.id)}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3 text-sm text-[#7a4a72]">
          <span>Misses: <b className="text-[#3b1e3a]">{misses}</b></span>
          <CandyButton onClick={reset} variant="cream" size="sm">
            Reshuffle
          </CandyButton>
        </div>

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

        {/* Placeholder so unused import stays out of prod bundle if needed */}
        <span className="hidden">{Object.keys(emojiHint).length}</span>
      </div>
    </LevelShell>
  );
}

function MemoryCard({ card, onFlip }: { card: Card; onFlip: () => void }) {
  const { Icon, color, flipped, matched } = card;
  return (
    <motion.button
      onClick={onFlip}
      disabled={matched || flipped}
      whileHover={!flipped && !matched ? { y: -2, scale: 1.02 } : {}}
      whileTap={!flipped && !matched ? { scale: 0.95 } : {}}
      className="relative aspect-[3/4] w-full"
      style={{ perspective: 900 }}
      aria-label={flipped ? "revealed" : "hidden card"}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateY: flipped || matched ? 180 : 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Back */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blush-300 to-blush-500 text-white shadow-candy"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/25 font-display text-sm font-bold">
            ?
          </div>
        </div>
        {/* Front */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br ${
            matched
              ? "from-gold-100 to-gold-300"
              : "from-white to-blush-50"
          } shadow-dreamy`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <Icon size={34} color={color} />
          {matched && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute bottom-1.5 right-1.5 rounded-full bg-gold-400 p-0.5"
            >
              <SparkleIcon size={12} color="#fff" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.button>
  );
}
