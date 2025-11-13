import { useState } from 'react';
import { css } from '@emotion/react';
import { Shell, Button, HUD, SettingsDialog } from '@emoji-minis/kit';
import type { HUDItem } from '@emoji-minis/kit';
import CelebrationOverlay from './components/CelebrationOverlay';
import ControlsPanel from './components/ControlsPanel';
import GameGrid from './components/GameGrid';
import { useGameEngine } from './hooks/useGameEngine';

const playAreaStyles = css`
  flex: 1;
  width: 100%;
  min-height: 0;
  background: rgba(248, 250, 252, 0.9);
  border-radius: var(--emoji-radius-lg);
  padding: clamp(0.5rem, 2vw, 1.5rem);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.4);
  display: flex;
  align-items: stretch;
  justify-content: center;
`;

const gridFrameStyles = css`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
    theme,
    difficulty,
    mode,
    cols,
    deck,
    isBusy,
    isGameWon,
    stats,
    startNewGame,
    handleCardClick,
    handleThemeChange,
    handleDifficultyChange,
    handleModeChange
  } = useGameEngine();

  const resolvedScores = mode === 'hotseat'
    ? (stats.playerScores.length ? stats.playerScores : [0, 0])
    : stats.playerScores;

  const hudItems: HUDItem[] = [
    { label: 'Moves', value: stats.moves, tone: 'accent' }
  ];

  if (mode === 'hotseat') {
    resolvedScores.forEach((score, index) => {
      hudItems.push({
        label: `Player ${index + 1}`,
        value: score,
        tone: 'neutral',
        active: stats.activePlayerIndex === index
      });
    });
  }

  const headerActions = (
    <>
      <Button type="button" variant="ghost" onClick={startNewGame}>
        Restart
      </Button>
      <Button type="button" variant="ghost" onClick={() => setIsSettingsOpen(true)}>
        Settings
      </Button>
    </>
  );

  return (
    <>
      <Shell title="Emogenius" hud={<HUD items={hudItems} />} actions={headerActions}>
        <div css={playAreaStyles}>
          <div css={gridFrameStyles}>
            <GameGrid
              deck={deck}
              cols={cols}
              isBusy={isBusy}
              onCardClick={handleCardClick}
            />
            {isGameWon && (
              <CelebrationOverlay
                moves={stats.moves}
                mode={mode}
                playerScores={resolvedScores}
                onRestart={startNewGame}
              />
            )}
          </div>
        </div>
      </Shell>
      <SettingsDialog open={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}>
        <ControlsPanel
          theme={theme}
          difficulty={difficulty}
          mode={mode}
          onThemeChange={handleThemeChange}
          onDifficultyChange={handleDifficultyChange}
          onModeChange={handleModeChange}
        />
      </SettingsDialog>
    </>
  );
}
