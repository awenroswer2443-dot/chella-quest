"use client";

import { AnimatePresence } from "framer-motion";
import { GameProvider, useGame } from "@/lib/game-state";
import LoadingScreen from "./screens/LoadingScreen";
import TitleScreen from "./screens/TitleScreen";
import Hub from "./screens/Hub";
import Level1Catch from "./screens/Level1Catch";
import Level2Boxes from "./screens/Level2Boxes";
import Level3Memory from "./screens/Level3Memory";
import Level4Constellation from "./screens/Level4Constellation";
import Level5Cake from "./screens/Level5Cake";
import Finale from "./screens/Finale";
import SparkleTrail from "./ui/SparkleTrail";
import AchievementPopup from "./ui/AchievementPopup";
import SoundToggle from "./ui/SoundToggle";

function GameBody() {
  const { screen } = useGame();

  return (
    <>
      <SoundToggle />
      <AchievementPopup />
      <SparkleTrail />

      <AnimatePresence mode="wait">
        {screen === "loading" && <LoadingScreen key="loading" />}
        {screen === "title" && <TitleScreen key="title" />}
        {screen === "hub" && <Hub key="hub" />}
        {screen === "catch" && <Level1Catch key="catch" />}
        {screen === "boxes" && <Level2Boxes key="boxes" />}
        {screen === "memory" && <Level3Memory key="memory" />}
        {screen === "constellation" && <Level4Constellation key="constellation" />}
        {screen === "cake" && <Level5Cake key="cake" />}
        {screen === "finale" && <Finale key="finale" />}
      </AnimatePresence>
    </>
  );
}

export default function Game() {
  return (
    <GameProvider>
      <GameBody />
    </GameProvider>
  );
}
