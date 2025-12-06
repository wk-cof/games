import { css, keyframes } from '@emotion/react';
import { useMemo, useState } from 'react';
import { Shell, HUD, Button, Emoji } from '@emoji-minis/kit';

type Level = {
  pattern: string[];
  missingIndex: number;
  choices: string[];
  theme: string;
};

type Theme = {
  name: string;
  emojis: string[];
};

type PatternRecipe = {
  id: string;
  tier: 'easy' | 'medium' | 'hard';
  minLength: number;
  maxLength: number;
  symbols: number;
  seed: (symbols: string[]) => string[];
};

const LEVEL_COUNT = 12;
const placeholder = '⬜️';

const themes: Theme[] = [
  { name: 'Forest Friends', emojis: ['🦊', '🦌', '🐻', '🦉', '🌲', '🍄'] },
  { name: 'Ocean Buddies', emojis: ['🐠', '🐡', '🐟', '🐬', '🐙', '🪼'] },
  { name: 'Sweet Treats', emojis: ['🍉', '🍓', '🍋', '🍑', '🍰', '🍭'] },
  { name: 'Cozy Winter', emojis: ['⛄️', '❄️', '🎄', '🧤', '🧣', '🛷'] },
  { name: 'Sky Shine', emojis: ['☁️', '🌤️', '🌈', '⭐️', '🌙', '☀️'] },
  { name: 'Zoom Crew', emojis: ['🚗', '🛴', '🚲', '🚁', '✈️', '🛸'] }
];

const patternRecipes: PatternRecipe[] = [
  { id: 'AB', tier: 'easy', minLength: 4, maxLength: 6, symbols: 2, seed: ([a, b]) => [a, b] },
  { id: 'AAB', tier: 'easy', minLength: 5, maxLength: 7, symbols: 2, seed: ([a, b]) => [a, a, b] },
  { id: 'ABB', tier: 'medium', minLength: 5, maxLength: 8, symbols: 2, seed: ([a, b]) => [a, b, b] },
  { id: 'ABC', tier: 'medium', minLength: 6, maxLength: 9, symbols: 3, seed: ([a, b, c]) => [a, b, c] },
  { id: 'ABBC', tier: 'hard', minLength: 6, maxLength: 9, symbols: 3, seed: ([a, b, c]) => [a, b, b, c] },
  { id: 'AABC', tier: 'hard', minLength: 6, maxLength: 9, symbols: 3, seed: ([a, b, c]) => [a, a, b, c] }
];

const tierByIndex: Array<'easy' | 'medium' | 'hard'> = ['easy', 'easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard', 'hard'];

const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = <T,>(items: T[]) => items[randomInt(0, items.length - 1)];

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const repeatSeed = (seed: string[], length: number) => {
  const pattern: string[] = [];
  for (let i = 0; i < length; i += 1) {
    pattern.push(seed[i % seed.length]);
  }
  return pattern;
};

const buildChoices = (answer: string, theme: Theme) => {
  const pool = shuffle(theme.emojis.filter((emoji) => emoji !== answer));
  const choices: string[] = [answer];
  while (choices.length < 3) {
    const next = pool.shift();
    choices.push(next ?? answer);
  }
  return shuffle(choices);
};

const generateLevels = (count: number): Level[] =>
  Array.from({ length: count }, (_, index) => {
    const tier = tierByIndex[index] ?? 'hard';
    const recipePool =
      tier === 'easy'
        ? patternRecipes.filter((recipe) => recipe.tier === 'easy')
        : tier === 'medium'
          ? patternRecipes.filter((recipe) => recipe.tier !== 'hard')
          : patternRecipes;
    const recipe = randomItem(recipePool);
    const theme = randomItem(themes);
    const palette = shuffle(theme.emojis).slice(0, Math.min(theme.emojis.length, recipe.symbols + 3));
    const baseSymbols = palette.slice(0, recipe.symbols);
    const length = randomInt(recipe.minLength, recipe.maxLength);
    const pattern = repeatSeed(recipe.seed(baseSymbols), length);
    const missingIndex = randomInt(0, pattern.length - 1);
    const choices = buildChoices(pattern[missingIndex], theme);

    return { pattern, missingIndex, choices, theme: theme.name };
  });

const boardBase = css`
  position: relative;
  background: var(--es-surface);
  border-radius: var(--emoji-radius-lg);
  padding: clamp(1rem, 2vw, 1.5rem);
  box-shadow: var(--es-shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border: 1px solid var(--es-border);
`;

const pop = keyframes`
  0% { transform: scale(1); }
  40% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  50% { transform: translateX(8px); }
  75% { transform: translateX(-6px); }
`;

const confettiFall = keyframes`
  0% {
    transform: translateY(-30%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translateY(110%) scale(1.15);
    opacity: 0;
  }
`;

const progressStyles = css`
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
  flex-wrap: wrap;
`;

const patternStyles = css`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  font-size: clamp(2.5rem, 7vw, 3.5rem);
`;

const blankStyles = css`
  color: #c9b7ad;
`;

const promptStyles = css`
  margin: 0;
  font-size: 1.05rem;
  color: var(--es-text-primary);
`;

const promptTagStyles = css`
  display: block;
  font-size: 0.85rem;
  color: var(--es-text-secondary);
  margin-top: 0.15rem;
`;

