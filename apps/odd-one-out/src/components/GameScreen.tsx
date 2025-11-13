import { useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { Shell, Button, HUD } from '@emoji-minis/kit';
import type { HUDItem } from '@emoji-minis/kit';
import { useGame } from '../hooks/gameContext';
import { GameBoard } from './board/GameBoard';
import { SettingsPanel } from './SettingsPanel';
import { GameOverDialog } from './GameOverDialog';
import { LiveRegion } from '../a11y/LiveRegion';

const boardWrapperStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: clamp(0.5rem, 2vw, 1.5rem);
`;

const ruleStyles = css`
  margin: 0;
  font-size: 1rem;
  opacity: 0.85;
  text-align: center;
`;

type FeedbackState = {
  tileId: string;
  status: 'correct' | 'wrong';
};

export function GameScreen() {
  const { state, settings, announcement, bestScore, restart, selectTile } = useGame();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<number>();

  const hudItems = useMemo<HUDItem[]>(() => {
    const livesValue = settings.mode === 'practice' ? '∞' : Math.max(0, state.lives);
    return [
      { label: 'round', value: state.round, tone: 'accent' },
      { label: 'score', value: state.score },
      { label: 'best', value: bestScore, tone: state.score >= bestScore && bestScore > 0 ? 'success' : 'neutral', active: state.score >= bestScore && bestScore > 0 },
      { label: 'streak', value: state.streak },
      { label: 'lives', value: livesValue },
      { label: 'time', value: Number.isFinite(state.timeLeftMs) ? `${(state.timeLeftMs / 1000).toFixed(state.timeLeftMs >= 1000 ? 1 : 2)}s` : '∞' },
    ];
  }, [state, bestScore, settings.mode]);

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleTileSelect = (tileId: string) => {
    if (isAnimating || state.status !== 'running') {
      return;
    }
    const tile = state.tiles.find((entry) => entry.id === tileId);
    if (!tile) return;
    const status: FeedbackState['status'] = tile.isOdd ? 'correct' : 'wrong';
    setFeedback({ tileId, status });
    setIsAnimating(true);
    timeoutRef.current = window.setTimeout(() => {
      selectTile(tileId);
      setIsAnimating(false);
      setFeedback(null);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const actions = (
    <div
      css={css`
        display: flex;
        gap: var(--emoji-spacing-sm);
        flex-wrap: wrap;
      `}
    >
      <Button type="button" variant="ghost" onClick={restart}>
        Restart
      </Button>
      <Button type="button" variant="ghost" onClick={handleOpenSettings}>
        Settings
      </Button>
    </div>
  );

  return (
    <>
      <LiveRegion message={announcement} />
      <Shell
        title="Odd One Out"
        hud={<HUD items={hudItems} />}
        actions={actions}
      >
        <div css={boardWrapperStyles}>
          <GameBoard
            tiles={state.tiles}
            disabled={isAnimating || state.status !== 'running'}
            revealOdd={state.status === 'lost'}
            onSelectTile={handleTileSelect}
            feedback={feedback}
          />
        </div>
        <p css={ruleStyles}>{state.rule.description || 'Pick the odd one out!'}</p>
      </Shell>
      <SettingsPanel open={isSettingsOpen} onClose={handleCloseSettings} />
      <GameOverDialog open={state.status === 'lost'} state={state} onRestart={restart} />
    </>
  );
}
