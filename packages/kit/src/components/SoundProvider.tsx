import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Howler } from "howler";

interface SoundContextType {
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    // Initialize from local storage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("emoji-minis-mute");
      return saved === "true";
    }
    return false;
  });

  const [volume] = useState(1);

  useEffect(() => {
    Howler.mute(isMuted);
    localStorage.setItem("emoji-minis-mute", String(isMuted));
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute, volume }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSoundContext = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSoundContext must be used within a SoundProvider");
  }
  return context;
};
