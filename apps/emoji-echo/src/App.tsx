import { useState } from "react";
import { css } from "@emotion/react";
import { Shell, Button, HUD, SettingsDialog } from "@emoji-minis/kit";
import { SimonBoard, BUTTON_CONFIG } from "./components/SimonBoard";
import { useGameLogic } from "./hooks/useGameLogic";

const containerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;

const messageStyles = css`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-align: center;
  min-height: 2rem;
  font-weight: bold;
  color: var(--es-text-primary, #333);
`;

const practiceSequenceStyles = css`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 12px;
  min-height: 2.5rem;
`;

export default function App() {
  const { gameState, score, activeButton, startGame, handleInput, sequence } =
    useGameLogic();
  const [showSettings, setShowSettings] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  const hudItems = [{ label: "Score", value: score.toString() }];

  let message = "Watch the pattern...";
  if (gameState === "idle") message = "Ready to start?";
  if (gameState === "player_input") message = "Your turn!";
  if (gameState === "game_over") message = "Game Over!";

  return (
    <Shell
      title="Emoji Echo"
      hud={<HUD items={hudItems} />}
      actions={
        <Button variant="ghost" onClick={() => setShowSettings(true)}>
          ⚙️
        </Button>
      }
    >
      <div css={containerStyles}>
        <SettingsDialog
          open={showSettings}
          onClose={() => setShowSettings(false)}
        >
          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 1rem;
            `}
          >
            <div
              css={css`
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 1rem;
                background: rgba(0, 0, 0, 0.05);
                border-radius: 12px;
              `}
            >
              <div>
                <div
                  css={css`
                    font-weight: bold;
                  `}
                >
                  Practice Mode
                </div>
                <div
                  css={css`
                    font-size: 0.9rem;
                    color: #666;
                  `}
                >
                  Show pattern sequence
                </div>
              </div>
              <label
                css={css`
                  position: relative;
                  display: inline-block;
                  width: 50px;
                  height: 28px;
                `}
              >
                <input
                  type="checkbox"
                  checked={isPracticeMode}
                  onChange={(e) => setIsPracticeMode(e.target.checked)}
                  css={css`
                    opacity: 0;
                    width: 0;
                    height: 0;
                  `}
                />
                <span
                  css={css`
                    position: absolute;
                    cursor: pointer;
                    inset: 0;
                    background-color: ${isPracticeMode ? "#4cd137" : "#ccc"};
                    transition: 0.3s;
                    border-radius: 34px;
                    &:before {
                      position: absolute;
                      content: "";
                      height: 20px;
                      width: 20px;
                      left: 4px;
                      bottom: 4px;
                      background-color: white;
                      transition: 0.3s;
                      border-radius: 50%;
                      transform: ${isPracticeMode
                        ? "translateX(22px)"
                        : "none"};
                    }
                  `}
                ></span>
              </label>
            </div>
          </div>
        </SettingsDialog>

        <div css={messageStyles}>{message}</div>

        {isPracticeMode && sequence.length > 0 && (
          <div css={practiceSequenceStyles}>
            {sequence.map((idx, i) => (
              <div key={i} title="Practice hint">
                {BUTTON_CONFIG[idx].emoji}
              </div>
            ))}
          </div>
        )}

        <SimonBoard
          activeButton={activeButton}
          onInput={handleInput}
          disabled={gameState !== "player_input"}
        />

        {gameState === "idle" && (
          <div
            css={css`
              margin-top: 2rem;
            `}
          >
            <Button onClick={startGame}>Start Game</Button>
          </div>
        )}

        {gameState === "game_over" && (
          <div
            css={css`
              margin-top: 2rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 1rem;
            `}
          >
            <div
              css={css`
                font-size: 2rem;
              `}
            >
              Score: {score}
            </div>
            <Button onClick={startGame}>Try Again</Button>
          </div>
        )}
      </div>
    </Shell>
  );
}
