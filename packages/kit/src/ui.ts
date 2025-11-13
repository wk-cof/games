const TOAST_ROOT_ID = 'emoji-kit-toast-root';

function ensureToastRoot(): HTMLElement {
  let root = document.getElementById(TOAST_ROOT_ID);
  if (!root) {
    root = document.createElement('div');
    root.id = TOAST_ROOT_ID;
    root.className = 'em-toast-root';
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
  el.className = 'em-toast';
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
