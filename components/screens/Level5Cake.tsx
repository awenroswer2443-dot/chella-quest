"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import messages from "@/lib/content";
import { useGame } from "@/lib/game-state";
import LevelShell from "./LevelShell";
import CandyButton from "@/components/ui/CandyButton";
import GemReward from "@/components/ui/GemReward";
import { HeartIcon, SparkleIcon } from "@/components/ui/Icons";
import { play } from "@/lib/sounds";

type Base = "vanilla" | "strawberry" | "choco" | "matcha";
type Icing = "buttercream" | "drip" | "pearl";
type Topping = "hearts" | "stars" | "sprinkles" | "berries";

const baseColors: Record<Base, { body: string; cream: string }> = {
  vanilla: { body: "#fff3dc", cream: "#ffe58a" },
  strawberry: { body: "#ffc6d7", cream: "#ff97b8" },
  choco: { body: "#8a5c3a", cream: "#b0784d" },
  matcha: { body: "#d4e8b5", cream: "#aed17e" },
};

const icingTint: Record<Icing, string> = {
  buttercream: "#fffaf0",
  drip: "#ff7aa0",
  pearl: "#a77dff",
};

interface Candle {
  id: number;
  lit: boolean;
  x: number;
}

export default function Level5Cake() {
  const { goto, completeLevel, awardGem, earn } = useGame();
  const level = messages.levels.cake;
  const [step, setStep] = useState<"design" | "blow" | "done">("design");
  const [base, setBase] = useState<Base>("strawberry");
  const [icing, setIcing] = useState<Icing>("buttercream");
  const [toppings, setToppings] = useState<Topping[]>(["hearts"]);
  const [candles, setCandles] = useState<Candle[]>(
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      lit: true,
      x: 20 + i * 15,
    }))
  );
  const [gemOpen, setGemOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const toggleTopping = (t: Topping) => {
    play("tap");
    setToppings((arr) =>
      arr.includes(t) ? arr.filter((x) => x !== t) : [...arr, t]
    );
  };

  const advance = () => {
    play("chime");
    setStep("blow");
    earn("cakeDesigned");
  };

  const blow = (id: number) => {
    play("whoosh");
    setCandles((arr) =>
      arr.map((c) => (c.id === id ? { ...c, lit: false } : c))
    );
  };

  useEffect(() => {
    if (step !== "blow") return;
    if (candles.every((c) => !c.lit)) {
      setStep("done");
      setCelebrate(true);
      play("win");
      completeLevel("cake");
      awardGem("cake");
      setTimeout(() => setGemOpen(true), 1200);
    }
  }, [candles, step, completeLevel, awardGem]);

  return (
    <LevelShell
      title={level.title}
      instruction={level.instruction}
      background="bg-dreamy-gradient"
    >
      <div className="relative flex flex-1 flex-col items-center px-4 pb-8 pt-4">
        <div className="relative my-4 flex h-72 w-full max-w-md flex-1 items-end justify-center sm:h-80">
          <Cake
            base={base}
            icing={icing}
            toppings={toppings}
            candles={candles}
            onBlow={blow}
            canBlow={step === "blow"}
          />
        </div>

        <AnimatePresence mode="wait">
          {step === "design" && (
            <motion.div
              key="design"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full max-w-md space-y-3"
            >
              <OptionRow
                label="Flavour"
                options={[
                  { key: "vanilla", label: "Vanilla" },
                  { key: "strawberry", label: "Strawberry" },
                  { key: "choco", label: "Chocolate" },
                  { key: "matcha", label: "Matcha" },
                ]}
                value={base}
                onPick={(v) => setBase(v as Base)}
              />
              <OptionRow
                label="Icing"
                options={[
                  { key: "buttercream", label: "Buttercream" },
                  { key: "drip", label: "Pink Drip" },
                  { key: "pearl", label: "Pearl" },
                ]}
                value={icing}
                onPick={(v) => setIcing(v as Icing)}
              />
              <div>
                <div className="mb-1 text-xs font-bold uppercase tracking-widest text-blush-500">
                  Toppings (pick as many)
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["hearts", "Hearts"],
                      ["stars", "Stars"],
                      ["sprinkles", "Sprinkles"],
                      ["berries", "Berries"],
                    ] as [Topping, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => toggleTopping(key)}
                      className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
                        toppings.includes(key)
                          ? "bg-blush-400 text-white shadow"
                          : "bg-white/70 text-[#7a4a72]"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-center pt-2">
                <CandyButton
                  onClick={advance}
                  variant="pink"
                  size="lg"
                  iconRight={<HeartIcon size={18} color="#fff" />}
                  sound={null}
                >
                  Light the candles
                </CandyButton>
              </div>
            </motion.div>
          )}

          {step === "blow" && (
            <motion.div
              key="blow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="rounded-full bg-white/85 px-4 py-2 text-sm font-bold text-[#3b1e3a] shadow">
                Tap each candle to blow it out. Make a wish ✦
              </div>
              <div className="text-xs text-[#7a4a72]">
                {candles.filter((c) => c.lit).length} left
              </div>
            </motion.div>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="font-display text-xl font-bold text-[#3b1e3a]">
                {level.successMessage}
              </div>
              <CandyButton
                onClick={() => setGemOpen(true)}
                variant="gold"
                size="md"
                icon={<SparkleIcon size={18} color="#6b3a00" />}
                sound="unlock"
              >
                Open the last gem
              </CandyButton>
            </motion.div>
          )}
        </AnimatePresence>

        {celebrate && <MiniConfetti />}

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

function OptionRow<T extends string>({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: { key: T; label: string }[];
  value: T;
  onPick: (key: T) => void;
}) {
  return (
    <div>
      <div className="mb-1 text-xs font-bold uppercase tracking-widest text-blush-500">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => {
              play("tap");
              onPick(o.key);
            }}
            className={`rounded-full px-3 py-1.5 text-sm font-bold transition ${
              value === o.key
                ? "bg-blush-400 text-white shadow"
                : "bg-white/70 text-[#7a4a72]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Cake({
  base,
  icing,
  toppings,
  candles,
  onBlow,
  canBlow,
}: {
  base: Base;
  icing: Icing;
  toppings: Topping[];
  candles: Candle[];
  onBlow: (id: number) => void;
  canBlow: boolean;
}) {
  const c = baseColors[base];
  return (
    <div className="relative aspect-[4/3] w-full">
      <svg viewBox="0 0 200 160" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="plate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#ffe4ec" />
          </linearGradient>
        </defs>

        {/* Plate */}
        <ellipse cx="100" cy="150" rx="95" ry="8" fill="url(#plate)" />
        <ellipse cx="100" cy="148" rx="78" ry="5" fill="#fff" opacity="0.7" />

        {/* Bottom tier */}
        <rect x="20" y="95" width="160" height="55" rx="8" fill={c.body} />
        <rect x="20" y="92" width="160" height="14" rx="7" fill={icingTint[icing]} />
        {icing === "drip" && (
          <path
            d="M20 106 Q30 118 40 106 Q50 120 60 106 Q70 118 80 106 Q90 120 100 106 Q110 118 120 106 Q130 120 140 106 Q150 118 160 106 Q170 120 180 106 L180 110 L20 110 Z"
            fill={icingTint[icing]}
          />
        )}
        {icing === "pearl" && (
          <g fill={icingTint[icing]}>
            {Array.from({ length: 10 }, (_, i) => (
              <circle key={i} cx={30 + i * 15} cy={106} r={2.5} />
            ))}
          </g>
        )}
        {/* Top tier */}
        <rect x="55" y="55" width="90" height="45" rx="6" fill={c.body} />
        <rect x="55" y="53" width="90" height="10" rx="5" fill={c.cream} />

        {/* Toppings on bottom tier */}
        {toppings.includes("sprinkles") && (
          <g>
            {Array.from({ length: 22 }, (_, i) => (
              <rect
                key={i}
                x={25 + ((i * 7) % 150)}
                y={118 + (i % 2) * 12}
                width={4}
                height={1.5}
                rx={0.5}
                fill={["#ff5288", "#ffbf2e", "#a77dff", "#ff97b8"][i % 4]}
                transform={`rotate(${(i * 23) % 180} ${
                  25 + ((i * 7) % 150)
                } ${118 + (i % 2) * 12})`}
              />
            ))}
          </g>
        )}
        {toppings.includes("berries") && (
          <g>
            {Array.from({ length: 5 }, (_, i) => (
              <circle
                key={i}
                cx={40 + i * 30}
                cy={99}
                r={3.5}
                fill="#e83a75"
              />
            ))}
          </g>
        )}
        {toppings.includes("hearts") && (
          <g fill="#ff5288">
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${70 + i * 30} 74 q-4 -6 -8 -3 q-6 3 -1 10 q1 4 9 8 q8 -4 9 -8 q5 -7 -1 -10 q-4 -3 -8 3 Z`}
              />
            ))}
          </g>
        )}
        {toppings.includes("stars") && (
          <g fill="#ffbf2e">
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                d={`M${70 + i * 30} 70 l2 5 5 1 -4 4 1 5 -4 -2 -4 2 1 -5 -4 -4 5 -1 Z`}
              />
            ))}
          </g>
        )}
      </svg>

      {/* Candles */}
      <div className="absolute inset-x-0 top-[14%] h-[22%]">
        {candles.map((cd) => (
          <CandleEl
            key={cd.id}
            candle={cd}
            onBlow={() => onBlow(cd.id)}
            canBlow={canBlow}
          />
        ))}
      </div>

      {/* sparkle hint over candles when blowing */}
      {canBlow && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2"
          animate={{ y: [0, 6, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <SparkleIcon size={22} color="#ffbf2e" />
        </motion.div>
      )}
    </div>
  );
}

