import { useSoundContext } from "./SoundProvider";
import { Button } from "./Button";

export const SoundToggle = () => {
  const { isMuted, toggleMute } = useSoundContext();

  return (
    <Button
      variant="ghost"
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute sound" : "Mute sound"}
      css={{ minWidth: "auto", padding: "0.5rem" }}
    >
      {isMuted ? "🔇" : "🔊"}
    </Button>
  );
};
