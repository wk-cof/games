import type { CSSProperties, ReactNode } from 'react';
import { css } from '@emotion/react';

export type FlipCardProps = {
  front: ReactNode;
  back: ReactNode;
  flipped?: boolean;
  matched?: boolean;
  disabled?: boolean;
  size?: number;
  onClick?: () => void;
  ariaLabel?: string;
};

const cardBase = css`
  width: var(--em-card-size, clamp(60px, 11vw, 96px));
  height: var(--em-card-size, clamp(60px, 11vw, 96px));
  border: none;
  padding: 0;
  background: transparent;
  border-radius: var(--emoji-radius-md);
  position: relative;
  cursor: pointer;

  &:disabled {
    opacity: 0.9;
    cursor: not-allowed;
  }
`;

const peekStyles = css`
  filter: brightness(1.05);
`;

const matchedStyles = css`
  cursor: default;
`;

const faceBase = css`
  position: absolute;
  inset: 0;
  border-radius: var(--emoji-radius-md);
  display: grid;
  place-items: center;
  font-size: var(--em-card-font-size, clamp(1.75rem, 6vw, 2.7rem));
  box-shadow: var(--es-shadow-md);
  transition: opacity 180ms ease, background 180ms ease, color 180ms ease,
    box-shadow 200ms ease;
  opacity: 0;
  border: 1px solid var(--es-border);
`;

const faceBack = css`
  background: var(--em-card-back-bg, var(--es-primary));
  color: var(--em-card-back-fg, white);
  border: none;
`;

const faceFront = css`
  background: var(--em-card-front-bg, var(--es-surface));
  color: var(--em-card-front-fg, var(--es-text-primary));
`;

const faceVisible = css`
  opacity: 1;
`;

const faceMatched = css`
  background: var(--em-card-match-bg, var(--es-success));
  color: var(--em-card-match-fg, white);
  box-shadow: var(--es-shadow-lg);
  border: none;
`;

export function FlipCard({
  front,
  back,
  flipped = false,
  matched = false,
  disabled = false,
  size,
  onClick,
  ariaLabel
}: FlipCardProps) {
  const sizeStyle: CSSProperties | undefined = size
    ? {
      '--em-card-size': `${size}px`,
      '--em-card-font-size': `${Math.max(22, Math.min(size * 0.55, 120))}px`
    } as CSSProperties
    : undefined;

  return (
    <button
      type="button"
      css={[cardBase, matched && matchedStyles, !matched && flipped && peekStyles]}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={flipped}
      aria-label={ariaLabel}
      style={sizeStyle}
    >
      <span css={[faceBase, faceBack, !flipped && faceVisible]}>{back}</span>
      <span css={[faceBase, faceFront, flipped && faceVisible, matched && faceMatched]}>{front}</span>
    </button>
  );
}

export default FlipCard;
