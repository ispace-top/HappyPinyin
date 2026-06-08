import type { KingdomSaveData, GameProgress, ZoneId, StickerGrade } from '@/types/kingdom'
import { ALL_GAMES, ZONE_MAP, ALL_ACHIEVEMENTS } from '@/data/kingdom'

const STORAGE_KEY = 'happypinyin_kingdom_data'
const LEGACY_STORAGE_KEY = 'happypinyin_game_data'
const CURRENT_VERSION = 2

// ========== Default Data ==========

function createDefaultProgress(): GameProgress {
  return {
    highScore: 0,
    bestStars: 0,
    attempts: 0,
    stickerCollected: false,
    stickerGrade: null,
  }
}

function createDefaultSaveData(): KingdomSaveData {
  const games: Record<string, GameProgress> = {}
  ALL_GAMES.forEach(game => {
    games[game.id] = createDefaultProgress()
  })

  return {
    version: CURRENT_VERSION,
    games,
    unlockedStickers: [],
    unlockedAchievements: [],
    totalStars: 0,
    lastPlayedAt: new Date().toISOString(),
    totalGamesPlayed: 0,
  }
}

// ========== Legacy Migration (v1 → v2) ==========

interface LegacyProgress {
  highScore: number
  bestStars: number
  attempts: number
  stickerCollected: boolean
  stickerGrade: StickerGrade | null
}

interface LegacySaveData {
  version: number
  progress: Record<number, LegacyProgress>
  totalStars: number
  unlockedStickers: string[]
  unlockedAchievements: string[]
  lastPlayedAt: string
}

function migrateFromV1(legacy: LegacySaveData): KingdomSaveData {
  const newData = createDefaultSaveData()

  // Map legacy levels to new game IDs
  // Legacy levels 1-6 were the original bubble game
  // We'll map them to bubble-1 through bubble-6 (but we only have bubble-1 to bubble-4 now)
  const levelMapping: Record<number, string> = {
    1: 'bubble-1',
    2: 'bubble-2',
    3: 'bubble-3',
    4: 'bubble-4',
    // Levels 5-6 don't have direct mappings, so we'll skip them
  }

  // Migrate game progress
  Object.entries(legacy.progress).forEach(([levelStr, progress]) => {
    const level = parseInt(levelStr)
    const gameId = levelMapping[level]
    if (gameId && newData.games[gameId]) {
      newData.games[gameId] = {
        highScore: progress.highScore,
        bestStars: progress.bestStars,
        attempts: progress.attempts,
        stickerCollected: progress.bestStars > 0,
        stickerGrade: progress.bestStars >= 3 ? 'gold' : progress.bestStars >= 2 ? 'silver' : 'bronze',
      }
    }
  })

  // Copy over other data
  newData.totalStars = legacy.totalStars
  newData.unlockedStickers = legacy.unlockedStickers || []
  newData.unlockedAchievements = legacy.unlockedAchievements || []
  newData.lastPlayedAt = legacy.lastPlayedAt

  return newData
}

// ========== Storage Operations ==========

export function loadKingdomData(): KingdomSaveData {
  try {
    // Try to load v2 data first
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      const parsed = JSON.parse(data) as KingdomSaveData
      if (parsed.version === CURRENT_VERSION) {
        return parsed
      }
    }

    // Try to migrate from v1
    const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacyData) {
      const legacy = JSON.parse(legacyData) as LegacySaveData
      if (legacy.version === 1) {
        const migrated = migrateFromV1(legacy)
        saveKingdomData(migrated)
        return migrated
      }
    }

    // No data found, return default
    const defaultData = createDefaultSaveData()
    saveKingdomData(defaultData)
    return defaultData
  } catch (error) {
    console.error('Failed to load kingdom data:', error)
    return createDefaultSaveData()
  }
}

export function saveKingdomData(data: KingdomSaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('Failed to save kingdom data:', error)
  }
}

// ========== Game Progress Operations ==========

export function getGameProgress(gameId: string): GameProgress {
  const data = loadKingdomData()
  return data.games[gameId] || createDefaultProgress()
}

export function updateGameProgress(
  gameId: string,
  score: number,
  stars: number,
  stickerGrade: StickerGrade | null
): void {
  const data = loadKingdomData()
  const progress = data.games[gameId] || createDefaultProgress()

  // Update only if new score is better
  if (score > progress.highScore) {
    progress.highScore = score
  }
  if (stars > progress.bestStars) {
    progress.bestStars = stars
    progress.stickerCollected = stars > 0
    progress.stickerGrade = stickerGrade
  }

  progress.attempts++
  data.games[gameId] = progress
  data.totalGamesPlayed++
  data.lastPlayedAt = new Date().toISOString()

  // Recalculate total stars
  data.totalStars = Object.values(data.games).reduce((sum, p) => sum + p.bestStars, 0)

  saveKingdomData(data)
}

