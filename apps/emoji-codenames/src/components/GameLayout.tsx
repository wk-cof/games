
import { ReactNode } from 'react';
import { Shell } from '@emoji-minis/kit';

interface GameLayoutProps {
    children: ReactNode;
    title: string;
    onBack?: () => void;
    levelProgress: string; // e.g. "Level 1/5"
}

export function GameLayout({ children, title, onBack, levelProgress }: GameLayoutProps) {
    return (
        <Shell
            title={title}
            leftAction={onBack ? { icon: 'arrow-left', onClick: onBack } : undefined}
            rightAction={{ icon: 'settings', onClick: () => console.log('settings') }} // Placeholder
        >
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                paddingTop: '2rem'
            }}>
                <div style={{ marginBottom: '1rem', color: 'var(--es-text-secondary)' }}>
                    {levelProgress}
                </div>
                {children}
            </div>
        </Shell>
    );
}
