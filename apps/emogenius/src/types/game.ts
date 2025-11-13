import type { Difficulty, ThemeKey } from "../constants/gameConfig";

export type CardState = "hidden" | "revealed" | "matched";

export type Card = {
  id: number;
  emoji: string;
  state: CardState;
};

export type GameMode = "solo" | "hotseat";

export type StoredSettings = {
  theme: ThemeKey;
  difficulty: Difficulty;
  mode: GameMode;
};
