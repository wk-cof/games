import { css } from '@emotion/react';
import { useEffect, useMemo, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Button } from './Button';

export type SettingsDialogProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

const backdropStyles = css`
  position: fixed;
  inset: 0;
  background: rgb(15 23 42 / 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  z-index: 1000;
`;

const panelStyles = css`
  width: min(640px, 100%);
  max-height: 90vh;
  background: #ffffff;
  border-radius: var(--emoji-radius-lg);
  padding: clamp(1.25rem, 2vw, 2rem);
  box-shadow: 0 30px 60px rgb(15 23 42 / 0.24);
  display: flex;
  flex-direction: column;
  gap: var(--emoji-spacing-md);
  overflow-y: auto;
`;

const headerStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--emoji-spacing-sm);
`;

export function SettingsDialog({ open, onClose, title = 'Settings', children }: SettingsDialogProps) {
  useEffect(() => {
    if (!open) {
      document.body.style.removeProperty('overflow');
      return;
    }

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);

    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.removeProperty('overflow');
    };
  }, [open, onClose]);

  const content = useMemo(() => {
    if (!open) {
      return null;
    }

    return (
      <div
        css={backdropStyles}
        role="presentation"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            onClose();
          }
        }}
      >
        <section css={panelStyles} role="dialog" aria-modal="true" aria-label={title}>
          <header css={headerStyles}>
            <h2>{title}</h2>
            <Button type="button" variant="ghost" onClick={onClose} aria-label="Close settings">
              ×
            </Button>
          </header>
          <div>{children}</div>
        </section>
      </div>
    );
  }, [children, onClose, open, title]);

  if (!content) {
    return null;
  }

  if (typeof document !== 'undefined') {
    return createPortal(content, document.body);
  }

  return content;
}

export default SettingsDialog;
