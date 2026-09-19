# Our Little Memories

Next.js website with three questions, seven tulip memories, a QR clue, and a 12-piece LEGO heart puzzle.

## Run

On this Windows workspace, double-click `start-local.cmd` to use the downloaded local Node.js runtime. On another machine, install Node.js 22 or newer, then:

```
npm install
npm run dev
```

Open http://localhost:3000. Build for deployment with `npm run build`, then `npm start`.

## Personalize

Replace placeholder photos in `public/memories` and edit titles, captions, and photo paths in `src/data/memories.ts`. No personal photos were supplied; all seven entries are explicitly placeholders.

The QR uses the current browser origin plus /lego. Deploy on a publicly reachable domain for phone scanning. For phone testing on your local network, run the production build (`npm run build`, then `npm start`) and open the site using your computer's LAN address. Both devices must be on the same network. The development server only allows localhost and the configured test origin.

## Puzzle

Drag each lettered brick onto its matching heart outline. Mouse and touch use pointer capture. Keyboard users can focus a brick and press Enter or Space to place it. Correct pieces lock; progress persists in localStorage when browser storage is available. Storage errors do not interrupt play.

A reset button appears only in development. The message and final scene require separate button presses. Reduced-motion preferences disable decorative animation.

## Checks

`npm run typecheck`
`npm run build`
`npm test` (install the Playwright Chromium browser first with `npx playwright install chromium`).
