# Kith

A desktop learning companion that lives on your screen. Pick a pet — cat, robot, or a custom avatar — and it helps you master reading-heavy fields by directing, teaching, and fetching. It asks questions instead of giving answers.

Think of it as a **GPS for mastery**. Kith knows your destination, knows where you are, lays the road ahead, tells you the next turn, and reroutes when you drift — but you still drive.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Electron** — transparent always-on-top desktop window
- **Framer Motion** — all animations
- **Tailwind CSS v4** — styling
- **Zustand** — state management

## How it works

The pet floats on your desktop as a small transparent window. It breathes, blinks, and sways on its own. You can:

- **Drag** it anywhere on screen
- **Click** to see notification bubbles (hooks, connections, fetch suggestions, direction nudges)
- **Right-click** to cycle between pets (cat, robot, avatar, boss)
- **Drop files** on it — readable files (md, pdf, txt) get eaten; non-readable files get a disgusted reaction
- **Hover** to make it happy

Each pet has its own sounds and visual style but shares the same state machine and behavior system.
