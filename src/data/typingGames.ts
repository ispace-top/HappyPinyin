import type { GameConfig } from '@/types/kingdom'
import { initials } from '@/data/initials'
import { singleFinals, compoundFinals } from '@/data/finals'
import { GRADE1A_SYLLABLES, GRADE1B_SYLLABLES, GRADE2A_SYLLABLES, GRADE2B_SYLLABLES } from '@/data/gradeChars'

const easyInitials = initials.filter(i => ['b','p','m','f','d','t','n','l'].includes(i.text))
const midInitials = initials.filter(i => ['g','k','h','j','q','x'].includes(i.text))
const hardInitials = initials.filter(i => ['zh','ch','sh','r','z','c','s'].includes(i.text))
const easyFinals = singleFinals
const midFinals = compoundFinals.filter(f => ['ai','ei','ao','ou','an','en','ang','eng','ong','er'].includes(f.text))
const hardFinals = compoundFinals.filter(f => ['ia','ie','iao','iu','ian','in','iang','ing','iong','ua','uo','uai','ui','uan','un','uang','ueng'].includes(f.text.includes('ü') ? f.text : f.text))

export const TYPING_GAMES: GameConfig[] = [
  {
    id: 'typing-1',
    zoneId: 'typing', mechanic: 'typing', name: '拼音初学（一上）', emoji: '⌨️',
    level: 1, roundsPerGame: 10, optionCount: 4,
    pool: easyInitials,
    finalPool: easyFinals,
    syllablePool: GRADE1A_SYLLABLES,
    avoidConfusionGroups: false,
  },
  {
    id: 'typing-2',
    zoneId: 'typing', mechanic: 'typing', name: '声母进阶（一上）', emoji: '⌨️',
    level: 2, roundsPerGame: 10, optionCount: 5,
    pool: midInitials,
    finalPool: [...easyFinals, ...midFinals],
    syllablePool: GRADE1A_SYLLABLES,
    avoidConfusionGroups: false,
  },
  {
    id: 'typing-3',
    zoneId: 'typing', mechanic: 'typing', name: '韵母挑战（一下）', emoji: '⌨️',
    level: 3, roundsPerGame: 10, optionCount: 5,
    pool: hardInitials,
    finalPool: [...easyFinals, ...midFinals],
    syllablePool: GRADE1B_SYLLABLES,
    avoidConfusionGroups: false,
  },
  {
    id: 'typing-4',
    zoneId: 'typing', mechanic: 'typing', name: '复韵母挑战（二上）', emoji: '⌨️',
    level: 4, roundsPerGame: 10, optionCount: 6,
    pool: [...easyInitials, ...midInitials],
    finalPool: [...easyFinals, ...midFinals, ...hardFinals],
    syllablePool: GRADE2A_SYLLABLES,
    avoidConfusionGroups: false,
  },
  {
    id: 'typing-5',
    zoneId: 'typing', mechanic: 'typing', name: '拼音达人（二下）', emoji: '⌨️',
    level: 5, roundsPerGame: 10, optionCount: 6,
    pool: initials,
    finalPool: [...singleFinals, ...compoundFinals],
    syllablePool: GRADE2B_SYLLABLES,
    avoidConfusionGroups: false,
  },
  {
    id: 'typing-6',
    zoneId: 'typing', mechanic: 'typing', name: '声调入门（一上）', emoji: '🎵',
    level: 6, roundsPerGame: 10, optionCount: 4,
    pool: easyInitials,
    finalPool: easyFinals,
    syllablePool: GRADE1A_SYLLABLES,
    avoidConfusionGroups: false,
    toneRequired: true,
  },
  {
    id: 'typing-7',
    zoneId: 'typing', mechanic: 'typing', name: '声调挑战（一下）', emoji: '🎶',
    level: 7, roundsPerGame: 10, optionCount: 6,
    pool: initials,
    finalPool: [...singleFinals, ...compoundFinals],
    syllablePool: GRADE1B_SYLLABLES,
    avoidConfusionGroups: false,
    toneRequired: true,
  },
]
