import { useState, useEffect, useCallback, useRef } from "react";

// Tetromino definitions
export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Tetromino {
    shape: number[][]; // [y, x]
    color: string; // Emoji
}

export const TETROMINOS: Record<TetrominoType, Tetromino> = {
    // Cyan -> Blue 🟦
    I: { shape: [[0, 0], [0, 1], [0, 2], [0, 3]], color: '🟦' },
    // Blue -> Brown 🟫
    J: { shape: [[0, 0], [1, 0], [1, 1], [1, 2]], color: '🟫' },
    // Orange -> Orange 🟧
    L: { shape: [[0, 2], [1, 0], [1, 1], [1, 2]], color: '🟧' },
    // Yellow -> Yellow 🟨
    O: { shape: [[0, 0], [0, 1], [1, 0], [1, 1]], color: '🟨' },
    // Green -> Green 🟩
    S: { shape: [[0, 1], [0, 2], [1, 0], [1, 1]], color: '🟩' },
    // Purple -> Purple 🟪
    T: { shape: [[0, 1], [1, 0], [1, 1], [1, 2]], color: '🟪' },
    // Red -> Red 🟥
    Z: { shape: [[0, 0], [0, 1], [1, 1], [1, 2]], color: '🟥' },
};
// Note: Adjusted shapes to be 0-indexed relative to top-left of a bounding box for easier rotation
// Standard rotation systems often revolve around a center point.
// Simple approach: rotate around center of the shape matrix.
// For simplicity here, I will use fixed shapes and a simple rotation algorithm.

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const createEmptyGrid = () =>
    Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));

const getRandomPieceType = (): TetrominoType => {
    const types: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    return types[Math.floor(Math.random() * types.length)];
};

