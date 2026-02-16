import { useGameEngine } from "../game/engine";
import { GameLayout } from "./GameLayout";

import { WorldOneView } from "./WorldOneView";
import { WorldTwoView } from "./WorldTwoView";
import { WorldThreeView } from "./WorldThreeView";
import { WorldFourView } from "./WorldFourView";
import { WORLD_DESCRIPTIONS } from "../game/data";
import { Button, Emoji } from "@emoji-minis/kit";
import confetti from "canvas-confetti";
import { useEffect } from "react";

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        background: "var(--es-surface)",
        borderRadius: "var(--emoji-radius-md)",
        boxShadow: "var(--es-shadow-md)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function GameContainer() {
  const {
    currentLevel,
    currentWorldId,
    gameState,
    nextLevel,
    totalLevels,
    currentLevelProgress,
    checkAnswer,
  } = useGameEngine();

  useEffect(() => {
    if (gameState === "success") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [gameState]);

  if (gameState === "complete") {
    return (
      <GameLayout title="You Win!" levelProgress="All Levels Complete">
        <Card style={{ padding: "3rem", textAlign: "center" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>
          <h2>Amazing job!</h2>
          <p>You are a true Emoji Agent.</p>
          <Button onClick={() => window.location.reload()}>Play Again</Button>
        </Card>
      </GameLayout>
    );
  }

  // Re-evaluating the View props.
  // My Views do: handleGuess -> if match -> set local success -> onCorrect()
  // The engine also has checkAnswer.
  // Let's just pass `checkAnswer` as part of the props if needed, but my views already have local logic.
  // Simple integration:
  // View.onCorrect -> engine.checkAnswer(targetWord) (implicitly true since view checked it) -> engine sets success

  // Actually, looking at my Views, they take `onCorrect`.
  // Code: `if (guess === level.targetWord) { ... setTimeout(onCorrect, 1500) }`
  // So when onCorrect is called, the view is already showing success state.
  // Then we probably want to transition to the REAL success state in engine.

  return (
    <GameLayout
      title={
        WORLD_DESCRIPTIONS[currentWorldId as keyof typeof WORLD_DESCRIPTIONS]
      }
      levelProgress={`Level ${currentLevelProgress} / ${totalLevels}`}
    >
      <div
        style={{
          width: "100%",
          marginBottom: "1rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        {/* Mapping Legend Toggle could go here if global */}
      </div>

      {/* <MappingLegend /> */}

      {gameState === "success" ? (
        <Card
          style={{ padding: "2rem", textAlign: "center", minWidth: "300px" }}
        >
          <h2 style={{ color: "var(--es-success)", marginBottom: "1rem" }}>
            Success!
          </h2>
          <Emoji symbol="🎉" size="4rem" />
          <div style={{ marginTop: "2rem" }}>
            <Button autoFocus onClick={nextLevel}>
              Next Level
            </Button>
          </div>
        </Card>
      ) : (
        <>
          {currentWorldId === 1 && (
            <WorldOneView
              level={currentLevel}
              onCorrect={() => checkAnswer(currentLevel.targetWord)}
            />
          )}
          {currentWorldId === 2 && (
            <WorldTwoView
              level={currentLevel}
              onCorrect={() => checkAnswer(currentLevel.targetWord)}
            />
          )}
          {currentWorldId === 3 && (
            <WorldThreeView
              level={currentLevel}
              onCorrect={() => checkAnswer(currentLevel.targetWord)}
            />
          )}
          {currentWorldId === 4 && (
            <WorldFourView
              level={currentLevel}
              onCorrect={() => checkAnswer(currentLevel.targetWord)}
            />
          )}
        </>
      )}
    </GameLayout>
  );
}
