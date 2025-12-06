import { useState, useCallback, useEffect, useRef } from 'react';
import { useSynth } from './useSynth';

export type GameState = 'idle' | 'showing_sequence' | 'player_input' | 'game_over';

export function useGameLogic() {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerInput, setPlayerInput] = useState<number[]>([]);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [score, setScore] = useState(0);

    const { playTone, playError } = useSynth();
    const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    // Clear all pending timeouts when stopping/resetting
    const clearTimeouts = () => {
        timeoutsRef.current.forEach(t => clearTimeout(t));
        timeoutsRef.current = [];
    };

    const startGame = useCallback(() => {
        clearTimeouts();
        setSequence([]);
        setPlayerInput([]);
        setScore(0);
        setGameState('showing_sequence');
        // Start with one random button
        addToSequence([]);
    }, []);

    const addToSequence = (currentSequence: number[]) => {
        const nextItem = Math.floor(Math.random() * 4);
        const newSequence = [...currentSequence, nextItem];
        setSequence(newSequence);
        setPlayerInput([]);
        setGameState('showing_sequence');

        playSequence(newSequence);
    };

    const playSequence = (seq: number[]) => {
        let delay = 500;
        const speed = Math.max(300, 800 - seq.length * 20); // Get faster as you go

        seq.forEach((item, index) => {
            const timeout = setTimeout(() => {
                setActiveButton(item);
                playTone(item, speed / 2000); // Duration depends on speed

                setTimeout(() => setActiveButton(null), speed * 0.6);
            }, delay);

            timeoutsRef.current.push(timeout);
            delay += speed;
        });

        const finalTimeout = setTimeout(() => {
            setGameState('player_input');
        }, delay);
        timeoutsRef.current.push(finalTimeout);
    };

    const handleInput = (index: number) => {
        if (gameState !== 'player_input') return;

        playTone(index);

        // Flash the button
        setActiveButton(index);
        setTimeout(() => setActiveButton(null), 200);

        const newInput = [...playerInput, index];
        setPlayerInput(newInput);

        // Check correctness
        if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
            // Wrong!
            playError();
            setGameState('game_over');
            return;
        }

        // Completed sequence?
        if (newInput.length === sequence.length) {
            setScore(s => s + 1);
            // Wait a bit before next round
            setTimeout(() => {
                addToSequence(sequence);
            }, 1000);
        }
    };

    useEffect(() => {
        return () => clearTimeouts();
    }, []);

    return {
        gameState,
        score,
        activeButton,
        startGame,
        handleInput,
        sequence // exposed for debug/display if needed
    };
}
