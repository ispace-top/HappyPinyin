import { FOREST_GAMES } from './forestGames'
import { WORKSHOP_GAMES } from './workshopGames'
import { TYPING_GAMES } from './typingGames'
import { BUBBLE_GAMES } from './bubbleGames'
import type { GameConfig } from '@/types/kingdom'

export const ALL_GAMES: GameConfig[] = [
  ...FOREST_GAMES,
  ...WORKSHOP_GAMES,
  ...TYPING_GAMES,
  ...BUBBLE_GAMES,
]

export const ALL_GAME_IDS = ALL_GAMES.map(g => g.id)

export function getGameById(id: string): GameConfig | undefined {
  return ALL_GAMES.find(g => g.id === id)
}

export function getGamesByZone(zoneId: string): GameConfig[] {
  return ALL_GAMES.filter(g => g.zoneId === zoneId)
}
