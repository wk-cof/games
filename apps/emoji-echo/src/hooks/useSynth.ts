import { useCallback, useRef, useEffect } from "react";

// Frequencies for C Major chord: C4, E4, G4, C5
const FREQUENCIES = [261.63, 329.63, 392.0, 523.25];

export function useSynth() {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on first user interaction if needed
    // But for now just create it. Browsers might block it until gesture.
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass();
    }

    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  const playTone = useCallback((index: number, duration = 0.3) => {
    if (!audioContextRef.current) return;

    // Resume context if suspended (browser autoplay policy)
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    const ctx = audioContextRef.current;

    // Create oscillator
    const osc = ctx.createOscillator();
    osc.type = "triangle"; // "Nintendo" sound
    osc.frequency.setValueAtTime(FREQUENCIES[index] || 440, ctx.currentTime);

    // Create gain node for envelope
    const gain = ctx.createGain();

    // Connect
    osc.connect(gain);
    gain.connect(ctx.destination);

    // Envelope
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.05); // Attack
    gain.gain.linearRampToValueAtTime(0, now + duration); // Release

    // Start/Stop
    osc.start(now);
    osc.stop(now + duration + 0.1);
  }, []);

  const playError = useCallback(() => {
    if (!audioContextRef.current) return;
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }

    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.4);

    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.4);
  }, []);

  return { playTone, playError };
}
