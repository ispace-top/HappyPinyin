# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

HappyPinYin（快乐拼音） — a Web-based Chinese Pinyin learning tool for children aged 5-8. The application helps preschoolers and early elementary students learn Hanyu Pinyin through interactive browsing and a syllable-building tool. Runs entirely in the browser with no backend.

## Tech Stack

- **Framework**: Vue 3 + TypeScript
- **Build**: Vite 6
- **Router**: Vue Router 4 (Hash mode)
- **Styling**: CSS Modules + CSS Custom Properties (design tokens in `src/styles/variables.css`)
- **Speech**: Web Speech API (SpeechSynthesis) wrapped in `src/services/speechService.ts`
- **Deployment**: Static SPA, no backend required

## Project Structure

```
src/
├── main.ts / App.vue           # Entry + root layout
├── router/index.ts             # 3 lazy-loaded routes
├── types/pinyin.ts             # All TS interfaces
├── data/                       # Pinyin dataset (static)
│   ├── initials.ts             # 23 initials (声母)
│   ├── finals.ts               # 6 single + 18 compound finals (韵母)
│   ├── wholeSyllables.ts       # 16 whole syllables (整体认读音节)
│   └── syllableCombinations.ts # ~400 valid syllable decompositions
├── utils/
│   ├── pinyinFilter.ts         # Smart filter logic + pinyin→Chinese speech conversion
│   ├── toneMark.ts             # Tone mark application + ü→u display rule
│   └── syllableChars.ts        # Syllable→Chinese character + word examples mapping
├── services/speechService.ts   # SpeechSynthesis singleton (voice selection, queue)
├── composables/
│   ├── useSpeech.ts            # speak() + speakSequence()
│   └── useBuilder.ts           # Builder state machine (reactive + 6 actions)
├── components/
│   ├── common/                 # AudioButton, PinyinCard, PandaMascot, CelebrationEffect
│   ├── layout/                 # AppHeader, MobileNav
│   └── builder/                # BuilderStepper, SelectorGrid, TonePicker
├── pages/
│   ├── HomePage.vue            # Landing page with navigation cards
│   ├── BrowserPage.vue         # Categorized pinyin browsing + sequential TTS
│   └── BuilderPage.vue         # Interactive spelling builder
└── styles/
    ├── variables.css           # Design tokens (colors, spacing, radii, shadows, transitions)
    └── global.css              # Reset + utilities + reduced-motion
```

## Key Design Decisions

- **Data-driven filtering**: Valid initial+medial+final combinations are stored as data in `syllableCombinations.ts`. Filter functions query this dataset — no hardcoded phonological rules.
- **Medial encoding**: `ü` is stored internally as `"v"` to distinguish from `u`. Display converts back via `medialDisplay()`.
- **TTS pronunciation**: All pronunciation text uses Chinese characters (not romanized pinyin), because SpeechSynthesis with `zh-CN` voices reads characters correctly. The `pinyinToSpeech()` utility converts any Latin pinyin substring to its Chinese character equivalent.
- **Builder state**: Uses a reactive object driven by a `dispatch(action)` pattern. 5 sequential steps: initial → medial → final → tone → result.
- **No generic SFC components**: Previous use of `<script setup generic="T">` in SelectorGrid caused template compilation issues; replaced with concrete `SelectorItem` interface.

## Commands

```bash
npm run dev       # Start dev server (HMR)
npm run build     # Type-check + production build
npm run preview   # Preview production build locally
```

## Documents

- `docs/requirements.md` — Full PRD (11 chapters)
- `docs/ui-design.md` — UI design spec (12 chapters, 2125 lines)
- `README.md` — Project overview, deployment guides, app packaging options
