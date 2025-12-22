
export type EmojiMapping = Record<string, string>;

export const EMOJI_TO_LETTER: EmojiMapping = {
    '🍎': 'A',
    '🐻': 'B',
    '🐱': 'C',
    '🐶': 'D',
    '🐘': 'E',
    '🐟': 'F',
    '🐐': 'G',
    '🐴': 'H',
    '🧊': 'I',
    '🧃': 'J',
    '🦘': 'K',
    '🦁': 'L',
    '🐵': 'M',
    '🪺': 'N',
    '🐙': 'O',
    '🐷': 'P',
    '👸': 'Q',
    '🐰': 'R',
    '🐍': 'S',
    '🐢': 'T',
    '☂️': 'U',
    '🌋': 'V',
    '🐳': 'W',
    '🩻': 'X',
    '🪀': 'Y',
    '🦓': 'Z',
};

// Reverse mapping for convenience
export const LETTER_TO_EMOJI: Record<string, string> = Object.entries(EMOJI_TO_LETTER).reduce(
    (acc, [emoji, letter]) => ({ ...acc, [letter]: emoji }),
    {}
);

export interface WordConfig {
    word: string;
    image?: string; // Optional image override or specialized asset
    // In future we could add difficulty, etc.
}

export interface LevelConfig {
    id: string;
    worldId: 1 | 2 | 3 | 4;
    targetWord: string;
    foils?: string[]; // Wrong answers for World 1 & 2
    family?: string; // For World 3
}

export const WORD_FAMILIES = {
    AT: ['CAT', 'BAT', 'HAT', 'MAT', 'RAT'],
    OG: ['DOG', 'LOG', 'FOG', 'HOG', 'JOG'],
    IG: ['PIG', 'DIG', 'FIG', 'BIG', 'WIG'],
    UN: ['SUN', 'RUN', 'BUN', 'FUN'],
    ET: ['JET', 'NET', 'VET', 'WET', 'PET'],
    EN: ['PEN', 'HEN', 'MEN', 'TEN'],
    OP: ['TOP', 'HOP', 'MOP', 'POP'],
    UG: ['BUG', 'RUG', 'MUG', 'HUG', 'TUG']
};

// Initial basic levels for testing
export const LEVELS: LevelConfig[] = [
    // World 1: Picture Decode
    // Words are chosen so their spelling emojis (First letter) DO NOT resemble the object itself
    // BOX = 🐻🐙🩻 -> 📦 (No Box emoji in spelling)
    // BED = 🐻🐘🐶 -> 🛏️ (No Bed emoji in spelling)
    // MAP = 🐵🍎🐷 -> 🗺️ (No Map emoji in spelling)
    { id: 'w1-1', worldId: 1, targetWord: 'BOX', foils: ['BED', 'MAP', 'FOX'] },
    { id: 'w1-2', worldId: 1, targetWord: 'BED', foils: ['BOX', 'MAP', 'SUN'] },
    { id: 'w1-3', worldId: 1, targetWord: 'MAP', foils: ['BOX', 'BED', 'RAT'] },

    // World 2: Word Decode
    { id: 'w2-1', worldId: 2, targetWord: 'SUN', foils: ['RUN', 'BUN'] },
    { id: 'w2-2', worldId: 2, targetWord: 'FOX', foils: ['BOX', 'SIX'] },

    // World 3: Word Families (-AT)
    { id: 'w3-1', worldId: 3, targetWord: 'CAT', family: 'AT' },
    { id: 'w3-2', worldId: 3, targetWord: 'HAT', family: 'AT' },
    { id: 'w3-3', worldId: 3, targetWord: 'BAT', family: 'AT' },

    // World 4: Encoding
    { id: 'w4-1', worldId: 4, targetWord: 'JET' },
    { id: 'w4-2', worldId: 4, targetWord: 'NET' },
];

export const WORLD_DESCRIPTIONS = {
    1: "Picture Decoder",
    2: "Word Explorer",
    3: "Pattern Master",
    4: "Master Coder"
};
