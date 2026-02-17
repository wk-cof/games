import React from "react";

interface SettingsProps {
    speed: number;
    setSpeed: (speed: number) => void;
}

export const Settings: React.FC<SettingsProps> = ({ speed, setSpeed }) => {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontWeight: "bold" }}>Game Speed: {speed}</span>
                <input
                    type="range"
                    min="1"
                    max="10"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    style={{ width: "100%" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#666" }}>
                    <span>Slow</span>
                    <span>Fast</span>
                </div>
            </label>
        </div>
    );
};
