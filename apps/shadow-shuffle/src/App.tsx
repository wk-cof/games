import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { Shell, Button, HUD, useGameSounds } from "@emoji-minis/kit";
import { ShadowEmoji, DifficultyStage } from "./components/ShadowEmoji";
import { motion } from "framer-motion";

const EMOJIS = [
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🦊",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
];
const ASYMMETRICAL_EMOJIS = [
  "🐘",
  "🏃",
  "🚗",
  "🚀",
  "🎺",
  "🎸",
  "👟",
  "🐟",
  "🦎",
  "🦕",
  "🦈",
  "🦓",
  "🦒",
  "🐌",
  "🐛",
];

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
  mirror: boolean;
  isCorrect: boolean;
}

export default function App() {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<"playing" | "game_over">(
    "playing",
  );
  const [target, setTarget] = useState<Option | null>(null);
  const [options, setOptions] = useState<Option[]>([]);
  const [stage, setStage] = useState<DifficultyStage>("static");
  const [message, setMessage] = useState("Find the shadow!");
  const [isShadowVisible, setIsShadowVisible] = useState(true);
  const { playSuccess, playError, playClick } = useGameSounds();

  useEffect(() => {
    startGame();
  }, []);

  const calculateStage = (currentScore: number): DifficultyStage => {
    if (currentScore < 3) return "static";
    if (currentScore < 6) return "rotate";
    if (currentScore < 10) return "scale";
    if (currentScore < 15) return "mirror";
    return "flash";
  };

  const startGame = () => {
    setScore(0);
    setLives(3);
    setGameState("playing");
    startRound(0);
  };

  const startRound = (currentScore: number) => {
    const currentStage = calculateStage(currentScore);
    setStage(currentStage);
    setIsShadowVisible(true); // Always start visible

    // Handle Flash mode visibility timer
    if (currentStage === "flash") {
      setTimeout(() => {
        setIsShadowVisible(false);
      }, 1000);
    }

    let roundOptions: Option[] = [];
    let correctOption: Option;

    if (currentStage === "mirror") {
      // Stage 4: Mirror Mode (Asymmetrical Emojis)
      const baseEmoji =
        ASYMMETRICAL_EMOJIS[
          Math.floor(Math.random() * ASYMMETRICAL_EMOJIS.length)
        ];

      const isTargetMirrored = Math.random() > 0.5;
      const distractorEmoji = ASYMMETRICAL_EMOJIS.filter(
        (e) => e !== baseEmoji,
      )[Math.floor(Math.random() * (ASYMMETRICAL_EMOJIS.length - 1))];

      roundOptions = [
        {
          id: "1",
          emoji: baseEmoji,
          rotation: 0,
          scale: 1,
          mirror: false,
          isCorrect: !isTargetMirrored,
        },
        {
          id: "2",
          emoji: baseEmoji,
          rotation: 0,
          scale: 1,
          mirror: true,
          isCorrect: isTargetMirrored,
        },
        {
          id: "3",
          emoji: distractorEmoji,
          rotation: 0,
          scale: 1,
          mirror: false,
          isCorrect: false,
        },
      ];

      correctOption = roundOptions.find((o) => o.isCorrect)!;
    } else if (currentStage === "flash") {
      // Stage 5: Flash Mode
      const baseEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const targetRotation = Math.floor(Math.random() * 8) * 45;

      const rotations = [targetRotation];
      while (rotations.length < 3) {
        const r = Math.floor(Math.random() * 8) * 45;
        if (!rotations.includes(r)) rotations.push(r);
      }

      roundOptions = rotations.map((r) => ({
        id: Math.random().toString(),
        emoji: baseEmoji,
        rotation: r,
        scale: 1,
        mirror: false,
        isCorrect: r === targetRotation,
      }));

      correctOption = roundOptions.find((o) => o.isCorrect)!;
    } else {
      // Existing Stages (Static, Rotate, Scale)
      const baseEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

      if (currentStage === "static") {
        const distractors = EMOJIS.filter((e) => e !== baseEmoji)
          .sort(() => 0.5 - Math.random())
          .slice(0, 2);

        const emojis = [baseEmoji, ...distractors];
        roundOptions = emojis.map((e) => ({
          id: Math.random().toString(),
          emoji: e,
          rotation: 0,
          scale: 1,
          mirror: false,
          isCorrect: e === baseEmoji,
        }));
      } else if (currentStage === "rotate") {
        const targetRotation = Math.floor(Math.random() * 8) * 45;
        const rotations = [targetRotation];
        while (rotations.length < 3) {
          const r = Math.floor(Math.random() * 8) * 45;
          if (!rotations.includes(r)) rotations.push(r);
        }
        roundOptions = rotations.map((r) => ({
          id: Math.random().toString(),
          emoji: baseEmoji,
          rotation: r,
          scale: 1,
          mirror: false,
          isCorrect: r === targetRotation,
        }));
      } else {
        // Scale
        const scales = [0.6, 1.0, 1.4];
        const targetScaleIdx = Math.floor(Math.random() * scales.length);
        const targetVal = scales[targetScaleIdx];
        roundOptions = scales.map((s) => ({
          id: Math.random().toString(),
          emoji: baseEmoji,
          rotation: 0,
          scale: s,
          mirror: false,
          isCorrect: s === targetVal,
        }));
      }
      correctOption = roundOptions.find((o) => o.isCorrect)!;
    }

    setTarget(correctOption);
    setOptions(roundOptions.sort(() => 0.5 - Math.random()));
    setMessage("Find the shadow!");
  };

  const handleGuess = (option: Option) => {
    if (gameState !== "playing") return;

    if (option.isCorrect) {
      playSuccess();
      const newScore = score + 1;
      setScore(newScore);
      setMessage("Correct! 🎉");

      setTimeout(() => {
        startRound(newScore);
      }, 800);
    } else {
      playError();
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives === 0) {
        setGameState("game_over");
        setMessage("Game Over!");
      } else {
        setMessage("Wrong! Life lost 💔");
      }
    }
  };

  const hudItems = [
    { label: "Score", value: score.toString() },
    { label: "Stage", value: stage.toUpperCase() },
    { label: "Lives", value: "❤️".repeat(lives) },
  ];

  return (
    <Shell title="Shadow Shuffle" hud={<HUD items={hudItems} />}>
      <div css={containerStyles}>
        {gameState === "playing" ? (
          <>
            <div
              css={css`
                height: 240px;
                display: flex;
                align-items: center;
                justify-content: center;
              `}
            >
              {target && (
                <ShadowEmoji
                  emoji={target.emoji}
                  rotation={target.rotation}
                  scale={target.scale}
                  size="4rem"
                  mirror={target.mirror}
                  visible={isShadowVisible}
                />
              )}
            </div>

            <div
              css={css`
                font-size: 1.5rem;
                font-weight: bold;
                min-height: 2rem;
              `}
            >
              {message}
            </div>

            <div css={optionsContainerStyles}>
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  css={optionButtonStyles}
                  onClick={() => {
                    playClick();
                    handleGuess(option);
                  }}
                  whileHover={{ scale: 1.1, borderColor: "#ddd" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    style={{
                      transform: `rotate(${option.rotation}deg) scale(${option.scale}) scaleX(${option.mirror ? -1 : 1})`,
                      transition: "transform 0.2s",
                    }}
                  >
                    {option.emoji}
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <div
            css={css`
              text-align: center;
            `}
          >
            <div
              css={css`
                font-size: 3rem;
                margin-bottom: 1rem;
              `}
            >
              Game Over
            </div>
            <div
              css={css`
                font-size: 1.5rem;
                margin-bottom: 2rem;
              `}
            >
              Final Score: {score}
            </div>
            <Button onClick={startGame}>Play Again</Button>
          </div>
        )}
      </div>
    </Shell>
  );
}
