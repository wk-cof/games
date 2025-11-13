import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { css } from '@emotion/react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant?: 'solid' | 'ghost';
};

const solidStyles = css`
  border: none;
  border-radius: var(--emoji-radius-md);
  padding: var(--emoji-spacing-sm) var(--emoji-spacing-lg);
  font-size: 1rem;
  font-weight: 600;
  background: var(--emoji-accent);
  color: var(--emoji-ink);
  cursor: pointer;
  transition: transform 120ms ease, filter 120ms ease;
  box-shadow: 0 10px 22px rgb(0 0 0 / 0.12);

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const ghostStyles = css`
  background: transparent;
  border: 2px solid rgb(0 0 0 / 0.12);
  box-shadow: none;
`;

export function Button({ icon, children, className, variant = 'solid', ...props }: ButtonProps) {
  return (
    <button css={[solidStyles, variant === 'ghost' && ghostStyles]} className={className} {...props}>
      {icon ? <span aria-hidden="true" style={{ marginRight: '0.35rem' }}>{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}
