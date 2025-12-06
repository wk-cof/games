import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { Shell, GameCard } from '@emoji-minis/kit';
import { motion } from 'framer-motion';

const apps = [
  {
    id: 'emogenius',
    title: 'Emogenius',
    description: 'Decode emoji clues!',
    emoji: '🧠',
    color: '#FFD93D'
  },
  {
    id: 'typehopper',
    title: 'Typehopper',
    description: 'Type emojis fast!',
    emoji: '⌨️',
    color: '#6BCB77'
  },
  {
    id: 'odd-one-out',
    title: 'Odd One Out',
    description: 'Find the different one!',
    emoji: '🧐',
    color: '#4D96FF'
  },
  {
    id: 'pattern-path',
    title: 'Pattern Path',
    description: 'What comes next?',
    emoji: '🔮',
    color: '#FF6B6B'
  },
  {
    id: 'bubble-pop',
    title: 'Bubble Pop',
    description: 'Pop the bubbles!',
    emoji: '🫧',
    color: '#A8D8EA'
  }
];

const gridStyles = css`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  width: 100%;
  padding-bottom: 2rem;
`;

export default function App() {
  const [view, setView] = useState<'all' | 'starred'>('all');
  const [starredIds, setStarredIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('emoji-minis-starred');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('emoji-minis-starred', JSON.stringify(starredIds));
  }, [starredIds]);

  const toggleStar = (id: string) => {
    setStarredIds(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const filteredApps = view === 'all'
    ? apps
    : apps.filter(app => starredIds.includes(app.id));

  const navItems = [
    {
      label: 'All Games',
      icon: '🏠',
      isActive: view === 'all',
      onClick: () => setView('all')
    },
    {
      label: 'Starred',
      icon: '⭐️',
      isActive: view === 'starred',
      onClick: () => setView('starred')
    }
  ];

  return (
    <Shell
      title="Emoji Minis"
      subtitle="Play tiny emoji games!"
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
        {view === 'starred' && filteredApps.length === 0 && (
          <div css={css`
            grid-column: 1 / -1;
            text-align: center;
            padding: 4rem;
            color: var(--es-text-secondary);
            font-size: 1.2rem;
          `}>
            No starred games yet! ⭐️
          </div>
        )}
      </div>
    </Shell>
  );
}
