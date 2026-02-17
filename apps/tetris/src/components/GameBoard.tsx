import React from "react";

interface GameBoardProps {
    grid: (string | null)[][];
    currentPiece?: any; // Already merged in grid for now
    clearingLines?: number[];
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, clearingLines = [] }) => {
    return (
        <div style={{
            display: "grid",
            gridTemplateRows: `repeat(${grid.length}, 1fr)`,
            gridTemplateColumns: `repeat(${grid[0].length}, 1fr)`,
            width: "300px",
            height: "600px",
            background: "#0f172a",
            border: "4px solid #334155",
            borderRadius: "8px",
            padding: "2px",
            gap: "1px" // Minimal gap for grid effect
        }}>
            {grid.map((row, y) => {
                const isClearing = clearingLines.includes(y);
                return row.map((cell, x) => (
                    <div
                        key={`${y}-${x}`}
                        style={{
                            background: isClearing ? "white" : (cell ? "transparent" : "#1e293b"),
                            opacity: isClearing ? 0 : 1,
                            transform: isClearing ? "scale(0.8)" : "none",
                            transition: "all 0.3s ease-out",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.5rem",
                            lineHeight: 1
                        }}
                    >
                        {(!isClearing && cell) || ""}
                    </div>
                ));
            })}
        </div>
    );
};
