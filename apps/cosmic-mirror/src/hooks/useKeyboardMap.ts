export interface KeyCoordinate {
    x: number; // percentage (0-100)
    y: number; // percentage (0-100)
    type: 'standard' | 'modifier' | 'spacebar';
}

// Based on a typical Apple Magic/M1 Pro keyboard map layout
export const M1_KEY_MAP: Record<string, KeyCoordinate> = {
    // --- FUNCTION ROW (y: ~5%) ---
    Escape: { x: 5, y: 5, type: 'modifier' },
    F1: { x: 13, y: 5, type: 'standard' },
    F2: { x: 20, y: 5, type: 'standard' },
    F3: { x: 27, y: 5, type: 'standard' },
    F4: { x: 34, y: 5, type: 'standard' },
    F5: { x: 41, y: 5, type: 'standard' },
    F6: { x: 48, y: 5, type: 'standard' },
    F7: { x: 55, y: 5, type: 'standard' },
    F8: { x: 62, y: 5, type: 'standard' },
    F9: { x: 69, y: 5, type: 'standard' },
    F10: { x: 76, y: 5, type: 'standard' },
    F11: { x: 83, y: 5, type: 'standard' },
    F12: { x: 90, y: 5, type: 'standard' },
    // TouchID / Eject often doesn't register a standard usable e.code, but mapped to ~95

    // --- NUMBER ROW (y: ~20%) ---
    Backquote: { x: 5, y: 20, type: 'standard' },
    Digit1: { x: 12, y: 20, type: 'standard' },
    Digit2: { x: 19, y: 20, type: 'standard' },
    Digit3: { x: 26, y: 20, type: 'standard' },
    Digit4: { x: 33, y: 20, type: 'standard' },
    Digit5: { x: 40, y: 20, type: 'standard' },
    Digit6: { x: 47, y: 20, type: 'standard' },
    Digit7: { x: 54, y: 20, type: 'standard' },
    Digit8: { x: 61, y: 20, type: 'standard' },
    Digit9: { x: 68, y: 20, type: 'standard' },
    Digit0: { x: 75, y: 20, type: 'standard' },
    Minus: { x: 82, y: 20, type: 'standard' },
    Equal: { x: 89, y: 20, type: 'standard' },
    Backspace: { x: 96, y: 20, type: 'modifier' },

    // --- TOP LETTERS (y: ~38%) ---
    Tab: { x: 7, y: 38, type: 'modifier' },
    KeyQ: { x: 16, y: 38, type: 'standard' },
    KeyW: { x: 23, y: 38, type: 'standard' },
    KeyE: { x: 30, y: 38, type: 'standard' },
    KeyR: { x: 37, y: 38, type: 'standard' },
    KeyT: { x: 44, y: 38, type: 'standard' },
    KeyY: { x: 51, y: 38, type: 'standard' },
    KeyU: { x: 58, y: 38, type: 'standard' },
    KeyI: { x: 65, y: 38, type: 'standard' },
    KeyO: { x: 72, y: 38, type: 'standard' },
    KeyP: { x: 79, y: 38, type: 'standard' },
    BracketLeft: { x: 86, y: 38, type: 'standard' },
    BracketRight: { x: 93, y: 38, type: 'standard' },
    Backslash: { x: 98, y: 38, type: 'standard' },

    // --- HOME LETTERS (y: ~56%) ---
    CapsLock: { x: 9, y: 56, type: 'modifier' },
    KeyA: { x: 18, y: 56, type: 'standard' },
    KeyS: { x: 25, y: 56, type: 'standard' },
    KeyD: { x: 32, y: 56, type: 'standard' },
    KeyF: { x: 39, y: 56, type: 'standard' },
    KeyG: { x: 46, y: 56, type: 'standard' },
    KeyH: { x: 53, y: 56, type: 'standard' },
    KeyJ: { x: 60, y: 56, type: 'standard' },
    KeyK: { x: 67, y: 56, type: 'standard' },
    KeyL: { x: 74, y: 56, type: 'standard' },
    Semicolon: { x: 81, y: 56, type: 'standard' },
    Quote: { x: 88, y: 56, type: 'standard' },
    Enter: { x: 96, y: 56, type: 'modifier' },

    // --- BOTTOM LETTERS (y: ~74%) ---
    ShiftLeft: { x: 12, y: 74, type: 'modifier' },
    KeyZ: { x: 21, y: 74, type: 'standard' },
    KeyX: { x: 28, y: 74, type: 'standard' },
    KeyC: { x: 35, y: 74, type: 'standard' },
    KeyV: { x: 42, y: 74, type: 'standard' },
    KeyB: { x: 49, y: 74, type: 'standard' },
    KeyN: { x: 56, y: 74, type: 'standard' },
    KeyM: { x: 63, y: 74, type: 'standard' },
    Comma: { x: 70, y: 74, type: 'standard' },
    Period: { x: 77, y: 74, type: 'standard' },
    Slash: { x: 84, y: 74, type: 'standard' },
    ShiftRight: { x: 95, y: 74, type: 'modifier' },

    // --- MODIFIERS & SPACE (y: ~90%) ---
    ControlLeft: { x: 5, y: 90, type: 'modifier' },
    AltLeft: { x: 12, y: 90, type: 'modifier' }, // Option
    MetaLeft: { x: 20, y: 90, type: 'modifier' }, // Command
    Space: { x: 45, y: 90, type: 'spacebar' },
    MetaRight: { x: 70, y: 90, type: 'modifier' },
    AltRight: { x: 77, y: 90, type: 'modifier' },
    ArrowLeft: { x: 84, y: 90, type: 'modifier' },
    ArrowUp: { x: 91, y: 85, type: 'modifier' },
    ArrowDown: { x: 91, y: 95, type: 'modifier' },
    ArrowRight: { x: 98, y: 90, type: 'modifier' },
};

export function getCoordinateForKey(code: string): KeyCoordinate {
    return M1_KEY_MAP[code] || { x: 50, y: 50, type: 'standard' }; // Fallback to center if unknown key
}
