export interface Sticker {
  id: string
  name: string
  emoji: string
  level: number
  zoneId: string
}

export const ALL_STICKERS: Sticker[] = [
  // Forest Zone (7 stickers)
  { id: 'sticker-forest-1', name: '声母小芽', emoji: '🌱', level: 1, zoneId: 'forest' },
  { id: 'sticker-forest-2', name: '声母嫩叶', emoji: '🌿', level: 2, zoneId: 'forest' },
  { id: 'sticker-forest-3', name: '声母小树', emoji: '🌲', level: 3, zoneId: 'forest' },
  { id: 'sticker-forest-4', name: '单韵母花', emoji: '🌸', level: 4, zoneId: 'forest' },
  { id: 'sticker-forest-5', name: '复韵母果', emoji: '🍎', level: 5, zoneId: 'forest' },
  { id: 'sticker-forest-6', name: '韵母大树', emoji: '🌳', level: 6, zoneId: 'forest' },
  { id: 'sticker-forest-7', name: '森林守护者', emoji: '🦉', level: 7, zoneId: 'forest' },

  // Workshop Zone (5 stickers)
  { id: 'sticker-workshop-1', name: '拼读学徒', emoji: '📖', level: 1, zoneId: 'workshop' },
  { id: 'sticker-workshop-2', name: '拼读助手', emoji: '🔤', level: 2, zoneId: 'workshop' },
  { id: 'sticker-workshop-3', name: '拼读能手', emoji: '⭐', level: 3, zoneId: 'workshop' },
  { id: 'sticker-workshop-4', name: '拼读专家', emoji: '🎯', level: 4, zoneId: 'workshop' },
  { id: 'sticker-workshop-5', name: '拼读大师', emoji: '👑', level: 5, zoneId: 'workshop' },

  // Typing Zone (5 stickers)
  { id: 'sticker-typing-1', name: '键盘新手', emoji: '⌨️', level: 1, zoneId: 'typing' },
  { id: 'sticker-typing-2', name: '声母达人', emoji: '🅱️', level: 2, zoneId: 'typing' },
  { id: 'sticker-typing-3', name: '韵母高手', emoji: '🎵', level: 3, zoneId: 'typing' },
  { id: 'sticker-typing-4', name: '复韵母专家', emoji: '🎶', level: 4, zoneId: 'typing' },
  { id: 'sticker-typing-5', name: '打字大师', emoji: '🏆', level: 5, zoneId: 'typing' },

  // Bubble Zone (3 stickers)
  { id: 'sticker-bubble-1', name: '泡泡学徒', emoji: '🫧', level: 1, zoneId: 'bubble' },
  { id: 'sticker-bubble-2', name: '泡泡能手', emoji: '🎈', level: 2, zoneId: 'bubble' },
  { id: 'sticker-bubble-3', name: '泡泡大师', emoji: '🏅', level: 3, zoneId: 'bubble' },
]

export function getStickerById(id: string): Sticker | undefined {
  return ALL_STICKERS.find(s => s.id === id)
}

export function getStickersByZone(zoneId: string): Sticker[] {
  return ALL_STICKERS.filter(s => s.zoneId === zoneId)
}

export function getStickerForGame(gameId: string): Sticker | undefined {
  const match = gameId.match(/^(.+)-(\d+)$/)
  if (!match || !match[1] || !match[2]) return undefined

  // Extract zoneId: for multi-dash IDs like "forest-init-1", zoneId is "forest"
  const rawZoneId = match[1]
  const zoneId = rawZoneId.includes('-') ? rawZoneId.split('-')[0]! : rawZoneId
  const level = parseInt(match[2])

  return ALL_STICKERS.find(s => s.zoneId === zoneId && s.level === level)
}
