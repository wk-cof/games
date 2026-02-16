import type { ButtonHTMLAttributes, ReactNode } from "react";
import { css } from "@emotion/react";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: "solid" | "ghost";
  interactionSound?: boolean;
};

const solidStyles = css`
  border: 1px solid transparent;
  border-radius: var(--emoji-radius-pill);
  padding: 0.5rem 1.25rem;
  font-size: 0.95rem;
  font-weight: 600;
  background: var(--es-primary);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--es-shadow-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: var(--es-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--es-shadow-md);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ghostStyles = css`
  background: transparent;
  border: 1px solid var(--es-border);
  color: var(--es-text-secondary);
  box-shadow: none;

  &:hover {
    background: var(--es-surface);
    color: var(--es-text-primary);
    border-color: var(--es-text-secondary);
  }
`;

import { useGameSounds } from "../hooks/useGameSounds";

export function Button({
  icon,
  children,
  className,
  variant = "solid",
  onClick,
  interactionSound = true,
  ...props
}: ButtonProps) {
  const { playClick } = useGameSounds();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (interactionSound) {
      playClick();
    }
    onClick?.(e);
  };

  return (
    <button
      css={[solidStyles, variant === "ghost" && ghostStyles]}
      className={className}
      onClick={handleClick}
      {...props}
    >
      {icon ? (
        <span aria-hidden="true" style={{ marginRight: "0.35rem" }}>
          {icon}
        </span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
