import { css } from '@emotion/react';
import { Button } from '@emoji-minis/kit';
import type { GameMode } from '../types/game';

export type CelebrationOverlayProps = {
  moves: number;
  mode: GameMode;
  playerScores: number[];
  onRestart: () => void;
};

const formatPairs = (value: number) =>
  `${value} pair${value === 1 ? '' : 's'}`;

const overlayStyles = css`
  position: absolute;
  inset: 0;
  background: rgb(99 102 241 / 0.12);
  display: grid;
  place-items: center;
  backdrop-filter: blur(3px);
  animation: emogenius-grow 280ms ease forwards;

  @keyframes emogenius-grow {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const cardStyles = css`
  background: #ffffff;
  border-radius: var(--emoji-radius-lg);
  padding: 2rem;
  text-align: center;
  box-shadow: 0 20px 45px rgb(99 102 241 / 0.28);
  display: grid;
  gap: var(--emoji-spacing-md);
  max-width: 320px;
`;

const emojiStyles = css`
  font-size: 2.6rem;
`;

const headingStyles = css`
  margin: 0;
  font-size: 1.6rem;
  color: #4338ca;
`;

const messageStyles = css`
  margin: 0;
  color: #4c1d95;
  font-weight: 600;
`;

const scoreStyles = css`
  margin: 0;
  font-size: 0.95rem;
  color: #6b21a8;
  font-weight: 500;
`;

export function CelebrationOverlay({
  moves,
  mode,
  playerScores,
  onRestart
}: CelebrationOverlayProps) {
  const isMultiplayer = mode === 'hotseat';

  let heading = 'Brilliant memory!';
  let message =
    moves > 0
      ? `You reunited every buddy in ${moves} move${moves === 1 ? '' : 's'}!`
      : 'You reunited every buddy!';
  let scoreLine: string | null = null;

  if (isMultiplayer) {
    const resolvedScores = playerScores.length ? playerScores : [0, 0];
    const maxScore = Math.max(...resolvedScores);
    const winners = resolvedScores
      .map((score, index) => ({ score, index }))
      .filter(({ score }) => score === maxScore);

    if (winners.length > 1) {
      heading = "It's a tie!";
      message = `Both players found ${formatPairs(maxScore)}.`;
    } else {
      const winnerIndex = winners[0]?.index ?? 0;
      heading = `Player ${winnerIndex + 1} wins!`;
      message = `They found ${formatPairs(maxScore)}.`;
    }

    scoreLine = `Final score — P1 ${resolvedScores[0] ?? 0} • P2 ${resolvedScores[1] ?? 0}`;
  }

  return (
    <div css={overlayStyles} role="dialog" aria-modal="true">
      <div css={cardStyles}>
        <span css={emojiStyles} aria-hidden="true">
          🎊
        </span>
        <h2 css={headingStyles}>{heading}</h2>
        <p css={messageStyles}>{message}</p>
        {scoreLine && <p css={scoreStyles}>{scoreLine}</p>}
        <Button type="button" onClick={onRestart}>
          Play again
        </Button>
      </div>
    </div>
  );
}

export default CelebrationOverlay;
