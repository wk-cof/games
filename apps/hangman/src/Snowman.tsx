import { css } from "@emotion/react";
import { motion } from "framer-motion";

type SnowmanProps = {
  mistakes: number; // 0 to 6
};

const containerStyles = css`
  width: 200px;
  height: 250px;
  position: relative;
  margin: 0 auto;
`;

const partStyles = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 2px solid #e5e7eb;
  box-shadow: inset -5px -5px 10px rgba(0, 0, 0, 0.05);
`;

export const Snowman = ({ mistakes }: SnowmanProps) => {
  // We start with a full snowman and remove parts as mistakes happen (Melting Metaphor)
  // Or build it up? The design doc said "Melting Snowman".
  // Let's stick to "Melting": Start full, remove parts.
  // Wait, standard Hangman is "Building". If we do "Melting", 0 mistakes = Full Snowman.
  // 6 mistakes = Puddle.

  // Let's reverse the logic for the render:
  // 0 mistakes: Show all 6 parts.
  // 1 mistake: Show 5 parts.
  // ...
  // 6 mistakes: Show 0 parts (or just a puddle).

  const partsRemaining = 6 - mistakes;

  return (
    <div css={containerStyles}>
      {/* Puddle */}
      <div
        css={css`
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 24px;
          background: #e0f2fe;
          border-radius: 50%;
          opacity: ${mistakes >= 6 ? 1 : 0.5};
          transition: opacity 0.5s;
        `}
      />

      {/* Bottom Body */}
      {partsRemaining >= 1 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          css={[
            partStyles,
            css`
              bottom: 15px;
              width: 100px;
              height: 100px;
              border-radius: 50%;
              z-index: 1;
            `,
          ]}
        />
      )}

      {/* Middle Body */}
      {partsRemaining >= 2 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          css={[
            partStyles,
            css`
              bottom: 85px;
              width: 80px;
              height: 80px;
              border-radius: 50%;
              z-index: 2;
            `,
          ]}
        />
      )}

      {/* Head */}
      {partsRemaining >= 3 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          css={[
            partStyles,
            css`
              bottom: 145px;
              width: 64px;
              height: 64px;
              border-radius: 50%;
              z-index: 3;
            `,
          ]}
        >
          {/* Eyes */}
          {partsRemaining >= 4 && (
            <>
              <div
                css={css`
                  position: absolute;
                  top: 22px;
                  left: 18px;
                  width: 8px;
                  height: 8px;
                  background: #374151;
                  border-radius: 50%;
                `}
              />
              <div
                css={css`
                  position: absolute;
                  top: 22px;
                  right: 18px;
                  width: 8px;
                  height: 8px;
                  background: #374151;
                  border-radius: 50%;
                `}
              />
            </>
          )}
          {/* Nose */}
          {partsRemaining >= 5 && (
            <div
              css={css`
                position: absolute;
                top: 32px;
                left: 50%;
                width: 0;
                height: 0;
                border-left: 4px solid transparent;
                border-right: 4px solid transparent;
                border-bottom: 12px solid #f97316;
                transform: translateX(-50%) rotate(0deg);
              `}
            />
          )}
        </motion.div>
      )}

      {/* Hat */}
      {partsRemaining >= 6 && (
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          css={css`
            position: absolute;
            bottom: 200px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 4;
            display: flex;
            flex-direction: column;
            align-items: center;
          `}
        >
          <div
            css={css`
              width: 40px;
              height: 35px;
              background: #374151;
              border-radius: 4px 4px 0 0;
            `}
          />
          <div
            css={css`
              width: 60px;
              height: 8px;
              background: #374151;
              border-radius: 4px;
            `}
          />
        </motion.div>
      )}
    </div>
  );
};
