import { useSound } from "../hooks/useSound";

import clickSound from "../assets/sounds/click.mp3";
import successSound from "../assets/sounds/success.mp3";
import errorSound from "../assets/sounds/error.mp3";

export const useGameSounds = (overrides?: {
  click?: string;
  success?: string;
  error?: string;
}) => {
  const { play: playClick } = useSound(overrides?.click || clickSound, {
    volume: 0.5,
  });
  const { play: playSuccess } = useSound(overrides?.success || successSound, {
    volume: 0.5,
  });
  const { play: playError } = useSound(overrides?.error || errorSound, {
    volume: 0.5,
  });

  return { playClick, playSuccess, playError };
};
