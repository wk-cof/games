import { css } from '@emotion/react';
import { Shell, Emoji } from '@emoji-minis/kit';
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
  }
];

const containerStyles = css`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 var(--emoji-spacing-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  justify-content: center;
  gap: 2rem;
`;

const heroStyles = css`
  text-align: center;
  flex-shrink: 0;
  
  h1 {
    font-size: clamp(2.5rem, 5vw, 3.5rem);
    margin: 0;
    color: var(--emoji-ink);
    line-height: 1.1;
    
    span {
      display: inline-block;
    }
  }

  p {
    font-size: 1.25rem;
    color: var(--emoji-ink);
    opacity: 0.8;
    margin-top: 0.5rem;
    max-width: 600px;
  }
`;

const gridStyles = css`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  width: 100%;
  flex: 1;
  align-content: center;
  max-height: 80vh;
`;

const cardStyles = (color: string) => css`
  background: white;
  border-radius: 32px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  cursor: pointer;
  text-decoration: none;
  color: var(--emoji-ink);
  position: relative;
  overflow: hidden;
  border: 4px solid ${color};
  box-shadow: 8px 8px 0 ${color};
  transition: transform 0.1s;
  height: 100%;
  justify-content: center;

  &:active {
    transform: translate(4px, 4px);
    box-shadow: 4px 4px 0 ${color};
  }
`;

const playButtonStyles = (color: string) => css`
  background: ${color};
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 99px;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  cursor: pointer;
`;

export default function App() {
  return (
    <Shell title="Emoji Minis" hideHeader noSurface>
      <div css={containerStyles}>
        <motion.div
          css={heroStyles}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1>
            <motion.span
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
            >
              👋
            </motion.span>
            {' '}
            Hi there!
          </h1>
          <p>Pick a game to play!</p>
        </motion.div>

        <div css={gridStyles}>
          {apps.map((app, index) => (
            <motion.a
              key={app.id}
              href={`./${app.id}/`}
              css={cardStyles(app.color)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: "spring", bounce: 0.5 }}
              whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
            >
              <div css={css`font-size: 4rem; line-height: 1;`}>
                {app.emoji}
              </div>
              <h2 css={css`margin: 0; font-size: 1.75rem;`}>{app.title}</h2>
              <p css={css`margin: 0; font-size: 1.1rem; opacity: 0.8;`}>
                {app.description}
              </p>
              <div css={playButtonStyles(app.color)}>
                Play!
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </Shell>
  );
}
