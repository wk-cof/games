import { css } from '@emotion/react';
import { Shell, Button, HUD } from '@emoji-minis/kit';
import { SimonBoard } from './components/SimonBoard';
import { useGameLogic } from './hooks/useGameLogic';

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

export default function App() {
    const { gameState, score, activeButton, startGame, handleInput } = useGameLogic();

    const hudItems = [
        { label: 'Score', value: score.toString() }
    ];

    let message = "Watch the pattern...";
    if (gameState === 'idle') message = "Ready to start?";
    if (gameState === 'player_input') message = "Your turn!";
    if (gameState === 'game_over') message = "Game Over!";

    return (
        <Shell
            title="Emoji Echo"
            hud={<HUD items={hudItems} />}
        >
            <div css={containerStyles}>

                <div css={messageStyles}>
                    {message}
                </div>

                <SimonBoard
                    activeButton={activeButton}
                    onInput={handleInput}
                    disabled={gameState !== 'player_input'}
                />

                {gameState === 'idle' && (
                    <div css={css`margin-top: 2rem;`}>
                        <Button onClick={startGame}>Start Game</Button>
                    </div>
                )}

                {gameState === 'game_over' && (
                    <div css={css`margin-top: 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem;`}>
                        <div css={css`font-size: 2rem;`}>Score: {score}</div>
                        <Button onClick={startGame}>Try Again</Button>
                    </div>
                )}

            </div>
        </Shell>
    );
}
