import { css } from '@emotion/react';
import { memo } from 'react';
import { FlipCard } from '@emoji-minis/kit';
import type { TileState } from '../../game/types';

const orientationTransforms: Record<string, string> = {
  upright: 'rotate(0deg)',
  'tilt-left': 'rotate(-12deg)',
  'tilt-right': 'rotate(12deg)',
  'flip-horizontal': 'scaleX(-1)'
};

const wrapperStyles = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const emojiStyles = css`
  display: inline-block;
  transition: transform 200ms ease;
`;

const correctAnimation = css`
  animation: oddCardCorrect 600ms ease;

  @keyframes oddCardCorrect {
    0% {
      transform: scale(0.97);
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      transform: scale(1);
    }
  }
`;

const wrongAnimation = css`
  animation: oddCardWrong 600ms ease;

  @keyframes oddCardWrong {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-6px);
    }
    50% {
      transform: translateX(6px);
    }
    75% {
      transform: translateX(-4px);
    }
  }
`;

export interface EmojiTileProps {
  tile: TileState;
  disabled?: boolean;
  matched?: boolean;
  status?: 'correct' | 'wrong';
  onSelect: () => void;
  index: number;
  size: number;
}

function EmojiTileComponent({ tile, disabled, matched, status, onSelect, index, size }: EmojiTileProps) {
  const orientation = orientationTransforms[tile.orientation ?? 'upright'];
  const wrapperClass = [wrapperStyles];
  if (status === 'correct') {
    wrapperClass.push(correctAnimation);
  } else if (status === 'wrong') {
    wrapperClass.push(wrongAnimation);
  }

  return (
    <div css={wrapperClass} data-grid-index={index}>
      <FlipCard
        front={<span css={[emojiStyles, css`transform: ${orientation};`]}>{tile.emoji}</span>}
        back="❔"
        flipped
        matched={matched || status === 'correct'}
        disabled={disabled}
        size={size}
        onClick={onSelect}
        ariaLabel={`Emoji tile ${tile.emoji}`}
      />
    </div>
  );
}

export const EmojiTile = memo(EmojiTileComponent);