const choicesGrid = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
`;

const choiceButton = css`
  background: var(--es-surface);
  color: var(--es-text-primary);
  font-size: 2rem;
  box-shadow: var(--es-shadow-sm);
  border: 1px solid var(--es-border);
  
  &:hover {
    background: var(--es-background);
    transform: translateY(-2px);
    box-shadow: var(--es-shadow-md);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const footerStyles = css`
  text-align: center;
  font-size: 0.95rem;
  color: #92796a;
`;

const confettiWrapper = css`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const confettiPiece = css`
  position: absolute;
  font-size: 1.4rem;
  animation: ${confettiFall} 0.9s ease forwards;
`;

const progressBadge = css`
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  border-radius: 999px;
  background: rgba(255, 244, 231, 0.9);
  padding: 0.35rem 0.85rem;
  font-size: 0.85rem;
`;

const Confetti = ({ show }: { show: boolean }) => {
  if (!show) return null;
  return (
    <div css={confettiWrapper} aria-hidden="true">
      {['🎉', '✨', '🎊', '💫', '🌟'].map((emoji, index) => (
        <span
          key={emoji + index}
          css={confettiPiece}
          style={{ left: `${10 + index * 15}%`, animationDelay: `${index * 0.08}s` }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default function App() {
  const [levels, setLevels] = useState<Level[]>(() => generateLevels(LEVEL_COUNT));
  const [levelIndex, setLevelIndex] = useState(0);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [locked, setLocked] = useState(false);
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [madeMistake, setMadeMistake] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  const activeLevel = levels[levelIndex];
  const totalLevels = levels.length;
  const displayPattern = useMemo(
    () =>
      activeLevel
        ? activeLevel.pattern.map((emoji, idx) => (idx === activeLevel.missingIndex && !showAnswer ? placeholder : emoji))
        : [],
    [activeLevel, showAnswer]
  );
  const answer = activeLevel?.pattern[activeLevel.missingIndex] ?? '';
  const nextIndex = (levelIndex + 1) % totalLevels;
  const progressPips = levels.map((_, idx) => {
    if (idx < levelIndex) return '⭐️';
    if (idx === levelIndex) return feedback === 'correct' ? '✅' : '✨';
    return '⚪️';
  });
  const difficulty = levelIndex < 4 ? 'Sprout' : levelIndex < 8 ? 'Explorer' : 'Trailblazer';

  const advance = () => {
    setLevelIndex(nextIndex);
    setFeedback('idle');
    setLocked(false);
    setMadeMistake(false);
    setShowAnswer(false);
    if (nextIndex === 0) {
      setRound((value) => value + 1);
      setLevels(generateLevels(LEVEL_COUNT));
    }
  };

  const handlePick = (choice: string) => {
    if (locked || !activeLevel) return;
    if (choice === answer) {
      setFeedback('correct');
      setLocked(true);
      setShowAnswer(true);
      const earned = madeMistake ? 1 : 2;
      setScore((value) => value + earned);
      setTimeout(advance, 1000);
    } else {
      setFeedback('wrong');
      setMadeMistake(true);
      setTimeout(() => setFeedback('idle'), 450);
    }
  };

  const restart = () => {
    setLevelIndex(0);
    setFeedback('idle');
    setLocked(false);
    setRound(1);
    setScore(0);
    setMadeMistake(false);
    setShowAnswer(false);
    setLevels(generateLevels(LEVEL_COUNT));
  };

  if (!activeLevel) return null;

  const hudItems = [
    { label: 'level', value: `${levelIndex + 1}/${totalLevels}` },
    { label: 'score', value: `${score} ⭐` },
    { label: 'rank', value: difficulty },
    { label: 'theme', value: activeLevel.theme }
  ];

  const actions = (
    <Button type="button" variant="ghost" onClick={restart}>
      Restart
    </Button>
  );

  const boardStatus =
    feedback === 'correct'
      ? css` ${boardBase}; animation: ${pop} 0.6s ease; box-shadow: 0 18px 50px rgb(109 191 139 / 0.35); `
      : feedback === 'wrong'
        ? css` ${boardBase}; animation: ${shake} 0.45s ease; `
        : boardBase;

  return (
    <>
      <Shell title="Pattern Path" hud={<HUD items={hudItems} />} actions={actions}>
        <div css={boardStatus}>
          <div css={progressStyles} aria-label="Progress">
            <span css={progressBadge}>Trail {round}</span>
            {progressPips.map((emoji, idx) => (
              <span key={idx}>{emoji}</span>
            ))}
          </div>

          <div css={patternStyles} aria-live="polite">
            {displayPattern.map((emoji, idx) => (
              <span key={`${emoji}-${idx}`} css={idx === activeLevel.missingIndex && !showAnswer ? blankStyles : undefined}>
                {emoji}
              </span>
            ))}
          </div>

          <p css={promptStyles}>
            Pick the missing emoji
            <span css={promptTagStyles}>{activeLevel.theme}</span>
          </p>

          <div css={choicesGrid}>
            {activeLevel.choices.map((emoji) => (
              <Button
                key={emoji}
                type="button"
                disabled={locked}
                onClick={() => handlePick(emoji)}
                css={choiceButton}
              >
                {emoji}
              </Button>
            ))}
          </div>

          <Confetti show={feedback === 'correct'} />
        </div>
      </Shell>
      <p css={footerStyles}>Trail {round}</p>
    </>
  );
}
