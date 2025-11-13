import { css } from '@emotion/react';
import {
  DIFFICULTIES,
  EMOJI_THEMES,
  type Difficulty,
  type ThemeKey
} from '../constants/gameConfig';
import type { GameMode } from '../types/game';

export type ControlsPanelProps = {
  theme: ThemeKey;
  difficulty: Difficulty;
  mode: GameMode;
  onThemeChange: (theme: ThemeKey) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onModeChange: (mode: GameMode) => void;
};

const rootStyles = css`
  display: grid;
  gap: var(--emoji-spacing-md);
`;

const rowStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: var(--emoji-spacing-sm);
  align-items: center;
`;

const labelStyles = css`
  font-weight: 600;
  min-width: 120px;
`;

const selectStyles = css`
  border-radius: var(--emoji-radius-md);
  border: 1px solid rgb(217 221 232 / 1);
  padding: 0.5rem 0.85rem;
  background: rgb(248 250 252 / 1);
  min-width: 200px;
  font-weight: 600;
`;

export function ControlsPanel({
  theme,
  difficulty,
  mode,
  onThemeChange,
  onDifficultyChange,
  onModeChange
}: ControlsPanelProps) {
  return (
    <section css={rootStyles} aria-label="Game settings">
      <div css={rowStyles}>
        <label css={labelStyles} htmlFor="mode-select">
          Game mode
        </label>
        <select
          id="mode-select"
          value={mode}
          css={selectStyles}
          onChange={(event) => onModeChange(event.target.value as GameMode)}
        >
          <option value="solo">Solo</option>
          <option value="hotseat">2 Players (Hot Seat)</option>
        </select>
      </div>
      <div css={rowStyles}>
        <label css={labelStyles} htmlFor="theme-select">
          Theme
        </label>
        <select
          id="theme-select"
          value={theme}
          css={selectStyles}
          onChange={(event) => onThemeChange(event.target.value as ThemeKey)}
        >
          {Object.keys(EMOJI_THEMES).map((key) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <div css={rowStyles}>
        <label css={labelStyles} htmlFor="difficulty-select">
          Difficulty
        </label>
        <select
          id="difficulty-select"
          value={difficulty}
          css={selectStyles}
          onChange={(event) =>
            onDifficultyChange(event.target.value as Difficulty)
          }
        >
          {Object.entries(DIFFICULTIES).map(([key, config]) => (
            <option key={key} value={key}>
              {config.label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}

export default ControlsPanel;
