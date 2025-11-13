import type { ReactNode } from 'react';

export type HUDItem = {
  label: ReactNode;
  value: ReactNode;
};

export type HUDProps = {
  items: HUDItem[];
  className?: string;
};

export function HUD({ items, className }: HUDProps) {
  return (
    <div className={['em-hud', className].filter(Boolean).join(' ')}>
      {items.map((item, index) => (
        <div key={index} className="em-hud__item">
          <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{item.label}</div>
          <div style={{ fontWeight: 700 }}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
