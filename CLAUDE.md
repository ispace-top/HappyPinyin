# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

HappyPinyin (快乐拼音) is a Vue 3 + TypeScript SPA that teaches children pinyin through interactive games and a syllable builder. It is a pure static frontend with zero backend dependencies, served via any static file server or Docker+Nginx.

## Commands

```bash
npm install          # Install dependencies (Node.js >= 20)
npm run dev          # Start Vite dev server → http://localhost:5173
npm run build        # Type-check (vue-tsc) + production build → dist/
npm run preview      # Preview production build locally
```

There is no test runner or linter currently configured.

## Architecture

### Routing (Hash Mode)

`src/router/index.ts` — Vue Router 4 with `createWebHashHistory`. All routes are lazy-loaded. Zone routes (`/game/forest`, `/game/workshop`, `/game/typing`, `/game/bubble`) have `beforeEnter` guards that check `isZoneUnlocked()` from `kingdomStorage.ts`. The dynamic route `/game/play/:gameId` handles individual game sessions.

### App Shell

`src/App.vue` provides a standard layout: `AppHeader` (desktop top nav), `<RouterView>` with fade transitions, `MobileNav` (bottom tab bar), `AppFooter`. Responsive breakpoints at 640px and 1024px.

### Page Architecture

| Route | Page | Description |
|-------|------|-------------|
| `/` | `HomePage` | Landing page |
| `/browser` | `BrowserPage` | Browse 63 pinyin elements by category |
| `/builder` | `BuilderPage` | Step-by-step syllable builder (initial → final → tone → result) |
| `/game` | `kingdom/KingdomPage` | Game hub showing 4 themed zones |
| `/game/forest` | `kingdom/ForestPage` | Recognition games for initials & finals |
| `/game/workshop` | `kingdom/WorkshopPage` | Spelling games (pick initial + final for a heard character) |
| `/game/typing` | `kingdom/TypingPage` | Keyboard typing games |
| `/game/bubble` | `kingdom/BubblePage` | Bubble pop recognition games |
| `/game/play/:gameId` | `kingdom/GamePlayPage` | Generic game session — loads the right mechanic component based on `GameConfig.mechanic` |
| `/about` | `AboutPage` | About page |

### Game Engines (Two Generations)

**Legacy engine** (`src/composables/useGameEngine.ts` + `src/types/game.ts` + `src/utils/gameStorage.ts`):
- Powers the original 6-level bubble-popping game on the `/game` route's old GamePage.
- Simple state machine: `idle → countdown → playing → feedback → result`.
- Pure recognition mechanic: hear a pinyin sound, tap the matching bubble.
- Persists to localStorage key `happypinyin_game_data` (version 1).

**Kingdom engine** (`src/composables/useKingdomGameEngine.ts` + `src/types/kingdom.ts` + `src/utils/kingdomStorage.ts`):
- Powers the zone-based games (forest, workshop, typing, bubble).
- Same phase state machine but supports multiple mechanics: `recognition`, `spelling`, `typing`, `bubble`.
- Round generation differs by mechanic: recognition generates bubble-option rounds; spelling/typing generate initial+final selection rounds with optional tone.
- Persists to localStorage key `happypinyin_kingdom_data` (version 2) with automatic migration from legacy v1 data.
- Zone unlocking is gated by total earned stars across all games.

**Scoring** is shared via `src/utils/gameUtils.ts`: first-try=10pts, second-try=6pts, third+=3pts, combo bonuses at 3 and 6 streak. Stars: ≥100=3⭐, ≥65=2⭐, ≥40=1⭐.

### Builder State Machine

`src/composables/useBuilder.ts` — A Redux-like reducer pattern. State flows through steps: `initial → final → tone → result`. The `medial` (介母) is a filter within the `final` step, not a separate step. `SELECT_MEDIAL` stays on the `final` step. Available medials/finals are dynamically filtered from `syllableCombinations` data (via `pinyinFilter.ts`) — only legal pinyin combinations are shown.

### Speech & Audio

**TTS fallback chain** (`useSpeech.ts` → `speechService.ts` + `pinyinAudio.ts`):
1. Try local MP3 from `/public/audio/{initials|finals|whole-syllables}/{text}.mp3`
2. Fall back to browser `SpeechSynthesis` API (zh-CN voice, rate 0.7)
3. `pinyinToSpeech()` in `pinyinFilter.ts` translates Latin pinyin letters to Chinese characters so TTS reads "b" as "播" not "bee"

`syllableChars.ts` maps pinyin syllables to example Chinese characters/words for display and TTS context.

### Data Layer

All content is static TypeScript data under `src/data/`:

- `initials.ts`, `finals.ts`, `wholeSyllables.ts` — 63 pinyin `PinyinElement[]` (23 initials, 24 finals, 16 whole syllables)
- `syllableCombinations.ts` — ~400 legal pinyin combinations with tone variants
- `zones.ts` — 4 zone configs with unlock requirements
- `games.ts`, `forestGames.ts`, `workshopGames.ts`, `typingGames.ts`, `bubbleGames.ts` — per-zone game configs
- `stickers.ts`, `achievements.ts` — reward system definitions
- `kingdom.ts` — barrel re-export for all kingdom data

### Styling

CSS Custom Properties defined in `src/styles/variables.css` — brand colors, category colors (声母 blue, 单韵母 pink, 复韵母 green, 整体认读 yellow), tone colors, spacing (4px base), typography scale. Components use CSS Modules (`<style scoped>`). CSS Modules are the standard; do not introduce a CSS-in-JS library.

### Key Types

- `PinyinElement` (`src/types/pinyin.ts`) — the core data shape: `{ id, text, category, subCategory, pronunciation, ... }`
- `BuilderState` / `BuilderAction` — reducer state machine types
- `GameConfig` (`src/types/kingdom.ts`) — zone game configuration with mechanic, pool, option count, etc.
- `KingdomSaveData` — localStorage persistence schema (version 2)

### Build & Deploy

- `vite.config.ts` — `@` path alias → `./src`, Vue plugin only
- `Dockerfile` — multi-stage: Node build → Nginx serve (port 80)
- `nginx.conf` — SPA mode (try_files $uri /index.html), gzip, cache headers for audio/assets
- `vercel.json` — Vercel deploy config
- GitHub Actions (`release.yml`) — on release published, builds multi-arch Docker image (amd64+arm64), pushes to Docker Hub with semver tags
