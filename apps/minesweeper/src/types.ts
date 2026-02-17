export type CellState = {
    isMine: boolean;
    isRevealed: boolean;
    isFlagged: boolean;
    neighborCount: number;
    id: string; // `${row}-${col}`
    row: number;
    col: number;
};

export type GameState = 'playing' | 'won' | 'lost';

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTIES: Record<Difficulty, { rows: number; cols: number; mines: number }> = {
    easy: { rows: 9, cols: 9, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 16, cols: 30, mines: 99 },
};
