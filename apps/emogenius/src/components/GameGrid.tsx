import { useLayoutEffect, useRef, useState } from 'react';
import { css } from '@emotion/react';
import { FlipCard, Emoji } from '@emoji-minis/kit';
import type { Card } from '../types/game';

export type GameGridProps = {
  deck: Card[];
  cols: number;
  isBusy: boolean;
  onCardClick: (index: number) => void;
};

const GRID_GAP = 12;
const MIN_CARD_SIZE = 48;
const MAX_CARD_SIZE = 132;

export function GameGrid({ deck, cols, isBusy, onCardClick }: GameGridProps) {
  const gridRef = useRef<HTMLElement | null>(null);
  const [cardSize, setCardSize] = useState(88);

  useLayoutEffect(() => {
    const element = gridRef.current;
    if (!element) {
      return undefined;
    }

    const rows = Math.max(1, Math.ceil(deck.length / cols));

    const updateSize = () => {
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }

      const usableWidth = rect.width - GRID_GAP * (cols - 1);
      const usableHeight = rect.height - GRID_GAP * (rows - 1);
      const sizeByWidth = usableWidth / cols;
      const sizeByHeight = usableHeight / rows;
      const nextSize = Math.max(
        MIN_CARD_SIZE,
        Math.min(MAX_CARD_SIZE, Math.floor(Math.min(sizeByWidth, sizeByHeight)))
      );
      setCardSize(nextSize);
    };

    updateSize();

    const resizeObserver =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => updateSize())
        : null;

    resizeObserver?.observe(element);
    window.addEventListener('resize', updateSize);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, [cols, deck.length]);

  const gridStyles = css`
    display: grid;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-content: center;
  `;

  return (
    <section
      ref={gridRef}
      css={gridStyles}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${cardSize}px)`,
        gridAutoRows: `${cardSize}px`,
        gap: `${GRID_GAP}px`
      }}
      aria-label="Memory cards"
    >
      {deck.map((card, index) => (
        <FlipCard
          key={card.id}
          front={<Emoji symbol={card.emoji} />}
          back="❔"
          flipped={card.state !== 'hidden'}
          matched={card.state === 'matched'}
          disabled={card.state === 'matched' || isBusy}
          size={cardSize}
          onClick={() => onCardClick(index)}
          ariaLabel={
            card.state === 'hidden'
              ? 'Hidden card'
              : card.state === 'matched'
              ? `Matched ${card.emoji}`
              : `Revealed ${card.emoji}`
          }
        />
      ))}
    </section>
  );
}

export default GameGrid;
