import { useEffect, useRef, useCallback } from "react";
import { Howl, HowlOptions } from "howler";
import { useSoundContext } from "../components/SoundProvider";

export const useSound = (
  src: string,
  options: Omit<HowlOptions, "src"> = {},
) => {
  const soundRef = useRef<Howl | null>(null);
  const { isMuted } = useSoundContext();

  useEffect(() => {
    soundRef.current = new Howl({
      src: [src],
      ...options,
      mute: isMuted, // Initialize with current mute state
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, [src, JSON.stringify(options)]);

  // Update mute state when context changes
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.mute(isMuted);
    }
  }, [isMuted]);

  const play = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.play();
    }
  }, []);

  const stop = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.stop();
    }
  }, []);

  const pause = useCallback(() => {
    if (soundRef.current) {
      soundRef.current.pause();
    }
  }, []);

  return { play, stop, pause, sound: soundRef.current };
};
