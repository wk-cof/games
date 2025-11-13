import type { ReactNode } from 'react';
import { css } from '@emotion/react';

export type ShellProps = {
  title: string;
  subtitle?: string;
  hud?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

const shellStyles = css`
  min-height: 100vh;
  width: 100%;
  padding: clamp(1rem, 3vw, 2rem);
  display: flex;
  flex-direction: column;
  gap: var(--emoji-spacing-md);
  margin: 0;
`;

const headerStyles = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--emoji-spacing-md);
`;

const titleBlockStyles = css`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`;

const titleStyles = css`
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  margin: 0;
`;

const subtitleStyles = css`
  margin: 0;
  opacity: 0.65;
`;

const actionsStyles = css`
  display: flex;
  gap: var(--emoji-spacing-sm);
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const hudStyles = css`
  display: flex;
  gap: var(--emoji-spacing-sm);
  flex-wrap: wrap;
  align-items: center;
`;

const surfaceStyles = css`
  flex: 1;
  background: white;
  border-radius: var(--emoji-radius-lg);
  padding: clamp(0.75rem, 2vw, 1.5rem);
  box-shadow: 0 16px 35px rgb(0 0 0 / 0.12);
  display: flex;
  flex-direction: column;
  gap: var(--emoji-spacing-md);
`;

export function Shell({ title, subtitle, hud, actions, children, className }: ShellProps) {
  return (
    <div css={shellStyles} className={className}>
      <div css={headerStyles}>
        <div css={titleBlockStyles}>
          <h1 css={titleStyles}>{title}</h1>
          {subtitle ? <p css={subtitleStyles}>{subtitle}</p> : null}
        </div>
        {actions ? <div css={actionsStyles}>{actions}</div> : null}
      </div>
      {hud ? <div css={hudStyles}>{hud}</div> : null}
      <div css={surfaceStyles}>{children}</div>
    </div>
  );
}
