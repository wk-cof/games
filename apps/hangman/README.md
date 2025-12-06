# Word Whiz (Hangman) - Game Design

**Status**: Concept Phase
**Target Audience**: Early Childhood (Ages 4-7)

## 1. Concept Overview
"Word Whiz" is a friendly adaptation of the classic Hangman game. Instead of the traditional "hanging" imagery, which can be scary or inappropriate for young children, we use a **"Build a Snowman"** metaphor.

**Goal**: Guess the hidden word letter by letter before the snowman melts (or conversely, build the snowman before the sun comes out).

![Word Whiz Concept](/Users/mikhail/.gemini/antigravity/brain/041e94d9-b96d-49c1-a8fd-b134aabb13f9/word_whiz_concept_1765038190592.png)

## 2. Child Development Goals

### 🧠 Language & Literacy
-   **Phonemic Awareness**: Recognizing letter-sound relationships.
-   **Vocabulary Building**: Learning new words associated with emojis (e.g., guessing "APPLE" while seeing a blurred 🍎).
-   **Spelling**: Practicing correct letter sequencing.

### 🧩 Cognitive Skills
-   **Deductive Reasoning**: Using known letters to guess unknown ones.
-   **Pattern Recognition**: Identifying common word structures (e.g., "TH", "ING").

### 😌 Emotional Resilience
-   **Trial and Error**: Learning that making mistakes is part of the learning process. The "Snowman" metaphor makes "losing" feel less harsh—you just try again to build him next time!

## 3. Gameplay Mechanics

### The Loop
1.  **Puzzle**: A word is chosen (e.g., "TIGER"). The screen shows `_ _ _ _ _`.
2.  **Hint**: A blurred or silhouette version of the corresponding emoji (🐯) is shown as a hint.
3.  **Guessing**: The child taps letters on the virtual keyboard.
    -   **Correct**: The letter fills in the blank.
    -   **Wrong**: A part of the "melting sun" appears (or a part of the snowman disappears/fails to build).
4.  **Win**: The word is complete! The emoji reveals fully, and the snowman dances.
5.  **Lose**: The sun comes out fully (or snowman melts). The word is revealed, and the child can try again.

## 4. Visual Design ("Emoji Suite")
-   **Palette**: Cool blues and whites for the winter theme, with the standard "Emoji Suite" vibrant accents.
-   **Typography**: Large, clear `Inter` font for letters.
-   **Feedback**:
    -   **Correct**: Green flash, happy chime.
    -   **Wrong**: Gentle shake, "whoops" sound.

## 5. Technical Implementation
-   **Word List**: Curated list of simple, emoji-mappable words (Animals, Food, Weather).
-   **State Management**: Track `guessedLetters`, `mistakes`, `currentWord`.
-   **Components**: `WordDisplay`, `Keyboard`, `SnowmanDisplay` (SVG or Emoji composition).
