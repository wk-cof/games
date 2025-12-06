import { css, keyframes } from '@emotion/react';
import { motion } from 'framer-motion';

export const BUTTON_CONFIG = [
    { color: '#ff5e57', emoji: '🍓' }, // Red
    { color: '#45aaf2', emoji: '🐳' }, // Blue
    { color: '#2ecc71', emoji: '🐸' }, // Green
    { color: '#f1c40f', emoji: '🌻' }  // Yellow
];

const gridStyles = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  max-width: 400px;
  width: 100%;
  aspect-ratio: 1;
  padding: 1rem;
`;

const buttonBaseStyles = css`
  border: none;
  border-radius: 24px;
  font-size: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.1s;
  box-shadow: 0 4px 0 rgba(0,0,0,0.1);
  -webkit-tap-highlight-color: transparent;

  &:active {
    transform: translateY(4px);
    box-shadow: none;
  }
`;

interface SimonBoardProps {
    activeButton: number | null;
    onInput: (index: number) => void;
    disabled: boolean;
}

export function SimonBoard({ activeButton, onInput, disabled }: SimonBoardProps) {
    return (
        <div css={gridStyles}>
            {BUTTON_CONFIG.map((config, index) => {
                const isActive = activeButton === index;

                return (
                    <motion.button
                        key={index}
                        css={css`
                    ${buttonBaseStyles};
                    background-color: ${config.color};
                    opacity: ${isActive ? 1 : 0.4};
                    filter: ${isActive ? 'brightness(1.2)' : 'none'};
                    transform: ${isActive ? 'scale(1.05)' : 'none'};
                    border: ${isActive ? '4px solid white' : '4px solid transparent'};
                    box-shadow: ${isActive ? '0 0 20px rgba(255,255,255,0.5)' : '0 4px 0 rgba(0,0,0,0.1)'};
                `}
                        whileTap={{ scale: disabled ? 1 : 0.95 }}
                        onClick={() => !disabled && onInput(index)}
                        disabled={disabled}
                    >
                        {config.emoji}
                    </motion.button>
                );
            })}
        </div>
    );
}
