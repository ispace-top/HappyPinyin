import type { GameConfig } from '@/types/kingdom'
import { initials } from '@/data/initials'
import { singleFinals, compoundFinals } from '@/data/finals'
import { wholeSyllables } from '@/data/wholeSyllables'

// Easy pool for beginners
const easyPool = [
  ...initials.filter(i => ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l'].includes(i.text)),
  ...singleFinals,
]

// Medium pool adds more initials and simple finals
const mediumPool = [
  ...initials.filter(i => ['g', 'k', 'h', 'j', 'q', 'x'].includes(i.text)),
  ...compoundFinals.filter(f => ['ai', 'ei', 'ao', 'ou', 'an', 'en'].includes(f.text)),
]

// Hard pool includes advanced initials
const hardPool = [
  ...initials.filter(i => ['zh', 'ch', 'sh', 'r', 'z', 'c', 's', 'y', 'w'].includes(i.text)),
  ...compoundFinals.filter(f => ['ang', 'eng', 'ing', 'ong', 'iang', 'iong'].includes(f.text)),
]

// Master pool is everything
const masterPool = [...initials, ...singleFinals, ...compoundFinals, ...wholeSyllables]

export const BUBBLE_GAMES: GameConfig[] = [
  {
    id: 'bubble-1',
    zoneId: 'bubble',
    mechanic: 'bubble',
    name: '泡泡初体验',
    emoji: '🫧',
    level: 1,
    roundsPerGame: 10,
    optionCount: 4,
    pool: easyPool,
    avoidConfusionGroups: true,
  },
  {
    id: 'bubble-2',
    zoneId: 'bubble',
    mechanic: 'bubble',
    name: '泡泡进阶',
    emoji: '🫧',
    level: 2,
    roundsPerGame: 10,
    optionCount: 5,
    pool: [...easyPool, ...mediumPool],
    avoidConfusionGroups: false,
  },
  {
    id: 'bubble-3',
    zoneId: 'bubble',
    mechanic: 'bubble',
    name: '泡泡挑战',
    emoji: '🫧',
    level: 3,
    roundsPerGame: 10,
    optionCount: 6,
    pool: [...easyPool, ...mediumPool, ...hardPool],
    avoidConfusionGroups: false,
  },
  {
    id: 'bubble-4',
    zoneId: 'bubble',
    mechanic: 'bubble',
    name: '泡泡大师',
    emoji: '🫧',
    level: 4,
    roundsPerGame: 10,
    optionCount: 6,
    pool: masterPool,
    avoidConfusionGroups: false,
  },
]
