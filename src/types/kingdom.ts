import type { PinyinElement } from './pinyin'

// ========== Zone Identity ==========

export type ZoneId = 'forest' | 'workshop' | 'typing' | 'bubble'

export interface ZoneConfig {
  id: ZoneId
  name: string
  emoji: string
  subtitle: string
  color: string           // CSS color for theming
  bgGradient: string      // CSS gradient string
  unlockRequirement: ZoneUnlockRequirement | null  // null = always unlocked
}

export interface ZoneUnlockRequirement {
  type: 'stars_total' | 'zone_completed' | 'stickers_count'
  value: number
  zoneId?: ZoneId
}

// ========== Game Config within a Zone ==========

export type GameMechanic = 'recognition' | 'spelling' | 'typing' | 'bubble'

export interface GameConfig {
  id: string              // e.g., 'forest-initials-1'
  zoneId: ZoneId
  mechanic: GameMechanic
  name: string
  emoji: string
  level: number           // 1-based within zone
  roundsPerGame: number   // default 10
  optionCount: number     // for recognition: 4|5|6
  pool: PinyinElement[]
  avoidConfusionGroups: boolean
  // Spelling/typing-specific
  syllablePool?: string[]     // fixed syllable list (spelling), omit for dynamic generation
  finalPool?: PinyinElement[] // finals available for dynamic generation (typing)
  toneRequired?: boolean      // typing: whether tone selection is required
}

// ========== Unified Game State ==========

export type KingdomGamePhase = 'idle' | 'countdown' | 'playing' | 'feedback' | 'result'

export interface KingdomRoundData {
  target: PinyinElement
  options: PinyinElement[]
  answeredCorrectly: boolean
  clicksThisRound: number
}

export interface KingdomGameState {
  phase: KingdomGamePhase
  zoneId: ZoneId
  gameId: string
  currentRound: number
  rounds: KingdomRoundData[]
  score: number
  combo: number
  maxCombo: number
  correctFirstTry: number
  totalClicks: number
  sessionStartTime: number
  // Spelling-specific fields
  spellingInput?: {
    selectedInitial: string | null
    selectedFinal: string | null
  }
  // Typing-specific fields
  typingInput?: {
    typedText: string
    targetSyllable: string
    targetChar: string
  }
}

// ========== Persistence (v2) ==========

export interface GameProgress {
  highScore: number
  bestStars: number
  attempts: number
  stickerCollected: boolean
  stickerGrade: StickerGrade | null
}

export interface KingdomSaveData {
  version: number            // 2
  games: Record<string, GameProgress>   // keyed by gameConfig.id
  unlockedStickers: string[]
  unlockedAchievements: string[]
  totalStars: number
  lastPlayedAt: string
  totalGamesPlayed: number
}

export type StickerGrade = 'gold' | 'silver' | 'bronze'
