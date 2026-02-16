import { useState, useEffect, useCallback } from "react";
import { css } from "@emotion/react";
import { Shell, HUD, Button } from "@emoji-minis/kit";
import confetti from "canvas-confetti";
import { WordDisplay } from "./WordDisplay";
import { Keyboard } from "./Keyboard";
import { Snowman } from "./Snowman";

const WORDS = [
  { word: "APPLE", emoji: "🍎" },
  { word: "BANANA", emoji: "🍌" },
  { word: "CHERRY", emoji: "🍒" },
  { word: "GRAPE", emoji: "🍇" },
  { word: "LEMON", emoji: "🍋" },
  { word: "MANGO", emoji: "🥭" },
  { word: "ORANGE", emoji: "🍊" },
  { word: "PEACH", emoji: "🍑" },
  { word: "PEAR", emoji: "🍐" },
  { word: "STRAWBERRY", emoji: "🍓" },
  { word: "WATERMELON", emoji: "🍉" },
  { word: "CARROT", emoji: "🥕" },
  { word: "CORN", emoji: "🌽" },
  { word: "POTATO", emoji: "🥔" },
  { word: "TOMATO", emoji: "🍅" },
  { word: "BROCCOLI", emoji: "🥦" },
  { word: "COOKIE", emoji: "🍪" },
  { word: "DONUT", emoji: "🍩" },
  { word: "PIZZA", emoji: "🍕" },
  { word: "BURGER", emoji: "🍔" },
  { word: "FRIES", emoji: "🍟" },
  { word: "HOTDOG", emoji: "🌭" },
  { word: "POPCORN", emoji: "🍿" },
  { word: "CAKE", emoji: "🍰" },
  { word: "ICECREAM", emoji: "🍦" },
  { word: "CANDY", emoji: "🍬" },
  { word: "CAT", emoji: "🐱" },
  { word: "DOG", emoji: "🐶" },
  { word: "MOUSE", emoji: "🐭" },
  { word: "HAMSTER", emoji: "🐹" },
  { word: "RABBIT", emoji: "🐰" },
  { word: "FOX", emoji: "🦊" },
  { word: "BEAR", emoji: "🐻" },
  { word: "PANDA", emoji: "🐼" },
  { word: "KOALA", emoji: "🐨" },
  { word: "TIGER", emoji: "🐯" },
  { word: "LION", emoji: "🦁" },
  { word: "COW", emoji: "🐮" },
  { word: "PIG", emoji: "🐷" },
  { word: "FROG", emoji: "🐸" },
  { word: "MONKEY", emoji: "🐵" },
  { word: "CHICKEN", emoji: "🐔" },
  { word: "PENGUIN", emoji: "🐧" },
  { word: "BIRD", emoji: "🐦" },
  { word: "DUCK", emoji: "🦆" },
  { word: "EAGLE", emoji: "🦅" },
  { word: "OWL", emoji: "🦉" },
  { word: "BAT", emoji: "🦇" },
  { word: "WOLF", emoji: "🐺" },
  { word: "HORSE", emoji: "🐴" },
  { word: "UNICORN", emoji: "🦄" },
  { word: "BEE", emoji: "🐝" },
  { word: "BUTTERFLY", emoji: "🦋" },
  { word: "SNAIL", emoji: "🐌" },
  { word: "LADYBUG", emoji: "🐞" },
  { word: "ANT", emoji: "🐜" },
  { word: "SPIDER", emoji: "🕷" },
  { word: "TURTLE", emoji: "🐢" },
  { word: "SNAKE", emoji: "🐍" },
  { word: "LIZARD", emoji: "🦎" },
  { word: "OCTOPUS", emoji: "🐙" },
  { word: "FISH", emoji: "🐟" },
  { word: "DOLPHIN", emoji: "🐬" },
  { word: "WHALE", emoji: "🐳" },
  { word: "SHARK", emoji: "🦈" },
  { word: "CROCODILE", emoji: "🐊" },
  { word: "ZEBRA", emoji: "🦓" },
  { word: "GIRAFFE", emoji: "🦒" },
  { word: "ELEPHANT", emoji: "🐘" },
  { word: "CAMEL", emoji: "🐫" },
  { word: "SUN", emoji: "☀️" },
  { word: "MOON", emoji: "🌙" },
  { word: "STAR", emoji: "⭐️" },
  { word: "CLOUD", emoji: "☁️" },
  { word: "RAIN", emoji: "🌧️" },
  { word: "SNOW", emoji: "❄️" },
  { word: "FIRE", emoji: "🔥" },
  { word: "WATER", emoji: "💧" },
  { word: "BALLOON", emoji: "🎈" },
  { word: "GIFT", emoji: "🎁" },
  { word: "TROPHY", emoji: "🏆" },
  { word: "MEDAL", emoji: "🥇" },
  { word: "CROWN", emoji: "👑" },
  { word: "DIAMOND", emoji: "💎" },
  { word: "HEART", emoji: "❤️" },
  { word: "GHOST", emoji: "👻" },
  { word: "ALIEN", emoji: "👽" },
  { word: "ROBOT", emoji: "🤖" },
  { word: "ROCKET", emoji: "🚀" },
  { word: "CAR", emoji: "🚗" },
  { word: "BUS", emoji: "🚌" },
  { word: "TRAIN", emoji: "🚂" },
  { word: "SHIP", emoji: "🚢" },
  { word: "PLANE", emoji: "✈️" },
  { word: "BIKE", emoji: "🚲" },
];

