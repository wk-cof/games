const TOAST_ROOT_ID = 'emoji-kit-toast-root';

function ensureToastRoot(): HTMLElement {
  let root = document.getElementById(TOAST_ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = TOAST_ROOT_ID;
    Object.assign(root.style, {
      position: 'fixed',
      bottom: 'var(--emoji-spacing-lg)',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '1000',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--emoji-spacing-sm)'
    });
    document.body.appendChild(root);
  }
  return root;
}

export type ToastOptions = {
  duration?: number;
};

export function toast(message: string, options: ToastOptions = {}) {
  if (typeof document === 'undefined') {
    return;
  }
  const duration = options.duration ?? 2200;
  const root = ensureToastRoot();
  const el = document.createElement('div');
  Object.assign(el.style, {
    background: 'var(--emoji-accent)',
    color: 'var(--emoji-ink)',
    padding: 'var(--emoji-spacing-sm) var(--emoji-spacing-md)',
    borderRadius: 'var(--emoji-radius-md)',
    boxShadow: '0 10px 25px rgb(0 0 0 / 0.2)',
    animation: 'toast-pop 160ms ease'
  });
  el.textContent = message;
  root.appendChild(el);
  window.setTimeout(() => {
    el.remove();
    if (!root.hasChildNodes()) {
      root.remove();
    }
  }, duration);
}

export function wrongShake(target?: HTMLElement | null) {
  if (!target) return;
  target.style.animation = 'none';
  target.offsetHeight; // force reflow
  target.style.animation = 'wrong-shake 400ms ease';
}

export type Star = {
  id: string;
  x: number;
  y: number;
  delay: number;
  scale: number;
};

export function stars(count = 12): Star[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `star-${index}-${Math.random().toString(36).slice(2, 6)}`,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 0.8,
    scale: 0.5 + Math.random() * 0.8,
  }));
}
