import React, { useState } from "react";
import { useMinesweeper } from "./hooks/useMinesweeper";
import { Board } from "./components/Board";
import { Difficulty } from "./types";
import { Button } from "@emoji-minis/kit";
import { useSound } from "@emoji-minis/kit";
import clickSound from "./assets/sounds/click.mp3";
import successSound from "./assets/sounds/success.mp3";
import errorSound from "./assets/sounds/error.mp3";
import { motion, AnimatePresence } from "framer-motion";

function App() {
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const { grid, gameState, minesLeft, resetGame, revealCell, toggleFlag } = useMinesweeper(difficulty);

    const { play: playClick } = useSound(clickSound);
    const { play: playSuccess } = useSound(successSound);
    const { play: playError } = useSound(errorSound);

    const handleCellClick = (row: number, col: number) => {
        playClick();
        revealCell(row, col);
    };

    const handleCellContextMenu = (e: React.MouseEvent, row: number, col: number) => {
        e.preventDefault();
        playClick();
        toggleFlag(row, col);
    };

    React.useEffect(() => {
        if (gameState === 'won') playSuccess();
        if (gameState === 'lost') playError();
    }, [gameState, playSuccess, playError]);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 20,
            fontFamily: 'sans-serif',
            minHeight: '100vh',
            backgroundColor: '#f0f0f0'
        }}>
            <h1 style={{ marginBottom: 10 }}>Emoji Minesweeper 💣</h1>

            <div style={{ marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
                <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="easy">Easy (9x9)</option>
                    <option value="medium">Medium (16x16)</option>
                    <option value="hard">Hard (16x30)</option>
                </select>

                <div style={{
                    padding: '8px 16px',
                    backgroundColor: '#333',
                    color: '#fff',
                    borderRadius: 4,
                    fontFamily: 'monospace',
                    fontSize: 18,
                    minWidth: 40,
                    textAlign: 'center'
                }}>
                    {minesLeft}
                </div>

                <Button onClick={resetGame} variant="solid">
                    {gameState === 'playing' ? '🙂' : gameState === 'won' ? '😎' : '😵'}
                </Button>
            </div>

            <Board
                grid={grid}
                onCellClick={handleCellClick}
                onCellContextMenu={handleCellContextMenu}
            />

            <AnimatePresence>
                {gameState !== 'playing' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        style={{ marginTop: 20, fontSize: 32, fontWeight: 'bold' }}
                    >
                        {gameState === 'won' ? 'You Won! 🎉' : 'Game Over 💥'}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
