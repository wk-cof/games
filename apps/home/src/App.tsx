import { css } from '@emotion/react';
import { Shell, Button, HUD, Emoji } from '@emoji-minis/kit';

const apps = [
  {
    id: 'emogenius',
    title: 'Emogenius',
    description: 'Decode emoji clues and keep your streak alive.',
    emoji: '🧠✨'
  },
  {
    id: 'typehopper',
    title: 'Typehopper',
    description: 'Re-type emoji combos as fast as you can.',
    emoji: '⌨️⚡️'
  },
  {
    id: 'odd-one-out',
    title: 'Odd One Out',
    description: 'Spot the rule breaker before the timer runs out.',
    emoji: '🧐✨'
  },
  {
    id: 'pattern-path',
    title: 'Pattern Path',
    description: 'Predict the next emoji in a growing pattern.',
    emoji: '🔮➡️'
  }
];

const gridStyles = css`
  display: grid;
  gap: clamp(1rem, 3vw, 1.5rem);
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
`;

const cardStyles = css`
  border-radius: var(--emoji-radius-lg);
  padding: var(--emoji-spacing-lg);
  background: white;
  box-shadow: 0 12px 30px rgb(15 23 42 / 0.08);
  display: flex;
  flex-direction: column;
  gap: var(--emoji-spacing-sm);
`;

export default function App() {
  const stats = [
    { label: 'games', value: apps.length },
    { label: 'made with', value: 'React + Vite' }
  ];

  return (
    <Shell title="Emoji Minis" hud={<HUD items={stats} />}>
      <p
        css={css`
          margin: 0 0 var(--emoji-spacing-lg);
          font-size: 1.1rem;
          max-width: 640px;
        `}
      >
        A cozy collection of emoji-first mini games. Pick a favorite below to launch it in-place – each game shares the same tiny UI kit so you can jump in without relearning the controls.
      </p>
      <div css={gridStyles}>
        {apps.map((app) => (
          <article key={app.id} css={cardStyles}>
            <Emoji symbol={app.emoji} size="2.5rem" />
            <h3
              css={css`
                margin: 0;
              `}
            >
              {app.title}
            </h3>
            <p
              css={css`
                margin: 0;
                opacity: 0.75;
              `}
            >
              {app.description}
            </p>
            <div>
              <Button type="button" onClick={() => (window.location.href = `./${app.id}/`)}>
                Play {app.title}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Shell>
  );
}
