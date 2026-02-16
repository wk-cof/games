import { css } from "@emotion/react";
import { motion } from "framer-motion";

export type DifficultyStage =
  | "static"
  | "wiggle"
  | "float"
  | "dance"
  | "rotate"
  | "scale"
  | "mirror"
  | "flash";

interface ShadowEmojiProps {
  emoji: string;
  rotation?: number;
  scale?: number;
  size?: string;
  mirror?: boolean;
  visible?: boolean;
}

const emojiStyles = (size: string, visible: boolean) => css`
  font-size: ${size};
  line-height: 1;
  user-select: none;
  filter: brightness(0) contrast(100%);
  opacity: ${visible ? 1 : 0};
  transition: opacity 0.2s ease-in-out;
`;

export function ShadowEmoji({
  emoji,
  rotation = 0,
  scale = 1,
  size = "8rem",
  mirror = false,
  visible = true,
}: ShadowEmojiProps) {
  return (
    <motion.div
      css={emojiStyles(size, visible)}
      animate={{
        rotate: rotation,
        scaleX: mirror ? -scale : scale, // Combine scale and mirror
        scaleY: scale,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      {emoji}
    </motion.div>
  );
}
