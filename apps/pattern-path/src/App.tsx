import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { Shell, HUD, Button, Emoji, toast, wrongShake, stars } from '@emoji-minis/kit';

const patterns = [
  { trail: ['🔴', '🟢', '🔵'], answer: '🟣', options: ['🟣', '🟡', '⚫️'] },
  { trail: ['🌧️', '🌦️', '🌤️'], answer: '☀️', options: ['☀️', '🌩️', '🌫️'] },
  { trail: ['🌱', '🌿', '🌳'], answer: '🌲', options: ['🌲', '🌻', '🍂'] }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [best, setBest] = useState(0);
  const [current, setCurrent] = useState(0);
  const [sparkles] = useState(() => stars(6));

  const pattern = patterns[index % patterns.length];

  const hud = useMemo(
    () => [
      { label: 'chain', value: current },
      { label: 'best', value: best },
      { label: 'pattern', value: index + 1 }
    ],
    [current, best, index]
  );

  const handlePick = (symbol: string, event: MouseEvent<HTMLButtonElement>) => {
    if (symbol === pattern.answer) {
      const nextCurrent = current + 1;
      setCurrent(nextCurrent);
      setBest((b) => Math.max(b, nextCurrent));
      toast('Path extended ✨');
      setIndex((i) => i + 1);
    } else {
      wrongShake(event.currentTarget);
      toast('Pattern broken', { duration: 1200 });
      setCurrent(0);
    }
  };

  return (
    <Shell title="Pattern Path" subtitle="Predict the next emoji" hud={<HUD items={hud} />}>
      <div className="em-shell__grid" style={{ position: 'relative' }}>
        {sparkles.map((star) => (
          <span
            key={star.id}
            style={{
              position: 'absolute',
              top: `${star.y}%`,
              left: `${star.x}%`,
              opacity: 0.15,
              fontSize: `${star.scale}rem`
            }}
          >
            ✨
          </span>
        ))}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {pattern.trail.map((symbol) => (
            <Emoji key={symbol} symbol={symbol} />
          ))}
          <span style={{ fontSize: '2rem', opacity: 0.6 }}>?</span>
        </div>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {pattern.options.map((option) => (
            <Button key={option} onClick={(event) => handlePick(option, event)}>
              <Emoji symbol={option} />
            </Button>
          ))}
        </div>
      </div>
    </Shell>
  );
}
