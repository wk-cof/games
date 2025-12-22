
import { useGameEngine } from '../game/engine';
import { GameLayout } from './GameLayout';
import { MappingLegend } from './MappingLegend';
import { WorldOneView } from './WorldOneView';
import { WorldTwoView } from './WorldTwoView';
import { WorldThreeView } from './WorldThreeView';
import { WorldFourView } from './WorldFourView';
import { WORLD_DESCRIPTIONS } from '../game/data';
import { Button, Emoji } from '@emoji-minis/kit';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

function Card({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
    return (
        <div style={{
            background: 'var(--es-surface)',
            borderRadius: 'var(--emoji-radius-md)',
            boxShadow: 'var(--es-shadow-md)',
            ...style
        }}>
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
        checkAnswer
    } = useGameEngine();

    useEffect(() => {
        if (gameState === 'success') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [gameState]);

    if (gameState === 'complete') {
        return (
            <GameLayout title="You Win!" levelProgress="All Levels Complete">
                <Card style={{ padding: '3rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                    <h2>Amazing job!</h2>
                    <p>You are a true Emoji Agent.</p>
                    <Button onClick={() => window.location.reload()}>Play Again</Button>
                </Card>
            </GameLayout>
        );
    }

    const renderWorld = () => {
        // Show success state overlay or just let the view handle it?
        // Let's have a simple "Next Level" overlay if success, 
        // but typically we might want the view to verify first.
        // Actually, the engine handles 'success' state.

        if (gameState === 'success') {
            return (
                <Card style={{ padding: '2rem', textAlign: 'center' }}>
                    <h2 style={{ color: 'var(--es-success)' }}>Correct!</h2>
                    <div style={{ fontSize: '3rem', margin: '1rem 0' }}>✅</div>
                    <Button autoFocus size="large" onClick={nextLevel}>Next Level</Button>
                </Card>
            );
        }

        switch (currentWorldId) {
            case 1:
                return <WorldOneView level={currentLevel} onCorrect={() => { }} />; // The view calls checkAnswer usually, but here engine does it.
            // Wait, the views I wrote take onCorrect. 
            // Need to pass the engine's checkAnswer to the view's internal logic?
            // Actually the views currently just call onCorrect when they THINK they are right.
            // But the engine has the source of truth.
            // Let's adapt: The views should call `checkAnswer` from engine.
            // But my views currently have internal `handleGuess` logic that might duplicate.
            // Let's refactor views slightly or wrap them? 
            // For now, let's pass a wrapper.
        }
    };

    // Re-evaluating the View props.
    // My Views do: handleGuess -> if match -> set local success -> onCorrect()
    // The engine also has checkAnswer. 
    // Let's just pass `checkAnswer` as part of the props if needed, but my views already have local logic.
    // Simple integration:
    // View.onCorrect -> engine.checkAnswer(targetWord) (implicitly true since view checked it) -> engine sets success

    const handleViewCorrect = () => {
        // We assume view validated it.
        // We can force a checkAnswer call to trigger the engine state change
        // or expose a direct method "forceSuccess" on engine if we trust the view.
        // For now, let's just re-validate with targetWord to be safe/consistent.
        // But wait, the view takes user input.
        // Let's change the pattern: The View should receive `onGuess` and return result?
        // Or View manages UI interactions and tells parent "User solved it".
        // Yes, View.onCorrect is "User solved it".
        // So:
        nextLevel();
        // specific issue: nextLevel skips the "Success" screen if I call it immediately.
        // I generally want: View calls onCorrect -> Engine setSuccess -> UI shows Success Screen -> User clicks Next.
        // But my engine `checkAnswer` sets success.
        // So: View.onCorrect -> engine.checkAnswer(level.targetWord) -> sets success -> re-render shows Success Card.
    };

    // Actually, looking at my Views, they take `onCorrect`.
    // Code: `if (guess === level.targetWord) { ... setTimeout(onCorrect, 1500) }`
    // So when onCorrect is called, the view is already showing success state.
    // Then we probably want to transition to the REAL success state in engine.

    const onWorldCorrect = () => {
        // Trigger engine success
        // Since the view verified it, we can just "pass" the level check
        // But checkAnswer requires the string.
        // Let's genericize
        const result = nextLevel; // No, checkAnswer('WORD') triggers 'success', nextLevel moves on.
        // The engine `checkAnswer` sets `gameState` to `success`.
        // So validating again is fine.
        // BUT, I need the `checkAnswer` to be available to call.
        // And `checkAnswer` expects the word.

        // Hacky but safe:
        // The view verified it matches targetWord.
        // So we call checkAnswer(currentLevel.targetWord).
        // But wait, `useGameEngine` checkAnswer implementation:
        // `if (answer === currentLevel.targetWord) setGameState('success')`
        // So yes, this works.
    };

    return (
        <GameLayout
            title={WORLD_DESCRIPTIONS[currentWorldId as keyof typeof WORLD_DESCRIPTIONS]}
            levelProgress={`Level ${currentLevelProgress} / ${totalLevels}`}
        >
            <div style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                {/* Mapping Legend Toggle could go here if global */}
            </div>

            {/* <MappingLegend /> */}

            {gameState === 'success' ? (
                <Card style={{ padding: '2rem', textAlign: 'center', minWidth: '300px' }}>
                    <h2 style={{ color: 'var(--es-success)', marginBottom: '1rem' }}>Success!</h2>
                    <Emoji size="large">🎉</Emoji>
                    <div style={{ marginTop: '2rem' }}>
                        <Button autoFocus size="large" onClick={nextLevel}>Next Level</Button>
                    </div>
                </Card>
            ) : (
                <>
                    {currentWorldId === 1 && <WorldOneView level={currentLevel} onCorrect={() => checkAnswer(currentLevel.targetWord)} />}
                    {currentWorldId === 2 && <WorldTwoView level={currentLevel} onCorrect={() => checkAnswer(currentLevel.targetWord)} />}
                    {currentWorldId === 3 && <WorldThreeView level={currentLevel} onCorrect={() => checkAnswer(currentLevel.targetWord)} />}
                    {currentWorldId === 4 && <WorldFourView level={currentLevel} onCorrect={() => checkAnswer(currentLevel.targetWord)} />}
                </>
            )}
        </GameLayout>
    );

}
