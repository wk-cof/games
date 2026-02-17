import { useEffect, useRef, useState, useCallback } from 'react';
import { useSoundContext } from '@emoji-minis/kit';

// Korobeiniki Theme (Tetris Type A)
// Notes and approximate durations for a simple loop
// Tempo: ~140-150 BPM? Let's say 120 for simplicity in calculation, or fast.
// 8-bit style: Square or Sawtooth wave. Square is more "NES".

type Note = {
    freq: number;
    duration: number; // in seconds
};

// Note frequencies (Hz)
const NOTES: Record<string, number> = {
    E5: 659.25,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    A4: 440.00,
    Gs4: 415.30, // G#4
    G4: 392.00,  // Natural G4? Wait, Korobeiniki is in E minor usually?
    // E minor: E, F#, G, A, B, C, D, E. 
    // Often involves G# in harmonic minor for the V chord (B major).
    F4: 349.23, // If needed
    F5: 698.46,
    E4: 329.63,
    D4: 293.66,
    C4: 261.63,
    B3: 246.94
};

// Melody Sequence
// E5 -> B4 -> C5 -> D5 -> C5 -> B4 -> A4 -> A4 -> C5 -> E5 -> D5 -> C5 -> B4 -> C5 -> D5 -> E5 -> C5 -> A4 -> A4
// Phrases...
// Phrase 1: E5-0.5, B4-0.25, C5-0.25, D5-0.5, C5-0.25, B4-0.25, A4-0.5
// Phrase 2: A4-0.25, C5-0.25, E5-0.5, D5-0.25, C5-0.25, B4-0.75, C5-0.25, D5-0.5, E5-0.5, C5-0.5, A4-0.5, A4-0.5
// ... (simplified verification needed)

// Let's use a standard transcription sequence (simplified):
// 1. E5 (1) -> B4 (0.5) -> C5 (0.5) -> D5 (1) -> C5 (0.5) -> B4 (0.5) -> A4 (1)
// 2. A4 (0.5) -> C5 (0.5) -> E5 (1) -> D5 (0.5) -> C5 (0.5) -> B4 (1.5) -> C5 (0.5)
// 3. D5 (1) -> E5 (1) -> C5 (1) -> A4 (1) -> A4 (2)
// B Section:
// 4. D5 (1.5) -> F5 (0.5) -> A5 (1) -> G5 (0.5) -> F5 (0.5) -> E5 (1.5) -> C5 (0.5) -> E5 (1)
// 5. D5 (0.5) -> C5 (0.5) -> B4 (1) -> B4 (0.5) -> C5 (0.5) -> D5 (1) -> E5 (1) -> C5 (1) -> A4 (1) -> A4 (1)

// Adjusting duration for speed. Base beat = 0.3s? 
const BEAT = 0.35;

const MELODY: Note[] = [
    // A Section
    { freq: NOTES.E5, duration: BEAT * 2 },
    { freq: NOTES.B4, duration: BEAT * 1 },
    { freq: NOTES.C5, duration: BEAT * 1 },
    { freq: NOTES.D5, duration: BEAT * 2 },
    { freq: NOTES.C5, duration: BEAT * 1 },
    { freq: NOTES.B4, duration: BEAT * 1 },

    { freq: NOTES.A4, duration: BEAT * 2 },
    { freq: NOTES.A4, duration: BEAT * 1 },
    { freq: NOTES.C5, duration: BEAT * 1 },
    { freq: NOTES.E5, duration: BEAT * 2 },
    { freq: NOTES.D5, duration: BEAT * 1 },
    { freq: NOTES.C5, duration: BEAT * 1 },

    { freq: NOTES.B4, duration: BEAT * 3 }, // Long B
    { freq: NOTES.C5, duration: BEAT * 1 },
    { freq: NOTES.D5, duration: BEAT * 2 },
    { freq: NOTES.E5, duration: BEAT * 2 },

    { freq: NOTES.C5, duration: BEAT * 2 },
    { freq: NOTES.A4, duration: BEAT * 2 },
    { freq: NOTES.A4, duration: BEAT * 4 }, // End phrase 1

    // Reuse A section logic? Or Loop? 
    // Let's add B Section (The "high" part)

    { freq: NOTES.D5, duration: BEAT * 3 }, // NOTE: Should start higher? Usually transitions to D sequence
    // Actually often jumps to D5 or uses high F...
    // Let's stick to a simple loop of Section A for now to save complexity, 
    // or add a simple B part.

    // Simple B part:
    { freq: NOTES.D5, duration: BEAT * 2 }, // low D? Or loop?
    // Let's just Loop A section for MVP 8-bit feeling.
    // Actually, without B section it gets repetitive fast.
    // B Section:
    { freq: 587.33, duration: BEAT * 3 }, // D5
    { freq: 698.46, duration: BEAT * 1 }, // F5
    { freq: 880.00, duration: BEAT * 2 }, // A5
    { freq: 783.99, duration: BEAT * 1 }, // G5
    { freq: 698.46, duration: BEAT * 1 }, // F5

    { freq: 659.25, duration: BEAT * 3 }, // E5
    { freq: 523.25, duration: BEAT * 1 }, // C5
    { freq: 659.25, duration: BEAT * 2 }, // E5

    { freq: 587.33, duration: BEAT * 1 }, // D5
    { freq: 523.25, duration: BEAT * 1 }, // C5
    { freq: 493.88, duration: BEAT * 2 }, // B4
    { freq: 493.88, duration: BEAT * 1 }, // B4
    { freq: 523.25, duration: BEAT * 1 }, // C5

    { freq: 587.33, duration: BEAT * 2 }, // D5
    { freq: 659.25, duration: BEAT * 2 }, // E5
    { freq: 523.25, duration: BEAT * 2 }, // C5
    { freq: 440.00, duration: BEAT * 2 }, // A4
    { freq: 440.00, duration: BEAT * 2 }, // A4
];

