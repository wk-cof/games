import React, { memo } from 'react';
import { CellState } from '../types';

interface CellProps {
    cell: CellState;
    onClick: (row: number, col: number) => void;
    onContextMenu: (e: React.MouseEvent, row: number, col: number) => void;
}

const NEIGHBOR_COLORS = [
    'transparent', // 0
    'blue',        // 1
    'green',       // 2
    'red',         // 3
    'purple',      // 4
    'maroon',      // 5
    'turquoise',   // 6
    'black',       // 7
    'gray'         // 8
];

export const Cell = memo(({ cell, onClick, onContextMenu }: CellProps) => {
    const { isRevealed, isFlagged, isMine, neighborCount, row, col } = cell;

    const handleClick = () => {
        onClick(row, col);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
        onContextMenu(e, row, col);
    };

    let content = '';
    let backgroundColor = '#bdbdbd'; // Default gray for covered
    let color = 'black';

    if (isRevealed) {
        backgroundColor = '#e0e0e0'; // Lighter gray for revealed
        if (isMine) {
            content = '💣';
            backgroundColor = '#ffcdd2'; // Reddish for mine
        } else if (neighborCount > 0) {
            content = neighborCount.toString();
            color = NEIGHBOR_COLORS[neighborCount] || 'black';
        }
    } else if (isFlagged) {
        content = '🚩';
    }

    return (
        <div
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            style={{
                width: 30,
                height: 30,
                backgroundColor,
                border: isRevealed ? '1px solid #9e9e9e' : '2px outset #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isRevealed ? 'default' : 'pointer',
                fontSize: '18px',
                fontWeight: 'bold',
                color,
                userSelect: 'none',
                boxSizing: 'border-box'
            }}
        >
            {content}
        </div>
    );
});
