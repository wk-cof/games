import { useState, useCallback } from "react";
import { css } from "@emotion/react";
import { Shell, HUD, Button, useGameSounds } from "@emoji-minis/kit";
import { BubbleSystem } from "./BubbleSystem";

const gameContainerStyles = css`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: radial-gradient(circle at top, #fdf1ff, #eef7ff 55%, #e5f5ff);
`;

const EMOJIS = [
  "🦊",
  "🐶",
  "🐱",
  "🐭",
  "🐹",
  "🐰",
  "🐻",
  "🐼",
  "🐨",
  "🐯",
  "🦁",
  "🐮",
  "🐷",
  "🐸",
  "🐵",
  "🐔",
  "🐧",
  "🐦",
  "🐤",
  "🦆",
  "🦅",
  "🦉",
  "🦇",
  "🐺",
  "🐗",
  "🐴",
  "🦄",
  "🐝",
  "🐛",
  "🦋",
  "🐌",
  "🐞",
  "🐜",
  "🦗",
  "🕷",
  "🦂",
  "🐢",
  "🐍",
  "🦎",
  "🦖",
  "🦕",
  "🐙",
  "🦑",
  "🦐",
  "🦞",
  "🦀",
  "🐡",
  "🐠",
  "🐟",
  "🐬",
  "🐳",
  "🐋",
  "🦈",
  "🐊",
  "🐅",
  "🐆",
  "🦓",
  "🦍",
  "🦧",
  "🐘",
  "🦛",
  "🦏",
  "🐪",
  "🐫",
  "🦒",
  "🦘",
  "🐃",
  "🐂",
  "🐄",
  "🐎",
  "🐖",
  "🐏",
  "🐑",
  "🦙",
  "🐐",
  "🦌",
  "🐕",
  "🐩",
  "🦮",
  "🐕‍🦺",
  "🐈",
  "🐈‍⬛",
  "🐓",
  "🦃",
  "🦚",
  "🦜",
  "🦢",
  "🦩",
  "🕊",
  "🐇",
  "🦝",
  "🦨",
  "🦡",
  "🦦",
  "🦥",
  "🐁",
  "🐀",
  "🐿",
  "🦔",
];

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<"zen" | "challenge">("zen");
  const [targetEmoji, setTargetEmoji] = useState<string>();

  const { playClick } = useGameSounds();

  const startGame = (selectedMode: "zen" | "challenge") => {
    setMode(selectedMode);
    setScore(0);
    setIsPlaying(true);
    if (selectedMode === "challenge") {
      pickNewTarget();
    } else {
      setTargetEmoji(undefined);
    }
  };

  const pickNewTarget = () => {
    const newTarget = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    setTargetEmoji(newTarget);
  };

  const handlePop = useCallback(
    (emoji: string) => {
      playClick();

      if (mode === "zen") {
        setScore((s) => s + 1);
      } else if (mode === "challenge") {
        if (emoji === targetEmoji) {
          setScore((s) => s + 10);
          pickNewTarget();
        } else {
          // Optional: penalty or feedback for wrong pop
        }
      }
    },
    [mode, targetEmoji],
  );

  const hudItems = [
    { label: "Score", value: score.toString() },
    ...(mode === "challenge" && targetEmoji
      ? [{ label: "Find", value: targetEmoji }]
      : []),
  ];

  const actions = isPlaying ? (
    <Button variant="ghost" onClick={() => setIsPlaying(false)}>
      Stop
    </Button>
  ) : null;

  return (
    <Shell title="Bubble Pop" hud={<HUD items={hudItems} />} actions={actions}>
      <div css={gameContainerStyles}>
        {!isPlaying ? (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              zIndex: 20,
            }}
          >
            <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
              Bubble Pop! 🫧
            </h1>
            <Button onClick={() => startGame("zen")} style={{ width: "200px" }}>
              Zen Mode 🧘
            </Button>
            <Button
              onClick={() => startGame("challenge")}
              variant="ghost"
              style={{ width: "200px" }}
            >
              Challenge Mode 🏆
            </Button>
          </div>
        ) : (
          <BubbleSystem
            active={isPlaying}
            targetEmoji={targetEmoji}
            onPop={handlePop}
          />
        )}
      </div>
    </Shell>
  );
}
