"use client";

import { useState } from "react";
import LegoIntro from "@/components/lego/LegoIntro";
import LegoGame from "@/components/lego/LegoGame";
import LegoWordReveal from "@/components/lego/LegoWordReveal";
import { clearLegoPuzzleProgress } from "@/hooks/useLegoPuzzle";

export default function LegoPage() {
  const [stage, setStage] = useState<"intro" | "game" | "word">("intro");
  const startNewPuzzle = () => {
    clearLegoPuzzleProgress();
    setStage("game");
  };

  return (
    <main className="lego-page">
      {stage === "intro" && <LegoIntro onStart={startNewPuzzle} />}
      {stage === "game" && <LegoGame onReveal={() => setStage("word")} />}
      {stage === "word" && <LegoWordReveal />}
    </main>
  );
}
