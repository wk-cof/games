
import { EMOJI_TO_LETTER } from '../game/data';


interface MappingLegendProps {
    visible?: boolean;
}

function Card({ children, style }: { children: React.ReactNode, style?: React.CSSProperties }) {
    return (
        <div style={{
            background: 'var(--es-surface)',
            borderRadius: 'var(--emoji-radius-md)',
            boxShadow: 'var(--es-shadow-md)',
            ...style
        }}>
            {children}
        </div>
    );
}

export function MappingLegend({ visible = true }: MappingLegendProps) {
    if (!visible) return null;

    return (
        <Card
            style={{
                position: 'fixed',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                maxHeight: '80vh',
                overflowY: 'auto',
                width: '180px',
                padding: '1rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
                zIndex: 10
            }}
        >
            <h3 style={{ gridColumn: 'span 2', textAlign: 'center', margin: '0 0 0.5rem 0' }}>Code</h3>
            {Object.entries(EMOJI_TO_LETTER).map(([emoji, letter]) => (
                <div key={letter} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '1.2rem',
                    padding: '2px 4px',
                    background: 'rgba(0,0,0,0.05)',
                    borderRadius: '4px'
                }}>
                    <span>{emoji}</span>
                    <strong>{letter}</strong>
                </div>
            ))}
        </Card>
    );
}
