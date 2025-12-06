# Shadow Shuffle 👥

Can you catch the shadow before it disappears?

## Concept
A fast-paced matching game where players must identify an emoji based solely on its silhouette (shadow).

## Progressive Difficulty ("The Spice")
To make this more than just a simple matching game, the shadows behave dynamically as you progress:

1.  **Stage 1 (Static)**: The shadow sits still. Good for learning the shapes.
2.  **Stage 2 (Wiggle)**: The shadow wiggles and rotates slightly, making it harder to track edges.
3.  **Stage 3 (Float)**: The shadow floats across the screen like a bubble. You have to catch it with your eyes.
4.  **Stage 4 (Dance)**: The shadow pulses and rotates while moving.

## Tech
- **Shadow Effect**: CSS `filter: brightness(0) contrast(100%)` (or `text-shadow` trick).
- **Movement**: `framer-motion` for smooth, performant animations.
