import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { Shell, Button, HUD } from '@emoji-minis/kit';
import { ShadowEmoji, DifficultyStage } from './components/ShadowEmoji';
import { motion } from 'framer-motion';

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵'];

const containerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  gap: 2rem;
  overflow: hidden;
`;

const optionsContainerStyles = css`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const optionButtonStyles = css`
  font-size: 4rem;
  background: white;
  border: 4px solid #eee;
  border-radius: 20px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  
  &:hover {
    transform: scale(1.1);
    border-color: #ddd;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

interface Option {
    id: string;
    emoji: string;
    rotation: number;
    scale: number;
    isCorrect: boolean;
}

export default function App() {
    const [score, setScore] = useState(0);
    const [target, setTarget] = useState<Option | null>(null);
    const [options, setOptions] = useState<Option[]>([]);
    const [stage, setStage] = useState<DifficultyStage>('static');
    const [message, setMessage] = useState('Find the shadow!');

    useEffect(() => {
        startRound(0);
    }, []);

    const calculateStage = (currentScore: number): DifficultyStage => {
        if (currentScore < 3) return 'static';
        if (currentScore < 6) return 'rotate';
        return 'scale';
    };

    const startRound = (currentScore: number) => {
        const currentStage = calculateStage(currentScore);
        setStage(currentStage);

        // Pick base emoji
        const baseEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

        let roundOptions: Option[] = [];
        let correctOption: Option;

        if (currentStage === 'static') {
            // Stage 1: Different emojis
            const distractors = EMOJIS.filter(e => e !== baseEmoji)
                .sort(() => 0.5 - Math.random())
                .slice(0, 2);

            const emojis = [baseEmoji, ...distractors];
            roundOptions = emojis.map(e => ({
                id: Math.random().toString(),
                emoji: e,
                rotation: 0,
                scale: 1,
                isCorrect: e === baseEmoji
            }));

            // For static stage, target matches the base emoji properties
            correctOption = roundOptions.find(o => o.isCorrect)!;

        } else if (currentStage === 'rotate') {
            // Stage 2: Same emoji, different rotations
            const targetRotation = Math.floor(Math.random() * 8) * 45; // 0, 45, 90...

            // Generate distractors with different rotations
            const rotations = [targetRotation];
            while (rotations.length < 3) {
                const r = Math.floor(Math.random() * 8) * 45;
                if (!rotations.includes(r)) rotations.push(r);
            }

            roundOptions = rotations.map(r => ({
                id: Math.random().toString(),
                emoji: baseEmoji,
                rotation: r,
                scale: 1,
                isCorrect: r === targetRotation
            }));

            correctOption = roundOptions.find(o => o.isCorrect)!;

        } else {
            // Stage 3: Same emoji, different scales
            const targetScale = 1;
            // We'll fix target to 1 for shadow, but options will vary.
            // Actually, let's make the shadow have a specific scale and options must match.
            // E.g. Shadow is Small (0.6). Options: 0.6, 1.0, 1.4

            const scales = [0.6, 1.0, 1.4];
            const targetScaleIdx = Math.floor(Math.random() * scales.length);
            const targetVal = scales[targetScaleIdx];

            roundOptions = scales.map(s => ({
                id: Math.random().toString(),
                emoji: baseEmoji,
                rotation: 0,
                scale: s,
                isCorrect: s === targetVal
            }));

            correctOption = roundOptions.find(o => o.isCorrect)!;
        }

        setTarget(correctOption);
        setOptions(roundOptions.sort(() => 0.5 - Math.random()));
        setMessage('Find the shadow!');
    };

    const handleGuess = (option: Option) => {
        if (option.isCorrect) {
            const newScore = score + 1;
            setScore(newScore);
            setMessage('Correct! 🎉');

            setTimeout(() => {
                startRound(newScore);
            }, 800);
        } else {
            setMessage('Try again! ❌');
        }
    };

    const hudItems = [
        { label: 'Score', value: score.toString() },
        { label: 'Stage', value: stage.toUpperCase() }
    ];

    return (
        <Shell
            title="Shadow Shuffle"
            hud={<HUD items={hudItems} />}
        >
            <div css={containerStyles}>
                {/* Target Area */}
                <div css={css`
                    height: 240px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `}>
                    {target && (
                        <ShadowEmoji
                            emoji={target.emoji}
                            rotation={target.rotation}
                            scale={target.scale}
                            size="4rem"
                        />
                    )}
                </div>

                <div css={css`font-size: 1.5rem; font-weight: bold; min-height: 2rem;`}>
                    {message}
                </div>

                {/* Options */}
                <div css={optionsContainerStyles}>
                    {options.map((option) => (
                        <motion.button
                            key={option.id}
                            css={optionButtonStyles}
                            onClick={() => handleGuess(option)}
                            whileHover={{ scale: 1.1, borderColor: '#ddd' }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <div style={{
                                transform: `rotate(${option.rotation}deg) scale(${option.scale})`,
                                transition: 'transform 0.2s'
                            }}>
                                {option.emoji}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </div>
        </Shell>
    );
}
