import { css } from "@emotion/react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

type BubbleProps = {
  id: string;
  emoji: string;
  x: number; // percentage 0-100
  speed: number; // duration in seconds
  errorTimestamp?: number;
  onPop: (id: string, x: number, y: number) => void;
  onMiss: (id: string) => void;
};

const bubbleStyles = css`
  position: absolute;
  bottom: -100px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.9),
    rgba(255, 255, 255, 0.4)
  );
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow:
    0 4px 10px rgba(0, 0, 0, 0.1),
    inset 0 0 20px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  cursor: pointer;
  user-select: none;
  touch-action: manipulation;
  z-index: 10;

  &::after {
    content: "";
    position: absolute;
    top: 15%;
    left: 15%;
    width: 20%;
    height: 12%;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.9);
    transform: rotate(-45deg);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Bubble = ({
  id,
  emoji,
  x,
  speed,
  errorTimestamp,
  onPop,
  onMiss,
}: BubbleProps) => {
  const controls = useAnimation();
  const floatControls = useAnimation();

  useEffect(() => {
    floatControls
      .start({
        y: "-120vh",
        transition: { duration: speed, ease: "linear" },
      })
      .then(() => {
        onMiss(id);
      });
  }, [floatControls, speed, onMiss, id]);

  useEffect(() => {
    if (errorTimestamp) {
      controls.start({
        x: [0, -10, 10, -10, 10, 0],
        backgroundColor: [
          "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4))",
          "radial-gradient(circle at 30% 30%, rgba(255, 200, 200, 0.9), rgba(255, 0, 0, 0.4))",
          "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.4))",
        ],
        transition: { duration: 0.4 },
      });
    }
  }, [errorTimestamp, controls]);

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    // Get click coordinates for particle effect origin
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY =
      "touches" in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    onPop(id, clientX, clientY);
  };

  return (
    <motion.div
      css={bubbleStyles}
      style={{ left: `${x}%` }}
      animate={floatControls}
      initial={{ y: "10vh" }}
      onMouseDown={handleClick}
      onTouchStart={handleClick}
    >
      <motion.div
        animate={controls}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
        }}
      >
        {emoji}
      </motion.div>
    </motion.div>
  );
};
