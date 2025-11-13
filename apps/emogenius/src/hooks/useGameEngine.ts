import { useCallback, useEffect, useMemo, useState } from "react";
import {
  DIFFICULTIES,
  EMOJI_THEMES,
  MISMATCH_TIMEOUT_MS,
  SETTINGS_STORAGE_KEY,
  type Difficulty,
  type ThemeKey
} from "../constants/gameConfig";
import type { Card, GameMode, StoredSettings } from "../types/game";
import shuffle from "../utils/shuffle";

const isThemeKey = (value: unknown): value is ThemeKey =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(EMOJI_THEMES, value);

const isDifficultyValue = (value: unknown): value is Difficulty =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(DIFFICULTIES, value);

const isGameModeValue = (value: unknown): value is GameMode =>
  value === "solo" || value === "hotseat";

type UseGameEngineOptions = {
  initialTheme?: ThemeKey;
  initialDifficulty?: Difficulty;
  initialMode?: GameMode;
};

type GameStats = {
  moves: number;
  playerScores: number[];
  activePlayerIndex: number;
};

export type UseGameEngineReturn = {
  theme: ThemeKey;
  difficulty: Difficulty;
  mode: GameMode;
  rows: number;
  cols: number;
  deck: Card[];
  isBusy: boolean;
  isGameWon: boolean;
  stats: GameStats;
  startNewGame: () => void;
  handleCardClick: (index: number) => void;
  handleThemeChange: (theme: ThemeKey) => void;
  handleDifficultyChange: (difficulty: Difficulty) => void;
  handleModeChange: (mode: GameMode) => void;
};

export const useGameEngine = (
  options: UseGameEngineOptions = {}
): UseGameEngineReturn => {
  const [theme, setTheme] = useState<ThemeKey>(options.initialTheme ?? "animals");
  const [difficulty, setDifficulty] = useState<Difficulty>(
    options.initialDifficulty ?? "easy"
  );
  const [mode, setMode] = useState<GameMode>(options.initialMode ?? "solo");
  const [deck, setDeck] = useState<Card[]>([]);
  const [revealedIndexes, setRevealedIndexes] = useState<number[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [targetPairs, setTargetPairs] = useState(0);
  const [playerScores, setPlayerScores] = useState<number[]>(() =>
    Array(mode === "hotseat" ? 2 : 1).fill(0)
  );
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);

  const playerCount = mode === "hotseat" ? 2 : 1;

  useEffect(() => {
    const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings) as Partial<StoredSettings>;
        if (parsed.theme && isThemeKey(parsed.theme)) {
          setTheme(parsed.theme);
        }
        if (parsed.difficulty && isDifficultyValue(parsed.difficulty)) {
          setDifficulty(parsed.difficulty);
        }
        if (parsed.mode && isGameModeValue(parsed.mode)) {
          setMode(parsed.mode);
        }
      } catch (error) {
        console.warn("Failed to load settings", error);
      }
    }
  }, []);

  useEffect(() => {
    const settings: StoredSettings = {
      theme,
      difficulty,
      mode
    };
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [theme, difficulty, mode]);

  const { rows, cols } = useMemo(() => {
    return DIFFICULTIES[difficulty];
  }, [difficulty]);

  const pairCount = useMemo(
    () => Math.floor((rows * cols) / 2),
    [rows, cols]
  );

  const startNewGame = useCallback(() => {
    const availableEmojis = EMOJI_THEMES[theme];
    const effectivePairCount = Math.min(pairCount, availableEmojis.length);
    const selectedEmojis = shuffle(availableEmojis).slice(0, effectivePairCount);
    const duplicated = selectedEmojis.flatMap((emoji) => [emoji, emoji]);
    const shuffled: Card[] = shuffle(duplicated).map((emoji, index) => ({
      id: index,
      emoji,
      state: "hidden"
    }));

    setDeck(shuffled);
    setRevealedIndexes([]);
    setIsBusy(false);
    setMoves(0);
    setMatches(0);
    setTargetPairs(effectivePairCount);
    setPlayerScores(Array(playerCount).fill(0));
    setActivePlayerIndex(0);
  }, [pairCount, theme, playerCount]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCardClick = useCallback(
    (index: number) => {
      if (isBusy) return;
      const card = deck[index];
      if (!card || card.state !== "hidden") return;

      const nextDeck = deck.map((item, idx) =>
        idx === index ? { ...item, state: "revealed" as const } : item
      );
      setDeck(nextDeck);

      const updatedRevealed = [...revealedIndexes, index];
      setRevealedIndexes(updatedRevealed);

      if (updatedRevealed.length === 2) {
        setMoves((prev) => prev + 1);
        const [firstIndex, secondIndex] = updatedRevealed;
        const firstCard = nextDeck[firstIndex];
        const secondCard = nextDeck[secondIndex];

        if (!firstCard || !secondCard) {
          setRevealedIndexes([]);
          return;
        }

        if (firstCard.emoji === secondCard.emoji) {
          setDeck((prevDeck) =>
            prevDeck.map((item, idx) =>
              idx === firstIndex || idx === secondIndex
                ? { ...item, state: "matched" as const }
                : item
            )
          );
          setMatches((prev) => prev + 1);
          setPlayerScores((prev) => {
            if (!prev.length) return prev;
            const next = [...prev];
            next[activePlayerIndex] = (next[activePlayerIndex] ?? 0) + 1;
            return next;
          });
          setRevealedIndexes([]);
        } else {
          setIsBusy(true);
          window.setTimeout(() => {
            setDeck((prevDeck) =>
              prevDeck.map((item, idx) =>
                idx === firstIndex || idx === secondIndex
                  ? { ...item, state: "hidden" as const }
                  : item
              )
            );
            setRevealedIndexes([]);
            setIsBusy(false);
            if (playerCount > 1) {
              setActivePlayerIndex((prev) => (prev + 1) % playerCount);
            }
          }, MISMATCH_TIMEOUT_MS);
        }
      }
    },
    [activePlayerIndex, deck, isBusy, playerCount, revealedIndexes]
  );

  const isGameWon = targetPairs > 0 && matches === targetPairs;

  const handleThemeChange = useCallback((nextTheme: ThemeKey) => {
    setTheme(nextTheme);
  }, []);

  const handleDifficultyChange = useCallback(
    (nextDifficulty: Difficulty) => {
      setDifficulty(nextDifficulty);
    },
    []
  );

  const handleModeChange = useCallback((nextMode: GameMode) => {
    setMode(nextMode);
  }, []);

  return {
    theme,
    difficulty,
    mode,
    rows,
    cols,
    deck,
    isBusy,
    isGameWon,
    stats: {
      moves,
      playerScores,
      activePlayerIndex
    },
    startNewGame,
    handleCardClick,
    handleThemeChange,
    handleDifficultyChange,
    handleModeChange
  };
};
