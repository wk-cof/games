import { css } from "@emotion/react";
import { useState } from "react";

export type GameCardProps = {
  title: string;
  description: string;
  emoji: string;
  color: string;
  href: string;
  isStarred?: boolean;
  onToggleStar?: (e: React.MouseEvent) => void;
};

const cardStyles = (color: string) => css`
  background: var(--es-surface);
  border-radius: var(--emoji-radius-lg);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1rem;
  text-decoration: none;
  color: var(--es-text-primary);
  position: relative;
  aspect-ratio: 1;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--es-shadow-sm);
  border: 1px solid transparent;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--es-shadow-lg);
    border-color: ${color};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const emojiContainerStyles = css`
  font-size: 3.5rem;
  line-height: 1;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: transform 0.2s ease;
`;

const titleStyles = css`
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
  color: var(--es-text-primary);
`;

const descriptionStyles = css`
  font-size: 0.9rem;
  color: var(--es-text-secondary);
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const starButtonStyles = (active: boolean) => css`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: ${active ? 1 : 0.2};
  transition: all 0.2s ease;
  padding: 0.25rem;
  border-radius: 50%;
  z-index: 2;

  &:hover {
    opacity: 1;
    transform: scale(1.1);
    background: rgba(0, 0, 0, 0.05);
  }
`;

export function GameCard({
  title,
  description,
  emoji,
  color,
  href,
  isStarred = false,
  onToggleStar,
}: GameCardProps) {
  const [starred, setStarred] = useState(isStarred);

  const handleStar = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setStarred(!starred);
    onToggleStar?.(e);
  };

  return (
    <a href={href} css={cardStyles(color)}>
      <button
        css={starButtonStyles(starred)}
        onClick={handleStar}
        aria-label={starred ? "Unstar game" : "Star game"}
      >
        ⭐️
      </button>
      <div css={emojiContainerStyles}>{emoji}</div>
      <div>
        <h3 css={titleStyles}>{title}</h3>
        <p css={descriptionStyles}>{description}</p>
      </div>
    </a>
  );
}
