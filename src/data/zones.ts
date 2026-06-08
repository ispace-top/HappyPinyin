import type { ZoneConfig } from '@/types/kingdom'

export const ZONES: ZoneConfig[] = [
  {
    id: 'forest',
    name: '字母森林',
    emoji: '🌳',
    subtitle: '认识声母和韵母',
    color: '#7EC8A0',
    bgGradient: 'linear-gradient(180deg, #E8F8EE 0%, #C8F0D8 100%)',
    unlockRequirement: null,  // always unlocked
  },
  {
    id: 'workshop',
    name: '拼读工坊',
    emoji: '🏗️',
    subtitle: '学习拼读组合',
    color: '#6C9BD2',
    bgGradient: 'linear-gradient(180deg, #E8F0FA 0%, #D0E4F8 100%)',
    unlockRequirement: { type: 'stars_total', value: 3 },
  },
  {
    id: 'typing',
    name: '打字广场',
    emoji: '⌨️',
    subtitle: '拼音打字练习',
    color: '#F0C75E',
    bgGradient: 'linear-gradient(180deg, #FDF6E3 0%, #F8ECCC 100%)',
    unlockRequirement: { type: 'stars_total', value: 8 },
  },
  {
    id: 'bubble',
    name: '泡泡湖',
    emoji: '🫧',
    subtitle: '综合挑战',
    color: '#E8839A',
    bgGradient: 'linear-gradient(180deg, #FAE8ED 0%, #F0D0DA 100%)',
    unlockRequirement: { type: 'stars_total', value: 5 },
  },
]

export const ZONE_MAP: Record<string, ZoneConfig> = Object.fromEntries(
  ZONES.map(zone => [zone.id, zone])
)
