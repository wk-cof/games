import { css } from "@emotion/react";

type WordDisplayProps = {
  word: string;
  guessed: Set<string>;
  revealed?: boolean;
};

const containerStyles = css`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2rem 0;
`;

const letterStyles = (isGuessed: boolean, isRevealed: boolean) => css`
  width: 3rem;
  height: 4rem;
  border-bottom: 4px solid var(--es-primary);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 800;
  color: ${isRevealed && !isGuessed ? "#ef4444" : "var(--es-text-primary)"};
  text-transform: uppercase;
  padding-bottom: 0.25rem;
  line-height: 1;
  overflow: visible;
`;

export const WordDisplay = ({ word, guessed, revealed }: WordDisplayProps) => {
  return (
    <div css={containerStyles}>
      {word.split("").map((char, index) => {
        const isGuessed = guessed.has(char);
        const showChar = isGuessed || revealed;

        return (
          <div key={index} css={letterStyles(isGuessed, !!revealed)}>
            {showChar ? (
              <span
                style={{ display: "block", width: "100%", textAlign: "center" }}
              >
                {char}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
