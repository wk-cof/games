import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
};

export function Button({ icon, children, className, ...props }: ButtonProps) {
  return (
    <button className={['em-button', className].filter(Boolean).join(' ')} {...props}>
      {icon ? <span aria-hidden="true" style={{ marginRight: '0.35rem' }}>{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}
