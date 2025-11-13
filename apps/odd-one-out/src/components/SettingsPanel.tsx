import { css } from '@emotion/react';
import { Button, SettingsDialog } from '@emoji-minis/kit';
import { useGame } from '../hooks/gameContext';
import type { Mode, PatternType, ThemeId } from '../game/types';
import { THEME_LABELS } from '../data/emojis';

const sectionStyles = css`
  display: grid;
  gap: 0.5rem;
`;

const toggleGroupStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const checkboxRow = css`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-transform: capitalize;
`;

const modes: Mode[] = ['endless', 'practice', 'kid'];
const patterns: PatternType[] = ['category', 'attribute', 'orientation'];

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { settings, state, setMode, togglePattern, setThemes } = useGame();

  const handleThemeToggle = (theme: ThemeId) => {
    const isActive = settings.themes.includes(theme);
    const nextThemes = isActive
      ? settings.themes.filter((t) => t !== theme)
      : [...settings.themes, theme];
    if (nextThemes.length >= 2) {
      setThemes(nextThemes);
    }
  };

  return (
    <SettingsDialog open={open} onClose={onClose} title="Settings">
      <section css={sectionStyles}>
        <p css={css`margin: 0; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.08em;`}>
          Current hint
        </p>
        <p css={css`margin: 0; opacity: 0.85;`}>
          {state.rule.description || 'Pick the odd one to keep your streak alive!'}
        </p>
      </section>

      <section css={sectionStyles}>
        <p css={css`margin: 0; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.08em;`}>Mode</p>
        <div css={toggleGroupStyles}>
          {modes.map((mode) => (
            <Button
              key={mode}
              type="button"
              variant={settings.mode === mode ? 'solid' : 'ghost'}
              onClick={() => setMode(mode)}
            >
              {mode}
            </Button>
          ))}
        </div>
      </section>

      <section css={sectionStyles}>
        <p css={css`margin: 0; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.08em;`}>
          Pattern types
        </p>
        {patterns.map((pattern) => (
          <label key={pattern} css={checkboxRow}>
            <input
              type="checkbox"
              checked={settings.patterns[pattern]}
              onChange={(event) => togglePattern(pattern, event.target.checked)}
              disabled={settings.mode === 'kid' && pattern !== 'category'}
            />
            <span>{pattern}</span>
          </label>
        ))}
        <small>At least one pattern must remain enabled.</small>
      </section>

      <section css={sectionStyles}>
        <p css={css`margin: 0; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.08em;`}>
          Themes
        </p>
        <div css={toggleGroupStyles}>
          {(Object.keys(THEME_LABELS) as ThemeId[]).map((theme) => {
            const active = settings.themes.includes(theme);
            const canDisable = !active || settings.themes.length > 2;
            return (
              <Button
                key={theme}
                type="button"
                variant={active ? 'solid' : 'ghost'}
                disabled={!canDisable}
                onClick={() => handleThemeToggle(theme)}
              >
                {THEME_LABELS[theme]}
              </Button>
            );
          })}
        </div>
        <small>Choose at least two themes for better variety.</small>
      </section>

      <div css={css`display: flex; justify-content: flex-end;`}>
        <Button type="button" onClick={onClose}>
          Close
        </Button>
      </div>
    </SettingsDialog>
  );
}
