import { css } from '@emotion/react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { EmojiTile } from './EmojiTile';
import type { TileState } from '../../game/types';
import { useArrowNavigation } from '../../hooks/useArrowNavigation';

export interface GameBoardProps {
  tiles: TileState[];
  disabled?: boolean;
  revealOdd?: boolean;
  onSelectTile: (tileId: string) => void;
  feedback?: { tileId: string; status: 'correct' | 'wrong' } | null;
}

const boardStyles = css`
  width: 100%;
  height: min(70vh, 640px);
  max-width: min(70vh, 640px);
  min-height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const gridStyles = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.5rem);
  width: 100%;
`;

const GAP_PX = 24;

export function GameBoard({ tiles, disabled, revealOdd, onSelectTile, feedback }: GameBoardProps) {
  const { containerRef, handleKeyDown } = useArrowNavigation({
    columns: 2,
    total: tiles.length,
    disabled,
  });
  const gridRef = useRef<HTMLDivElement | null>(null);
  const [cardSize, setCardSize] = useState(180);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useLayoutEffect(() => {
    const node = gridRef.current;
    if (!node) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry.contentRect.width;
      const nextSize = Math.max(120, Math.min(220, (width - GAP_PX) / 2));
      setCardSize(nextSize);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setSelectedId(null);
  }, [tiles]);

  const handleSelect = (tileId: string) => {
    if (disabled) return;
    setSelectedId(tileId);
    onSelectTile(tileId);
  };

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node;
    gridRef.current = node;
  }, [containerRef]);

  return (
    <div css={boardStyles}>
      <div
        css={gridStyles}
        ref={setRefs}
        onKeyDown={handleKeyDown}
        role="grid"
        aria-label="Emoji selection grid"
        aria-disabled={disabled}
      >
        {tiles.map((tile, index) => (
          <EmojiTile
            key={tile.id}
            tile={tile}
            disabled={disabled}
            index={index}
            onSelect={() => handleSelect(tile.id)}
            size={cardSize}
            matched={tile.isOdd && (revealOdd || tile.id === selectedId)}
            status={feedback?.tileId === tile.id ? feedback.status : undefined}
          />
        ))}
      </div>
    </div>
  );
}
