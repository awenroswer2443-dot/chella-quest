"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { LevelId } from "./content";
import { isMuted, play, setMuted } from "./sounds";

export type Screen =
  | "loading"
  | "title"
  | "hub"
  | "catch"
  | "boxes"
  | "memory"
  | "constellation"
  | "cake"
  | "finale";

interface GameStateShape {
  screen: Screen;
  completed: Record<LevelId, boolean>;
  gems: Record<LevelId, boolean>;
  soundOn: boolean;
  achievements: string[];
  sparkleCount: number;
  secretFound: boolean;
}

type Action =
  | { type: "goto"; screen: Screen }
  | { type: "complete-level"; level: LevelId }
  | { type: "award-gem"; level: LevelId }
  | { type: "toggle-sound" }
  | { type: "set-sound"; on: boolean }
  | { type: "achievement"; name: string }
  | { type: "add-sparkles"; amount: number }
  | { type: "secret" }
  | { type: "reset" }
  | { type: "rehydrate"; payload: Partial<GameStateShape> };

const defaults: GameStateShape = {
  screen: "loading",
  completed: {
    catch: false,
    boxes: false,
    memory: false,
    constellation: false,
    cake: false,
  },
  gems: {
    catch: false,
    boxes: false,
    memory: false,
    constellation: false,
    cake: false,
  },
  soundOn: true,
  achievements: [],
  sparkleCount: 0,
  secretFound: false,
};

function reducer(state: GameStateShape, action: Action): GameStateShape {
  switch (action.type) {
    case "goto":
      return { ...state, screen: action.screen };
    case "complete-level":
      return {
        ...state,
        completed: { ...state.completed, [action.level]: true },
      };
    case "award-gem":
      return { ...state, gems: { ...state.gems, [action.level]: true } };
    case "toggle-sound":
      return { ...state, soundOn: !state.soundOn };
    case "set-sound":
      return { ...state, soundOn: action.on };
    case "achievement":
      if (state.achievements.includes(action.name)) return state;
      return { ...state, achievements: [...state.achievements, action.name] };
    case "add-sparkles":
      return { ...state, sparkleCount: state.sparkleCount + action.amount };
    case "secret":
      return { ...state, secretFound: true };
    case "reset":
      return { ...defaults, screen: "title", soundOn: state.soundOn };
    case "rehydrate":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

interface GameContextValue extends GameStateShape {
  goto: (screen: Screen) => void;
  completeLevel: (level: LevelId) => void;
  awardGem: (level: LevelId) => void;
  toggleSound: () => void;
  earn: (name: string) => void;
  addSparkles: (n: number) => void;
  findSecret: () => void;
  reset: () => void;
  achievementsQueue: string[];
  dismissAchievement: () => void;
  allLevelsDone: boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

const STORAGE_KEY = "chella-quest-save-v1";

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, defaults);
  const [hydrated, setHydrated] = useState(false);
  const [achievementsQueue, setAchievementsQueue] = useState<string[]>([]);

  // hydrate from localStorage on first mount
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: "rehydrate", payload: { ...parsed, screen: "loading" } });
      }
    } catch {
      /* noop */
    }
    setHydrated(true);
  }, []);

  // persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      const { screen: _s, ...rest } = state;
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rest));
    } catch {
      /* noop */
    }
  }, [state, hydrated]);

  // sync sound mute flag
  useEffect(() => {
    setMuted(!state.soundOn);
  }, [state.soundOn]);

  const earn = useCallback((name: string) => {
    dispatch({ type: "achievement", name });
    setAchievementsQueue((q) => [...q, name]);
    play("chime");
  }, []);

  const dismissAchievement = useCallback(() => {
    setAchievementsQueue((q) => q.slice(1));
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      ...state,
      goto: (screen) => dispatch({ type: "goto", screen }),
      completeLevel: (level) => dispatch({ type: "complete-level", level }),
      awardGem: (level) => dispatch({ type: "award-gem", level }),
      toggleSound: () => {
        const next = !state.soundOn;
        setMuted(!next);
        dispatch({ type: "toggle-sound" });
        if (next) play("tap");
      },
      earn,
      addSparkles: (n) => dispatch({ type: "add-sparkles", amount: n }),
      findSecret: () => dispatch({ type: "secret" }),
      reset: () => dispatch({ type: "reset" }),
      achievementsQueue,
      dismissAchievement,
      allLevelsDone: Object.values(state.completed).every(Boolean),
    }),
    [state, achievementsQueue, dismissAchievement, earn]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside <GameProvider>");
  return ctx;
}

export { isMuted };
