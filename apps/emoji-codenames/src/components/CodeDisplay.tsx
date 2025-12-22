
import { motion, AnimatePresence } from 'framer-motion';
import { Emoji } from '@emoji-minis/kit';
import { EMOJI_TO_LETTER } from '../game/data';

interface CodeDisplayProps {
    targetWord: string;
    revealedLetters: Set<number>; // Indices of letters to reveal
    showAll?: boolean;
    highlightEnding?: boolean; // For World 3 word families
}

export function CodeDisplay({ targetWord, revealedLetters, showAll = false, highlightEnding = false }: CodeDisplayProps) {
    const letters = targetWord.split('');

    // Find the emoji for a given letter. 
    // In a real optimized way we'd use the reverse map, but finding it on fly is cheap enough for 5 items.
    const getEmoji = (char: string) => {
        return Object.entries(EMOJI_TO_LETTER).find(([_, l]) => l === char)?.[0] || '❓';
    };

    return (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
            {letters.map((letter, index) => {
                const isRevealed = showAll || revealedLetters.has(index);
                const emoji = getEmoji(letter);
                const isEnding = highlightEnding && index >= letters.length - 2; // Rough heuristic for CVC

                return (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                        <Emoji symbol={emoji} size="large" />
                        <div style={{
                            width: '3rem',
                            height: '3rem',
                            borderBottom: '4px solid #333',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '2rem',
                            fontWeight: 'bold',
                            color: isEnding && showAll ? 'var(--es-primary)' : 'inherit'
                        }}>
                            <AnimatePresence>
                                {isRevealed && (
                                    <motion.span
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        {letter}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
