import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import { Shell, Button, HUD, Emoji, toast, wrongShake } from '@emoji-minis/kit';

const puzzles = [
  {
    clue: '🧠✨',
    prompt: 'Synonym for brilliant',
    options: ['Genius', 'Lucky', 'Spark'],
    answer: 'Genius'
  },
  {
    clue: '🎯🧑‍🎓',
    prompt: 'Who always hits the right answer?',
    options: ['Scholar', 'Sharpshooter', 'Teacher'],
    answer: 'Scholar'
  },
  {
    clue: '🧩⚡️',
    prompt: 'Quick thinker badge',
    options: ['Puzzle Bolt', 'Brainwave', 'Sprint Solve'],
    answer: 'Brainwave'
  }
];

export default function App() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);

  const puzzle = puzzles[index];
  const hud = useMemo(
    () => [
      { label: 'score', value: score },
      { label: 'streak', value: streak },
      { label: 'round', value: round }
    ],
    [score, streak, round]
  );

  const handleAnswer = (choice: string, event: MouseEvent<HTMLButtonElement>) => {
    if (choice === puzzle.answer) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      toast('Nice one!');
      const nextIndex = (index + 1) % puzzles.length;
      setIndex(nextIndex);
      setRound((r) => r + 1);
    } else {
      setStreak(0);
      wrongShake(event.currentTarget);
      toast('Try again', { duration: 1500 });
    }
  };

  return (
    <Shell title="Emogenius" subtitle="Decode the emoji clue" hud={<HUD items={hud} />}>
      <section className="em-shell__grid">
        <Emoji symbol={puzzle.clue} size="4rem" />
        <p>{puzzle.prompt}</p>
        <div style={{ display: 'grid', gap: '0.5rem' }}>
          {puzzle.options.map((option) => (
            <Button key={option} onClick={(event) => handleAnswer(option, event)}>
              {option}
            </Button>
          ))}
        </div>
      </section>
    </Shell>
  );
}
