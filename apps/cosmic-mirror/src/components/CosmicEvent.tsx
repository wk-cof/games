import { useEffect } from 'react';
import type { ActiveEvent } from '../hooks/useToddlerInput';

interface CosmicEventProps {
    event: ActiveEvent;
    onComplete: (id: string) => void;
}

export function CosmicEvent({ event, onComplete }: CosmicEventProps) {
    // Map types to CSS animation classes and durations
    const config = {
        standard: { className: 'anim-starburst', duration: 1500 },
        modifier: { className: 'anim-ripple', duration: 2000 },
        spacebar: { className: 'anim-orbit', duration: 2500 },
        supernova: { className: 'anim-supernova', duration: 3500 },
    };

    const { className, duration } = config[event.type] || config.standard;

    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete(event.id);
        }, duration);
        return () => clearTimeout(timer);
    }, [event.id, duration, onComplete]);

    // Slight random offset so overlapping keys still look distinct
    const offsetX = (Math.random() - 0.5) * 5;
    const offsetY = (Math.random() - 0.5) * 5;

    return (
        <div
            className={`cosmic-entity ${className}`}
            style={{
                left: `calc(${event.x}% + ${offsetX}vw)`,
                top: `calc(${event.y}% + ${offsetY}vh)`,
                zIndex: event.timestamp, // Newer events always on top
            }}
        >
            {event.type === 'spacebar' && (
                <>
                    <div className="moon moon-1" />
                    <div className="moon moon-2" />
                    <div className="moon moon-3" />
                </>
            )}
            {event.type === 'supernova' && (
                <>
                    <div className="nova-core" />
                    <div className="nova-ring ring-1" />
                    <div className="nova-ring ring-2" />
                </>
            )}
        </div>
    );
}
