import React from "react";
import { TetrominoType, TETROMINOS } from "../hooks/useTetris";

interface NextPieceProps {
    piece: TetrominoType | null;
}

export const NextPiece: React.FC<NextPieceProps> = ({ piece }) => {
    if (!piece) return <div style={{ width: 100, height: 100, background: "#333" }} />;

    const { shape, color } = TETROMINOS[piece];

    // Render a mini grid
    return (
        <div style={{
            background: "#333",
            padding: "1rem",
            borderRadius: "0.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "120px"
        }}>
            <h3 style={{ margin: "0 0 1rem 0", color: "#fff", fontSize: "1rem" }}>Next</h3>
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 20px)",
                gridTemplateRows: "repeat(2, 20px)",
                gap: "2px"
            }}>
                {/* Simple 4x2 grid rendering? Shape coords are arbitrary. */}
                {/* Let's just map the shape to a relative grid. */}
                {Array.from({ length: 8 }).map((_, i) => {
                    const row = Math.floor(i / 4);
                    const col = i % 4;
                    // Check if (row, col) is in shape
                    const exists = shape.some(([y, x]) => y === row && x === col);
                    return (
                        <div key={i} style={{ width: 20, height: 20, fontSize: "16px", lineHeight: 1 }}>
                            {exists ? color : ""}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
