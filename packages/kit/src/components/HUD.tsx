import type { ReactNode } from 'react';
import { css } from '@emotion/react';

export type HUDItem = {
  label: ReactNode;
  value: ReactNode;
  tone?: 'neutral' | 'accent' | 'success';
  active?: boolean;
};

export type HUDProps = {
  items: HUDItem[];
  className?: string;
};

const containerStyles = css`
  display: flex;
  gap: var(--emoji-spacing-sm);
  flex-wrap: wrap;
  align-items: center;
`;

const baseItemStyles = css`
  padding: 0.35rem 1rem;
  border-radius: 999px;
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  font-weight: 700;
  box-shadow: 0 10px 20px rgb(0 0 0 / 0.08);
`;

const toneStyles = {
  neutral: css`
    background: rgba(0, 0, 0, 0.05);
    color: var(--emoji-ink);
  `,
  accent: css`
    background: rgba(99, 102, 241, 0.18);
    color: #2f1b74;
  `,
  success: css`
    background: rgba(16, 185, 129, 0.2);
    color: #065f46;
  `
};

const activeStyles = css`
  box-shadow: 0 14px 24px rgb(0 0 0 / 0.12);
`;

const labelStyles = css`
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  opacity: 0.85;
`;

const valueStyles = css`
  font-size: 1.05rem;
`;

export function HUD({ items, className }: HUDProps) {
  return (
    <div css={containerStyles} className={className}>
      {items.map((item, index) => (
        <div
          key={index}
          css={[baseItemStyles, toneStyles[item.tone ?? 'neutral'], item.active && activeStyles]}
        >
          <div css={labelStyles}>{item.label}</div>
          <div css={valueStyles}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