// ========== Star Operations ==========

export function getTotalStars(): number {
  const data = loadKingdomData()
  return data.totalStars
}

// ========== Sticker Operations ==========

export function getUnlockedStickers(): string[] {
  const data = loadKingdomData()
  return data.unlockedStickers
}

export function unlockSticker(stickerId: string): void {
  const data = loadKingdomData()
  if (!data.unlockedStickers.includes(stickerId)) {
    data.unlockedStickers.push(stickerId)
    data.lastPlayedAt = new Date().toISOString()
    saveKingdomData(data)
  }
}

export function hasSticker(stickerId: string): boolean {
  return getUnlockedStickers().includes(stickerId)
}

// ========== Achievement Operations ==========

export function getUnlockedAchievements(): string[] {
  const data = loadKingdomData()
  return data.unlockedAchievements
}

export function unlockAchievement(achievementId: string): void {
  const data = loadKingdomData()
  if (!data.unlockedAchievements.includes(achievementId)) {
    data.unlockedAchievements.push(achievementId)
    data.lastPlayedAt = new Date().toISOString()
    saveKingdomData(data)
  }
}

export function hasAchievement(achievementId: string): boolean {
  return getUnlockedAchievements().includes(achievementId)
}

export function checkAndUnlockAchievements(): string[] {
  const data = loadKingdomData()
  const newlyUnlocked: string[] = []

  for (const achievement of ALL_ACHIEVEMENTS) {
    if (data.unlockedAchievements.includes(achievement.id)) continue

    let earned = false
    const cond = achievement.condition

    switch (cond.type) {
      case 'zone_stickers': {
        const zoneStickers = getUnlockedStickers().filter(s => s.startsWith(`sticker-${cond.zoneId}`))
        earned = zoneStickers.length >= cond.count
        break
      }
      case 'total_stars': {
        earned = data.totalStars >= cond.count
        break
      }
      case 'zone_mastery': {
        const zoneGames = ALL_GAMES.filter(g => g.zoneId === cond.zoneId)
        earned = zoneGames.length > 0 && zoneGames.every(g => {
          const progress = data.games[g.id]
          return progress && progress.bestStars >= 3
        })
        break
      }
      case 'perfect_game': {
        const progress = data.games[cond.gameId]
        earned = progress ? progress.bestStars >= 3 : false
        break
      }
      case 'all_zones_complete': {
        const allZones = [...new Set(ALL_GAMES.map(g => g.zoneId))]
        earned = allZones.length > 0 && allZones.every(zoneId => {
          const zoneGames = ALL_GAMES.filter(g => g.zoneId === zoneId)
          return zoneGames.every(g => {
            const progress = data.games[g.id]
            return progress && progress.bestStars >= 3
          })
        })
        break
      }
    }

    if (earned) {
      data.unlockedAchievements.push(achievement.id)
      newlyUnlocked.push(achievement.id)
    }
  }

  if (newlyUnlocked.length > 0) {
    saveKingdomData(data)
  }

  return newlyUnlocked
}

// ========== Zone Operations ==========

export function isZoneUnlocked(zoneId: ZoneId): boolean {
  const zone = ZONE_MAP[zoneId]
  if (!zone) return false
  // No requirement means always unlocked
  if (!zone.unlockRequirement) return true

  const data = loadKingdomData()

  // Only stars_total is supported for now
  if (zone.unlockRequirement.type === 'stars_total') {
    return data.totalStars >= zone.unlockRequirement.value
  }

  return false
}

export function getZoneStars(zoneId: ZoneId): number {
  const data = loadKingdomData()
  const zoneGames = ALL_GAMES.filter(g => g.zoneId === zoneId)
  return zoneGames.reduce((sum, game) => {
    const progress = data.games[game.id]
    return sum + (progress?.bestStars || 0)
  }, 0)
}

export function getZoneMaxStars(zoneId: ZoneId): number {
  const zoneGames = ALL_GAMES.filter(g => g.zoneId === zoneId)
  return zoneGames.length * 3  // 3 stars per game
}

// ========== Reset Operations ==========

export function resetKingdomData(): void {
  const defaultData = createDefaultSaveData()
  saveKingdomData(defaultData)
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(LEGACY_STORAGE_KEY)
}
