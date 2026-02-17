import React from 'react';
import { CellState } from '../types';
import { Cell } from './Cell';

interface BoardProps {
    grid: CellState[][];
    onCellClick: (row: number, col: number) => void;
    onCellContextMenu: (e: React.MouseEvent, row: number, col: number) => void;
}

export const Board = ({ grid, onCellClick, onCellContextMenu }: BoardProps) => {
    if (!grid || grid.length === 0) return null;

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${grid[0].length}, 30px)`,
                gap: 1,
                backgroundColor: '#9e9e9e',
                padding: 4,
                border: '4px outset #eeeeee',
                width: 'fit-content',
                margin: '0 auto'
            }}
        >
            {grid.map((row, rIndex) =>
                row.map((cell, cIndex) => (
                    <Cell
                        key={`${rIndex}-${cIndex}`}
                        cell={cell}
                        onClick={onCellClick}
                        onContextMenu={onCellContextMenu}
                    />
                ))
            )}
        </div>
    );
};
