import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { Shell, GameCard } from "@emoji-minis/kit";
import { motion } from "framer-motion";

const apps = [
  {
    id: "emogenius",
    title: "Emogenius",
    description: "Decode emoji clues!",
    emoji: "🧠",
    color: "#FFD93D",
  },
  {
    id: "typehopper",
    title: "Typehopper",
    description: "Type emojis fast!",
    emoji: "⌨️",
    color: "#6BCB77",
  },
  {
    id: "odd-one-out",
    title: "Odd One Out",
    description: "Find the different one!",
    emoji: "🧐",
    color: "#4D96FF",
  },
  {
    id: "pattern-path",
    title: "Pattern Path",
    description: "What comes next?",
    emoji: "🔮",
    color: "#FF6B6B",
  },
  {
    id: "bubble-pop",
    title: "Bubble Pop",
    description: "Pop bubbles before they float away! 🫧",
    emoji: "🫧",
    color: "var(--es-accent-pink)",
    path: "/bubble-pop/",
  },
  {
    id: "hangman",
    title: "Word Whiz",
    description: "Save the snowman by guessing the word! ☃️",
    emoji: "☃️",
    color: "var(--es-accent-blue)",
    path: "/hangman/",
  },
  {
    id: "emoji-echo",
    title: "Emoji Echo",
    description: "Repeat the pattern! 🍓🐳🐸🌻",
    emoji: "🍓",
    color: "#ff5e57",
    path: "/emoji-echo/",
  },
  {
    id: "shadow-shuffle",
    title: "Shadow Shuffle",
    description: "Catch the shadow! 👥",
    emoji: "👥",
    color: "#34495e",
    path: "/shadow-shuffle/",
  },
  {
    id: "emoji-codenames",
    title: "Emoji Codenames",
    description: "Crack the code to learn to read! 🕵️‍♀️",
    emoji: "🕵️‍♀️",
    color: "#8e44ad",
    path: "/emoji-codenames/",
  },
  {
    id: "tetris",
    title: "Tetris",
    description: "Stack the blocks! 🧱",
    emoji: "🧱",
    color: "#E056FD",
    path: "/tetris/",
  },
];

const gridStyles = css`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  width: 100%;
  padding-bottom: 2rem;
`;

export default function App() {
  const [view, setView] = useState<"all" | "starred">("all");
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("emoji-minis-starred");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("emoji-minis-starred", JSON.stringify(starredIds));
  }, [starredIds]);

  const toggleStar = (id: string) => {
    setStarredIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const filteredApps =
    view === "all" ? apps : apps.filter((app) => starredIds.includes(app.id));

  const navItems = [
    {
      label: "All Games",
      icon: "🏠",
      isActive: view === "all",
      onClick: () => setView("all"),
    },
    {
      label: "Starred",
      icon: "⭐️",
      isActive: view === "starred",
      onClick: () => setView("starred"),
    },
  ];

  return (
    <Shell
      title="Emoji Minis"
      subtitle="A suite of beautifully crafted emoji games designed to build cognitive skills and make learning delightful."
      navItems={navItems}
    >
      <div css={gridStyles}>
        {filteredApps.map((app, index) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GameCard
              title={app.title}
              description={app.description}
              emoji={app.emoji}
              color={app.color}
              href={`./${app.id}/`}
              isStarred={starredIds.includes(app.id)}
              onToggleStar={() => toggleStar(app.id)}
            />
          </motion.div>
        ))}
        {view === "starred" && filteredApps.length === 0 && (
          <div
            css={css`
              grid-column: 1 / -1;
              text-align: center;
              padding: 4rem;
              color: var(--es-text-secondary);
              font-size: 1.2rem;
            `}
          >
            No starred games yet! ⭐️
          </div>
        )}
      </div>
    </Shell>
  );
}
