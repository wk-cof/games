import { useState, useEffect } from "react";
import { useGameSounds } from "@emoji-minis/kit";
import { LevelConfig, EMOJI_TO_LETTER } from "../game/data"; // Ensure LETTER_TO_EMOJI is exported or derived

// Quick reverse map for local use if not in data
const LETTER_TO_EMOJI: Record<string, string> = Object.entries(
  EMOJI_TO_LETTER,
).reduce((acc, [emoji, letter]) => ({ ...acc, [letter]: emoji }), {});

interface WorldFourViewProps {
  level: LevelConfig;
  onCorrect: () => void;
}

export function WorldFourView({ level, onCorrect }: WorldFourViewProps) {
  const [slots, setSlots] = useState<string[]>(
    new Array(level.targetWord.length).fill(""),
  );
  const { playClick, playSuccess, playError } = useGameSounds();

  useEffect(() => {
    setSlots(new Array(level.targetWord.length).fill(""));
  }, [level]);

  const handleSelectEmoji = (emoji: string) => {
    playClick();
    // Fill first empty slot
    const emptyIndex = slots.findIndex((s) => s === "");
    if (emptyIndex !== -1) {
      const newSlots = [...slots];
      newSlots[emptyIndex] = emoji;
      setSlots(newSlots);

      // Auto-check if full?
      if (emptyIndex === slots.length - 1) {
        // Last slot filled
        checkSolution(newSlots);
      }
    }
  };

  const handleClearSlot = (index: number) => {
    const newSlots = [...slots];
    newSlots[index] = "";
    setSlots(newSlots);
  };

  const checkSolution = (currentSlots: string[]) => {
    const currentWord = currentSlots.map((e) => EMOJI_TO_LETTER[e]).join("");
    if (currentWord === level.targetWord) {
      playSuccess();
      setTimeout(onCorrect, 1000);
    } else {
      playError();
      // Maybe clear wrong ones or shake
      setTimeout(() => {
        setSlots(new Array(level.targetWord.length).fill(""));
      }, 1000);
    }
  };

  const letters = level.targetWord.split("");

  // Available Emojis (Correct ones + some distractors)
  // For simplicity, let's just show the alphabet subsets or random subset
  const correctEmojis = letters.map((l) => LETTER_TO_EMOJI[l]);
  // Add 3 random others
  const allEmojis = Object.keys(EMOJI_TO_LETTER);
  const distractors = allEmojis.slice(0, 3); // Naive

  const pool = Array.from(new Set([...correctEmojis, ...distractors])).sort();

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
        Spell the word: <strong>{level.targetWord}</strong>
      </h2>

      {/* Slot Display */}
      <div style={{ display: "flex", gap: "1rem" }}>
        {slots.map((emoji, i) => (
          <button
            key={i}
            onClick={() => handleClearSlot(i)}
            style={{
              width: "4rem",
              height: "4rem",
              border: "2px dashed var(--es-border)",
              borderRadius: "12px",
              background: "var(--es-surface)",
              fontSize: "2.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Emoji Keyboard */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          justifyContent: "center",
          maxWidth: "400px",
        }}
      >
        {pool.map((emoji) => (
          <button
            key={emoji}
            onClick={() => handleSelectEmoji(emoji)}
            style={{
              fontSize: "2rem",
              padding: "0.5rem",
              border: "1px solid var(--es-border)",
              borderRadius: "8px",
              background: "#FFF",
              cursor: "pointer",
            }}
          >
            {emoji}
            {/* Debug hint */}
            {/* <span style={{fontSize: '10px', display: 'block'}}>{EMOJI_TO_LETTER[emoji]}</span> */}
          </button>
        ))}
      </div>
    </div>
  );
}