export const useTetris = ({ speed }: { speed: number }) => {
    const [grid, setGrid] = useState<(string | null)[][]>(createEmptyGrid());
    const [activePiece, setActivePiece] = useState<{
        type: TetrominoType;
        position: { x: number; y: number };
        rotation: number; // 0, 1, 2, 3
    } | null>(null);

    const [nextPieceType, setNextPieceType] = useState<TetrominoType>(getRandomPieceType);
    const [score, setScore] = useState(0);
    const [level, setLevel] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Refs to access state in event listeners/intervals
    const gridRef = useRef(grid);
    const activePieceRef = useRef(activePiece);
    const isPlayingRef = useRef(isPlaying);
    const isPausedRef = useRef(isPaused);
    const isGameOverRef = useRef(isGameOver);

    useEffect(() => { gridRef.current = grid; }, [grid]);
    useEffect(() => { activePieceRef.current = activePiece; }, [activePiece]);
    useEffect(() => { isPlayingRef.current = isPlaying; }, [isPlaying]);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);
    useEffect(() => { isGameOverRef.current = isGameOver; }, [isGameOver]);

    const getRotatedShape = useCallback((type: TetrominoType, rotation: number) => {
        // 0: original
        // 1: 90 deg
        // 2: 180 deg
        // 3: 270 deg

        // Basic shape definitions (aligned roughly top-left 4x4 or 3x3)
        // Let's implement a simple rotation: transform (x, y) -> (rows-1-y, x) ?
        // Or just look up standard SRS?
        // For this assignment, simple matrix rotation is sufficient.

        let shape = TETROMINOS[type].shape;

        // Perform N rotations
        for (let r = 0; r < rotation % 4; r++) {
            // Find max dimensions to pivot around center? 
            // Simplest: Map to relative coordinates, rotate (x,y) -> (-y, x), re-normalize?
            // Let's stick to pivot rotation.
            // Center for I is (1.5, 1.5), others (1, 1)?
            // Let's rely on standard matrix rotation.
            // (y, x) -> (x, max_y - y)?
            // Let's manually define shapes per rotation if needed or use a robust algo.

            // Algorithm: 
            // New X = Old Y
            // New Y = MaxDim - 1 - Old X ??

            // Center of rotation approach:
            // x' = y
            // y' = -x

            const center = type === 'I' ? 1.5 : 1;
            shape = shape.map(([y, x]) => {
                const relativeY = y - center;
                const relativeX = x - center;
                // Rotate 90 deg clockwise: (x, -y)
                const newRelX = -relativeY;
                const newRelY = relativeX;
                return [newRelY + center, newRelX + center];
            });

            // Rounding for I (1.5)
            shape = shape.map(([y, x]) => [Math.round(y), Math.round(x)]);
        }
        return shape;
    }, []);

    const checkCollision = useCallback((
        piece: { type: TetrominoType; position: { x: number; y: number }; rotation: number },
        currentGrid: (string | null)[][]
    ) => {
        const shape = getRotatedShape(piece.type, piece.rotation);
        for (const [dy, dx] of shape) {
            const x = piece.position.x + dx;
            const y = piece.position.y + dy;

            // Walls
            if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) return true;
            // Floor checking is y >= BOARD_HEIGHT

            // Existing blocks
            if (y >= 0 && currentGrid[y][x]) return true;
        }
        return false;
    }, [getRotatedShape]);

    const lockPiece = useCallback(() => {
        const piece = activePieceRef.current;
        if (!piece) return;

        const newGrid = gridRef.current.map(row => [...row]);
        const shape = getRotatedShape(piece.type, piece.rotation);
        const color = TETROMINOS[piece.type].color;

        for (const [dy, dx] of shape) {
            const x = piece.position.x + dx;
            const y = piece.position.y + dy;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                newGrid[y][x] = color;
            }
        }

        // Line clearing
        let linesCleared = 0;
        const finalGrid = newGrid.filter(row => {
            const isFull = row.every(cell => cell !== null);
            if (isFull) linesCleared++;
            return !isFull;
        });

        while (finalGrid.length < BOARD_HEIGHT) {
            finalGrid.unshift(Array(BOARD_WIDTH).fill(null));
        }

        setGrid(finalGrid);
        if (linesCleared > 0) {
            const points = [0, 100, 300, 500, 800][linesCleared] || 0;
            setScore(s => s + points * level);
        }

        // Spawn next
        const type = nextPieceType;
        setNextPieceType(getRandomPieceType());

        const newPiece = {
            type,
            position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: -2 }, // Start higher
            rotation: 0
        };

        // Check spawn collision?
        // If we can't place it at y=0?
        // Let's check collision at spawn point
        // Actually we start at y=-2. The collision check handles y < 0 by ignoring grid?
        // `checkCollision`: `if (y >= 0 && currentGrid[y][x])`
        // So usually safe.
        // But we need to move it down immediately? 
        // Usually pieces spawn and fall.

        setActivePiece(newPiece);

        // If immediate collision at spawn (even after gravity?)
        // Simpler: Check collision at start position.
        if (checkCollision(newPiece, finalGrid)) {
            setIsGameOver(true);
            setIsPlaying(false);
            setActivePiece(null);
        }

    }, [nextPieceType, level, getRotatedShape, checkCollision]);

    const move = useCallback((dx: number, dy: number, rotateAction: boolean = false) => {
        if (!activePieceRef.current || !isPlayingRef.current || isPausedRef.current || isGameOverRef.current) return;

        const piece = activePieceRef.current;

        let newRotation = piece.rotation;
        if (rotateAction) {
            newRotation = (piece.rotation + 1) % 4;
        }

        const newPos = {
            x: piece.position.x + dx,
            y: piece.position.y + dy
        };

        const newPieceCandidate = { ...piece, position: newPos, rotation: newRotation };

        // Wall Kicks (Basic)
        // If rotation fails, try moving left/right/up one step?
        // Simple wall kick: if out of bounds x, move back x
        if (rotateAction && checkCollision(newPieceCandidate, gridRef.current)) {
            // Try kicking x+1
            if (!checkCollision({ ...newPieceCandidate, position: { ...newPos, x: newPos.x + 1 } }, gridRef.current)) {
                setActivePiece({ ...newPieceCandidate, position: { ...newPos, x: newPos.x + 1 } });
                return;
            }
            // Try kicking x-1
            if (!checkCollision({ ...newPieceCandidate, position: { ...newPos, x: newPos.x - 1 } }, gridRef.current)) {
                setActivePiece({ ...newPieceCandidate, position: { ...newPos, x: newPos.x - 1 } });
                return;
            }
            // Fail rotation
            return;
        }

        if (!checkCollision(newPieceCandidate, gridRef.current)) {
            setActivePiece(newPieceCandidate);
        } else {
            // Collision usually means stop if moving down
            if (dy > 0 && dx === 0 && !rotateAction) {
                lockPiece();
            }
        }
    }, [checkCollision, lockPiece]);

    const hardDrop = useCallback(() => {
        if (!activePieceRef.current || !isPlayingRef.current || isPausedRef.current) return;

        let currentPiece = activePieceRef.current;
        let y = currentPiece.position.y;

        // Find lowest valid y
        while (true) {
            const nextY = y + 1;
            const candidate = { ...currentPiece, position: { ...currentPiece.position, y: nextY } };
            if (checkCollision(candidate, gridRef.current)) {
                break;
            }
            y = nextY;
        }

        // Update piece to lowest
        activePieceRef.current = { ...currentPiece, position: { ...currentPiece.position, y } };
        setActivePiece(activePieceRef.current);
        lockPiece();

    }, [checkCollision, lockPiece]);

    // Controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlayingRef.current || isPausedRef.current) return;

            switch (e.key) {
                case "ArrowLeft": move(-1, 0); break;
                case "ArrowRight": move(1, 0); break;
                case "ArrowDown": move(0, 1); break;
                case "ArrowUp": move(0, 0, true); break;
                case " ": hardDrop(); break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [move, hardDrop]);

    // Interval
    useEffect(() => {
        if (!isPlaying || isPaused || isGameOver) return;

        // Speed: level 1 = 1000ms, level 10 = 100ms?
        // User Speed Setting overrides level? Or adds to it? 
        // Plan says "adjustable speed". Let's use `speed` prop directly.
        // Speed 1 (Slow) -> 1000ms
        // Speed 10 (Fast) -> 100ms
        const ms = Math.max(100, 1000 - ((speed - 1) * 100));

        const id = setInterval(() => {
            move(0, 1);
        }, ms);
        return () => clearInterval(id);
    }, [isPlaying, isPaused, isGameOver, speed, move]);

    const startGame = () => {
        setGrid(createEmptyGrid());
        setScore(0);
        setLevel(1);
        setIsGameOver(false);
        setIsPlaying(true);
        setIsPaused(false);
        setNextPieceType(getRandomPieceType());
        setActivePiece({
            type: getRandomPieceType(),
            position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: -1 },
            rotation: 0
        });
    };

    const getRenderGrid = () => {
        if (!activePiece) return grid;
        const renderGrid = grid.map(row => [...row]);
        const shape = getRotatedShape(activePiece.type, activePiece.rotation);
        const color = TETROMINOS[activePiece.type].color;

        for (const [dy, dx] of shape) {
            const x = activePiece.position.x + dx;
            const y = activePiece.position.y + dy;
            if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
                renderGrid[y][x] = color;
            }
        }
        return renderGrid;
    };

    return {
        grid: getRenderGrid(),
        score,
        level,
        gameOver: isGameOver,
        nextPiece: nextPieceType, // Return type, component will render
        isPlaying,
        isPaused,
        togglePause: () => {
            if (isGameOver) startGame();
            else if (isPlaying) setIsPaused(!isPaused);
            else startGame();
        },
        resetGame: startGame,
        moveLeft: () => move(-1, 0),
        moveRight: () => move(1, 0),
        rotate: () => move(0, 0, true),
        drop: () => move(0, 1),
        hardDrop
    };
};
