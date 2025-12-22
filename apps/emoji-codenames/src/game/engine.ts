
import { useState, useCallback, useMemo, useEffect } from 'react';
import { LEVELS, LevelConfig, WORD_FAMILIES, EMOJI_TO_LETTER } from './data';

export type GameState = 'playing' | 'success' | 'complete';
export type WorldId = 1 | 2 | 3 | 4;

export interface GameStateData {
    currentLevelId: string;
    unlockedWorlds: number;
    score: number;
}

export function useGameEngine() {
    // Simple persistent state simulation (can use localStorage later)
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [gameState, setGameState] = useState<GameState>('playing');

    const currentLevel = useMemo(() => LEVELS[currentLevelIndex], [currentLevelIndex]);

    const nextLevel = useCallback(() => {
        if (currentLevelIndex < LEVELS.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
            setGameState('playing');
        } else {
            setGameState('complete');
        }
    }, [currentLevelIndex]);

    const checkAnswer = useCallback((answer: string) => {
        if (answer === currentLevel.targetWord) {
            setGameState('success');
            return true;
        }
        return false;
    }, [currentLevel]);

    // World 4 specific: Building code
    // This state might need to be local to the view, or lifted here if we want persistence.
    // For now, let's keep the engine focused on progression and validation.

    return {
        currentLevel,
        currentWorldId: currentLevel.worldId,
        gameState,
        nextLevel,
        checkAnswer,
        totalLevels: LEVELS.length,
        currentLevelProgress: currentLevelIndex + 1
    };
}
