import type { GameConfig } from '@/types/kingdom'
import { initials } from '@/data/initials'

// Simple initials for beginners
const simpleInitials = initials.filter(i => ['b', 'p', 'm', 'f', 'd', 't', 'n', 'l'].includes(i.text))
const advancedInitials = initials.filter(i => ['g', 'k', 'h', 'j', 'q', 'x', 'zh', 'ch', 'sh', 'r', 'z', 'c', 's'].includes(i.text))

export const WORKSHOP_GAMES: GameConfig[] = [
  {
    id: 'workshop-1',
    zoneId: 'workshop',
    mechanic: 'spelling',
    name: '声韵组合入门',
    emoji: '🔤',
    level: 1,
    roundsPerGame: 10,
    optionCount: 4,
    pool: simpleInitials,
    avoidConfusionGroups: false,
    syllablePool: ['ba', 'pa', 'ma', 'fa', 'da', 'ta', 'na', 'la', 'bo', 'po', 'mo', 'fo'],
  },
  {
    id: 'workshop-2',
    zoneId: 'workshop',
    mechanic: 'spelling',
    name: '声韵组合进阶',
    emoji: '📚',
    level: 2,
    roundsPerGame: 10,
    optionCount: 5,
    pool: [...simpleInitials, ...advancedInitials.slice(0, 3)],
    avoidConfusionGroups: false,
    syllablePool: ['ge', 'ke', 'he', 'bi', 'pi', 'mi', 'di', 'ti', 'ni', 'li', 'gu', 'ku', 'hu'],
  },
  {
    id: 'workshop-3',
    zoneId: 'workshop',
    mechanic: 'spelling',
    name: '拼音小能手',
    emoji: '⭐',
    level: 3,
    roundsPerGame: 10,
    optionCount: 5,
    pool: advancedInitials,
    avoidConfusionGroups: false,
    syllablePool: ['jia', 'qia', 'xia', 'zha', 'cha', 'sha', 'gua', 'kua', 'hua', 'zuo', 'cuo', 'suo'],
  },
  {
    id: 'workshop-4',
    zoneId: 'workshop',
    mechanic: 'spelling',
    name: '拼读挑战',
    emoji: '🎯',
    level: 4,
    roundsPerGame: 10,
    optionCount: 6,
    pool: [...simpleInitials, ...advancedInitials],
    avoidConfusionGroups: false,
    syllablePool: ['zhuang', 'chuang', 'shuang', 'zhong', 'chong', 'rong', 'ming', 'ting', 'ning', 'ling'],
  },
  {
    id: 'workshop-5',
    zoneId: 'workshop',
    mechanic: 'spelling',
    name: '拼读大师',
    emoji: '👑',
    level: 5,
    roundsPerGame: 10,
    optionCount: 6,
    pool: initials,
    avoidConfusionGroups: false,
    syllablePool: ['xue', 'yue', 'quan', 'xuan', 'yuan', 'jue', 'que', 'bie', 'pie', 'mie', 'die', 'tie'],
  },
]
