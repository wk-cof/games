import { css } from '@emotion/react';
import { Button, SettingsDialog } from '@emoji-minis/kit';
import type { GameState } from '../game/types';

interface GameOverDialogProps {
  state: GameState;
  open: boolean;
  onRestart: () => void;
}

const bodyStyles = css`
  display: grid;
  gap: var(--emoji-spacing-md);
`;

export function GameOverDialog({ state, open, onRestart }: GameOverDialogProps) {
  return (
    <SettingsDialog open={open} onClose={onRestart} title="Game Over">
      <div css={bodyStyles}>
        <p>
          You reached round {state.round} with a score of {state.score}.
        </p>
        <p>
          Keep practising to improve your streaks and reaction time!
        </p>
        <div>
          <Button type="button" onClick={onRestart}>
            Play again
          </Button>
        </div>
      </div>
    </SettingsDialog>
  );
}
