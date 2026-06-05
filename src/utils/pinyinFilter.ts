import { syllableCombinations } from '@/data/syllableCombinations'

/**
 * Replace Latin pinyin letters in text with Chinese characters
 * so TTS reads them as pinyin sounds instead of English letters.
 * Handles compound finals, multi-char initials, and single letters.
 * Replacement order: longest match first to avoid partial replacement.
 * e.g., "听广播的b" → "听广播的播", "ai" → "挨", "ang" → "昂"
 */
export function pinyinToSpeech(text: string): string {
  // Ordered longest-first: compound finals > initials > single vowels/consonants
  const replacements: [string, string][] = [
    // Whole syllables (longest first — must come before letter decomposition)
    ['zhuang', '庄'], ['chuang', '窗'], ['shuang', '双'],
    ['zhuai', '拽'], ['chuai', '揣'], ['shuai', '摔'],
    ['zhuan', '专'], ['chuan', '穿'], ['shuan', '栓'],
    ['zhuo', '桌'], ['chuo', '戳'], ['shuo', '说'],
    ['zhei', '这'], ['shei', '谁'],
    ['yuan', '圆'], ['ying', '英'], ['yong', '拥'], ['yue', '月'], ['yun', '云'],
    ['zhi', '知'], ['chi', '吃'], ['shi', '师'], ['ri', '日'],
    ['zi', '资'], ['ci', '词'], ['si', '思'],
    ['yi', '衣'], ['wu', '乌'], ['yu', '鱼'], ['ye', '耶'], ['yin', '音'],
    // Compound finals (ordered by length desc)
    ['uang', '汪'], ['iang', '央'], ['iong', '拥'],
    ['ang', '昂'], ['eng', '鞥'], ['ing', '英'], ['ong', '翁'],
    ['uai', '歪'], ['uan', '弯'],
    ['iao', '腰'], ['ian', '烟'], ['iou', '优'],
    ['ai', '挨'], ['ei', '欸'], ['ao', '凹'], ['ou', '欧'],
    ['iu', '优'], ['ie', '椰'],
    ['an', '安'], ['en', '恩'], ['in', '音'],
    ['ui', '威'], ['un', '温'],
    ['er', '儿'], ['üe', '约'], ['ün', '晕'],
    // Multi-char initials
    ['zh', '知'], ['ch', '吃'], ['sh', '师'],
    // Single letters
    ['b', '播'], ['p', '坡'], ['m', '摸'], ['f', '佛'],
    ['d', '得'], ['t', '特'], ['n', '呢'], ['l', '了'],
    ['g', '哥'], ['k', '科'], ['h', '喝'],
    ['j', '鸡'], ['q', '七'], ['x', '西'],
    ['r', '日'], ['z', '资'], ['c', '词'], ['s', '思'],
    ['y', '衣'], ['w', '屋'],
    ['ü', '鱼'],
    ['a', '啊'], ['o', '喔'], ['e', '鹅'],
    ['i', '衣'], ['u', '乌'],
  ]
  let result = text
  for (const [letter, char] of replacements) {
    result = result.replace(new RegExp(letter, 'g'), char)
  }
  return result
}

/** @deprecated — use pinyinToSpeech instead */
export const descriptionToSpeech = pinyinToSpeech

export function getAvailableMedials(initial: string): Array<string | null> {
  const medials = syllableCombinations
    .filter(s => s.initial === initial)
    .map(s => s.medial)
  const unique = [...new Set(medials)]
  const hasNull = unique.includes(null)
  const nonNull = unique.filter((m): m is string => m !== null).sort()
  return hasNull ? [null, ...nonNull] : nonNull
}

export function getAvailableFinals(initial: string, medial: string | null): string[] {
  const finals = syllableCombinations
    .filter(s => s.initial === initial && s.medial === medial)
    .map(s => s.final)
  return [...new Set(finals)].sort()
}

export function getResultSyllable(
  initial: string,
  medial: string | null,
  final: string,
  tone: number
): string | null {
  const match = syllableCombinations.find(
    s => s.initial === initial && s.medial === medial && s.final === final
  )
  if (!match) return null
  if (tone === 0) return match.syllable
  return match.toneVariants[tone - 1] ?? null
}

export function medialDisplay(medial: string | null): string {
  if (medial === null) return '无介母'
  if (medial === 'v') return 'ü'
  return medial
}

// Map internal final values to UI display values
export function finalDisplay(rawFinal: string, medial: string | null): string {
  // When medial is present, the rawFinal might be "n" (for un, ün) or "ng" endings
  // These need to be displayed in context
  if (medial === null) return rawFinal
  // For combinations like "jun" where final is "n", display as "un"
  if (rawFinal === 'n' && medial === 'v') return 'ün'
  if (rawFinal === 'n' && medial === 'u') return 'un'
  if (rawFinal === 'n' && medial === 'i') return 'in'
  if (rawFinal === 'i' && medial === 'u') return 'ui'
  if (rawFinal === 'u' && medial === 'i') return 'iu'
  return rawFinal
}
