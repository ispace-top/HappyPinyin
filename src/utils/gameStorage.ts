import type { GameSaveData, LevelProgress, StickerGrade } from '@/types/game'
import { ACHIEVEMENT_DEFS } from '@/types/game'

const STORAGE_KEY = 'happypinyin_game_data'
const SAVE_VERSION = 1

const GRADE_RANK: Record<StickerGrade, number> = { bronze: 1, silver: 2, gold: 3 }

function createDefaultSave(): GameSaveData {
  return {
    version: SAVE_VERSION,
    levels: {},
    stickers: [],
    achievements: [],
    lastPlayedAt: '',
    totalGamesPlayed: 0,
  }
}

function isStorageAvailable(): boolean {
  try {
    const key = '__happypinyin_test__'
    localStorage.setItem(key, '1')
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

export function loadGameData(): GameSaveData {
  if (!isStorageAvailable()) {
    return createDefaultSave()
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return createDefaultSave()
    }

    const data = JSON.parse(raw) as GameSaveData
    if (data.version !== SAVE_VERSION) {
      return createDefaultSave()
    }

    return data
  } catch {
    return createDefaultSave()
  }
}

export function saveGameData(data: GameSaveData): void {
  if (!isStorageAvailable()) {
    return
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // silently degrade — localStorage full or disabled
  }
}

export function getLevelProgress(level: number): LevelProgress {
  const data = loadGameData()
  return (
    data.levels[level] ?? {
      highScore: 0,
      bestStars: 0,
      attempts: 0,
      stickerCollected: false,
      stickerGrade: null,
    }
  )
}

export function updateLevelProgress(
  level: number,
  score: number,
  stars: number,
  stickerGrade: StickerGrade | null,
): void {
  const data = loadGameData()
  const prev = data.levels[level]

  const attempts = (prev?.attempts ?? 0) + 1
  const highScore = Math.max(score, prev?.highScore ?? 0)
  const bestStars = Math.max(stars, prev?.bestStars ?? 0)
  const stickerCollected = stars >= 1 || (prev?.stickerCollected ?? false)

  // keep the best sticker grade
  const currentRank = stickerGrade ? GRADE_RANK[stickerGrade] : 0
  const prevRank = prev?.stickerGrade ? GRADE_RANK[prev.stickerGrade] : 0
  const bestGrade = currentRank >= prevRank ? stickerGrade : prev?.stickerGrade ?? null

  data.levels[level] = {
    highScore,
    bestStars,
    attempts,
    stickerCollected,
    stickerGrade: stickerCollected ? (bestGrade ?? 'bronze') : null,
  }

  // track sticker collection
  const stickerId = `level-${level}`
  if (stickerCollected && !data.stickers.includes(stickerId)) {
    data.stickers.push(stickerId)
  }

  data.lastPlayedAt = new Date().toISOString()
  data.totalGamesPlayed += 1

  saveGameData(data)
}

export function isLevelUnlocked(level: number): boolean {
  if (level === 1) return true

  const prev = getLevelProgress(level - 1)
  return prev.bestStars >= 1
}

export function getUnlockedLevels(): number[] {
  const unlocked: number[] = []
  for (let i = 1; i <= 6; i++) {
    if (isLevelUnlocked(i)) {
      unlocked.push(i)
    }
  }
  return unlocked
}

export function hasSticker(stickerId: string): boolean {
  const data = loadGameData()
  return data.stickers.includes(stickerId)
}

export function getCollectedStickers(): string[] {
  const data = loadGameData()
  return data.stickers
}

export function unlockAchievement(achievementId: string): boolean {
  const data = loadGameData()
  if (data.achievements.includes(achievementId)) {
    return false
  }
  data.achievements.push(achievementId)
  saveGameData(data)
  return true
}

export function getAchievements(): string[] {
  const data = loadGameData()
  return data.achievements
}

export function checkAndUnlockAchievements(): string[] {
  const data = loadGameData()
  const newlyUnlocked: string[] = []

  for (const def of ACHIEVEMENT_DEFS) {
    if (data.achievements.includes(def.id)) continue
    const allCollected = def.requiredStickers.every((sid) => data.stickers.includes(sid))
    if (allCollected) {
      data.achievements.push(def.id)
      newlyUnlocked.push(def.id)
    }
  }

  if (newlyUnlocked.length > 0) {
    saveGameData(data)
  }

  return newlyUnlocked
}

export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // silently degrade
  }
}
