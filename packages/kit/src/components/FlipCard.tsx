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
  border-radius: 18px;
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
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: var(--em-card-font-size, clamp(1.75rem, 6vw, 2.7rem));
  box-shadow: 0 10px 18px rgba(99, 102, 241, 0.2);
  transition: opacity 180ms ease, background 180ms ease, color 180ms ease,
    box-shadow 200ms ease;
  opacity: 0;
`;

const faceBack = css`
  background: var(--em-card-back-bg, #cfd4ff);
  color: var(--em-card-back-fg, #4338ca);
`;

const faceFront = css`
  background: var(--em-card-front-bg, #ffffff);
  color: var(--em-card-front-fg, var(--emoji-ink));
`;

const faceVisible = css`
  opacity: 1;
`;

const faceMatched = css`
  background: var(--em-card-match-bg, #34d399);
  color: var(--em-card-match-fg, #064e3b);
  box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
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
        '--em-card-font-size': `${Math.max(22, Math.min(size * 0.55, 60))}px`
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
