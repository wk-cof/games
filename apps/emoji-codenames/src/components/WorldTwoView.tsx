
import { useState, useEffect } from 'react';
import { Button, useGameSounds } from '@emoji-minis/kit';
import { CodeDisplay } from './CodeDisplay';
import { LevelConfig } from '../game/data';

interface WorldTwoViewProps {
    level: LevelConfig;
    onCorrect: () => void;
}

export function WorldTwoView({ level, onCorrect }: WorldTwoViewProps) {
    const [revealed, setRevealed] = useState<Set<number>>(new Set());
    const { playSuccess, playError } = useGameSounds();

    useEffect(() => {
        setRevealed(new Set());
    }, [level]);

    const handleGuess = (guess: string) => {
        if (guess === level.targetWord) {
            playSuccess();
            const allIndices = new Set(level.targetWord.split('').map((_, i) => i));
            setRevealed(allIndices);
            setTimeout(onCorrect, 1500);
        } else {
            playError();
            // Show one more letter as hint
            setRevealed(prev => {
                const next = new Set(prev);
                // Find first execution unrevealed index
                for (let i = 0; i < level.targetWord.length; i++) {
                    if (!next.has(i)) {
                        next.add(i);
                        break;
                    }
                }
                return next;
            });
        }
    };

    const options = [level.targetWord, ...(level.foils || [])].sort();

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', opacity: 0.7 }}>Read the code!</h2>

            <CodeDisplay targetWord={level.targetWord} revealedLetters={revealed} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                {options.map(option => (
                    <Button
                        key={option}
                        size="large"
                        onClick={() => handleGuess(option)}
                    >
                        {option}
                    </Button>
                ))}
            </div>
        </div>
    );
}
