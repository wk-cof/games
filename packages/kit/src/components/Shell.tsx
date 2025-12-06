import type { ReactNode } from 'react';
import { css } from '@emotion/react';

export type NavItem = {
  label: string;
  icon: string;
  href?: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

export type ShellProps = {
  title: string;
  subtitle?: string;
  hud?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  hideHeader?: boolean;
  noSurface?: boolean;
  navItems?: NavItem[];
};

const shellContainer = css`
  min-height: 100vh;
  display: flex;
  background: var(--es-background);
  color: var(--es-text-primary);
`;

const sidebarStyles = css`
  width: 260px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border-right: 1px solid var(--es-border);
  padding: 2rem 1.5rem;
  display: none;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: 0;
  height: 100vh;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const mobileNavStyles = css`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  border-top: 1px solid var(--es-border);
  padding: 0.75rem;
  display: flex;
  justify-content: space-around;
  z-index: 50;

  @media (min-width: 768px) {
    display: none;
  }
`;

const mainContentStyles = css`
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 100%;
  overflow-x: hidden;

  @media (min-width: 768px) {
    padding: 3rem;
  }
`;

const headerStyles = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const titleStyles = css`
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, var(--es-primary), #818CF8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const sidebarTitleStyles = css`
  font-size: 1.5rem; 
  font-weight: 800; 
  padding: 0 1rem;
  background: linear-gradient(135deg, var(--es-primary), #818CF8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const navItemStyles = (active: boolean) => css`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--emoji-radius-md);
  color: ${active ? 'var(--es-primary)' : 'var(--es-text-secondary)'};
  background: ${active ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
  width: 100%;
  font-size: 1rem;
  text-align: left;

  &:hover {
    background: rgba(99, 102, 241, 0.05);
    color: var(--es-primary);
  }
`;

export function Shell({
  title,
  subtitle,
  hud,
  actions,
  children,
  className,
  hideHeader = false,
  noSurface = false,
  navItems = []
}: ShellProps) {
  const NavContent = () => (
    <>
      {navItems.map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          css={navItemStyles(!!item.isActive)}
        >
          <span>{item.icon}</span> {item.label}
        </button>
      ))}
    </>
  );

  return (
    <div css={shellContainer} className={className}>
      <aside css={sidebarStyles}>
        <div css={sidebarTitleStyles}>
          Emoji Minis
        </div>
        <nav css={css`display: flex; flex-direction: column; gap: 0.5rem;`}>
          <NavContent />
        </nav>
      </aside>

      <main css={mainContentStyles}>
        {!hideHeader && (
          <header css={headerStyles}>
            <div>
              <h1 css={titleStyles}>{title}</h1>
              {subtitle && <p css={css`color: var(--es-text-secondary); margin: 0.5rem 0 0;`}>{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </header>
        )}
        {hud && <div css={css`margin-bottom: 2rem;`}>{hud}</div>}
        {children}
      </main>

      {navItems.length > 0 && (
        <nav css={mobileNavStyles}>
          <NavContent />
        </nav>
      )}
    </div>
  );
}