export const useTetrisMusic = (isPlaying: boolean) => {
    const { isMuted } = useSoundContext();
    const [userEnabled, setUserEnabled] = useState(false); // Music toggle

    // Refs
    const audioCtxRef = useRef<AudioContext | null>(null);
    const oscillatorRef = useRef<OscillatorNode | null>(null);
    const gainNodeRef = useRef<GainNode | null>(null);
    const noteIndexRef = useRef(0);
    const nextNoteTimeRef = useRef(0);
    const timerIdRef = useRef<number | null>(null);
    const isPlayingRef = useRef(false);

    // Initialize Audio Context (must be user initiated ideally, but we'll try)
    const initAudio = useCallback(() => {
        if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return audioCtxRef.current;
    }, []);

    const playNote = useCallback((ctx: AudioContext, note: Note, time: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square'; // 8-bit feel
        osc.frequency.value = note.freq;

        // Envelope to avoid clicking
        gain.gain.setValueAtTime(0.05, time); // Low volume (0.1 max)
        gain.gain.exponentialRampToValueAtTime(0.01, time + note.duration - 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(time);
        osc.stop(time + note.duration);
    }, []);

    const scheduleNotes = useCallback(() => {
        const ctx = initAudio();
        if (!ctx) return;

        // Schedule up to 0.5s ahead
        while (nextNoteTimeRef.current < ctx.currentTime + 0.5) {
            const note = MELODY[noteIndexRef.current];
            playNote(ctx, note, nextNoteTimeRef.current);

            nextNoteTimeRef.current += note.duration;
            noteIndexRef.current = (noteIndexRef.current + 1) % MELODY.length;
        }

        timerIdRef.current = requestAnimationFrame(scheduleNotes);
    }, [initAudio, playNote]);

    const stopMusic = useCallback(() => {
        if (timerIdRef.current) {
            cancelAnimationFrame(timerIdRef.current);
            timerIdRef.current = null;
        }
        // We rely on nodes stopping themselves via stop(time)
        // But we should reset index if we want specific restart behavior? 
        // Usually looping music just pauses/resumes or restarts.
        // Let's restart for simplicity or keep index?
        // Restarting gives generic behavior.
        noteIndexRef.current = 0;
    }, []);

    const startMusic = useCallback(() => {
        const ctx = initAudio();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        nextNoteTimeRef.current = ctx.currentTime + 0.1;
        scheduleNotes();
    }, [initAudio, scheduleNotes]);

    // Effect to manage playback
    useEffect(() => {
        const shouldPlay = isPlaying && !isMuted && userEnabled;

        if (shouldPlay) {
            if (!timerIdRef.current) {
                startMusic();
            }
        } else {
            stopMusic();
        }

        return () => {
            stopMusic();
        };
    }, [isPlaying, isMuted, userEnabled, startMusic, stopMusic]);

    // Volume control via main gain node?
    // Currently implementing per-note gain inside playNote. 
    // It checks isMuted in the effect.

    return {
        isMusicEnabled: userEnabled,
        toggleMusic: () => setUserEnabled(p => !p)
    };
};