const gameContainerStyles = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  gap: 2rem;
`;

const hintStyles = css`
  font-size: 4rem;
  margin-bottom: 1rem;
  filter: blur(8px);
  transition: filter 0.5s ease;

  &.revealed {
    filter: blur(0);
  }
`;

export default function App() {
  const [target, setTarget] = useState(WORDS[0]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState<"playing" | "won" | "lost">("playing");
  const [score, setScore] = useState(0);

  const [blurHint, setBlurHint] = useState(true);

  const pickNewWord = useCallback(() => {
    const next = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTarget(next);
    setGuessed(new Set());
    setMistakes(0);
    setStatus("playing");
  }, []);

  useEffect(() => {
    pickNewWord();
  }, [pickNewWord]);

  const handleGuess = (char: string) => {
    if (status !== "playing") return;

    setGuessed((prev) => {
      const next = new Set(prev);
      next.add(char);
      return next;
    });

    if (!target.word.includes(char)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= 6) {
        setStatus("lost");
      }
    } else {
      // Check win
      const isWin = target.word
        .split("")
        .every((c) => guessed.has(c) || c === char);
      if (isWin) {
        setStatus("won");
        setScore((s) => s + 10);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }
  };

  const hudItems = [
    { label: "Score", value: score.toString() },
    { label: "Mistakes", value: `${mistakes}/6` },
  ];

  const actions = (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button variant="ghost" onClick={() => setBlurHint(!blurHint)}>
        {blurHint ? "👁️ Show Hint" : "🔒 Hide Hint"}
      </Button>
      <Button variant="ghost" onClick={pickNewWord}>
        Skip Word
      </Button>
    </div>
  );

  return (
    <Shell title="Word Whiz" hud={<HUD items={hudItems} />} actions={actions}>
      <div css={gameContainerStyles}>
        <div
          style={{
            display: "flex",
            gap: "4rem",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Snowman mistakes={mistakes} />

          <div style={{ textAlign: "center" }}>
            <div
              css={hintStyles}
              className={status !== "playing" || !blurHint ? "revealed" : ""}
            >
              {target.emoji}
            </div>

            <WordDisplay
              word={target.word}
              guessed={guessed}
              revealed={status !== "playing"}
            />
          </div>
        </div>

        {status === "playing" ? (
          <Keyboard guessed={guessed} onGuess={handleGuess} />
        ) : (
          <div style={{ textAlign: "center" }}>
            <h2
              style={{
                fontSize: "2rem",
                marginBottom: "1rem",
                color: status === "won" ? "#10b981" : "#ef4444",
              }}
            >
              {status === "won"
                ? "You Saved the Snowman! 🎉"
                : "Oh no! The Snowman Melted! ☀️"}
            </h2>
            <Button
              onClick={pickNewWord}
              style={{ fontSize: "1.2rem", padding: "1rem 2rem" }}
            >
              Play Again
            </Button>
          </div>
        )}
      </div>
    </Shell>
  );
}
