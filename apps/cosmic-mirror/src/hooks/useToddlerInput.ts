import { useState, useEffect, useRef, useCallback } from 'react';
import { getCoordinateForKey } from './useKeyboardMap';

import { synthEngine } from '../audio/SynthEngine';

export type EventType = 'standard' | 'modifier' | 'spacebar' | 'supernova';

export interface ActiveEvent {
    id: string; // Unique ID per event
    x: number;
    y: number;
    type: EventType;
    timestamp: number;
}

const SUPERNOVA_THRESHOLD = 3; // 3+ keys pressed within buffer window = supernova
const BUFFER_WINDOW_MS = 60; // 60ms window to detect "palm mash"

export function useToddlerInput() {
    const [activeEvents, setActiveEvents] = useState<ActiveEvent[]>([]);
    const activeKeys = useRef<Set<string>>(new Set());

    // Buffer to store recent rapid keypresses
    const keyBuffer = useRef<{ code: string; timestamp: number }[]>([]);
    const bufferTimerRef = useRef<number | null>(null);

    const processBuffer = useCallback(() => {
        if (keyBuffer.current.length === 0) return;

        const now = Date.now();
        const buffer = [...keyBuffer.current];
        keyBuffer.current = []; // Clear immediately

        // Calculate center of mass for multiple keys
        if (buffer.length >= SUPERNOVA_THRESHOLD) {
            let sumX = 0, sumY = 0;
            buffer.forEach(k => {
                const coord = getCoordinateForKey(k.code);
                sumX += coord.x;
                sumY += coord.y;
            });
            const avgX = sumX / buffer.length;
            const avgY = sumY / buffer.length;

            synthEngine.play(avgY, 'supernova');

            setActiveEvents(prev => [
                ...prev,
                { id: `supernova-${now}`, x: avgX, y: avgY, type: 'supernova', timestamp: now }
            ]);
        } else {
            // Process normally
            const newEvents = buffer.map((k, index) => {
                const coord = getCoordinateForKey(k.code);
                synthEngine.play(coord.y, coord.type);
                return {
                    id: `evt-${now}-${index}`,
                    x: coord.x,
                    y: coord.y,
                    type: coord.type,
                    timestamp: now
                };
            });
            setActiveEvents(prev => [...prev, ...newEvents]);
        }

        if (bufferTimerRef.current) {
            clearTimeout(bufferTimerRef.current);
            bufferTimerRef.current = null;
        }
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            e.preventDefault();

            if (e.repeat) return;
            if (activeKeys.current.has(e.code)) return;

            activeKeys.current.add(e.code);

            // Add to buffer
            keyBuffer.current.push({ code: e.code, timestamp: Date.now() });

            // Start or reset buffer timer
            if (!bufferTimerRef.current) {
                bufferTimerRef.current = window.setTimeout(processBuffer, BUFFER_WINDOW_MS);
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            e.preventDefault();
            activeKeys.current.delete(e.code);
        };

        // Very aggressive protection
        const blockDefaults = (e: Event) => e.preventDefault();

        window.addEventListener('keydown', handleKeyDown, { capture: true });
        window.addEventListener('keyup', handleKeyUp, { capture: true });
        window.addEventListener('contextmenu', blockDefaults, { capture: true });
        window.addEventListener('wheel', blockDefaults, { capture: true, passive: false });

        return () => {
            window.removeEventListener('keydown', handleKeyDown, { capture: true });
            window.removeEventListener('keyup', handleKeyUp, { capture: true });
            window.removeEventListener('contextmenu', blockDefaults, { capture: true });
            window.removeEventListener('wheel', blockDefaults, { capture: true });
            if (bufferTimerRef.current) clearTimeout(bufferTimerRef.current);
        };
    }, [processBuffer]);

    const removeEvent = useCallback((id: string) => {
        setActiveEvents(prev => prev.filter(e => e.id !== id));
    }, []);

    return { activeEvents, removeEvent };
}
