import { useState, useEffect } from "react";
import { Button, useGameSounds } from "@emoji-minis/kit";
import { CodeDisplay } from "./CodeDisplay";
import { LevelConfig, WORD_FAMILIES } from "../game/data";

interface WorldThreeViewProps {
  level: LevelConfig;
  onCorrect: () => void;
}

export function WorldThreeView({ level, onCorrect }: WorldThreeViewProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const { playSuccess, playError } = useGameSounds();

  useEffect(() => {
    // In world 3, the ending might be revealed implicitly or after delay?
    // Let's start hidden
    setRevealed(new Set());
  }, [level]);

  const handleGuess = (guess: string) => {
    if (guess === level.targetWord) {
      playSuccess();
      const allIndices = new Set(level.targetWord.split("").map((_, i) => i));
      setRevealed(allIndices);
      setTimeout(onCorrect, 1500);
    } else {
      playError();
      // Hint logic
    }
  };

  // Options are from the same family + maybe one distinct?
  // Let's use the family list
  const family = level.family
    ? WORD_FAMILIES[level.family as keyof typeof WORD_FAMILIES]
    : [];
  // Pick 3 random from family including target, or use all if small
  const options =
    family.length > 0 ? family.slice(0, 3) : [level.targetWord, "BAD", "MAD"];
  if (!options.includes(level.targetWord)) options[0] = level.targetWord;
  options.sort();

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
        Family: -{level.family}
      </h2>

      <CodeDisplay
        targetWord={level.targetWord}
        revealedLetters={revealed}
        highlightEnding={true} // Special Highlight
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        {options.map((option) => (
          <Button
            key={option}
            variant={option === level.targetWord ? "solid" : "ghost"}
            onClick={() => handleGuess(option)}
          >
            {option}
          </Button>
        ))}
      </div>

      {/* Visual reinforcement of the pattern */}
      {revealed.size === level.targetWord.length && (
        <div style={{ fontSize: "2rem", marginTop: "1rem" }}>
          <span style={{ opacity: 0.5 }}>{level.targetWord[0]}</span>
          <strong style={{ color: "var(--es-primary)" }}>{level.family}</strong>
        </div>
      )}
    </div>
  );
}
