import { reactive, computed, readonly } from 'vue'
import type { PinyinElement } from '@/types/pinyin'
import type { GameState, GamePhase, RoundData, LevelConfig } from '@/types/game'
import { CONFUSION_GROUPS, SCORE_FIRST_TRY, SCORE_SECOND_TRY, SCORE_THIRD_PLUS_TRY, COMBO_BONUS_3, COMBO_BONUS_6, STAR_3_THRESHOLD, STAR_2_THRESHOLD, STAR_1_THRESHOLD, ROUNDS_PER_GAME } from '@/types/game'
import { initials } from '@/data/initials'
import { singleFinals, compoundFinals } from '@/data/finals'
import { wholeSyllables } from '@/data/wholeSyllables'
import { speechService } from '@/services/speechService'
import { play as playPinyinAudio, stop as stopPinyinAudio, getAudioPath } from '@/services/pinyinAudio'

const LEVEL_CONFIGS: LevelConfig[] = [
  { level: 1, name: '单韵母乐园', emoji: '🌱', optionCount: 4, pool: singleFinals, avoidConfusionGroups: true },
  { level: 2, name: '声母启蒙(上)', emoji: '🪴', optionCount: 4, pool: initials.filter(i => ['b','p','m','f','d','t','n','l'].includes(i.text)), avoidConfusionGroups: true },
  { level: 3, name: '声母启蒙(下)', emoji: '🛡️', optionCount: 5, pool: initials.filter(i => ['g','k','h','j','q','x'].includes(i.text)), avoidConfusionGroups: false },
  { level: 4, name: '声母挑战', emoji: '⭐', optionCount: 5, pool: initials.filter(i => ['zh','ch','sh','r','z','c','s','y','w'].includes(i.text)), avoidConfusionGroups: false },
  { level: 5, name: '复韵母探险', emoji: '🌸', optionCount: 6, pool: compoundFinals, avoidConfusionGroups: false },
  { level: 6, name: '拼音大师', emoji: '👑', optionCount: 6, pool: [...initials, ...singleFinals, ...compoundFinals, ...wholeSyllables], avoidConfusionGroups: false },
]

function createInitialState(): GameState {
  return {
    phase: 'idle',
    level: 1,
    currentRound: 0,
    rounds: [],
    score: 0,
    combo: 0,
    maxCombo: 0,
    correctFirstTry: 0,
    totalClicks: 0,
    sessionStartTime: 0,
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j]!, a[i]!]
  }
  return a
}

function isConfusable(a: string, b: string): boolean {
  for (const group of CONFUSION_GROUPS) {
    if (group.includes(a) && group.includes(b)) return true
  }
  return false
}

function pickDistractors(pool: PinyinElement[], target: PinyinElement, count: number, avoidConfusion: boolean): PinyinElement[] {
  let candidates = pool.filter(p => p.id !== target.id)
  if (avoidConfusion) {
    const noConfusable = candidates.filter(p => !isConfusable(target.text, p.text))
    if (noConfusable.length >= count) {
      candidates = noConfusable
    }
  }
  return shuffle(candidates).slice(0, count)
}

function generateRounds(config: LevelConfig): RoundData[] {
  const rounds: RoundData[] = []
  const usedTargets = new Set<string>()

  for (let i = 0; i < ROUNDS_PER_GAME; i++) {
    const available = config.pool.filter(p => !usedTargets.has(p.id))
    const target = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]!
      : config.pool[Math.floor(Math.random() * config.pool.length)]!

    usedTargets.add(target.id)
    const distractors = pickDistractors(config.pool, target, config.optionCount - 1, config.avoidConfusionGroups)
    rounds.push({
      target,
      options: shuffle([target, ...distractors]),
      answeredCorrectly: false,
      clicksThisRound: 0,
    })
  }

  return rounds
}

export function useGameEngine() {
  const state = reactive<GameState>(createInitialState())

  const config = computed<LevelConfig | null>(() =>
    LEVEL_CONFIGS.find(c => c.level === state.level) ?? null,
  )

  const currentRoundData = computed<RoundData | null>(() =>
    state.rounds[state.currentRound] ?? null,
  )

  const stars = computed(() => {
    if (state.score >= STAR_3_THRESHOLD) return 3
    if (state.score >= STAR_2_THRESHOLD) return 2
    if (state.score >= STAR_1_THRESHOLD) return 1
    return 0
  })

  const isLastRound = computed(() => state.currentRound >= ROUNDS_PER_GAME - 1)

  function startGame(level: number): void {
    const cfg = LEVEL_CONFIGS.find(c => c.level === level)
    if (!cfg) return

    Object.assign(state, {
      ...createInitialState(),
      phase: 'countdown' as GamePhase,
      level,
      rounds: generateRounds(cfg),
      sessionStartTime: Date.now(),
    })
  }

  function onCountdownEnd(): void {
    state.phase = 'playing'
    speakTarget()
  }

  function speakTarget(): void {
    const round = currentRoundData.value
    if (!round) return
    speechService.stop()
    stopPinyinAudio()
    const audioPath = getAudioPath(round.target.category, round.target.text)
    if (audioPath) {
      playPinyinAudio(audioPath).then((success: boolean) => {
        if (!success) {
          speechService.speak(round!.target.pronunciation, { rate: 0.7, pitch: 1.1 })
        }
      })
    } else {
      speechService.speak(round.target.pronunciation, { rate: 0.7, pitch: 1.1 })
    }
  }

  function selectBubble(elementId: string): 'correct' | 'wrong' {
    const round = currentRoundData.value
    if (!round || state.phase !== 'playing') return 'wrong'

    round.clicksThisRound++
    state.totalClicks++

    if (elementId === round.target.id) {
      if (round.clicksThisRound === 1) {
        state.correctFirstTry++
      }

      round.answeredCorrectly = true
      state.combo++
      if (state.combo > state.maxCombo) {
        state.maxCombo = state.combo
      }

      let points = SCORE_THIRD_PLUS_TRY
      if (round.clicksThisRound === 1) points = SCORE_FIRST_TRY
      else if (round.clicksThisRound === 2) points = SCORE_SECOND_TRY

      if (state.combo >= 6) points += COMBO_BONUS_6
      else if (state.combo >= 3) points += COMBO_BONUS_3

      state.score += points
      state.phase = 'feedback'
      return 'correct'
    }

    state.combo = 0
    return 'wrong'
  }

  function nextRound(): boolean {
    if (isLastRound.value) {
      state.phase = 'result'
      return false
    }
    state.currentRound++
    state.phase = 'playing'
    return true
  }

  function replayAudio(): void {
    speakTarget()
  }

  function resetGame(): void {
    speechService.stop()
    stopPinyinAudio()
    Object.assign(state, createInitialState())
  }

  return {
    state: readonly(state) as GameState,
    config,
    currentRoundData,
    stars,
    isLastRound,
    startGame,
    onCountdownEnd,
    selectBubble,
    nextRound,
    replayAudio,
    resetGame,
  }
}
