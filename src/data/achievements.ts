export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: AchievementCondition
}

export type AchievementCondition =
  | { type: 'zone_stickers'; zoneId: string; count: number }
  | { type: 'total_stars'; count: number }
  | { type: 'zone_mastery'; zoneId: string }
  | { type: 'perfect_game'; gameId: string }
  | { type: 'all_zones_complete' }

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // Zone Sticker Collections
  {
    id: 'forest-stickers',
    name: '森林探险家',
    description: '集齐字母森林所有贴纸',
    icon: '🌲',
    condition: { type: 'zone_stickers', zoneId: 'forest', count: 7 },
  },
  {
    id: 'workshop-stickers',
    name: '拼读建筑师',
    description: '集齐拼读工坊所有贴纸',
    icon: '🏗️',
    condition: { type: 'zone_stickers', zoneId: 'workshop', count: 5 },
  },
  {
    id: 'typing-stickers',
    name: '打字小能手',
    description: '集齐打字广场所有贴纸',
    icon: '⌨️',
    condition: { type: 'zone_stickers', zoneId: 'typing', count: 5 },
  },
  {
    id: 'bubble-stickers',
    name: '泡泡冠军',
    description: '集齐泡泡湖所有贴纸',
    icon: '🫧',
    condition: { type: 'zone_stickers', zoneId: 'bubble', count: 3 },
  },

  // Star Milestones
  {
    id: 'stars-10',
    name: '拼音新星',
    description: '累计获得10颗星星',
    icon: '⭐',
    condition: { type: 'total_stars', count: 10 },
  },
  {
    id: 'stars-30',
    name: '拼音达人',
    description: '累计获得30颗星星',
    icon: '🌟',
    condition: { type: 'total_stars', count: 30 },
  },
  {
    id: 'stars-60',
    name: '拼音大师',
    description: '累计获得60颗星星',
    icon: '💫',
    condition: { type: 'total_stars', count: 60 },
  },

  // Zone Mastery (3 stars on all games)
  {
    id: 'forest-mastery',
    name: '森林征服者',
    description: '字母森林所有关卡获得3星',
    icon: '🌳',
    condition: { type: 'zone_mastery', zoneId: 'forest' },
  },
  {
    id: 'workshop-mastery',
    name: '工坊征服者',
    description: '拼读工坊所有关卡获得3星',
    icon: '🏭',
    condition: { type: 'zone_mastery', zoneId: 'workshop' },
  },
  {
    id: 'typing-mastery',
    name: '打字征服者',
    description: '打字广场所有关卡获得3星',
    icon: '💻',
    condition: { type: 'zone_mastery', zoneId: 'typing' },
  },
  {
    id: 'bubble-mastery',
    name: '泡泡征服者',
    description: '泡泡湖所有关卡获得3星',
    icon: '🎪',
    condition: { type: 'zone_mastery', zoneId: 'bubble' },
  },

  // Special Achievements
  {
    id: 'all-zones-complete',
    name: '拼音王国之王',
    description: '完成所有区域的所有关卡',
    icon: '👑',
    condition: { type: 'all_zones_complete' },
  },
]

export function getAchievementById(id: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find(a => a.id === id)
}
