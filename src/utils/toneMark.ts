const TONE_MARKS: Record<string, Record<number, string>> = {
  a: { 1: 'ā', 2: 'á', 3: 'ǎ', 4: 'à' },
  e: { 1: 'ē', 2: 'é', 3: 'ě', 4: 'è' },
  i: { 1: 'ī', 2: 'í', 3: 'ǐ', 4: 'ì' },
  o: { 1: 'ō', 2: 'ó', 3: 'ǒ', 4: 'ò' },
  u: { 1: 'ū', 2: 'ú', 3: 'ǔ', 4: 'ù' },
  v: { 1: 'ǖ', 2: 'ǘ', 3: 'ǚ', 4: 'ǜ' },
}

/**
 * Apply tone mark to a pinyin syllable following standard orthography rules:
 * 1. "a" or "e" always gets the tone mark
 * 2. "ou" -> the "o" gets the mark
 * 3. For "iu" and "ui", the last vowel gets the mark
 * 4. Otherwise, mark the last vowel
 */
export function applyToneMark(syllable: string, tone: 1 | 2 | 3 | 4): string {
  if (tone < 1 || tone > 4) return syllable

  const hasMedialA = syllable.includes('a')
  const hasMedialE = syllable.includes('e')

  let target: string

  if (hasMedialA) {
    target = 'a'
  } else if (hasMedialE) {
    target = 'e'
  } else if (syllable.includes('ou')) {
    target = 'o'
  } else {
    // Find the rightmost vowel (v = ü)
    const vowels = ['i', 'u', 'o', 'v']
    let lastIdx = -1
    target = vowels[0]!
    for (const v of vowels) {
      const idx = syllable.lastIndexOf(v)
      if (idx > lastIdx) {
        lastIdx = idx
        target = v
      }
    }
  }

  const mark = TONE_MARKS[target]?.[tone]
  if (!mark) return syllable

  // Handle "v" display: replace v with the tone-marked ü
  if (target === 'v') {
    return syllable.replace('v', mark)
  }

  return syllable.replace(target, mark)
}

/**
 * Display a result syllable with proper ü→u conversion after j/q/x/y
 */
export function formatResultSyllable(text: string): string {
  // Replace ü with u after j, q, x, y for display (standard pinyin rule)
  return text.replace(/([jqxy])ü/g, '$1u')
}
