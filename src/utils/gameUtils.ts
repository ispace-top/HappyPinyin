import type { PinyinElement } from '@/types/pinyin'
import { CONFUSION_GROUPS } from '@/types/game'

// ========== Utility Functions ==========

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

/**
 * Pick N random elements from an array
 */
export function pickRandom<T>(arr: T[], count: number): T[] {
  return shuffle(arr).slice(0, count)
}

/**
 * Check if two pinyin elements are in the same confusion group
 */
export function isConfusable(a: PinyinElement, b: PinyinElement): boolean {
  return CONFUSION_GROUPS.some(group =>
    group.includes(a.text) && group.includes(b.text)
  )
}

/**
 * Pick distractors for a target element
 * @param pool - All available elements
 * @param target - The target element to avoid
 * @param count - Number of distractors to pick
 * @param avoidConfusion - Whether to avoid confusable elements
 */
export function pickDistractors(
  pool: PinyinElement[],
  target: PinyinElement,
  count: number,
  avoidConfusion: boolean
): PinyinElement[] {
  // Filter out the target
  let candidates = pool.filter(p => p.id !== target.id)

  // If avoiding confusion, filter out confusable elements
  if (avoidConfusion) {
    const noConfusable = candidates.filter(c => !isConfusable(target, c))
    // Only use filtered list if we have enough candidates
    if (noConfusable.length >= count) {
      candidates = noConfusable
    }
  }

  // Pick random distractors
  return pickRandom(candidates, count)
}

// ========== Scoring Functions ==========

export const SCORE_FIRST_TRY = 10
export const SCORE_SECOND_TRY = 6
export const SCORE_THIRD_PLUS_TRY = 3
export const COMBO_BONUS_3 = 3
export const COMBO_BONUS_6 = 5
export const STAR_3_THRESHOLD = 100
export const STAR_2_THRESHOLD = 65
export const STAR_1_THRESHOLD = 40
export const ROUNDS_PER_GAME = 10

/**
 * Calculate score based on attempt number
 */
export function calculateScore(clicksThisRound: number): number {
  if (clicksThisRound === 1) return SCORE_FIRST_TRY
  if (clicksThisRound === 2) return SCORE_SECOND_TRY
  return SCORE_THIRD_PLUS_TRY
}

/**
 * Calculate combo bonus
 */
export function calculateComboBonus(combo: number): number {
  if (combo >= 6) return COMBO_BONUS_6
  if (combo >= 3) return COMBO_BONUS_3
  return 0
}

/**
 * Calculate stars based on score
 */
export function calculateStars(score: number): number {
  if (score >= STAR_3_THRESHOLD) return 3
  if (score >= STAR_2_THRESHOLD) return 2
  if (score >= STAR_1_THRESHOLD) return 1
  return 0
}

/**
 * Get sticker grade based on stars
 */
export function getStickerGrade(stars: number): 'gold' | 'silver' | 'bronze' | null {
  if (stars >= 3) return 'gold'
  if (stars >= 2) return 'silver'
  if (stars >= 1) return 'bronze'
  return null
}

// ========== Round Generation ==========

export interface RoundData {
  target: PinyinElement
  options: PinyinElement[]
  answeredCorrectly: boolean
  clicksThisRound: number
}

/**
 * Generate rounds for a game
 * @param pool - Pool of available elements
 * @param roundsCount - Number of rounds to generate
 * @param optionCount - Number of options per round (including target)
 * @param avoidConfusion - Whether to avoid confusable distractors
 */
export function generateRounds(
  pool: PinyinElement[],
  roundsCount: number,
  optionCount: number,
  avoidConfusion: boolean
): RoundData[] {
  const rounds: RoundData[] = []
  const usedTargets = new Set<string>()

  for (let i = 0; i < roundsCount; i++) {
    // Pick a target that hasn't been used yet
    const available = pool.filter(p => !usedTargets.has(p.id))
    if (available.length === 0) break

    const target = available[Math.floor(Math.random() * available.length)]!
    usedTargets.add(target.id)

    // Pick distractors
    const distractorCount = optionCount - 1
    const distractors = pickDistractors(pool, target, distractorCount, avoidConfusion)

    // Create round with shuffled options
    const options = shuffle([target, ...distractors])

    rounds.push({
      target,
      options,
      answeredCorrectly: false,
      clicksThisRound: 0,
    })
  }

  return rounds
}

// ========== Audio Functions ==========

/**
 * Get audio path for a pinyin element
 * Uses local audio files if available, falls back to TTS
 */
export function getAudioPath(element: PinyinElement): string | null {
  // Local audio exists for initials, single finals, compound finals
  if (element.category === 'initial') {
    return `/audio/initials/${element.text}.mp3`
  }

  if (element.category === 'final') {
    // Map ü to v for file paths
    const mappedText = element.text
      .replace('ü', 'v')
      .replace('üe', 've')
      .replace('ün', 'vn')
    return `/audio/finals/${mappedText}.mp3`
  }

  // No local audio for whole syllables yet
  return null
}

/**
 * Get TTS text for a pinyin element
 */
export function getTTSText(element: PinyinElement): string {
  // For initials and finals, use the pronunciation field
  return element.pronunciation
}