function CandleEl({
  candle,
  onBlow,
  canBlow,
}: {
  candle: Candle;
  onBlow: () => void;
  canBlow: boolean;
}) {
  return (
    <button
      onClick={canBlow ? onBlow : undefined}
      className="absolute bottom-0 -translate-x-1/2"
      style={{ left: `${candle.x + 20}%` }}
      aria-label={candle.lit ? "lit candle" : "out"}
      disabled={!canBlow}
    >
      <div className="flex flex-col items-center">
        <AnimatePresence>
          {candle.lit && (
            <motion.div
              key="flame"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, y: -8, opacity: 0 }}
              className="relative"
            >
              <motion.div
                className="relative h-5 w-3"
                animate={{ scaleY: [1, 1.2, 1], scaleX: [1, 0.9, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 80%, #fff176 0%, #ffbf2e 50%, #ff7aa0 100%)",
                  }}
                />
              </motion.div>
              <motion.div
                className="absolute -inset-2 rounded-full bg-gold-200 blur-md"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-0.5 h-10 w-2.5 rounded-sm bg-gradient-to-b from-blush-200 to-blush-400 shadow" />
      </div>
    </button>
  );
}

function MiniConfetti() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-3 w-3 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            background: ["#ff5288", "#ffbf2e", "#a77dff", "#ff97b8"][i % 4],
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: 400, opacity: 0 }}
          transition={{
            duration: 1.5 + Math.random() * 1.5,
            delay: Math.random() * 0.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}
    </div>
  );
}
