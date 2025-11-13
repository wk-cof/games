import type { ReactNode } from 'react';

export type ShellProps = {
  title: string;
  subtitle?: string;
  hud?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Shell({ title, subtitle, hud, footer, children, className }: ShellProps) {
  return (
    <div className={['em-shell', className].filter(Boolean).join(' ')}>
      <div className="em-shell__header">
        <p className="em-shell__subtitle">emoji minis</p>
        <h1 className="em-shell__title">{title}</h1>
        {subtitle ? <p className="em-shell__subtitle">{subtitle}</p> : null}
        {hud}
      </div>
      <div className="em-shell__surface">
        {children}
      </div>
      {footer ? <div className="em-shell__footer">{footer}</div> : null}
    </div>
  );
}
