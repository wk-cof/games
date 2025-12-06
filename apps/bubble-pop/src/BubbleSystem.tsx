import { useState, useEffect, useCallback, useRef } from 'react';
import { Bubble } from './Bubble';
import confetti from 'canvas-confetti';

type BubbleData = {
    id: string;
    emoji: string;
    x: number;
    speed: number;
};

type BubbleSystemProps = {
    active: boolean;
    targetEmoji?: string;
    onPop: (emoji: string) => void;
};

const EMOJIS = ['🦊', '🐶', '🐱', '🐭', '🐹', '🐰', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦗', '🕷', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿', '🦔'];

export const BubbleSystem = ({ active, targetEmoji, onPop }: BubbleSystemProps) => {
    const [bubbles, setBubbles] = useState<BubbleData[]>([]);
    const spawnTimerRef = useRef<number>();

    const spawnBubble = useCallback(() => {
        if (!active) return;

        const id = Math.random().toString(36).substr(2, 9);
        const x = Math.random() * 80 + 10; // 10% to 90% width
        const speed = Math.random() * 3 + 4; // 4s to 7s duration

        // 30% chance to spawn target emoji if one is set
        let emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        if (targetEmoji && Math.random() < 0.3) {
            emoji = targetEmoji;
        }

        setBubbles(prev => [...prev, { id, emoji, x, speed }]);

        // Schedule next spawn
        const nextSpawnTime = Math.random() * 1000 + 500; // 0.5s to 1.5s
        spawnTimerRef.current = window.setTimeout(spawnBubble, nextSpawnTime);
    }, [active, targetEmoji]);

    useEffect(() => {
        if (active) {
            spawnBubble();
        } else {
            clearTimeout(spawnTimerRef.current);
            setBubbles([]);
        }
        return () => clearTimeout(spawnTimerRef.current);
    }, [active, spawnBubble]);

    const handlePop = (id: string, x: number, y: number) => {
        const bubble = bubbles.find(b => b.id === id);
        if (!bubble) return;

        // Remove bubble
        setBubbles(prev => prev.filter(b => b.id !== id));

        // Particle effect
        confetti({
            particleCount: 15,
            spread: 60,
            origin: { x: x / window.innerWidth, y: y / window.innerHeight },
            colors: ['#ffffff', '#a8d8ea', '#aa96da', '#fcbad3', '#ffffd2'],
            disableForReducedMotion: true,
            zIndex: 100
        });

        // Callback
        onPop(bubble.emoji);
    };

    const handleMiss = (id: string) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
    };

    return (
        <>
            {bubbles.map(bubble => (
                <Bubble
                    key={bubble.id}
                    {...bubble}
                    onPop={handlePop}
                    onMiss={handleMiss}
                />
            ))}
        </>
    );
};
