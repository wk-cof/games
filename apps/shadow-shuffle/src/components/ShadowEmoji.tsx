import { css } from '@emotion/react';
import { motion } from 'framer-motion';

export type DifficultyStage = 'static' | 'wiggle' | 'float' | 'dance' | 'rotate' | 'scale';

interface ShadowEmojiProps {
    emoji: string;
    rotation?: number;
    scale?: number;
    stage?: DifficultyStage; // Keeping for backward compat
    size?: string;
}

const emojiStyles = (size: string) => css`
  font-size: ${size};
  line-height: 1;
  user-select: none;
  filter: brightness(0) contrast(100%);
`;

export function ShadowEmoji({ emoji, rotation = 0, scale = 1, size = '8rem' }: ShadowEmojiProps) {
    return (
        <motion.div
            css={emojiStyles(size)}
            animate={{
                rotate: rotation,
                scale: scale,
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20
            }}
        >
            {emoji}
        </motion.div>
    );
}
