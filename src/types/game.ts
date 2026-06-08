import type { PinyinElement } from './pinyin'

// ========== Game Config ==========

export interface LevelConfig {
  level: number
  name: string
  emoji: string
  optionCount: number // 4 | 5 | 6
  pool: PinyinElement[]
  avoidConfusionGroups: boolean
}

// ========== Game State ==========

export type GamePhase = 'idle' | 'countdown' | 'playing' | 'feedback' | 'result'

export interface RoundData {
  target: PinyinElement
  options: PinyinElement[]
  answeredCorrectly: boolean
  clicksThisRound: number
}

export interface GameState {
  phase: GamePhase
  level: number
  currentRound: number
  rounds: RoundData[]
  score: number
  combo: number
  maxCombo: number
  correctFirstTry: number
  totalClicks: number
  sessionStartTime: number
}

// ========== Persistence ==========

export type StickerGrade = 'gold' | 'silver' | 'bronze'

export interface LevelProgress {
  highScore: number
  bestStars: number
  attempts: number
  stickerCollected: boolean
  stickerGrade: StickerGrade | null
}

export interface GameSaveData {
  version: number
  levels: Record<number, LevelProgress>
  stickers: string[]
  achievements: string[]
  lastPlayedAt: string
  totalGamesPlayed: number
}

// ========== Sound Effects ==========

export type SfxId =
  | 'pop-correct'
  | 'pop-wrong'
  | 'sticker-fly'
  | 'star-appear'
  | 'sticker-collect'
  | 'countdown'
  | 'countdown-go'
  | 'achievement'

// ========== Achievements ==========

export type AchievementId =
  | 'beginner_master'
  | 'initial_master'
  | 'final_explorer'
  | 'pinyin_master'

export interface Achievement {
  id: AchievementId
  name: string
  description: string
  requiredStickers: string[]
}

// ========== Confusion Groups ==========

export const CONFUSION_GROUPS: string[][] = [
  ['zh', 'z', 'ch', 'c', 'sh', 's'],
  ['n', 'l'],
  ['b', 'p', 'd', 't'],
  ['j', 'q', 'x'],
  ['an', 'ang', 'en', 'eng', 'in', 'ing'],
  ['ai', 'ei', 'ao', 'ou'],
]

// ========== Text Pools ==========

export const ENCOURAGEMENT_POOL: string[] = [
  '太棒了!',
  '真聪明!',
  '答对啦!',
  '你真厉害!',
  '就是它!',
  '完美!',
]

export const GUIDANCE_POOL: string[] = [
  '再试试看~',
  '差一点点，再找找!',
  '听听看，是哪个呢?',
  '没关系，再来!',
]

// ========== Sticker Definitions ==========

export interface StickerDef {
  id: string
  name: string
  emoji: string
  level: number
}

export const STICKER_DEFS: StickerDef[] = [
  { id: 'level-1', name: '韵母小芽', emoji: '🌱', level: 1 },
  { id: 'level-2', name: '声母小苗', emoji: '🪴', level: 2 },
  { id: 'level-3', name: '舌根勇士', emoji: '🛡️', level: 3 },
  { id: 'level-4', name: '翘舌之星', emoji: '⭐', level: 4 },
  { id: 'level-5', name: '复韵之花', emoji: '🌸', level: 5 },
  { id: 'level-6', name: '拼音大师', emoji: '👑', level: 6 },
]

export const ACHIEVEMENT_DEFS: Achievement[] = [
  {
    id: 'beginner_master',
    name: '初学小能手',
    description: '集齐关卡1-2的贴纸',
    requiredStickers: ['level-1', 'level-2'],
  },
  {
    id: 'initial_master',
    name: '声母小达人',
    description: '集齐关卡3-4的贴纸',
    requiredStickers: ['level-3', 'level-4'],
  },
  {
    id: 'final_explorer',
    name: '韵母探险家',
    description: '收集关卡5的贴纸',
    requiredStickers: ['level-5'],
  },
  {
    id: 'pinyin_master',
    name: '拼音大师',
    description: '集齐全部6张贴纸',
    requiredStickers: ['level-1', 'level-2', 'level-3', 'level-4', 'level-5', 'level-6'],
  },
]

// ========== Scoring ==========

export const SCORE_FIRST_TRY = 10
export const SCORE_SECOND_TRY = 6
export const SCORE_THIRD_PLUS_TRY = 3
export const COMBO_BONUS_3 = 3
export const COMBO_BONUS_6 = 5
export const STAR_3_THRESHOLD = 100
export const STAR_2_THRESHOLD = 65
export const STAR_1_THRESHOLD = 40
export const ROUNDS_PER_GAME = 10
