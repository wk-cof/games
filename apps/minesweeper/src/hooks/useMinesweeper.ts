import { useState, useCallback, useEffect } from 'react';
import { CellState, Difficulty, DIFFICULTIES, GameState } from '../types';

const getNeighbors = (row: number, col: number, rows: number, cols: number) => {
    const neighbors: { row: number; col: number }[] = [];
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < cols && !(r === row && c === col)) {
                neighbors.push({ row: r, col: c });
            }
        }
    }
    return neighbors;
};

const createBoard = (rows: number, cols: number, mines: number): CellState[][] => {
    // Initialize empty grid
    let grid: CellState[][] = Array(rows).fill(null).map((_, r) =>
        Array(cols).fill(null).map((_, c) => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            neighborCount: 0,
            id: `${r}-${c}`,
            row: r,
            col: c,
        }))
    );

    // Place mines
    let minesPlaced = 0;
    while (minesPlaced < mines) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        if (!grid[r][c].isMine) {
            grid[r][c].isMine = true;
            minesPlaced++;
        }
    }

    // Calculate neighbor counts
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (!grid[r][c].isMine) {
                const neighbors = getNeighbors(r, c, rows, cols);
                let count = 0;
                neighbors.forEach(({ row, col }) => {
                    if (grid[row][col].isMine) count++;
                });
                grid[r][c].neighborCount = count;
            }
        }
    }

    return grid;
};

export const useMinesweeper = (difficulty: Difficulty) => {
    const [grid, setGrid] = useState<CellState[][]>([]);
    const [gameState, setGameState] = useState<GameState>('playing');
    const [minesLeft, setMinesLeft] = useState(0);
    const [rows, setRows] = useState(0);
    const [cols, setCols] = useState(0);

    const resetGame = useCallback(() => {
        const config = DIFFICULTIES[difficulty];
        setRows(config.rows);
        setCols(config.cols);
        setGrid(createBoard(config.rows, config.cols, config.mines));
        setGameState('playing');
        setMinesLeft(config.mines);
    }, [difficulty]);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    const revealCell = useCallback((row: number, col: number) => {
        if (gameState !== 'playing') return;

        setGrid(prev => {
            const newGrid = [...prev.map(r => [...r])]; // Deep copy
            const cell = newGrid[row][col];

            if (cell.isRevealed || cell.isFlagged) return prev;

            if (cell.isMine) {
                // Game Over
                setGameState('lost');
                // Reveal all mines
                newGrid.forEach(r => r.forEach(c => {
                    if (c.isMine) c.isRevealed = true;
                }));
                return newGrid;
            }

            // Flood fill reveal
            const queue = [{ row, col }];
            while (queue.length > 0) {
                const { row: r, col: c } = queue.shift()!;
                if (newGrid[r][c].isRevealed) continue;

                newGrid[r][c].isRevealed = true;

                if (newGrid[r][c].neighborCount === 0) {
                    const neighbors = getNeighbors(r, c, rows, cols);
                    neighbors.forEach(n => {
                        if (!newGrid[n.row][n.col].isRevealed && !newGrid[n.row][n.col].isFlagged) {
                            queue.push(n); // BFS
                        }
                    });
                }
            }

            // Check win condition
            let unrevealedSafeCells = 0;
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (!newGrid[r][c].isMine && !newGrid[r][c].isRevealed) {
                        unrevealedSafeCells++;
                    }
                }
            }

            if (unrevealedSafeCells === 0) {
                setGameState('won');
                // Flag all mines
                newGrid.forEach(r => r.forEach(c => {
                    if (c.isMine) c.isFlagged = true;
                }));
                setMinesLeft(0);
            }

            return newGrid;
        });
    }, [gameState, rows, cols]);

    const toggleFlag = useCallback((row: number, col: number) => {
        if (gameState !== 'playing') return;

        setGrid(prev => {
            const newGrid = [...prev.map(r => [...r])];
            const cell = newGrid[row][col];
            if (cell.isRevealed) return prev;

            cell.isFlagged = !cell.isFlagged;
            setMinesLeft(prevMines => cell.isFlagged ? prevMines - 1 : prevMines + 1);

            return newGrid;
        });
    }, [gameState]);

    return { grid, gameState, minesLeft, resetGame, revealCell, toggleFlag };
};
