import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Shell, HUD, Button, Emoji, toast, wrongShake } from '@emoji-minis/kit';

const sequences = ['😀😃😄', '🌈⚡️', '🍕🔥', '🐢➡️🐇', '⭐️🌙', '🍉🍇🍒'];

function randomSequence(exclude?: string) {
  const choices = sequences.filter((seq) => seq !== exclude);
  return choices[Math.floor(Math.random() * choices.length)];
}

export default function App() {
  const [target, setTarget] = useState(() => randomSequence());
  const [input, setInput] = useState('');
  const [wins, setWins] = useState(0);
  const [fails, setFails] = useState(0);
  const [streak, setStreak] = useState(0);

  const hud = useMemo(
    () => [
      { label: 'wins', value: wins },
      { label: 'fails', value: fails },
      { label: 'streak', value: streak }
    ],
    [wins, fails, streak]
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (input === target) {
      setWins((w) => w + 1);
      setStreak((s) => s + 1);
      toast('Smooth typing!');
      setInput('');
      setTarget(randomSequence(target));
    } else {
      setFails((f) => f + 1);
      setStreak(0);
      const form = event.currentTarget;
      wrongShake(form);
      toast('Mismatch', { duration: 1200 });
    }
  };

  return (
    <Shell title="Typehopper" hud={<HUD items={hud} />}>
      <div className="em-shell__grid">
        <Emoji symbol={target} size="3.5rem" />
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '0.5rem' }}>
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type the emojis"
            style={{
              padding: '0.75rem',
              fontSize: '1.25rem',
              borderRadius: '12px',
              border: '2px solid rgb(0 0 0 / 0.1)'
            }}
          />
          <Button type="submit">Match it</Button>
        </form>
        <Button type="button" onClick={() => setTarget(randomSequence(target))}>
          Shuffle
        </Button>
      </div>
    </Shell>
  );
}
