import { useState } from "react";
import { Shell, SettingsDialog, Button, useLocalStorage, SoundProvider } from "@emoji-minis/kit";
import { useTetris } from "./hooks/useTetris";
import { useTetrisMusic } from "./hooks/useTetrisMusic";
import { GameBoard } from "./components/GameBoard";
import { NextPiece } from "./components/NextPiece";
import { Settings } from "./components/Settings";

function TetrisGame() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Game Speed: 1 (Slow) to 10 (Fast). Default 5.
    const [speed, setSpeed] = useLocalStorage<number>("tetris-speed", 5);

    const {
        grid,
        score,
        level,
        gameOver,
        nextPiece,
        isPlaying,
        isPaused,
        togglePause,
        resetGame,
        moveLeft,
        moveRight,
        rotate,
        drop,
        hardDrop,
        clearingLines
    } = useTetris({ speed });

    const { isMusicEnabled, toggleMusic } = useTetrisMusic(isPlaying && !isPaused && !gameOver);

    return (
        <Shell
            title="Tetris"
            actions={
                <>
                    <Button
                        variant="ghost"
                        onClick={(e) => { e.currentTarget.blur(); toggleMusic(); }}
                        aria-label={isMusicEnabled ? "Mute Music" : "Play Music"}
                        style={{ padding: "0.5rem" }}
                    >
                        {isMusicEnabled ? "🎵" : "🔇"}
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={(e) => { e.currentTarget.blur(); setIsSettingsOpen(true); }}
                        aria-label="Settings"
                        style={{ padding: "0.5rem" }}
                    >
                        ⚙️
                    </Button>
                </>
            }
        >
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
                touchAction: "none" // Prevent zooming/scrolling on mobile while playing
            }}>
                <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
                    <GameBoard
                        grid={grid}
                        clearingLines={clearingLines}
                        currentPiece={null}
                    />

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <NextPiece piece={nextPiece} />

                        <div style={{
                            background: "#333",
                            color: "#fff",
                            padding: "1rem",
                            borderRadius: "0.5rem",
                            minWidth: "120px"
                        }}>
                            <div>Score: {score}</div>
                            <div>Level: {level}</div>
                        </div>

                        <Button onClick={(e) => { e.currentTarget.blur(); togglePause(); }}>
                            {isPlaying && !isPaused ? "Pause" : (gameOver ? "Game Over" : (isPaused ? "Resume" : "Start"))}
                        </Button>

                        {gameOver && (
                            <Button onClick={(e) => { e.currentTarget.blur(); resetGame(); }} variant="solid">
                                New Game
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <SettingsDialog
                open={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                title="Settings"
            >
                <Settings speed={speed} setSpeed={setSpeed} />
            </SettingsDialog>
        </Shell>
    );
}

function App() {
    return (
        <SoundProvider>
            <TetrisGame />
        </SoundProvider>
    );
}

export default App;
