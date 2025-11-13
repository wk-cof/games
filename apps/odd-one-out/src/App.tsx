import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { Shell, HUD, Button, Emoji, toast, wrongShake } from '@emoji-minis/kit';

const rounds = [
  { group: ['🍎', '🍊', '🍋', '🌮'], oddIndex: 3, hint: 'Three fruits, one dinner' },
  { group: ['🚲', '🛴', '🚗', '🛹'], oddIndex: 2, hint: 'Only one has an engine' },
  { group: ['🎸', '🥁', '🎧', '🎺'], oddIndex: 2, hint: 'Passive listener' }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [mistakes, setMistakes] = useState(0);

  const hud = useMemo(
    () => [
      { label: 'cleared', value: correct },
      { label: 'misses', value: mistakes },
      { label: 'round', value: index + 1 }
    ],
    [correct, mistakes, index]
  );

  const round = rounds[index % rounds.length];

  const handlePick = (choiceIndex: number, event: MouseEvent<HTMLButtonElement>) => {
    if (choiceIndex === round.oddIndex) {
      setCorrect((c) => c + 1);
      toast('Odd spotted!');
      setIndex((i) => i + 1);
    } else {
      setMistakes((m) => m + 1);
      wrongShake(event.currentTarget);
      toast('Nope!', { duration: 1000 });
    }
  };

  return (
    <Shell title="Odd One Out" subtitle={round.hint} hud={<HUD items={hud} />}>
      <div className="em-shell__grid">
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {round.group.map((symbol, idx) => (
            <Button key={symbol} onClick={(event) => handlePick(idx, event)}>
              <Emoji symbol={symbol} />
            </Button>
          ))}
        </div>
        <Button type="button" onClick={() => setIndex((i) => i + 1)}>
          Skip ➡️
        </Button>
      </div>
    </Shell>
  );
}
