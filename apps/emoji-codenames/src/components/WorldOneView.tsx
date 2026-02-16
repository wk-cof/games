import { useState, useEffect } from "react";
import { Button, Emoji, useGameSounds } from "@emoji-minis/kit";
import { CodeDisplay } from "./CodeDisplay";
import { LevelConfig } from "../game/data";

interface WorldOneViewProps {
  level: LevelConfig;
  onCorrect: () => void;
}

export function WorldOneView({ level, onCorrect }: WorldOneViewProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const { playSuccess, playError } = useGameSounds();

  // Reset state when level changes
  useEffect(() => {
    setRevealed(new Set());
    setWrong(null);
  }, [level]);

  const handleGuess = (guess: string) => {
    if (guess === level.targetWord) {
      playSuccess();
      setWrong(null);
      // Reveal all
      const allIndices = new Set(level.targetWord.split("").map((_, i) => i));
      setRevealed(allIndices);
      setTimeout(onCorrect, 1500);
    } else {
      playError();
      setWrong(guess);
      // Reveal first letter as hint? Or just shake?
      // Let's reveal first letter
      setRevealed((prev) => {
        const next = new Set(prev);
        next.add(0);
        return next;
      });
    }
  };

  // Generate options: Target + Foils
  // Ideally this should be memoized or passed from engine to avoid shuffling on re-render
  // For now simple sort
  const options = [level.targetWord, ...(level.foils || [])].sort();

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "2rem",
      }}
    >
      <h2 style={{ fontSize: "1.5rem", opacity: 0.7 }}>
        Which picture matches the code?
      </h2>

      <CodeDisplay targetWord={level.targetWord} revealedLetters={revealed} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "1rem",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        {options.map((option) => (
          <Button
            key={option}
            variant={wrong === option ? "ghost" : "solid"}
            onClick={() => handleGuess(option)}
            style={{
              height: "120px",
              fontSize: "3rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {/* Placeholder for image - using emoji for now until assets are real */}
            <Emoji symbol={getEmojiForWord(option)} />
          </Button>
        ))}
      </div>
    </div>
  );
}

// Temporary helper until we have real assets
function getEmojiForWord(word: string) {
  const map: Record<string, string> = {
    CAT: "🐱",
    DOG: "🐶",
    FISH: "🐟",
    BIRD: "🐦",
    PIG: "🐷",
    COW: "🐮",
    FOX: "🦊",
    BEAR: "🐻",
    SUN: "☀️",
    RUN: "🏃",
    BUN: "🥖",
    BOX: "📦",
    SIX: "6️⃣",
    BED: "🛏️",
    MAP: "🗺️",
    RAT: "🐀",
  };
  return map[word] || "❓";
}
