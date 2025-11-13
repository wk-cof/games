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

export interface EmojiTileProps {
  tile: TileState;
  disabled?: boolean;
  matched?: boolean;
  onSelect: () => void;
  index: number;
  size: number;
}

function EmojiTileComponent({ tile, disabled, matched, onSelect, index, size }: EmojiTileProps) {
  const orientation = orientationTransforms[tile.orientation ?? 'upright'];

  return (
    <div css={wrapperStyles} data-grid-index={index}>
      <FlipCard
        front={<span css={[emojiStyles, css`transform: ${orientation};`]}>{tile.emoji}</span>}
        back="❔"
        flipped
        matched={matched}
        disabled={disabled}
        size={size}
        onClick={onSelect}
        ariaLabel={`Emoji tile ${tile.emoji}`}
      />
    </div>
  );
}

export const EmojiTile = memo(EmojiTileComponent);
