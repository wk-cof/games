import { css } from '@emotion/react';
import { Button } from '@emoji-minis/kit';

type KeyboardProps = {
    guessed: Set<string>;
    onGuess: (char: string) => void;
    disabled?: boolean;
};

const keyboardStyles = css`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  max-width: 600px;
  margin: 0 auto;
`;

const KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const Keyboard = ({ guessed, onGuess, disabled }: KeyboardProps) => {
    return (
        <div css={keyboardStyles}>
            {KEYS.map((char) => {
                const isGuessed = guessed.has(char);
                return (
                    <Button
                        key={char}
                        onClick={() => onGuess(char)}
                        disabled={disabled || isGuessed}
                        variant={isGuessed ? 'ghost' : 'solid'}
                        style={{
                            width: '3rem',
                            height: '3.5rem',
                            padding: 0,
                            opacity: isGuessed ? 0.5 : 1
                        }}
                    >
                        {char}
                    </Button>
                );
            })}
        </div>
    );
};
