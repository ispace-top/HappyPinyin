import { reactive, computed, type Ref } from 'vue'
import type { PinyinElement } from '@/types/pinyin'
import type { GameConfig, KingdomGameState, KingdomGamePhase } from '@/types/kingdom'
import type { SyllableComponent } from '@/types/pinyin'
import { speechService } from '@/services/speechService'
import { play as playAudio, stop as stopAudio, getAudioPath } from '@/services/pinyinAudio'
import { shuffle, pickRandom, pickDistractors, calculateScore, calculateComboBonus, calculateStars, getStickerGrade } from '@/utils/gameUtils'
import { initials } from '@/data/initials'
import { singleFinals, compoundFinals } from '@/data/finals'
import { syllableCombinations } from '@/data/syllableCombinations'
import { getCharForSyllable } from '@/utils/syllableChars'

interface RoundData {
  target: PinyinElement
  options: PinyinElement[]
  answeredCorrectly: boolean
  clicksThisRound: number
  // Spelling
  targetSyllable?: string
  initialOptions?: PinyinElement[]
  finalOptions?: PinyinElement[]
  // Typing
  targetChar?: string
}

function createInitialState(): KingdomGameState {
  return {
    phase: 'idle',
    zoneId: 'forest',
    gameId: '',
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

function findSyllableDecomp(syllable: string): SyllableComponent | undefined {
  return syllableCombinations.find(s => s.syllable === syllable)
}

function generateRecognitionRounds(config: GameConfig): RoundData[] {
  const rounds: RoundData[] = []
  const usedTargets = new Set<string>()

  for (let i = 0; i < config.roundsPerGame; i++) {
    const available = config.pool.filter(p => !usedTargets.has(p.id))
    if (available.length === 0) break

    const target = pickRandom(available, 1)[0]!
    usedTargets.add(target.id)

    const distractors = pickDistractors(
      config.pool,
      target,
      config.optionCount - 1,
      config.avoidConfusionGroups
    )
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

function generateSpellingRounds(config: GameConfig): RoundData[] {
  const syllables = config.syllablePool || []
  const rounds: RoundData[] = []
  const used = new Set<string>()
  const allFinals = [...singleFinals, ...compoundFinals]

  while (rounds.length < config.roundsPerGame) {
    const available = syllables.filter(s => !used.has(s))
    if (available.length === 0) break

    const syllable = pickRandom(available, 1)[0]!
    used.add(syllable)

    const decomp = findSyllableDecomp(syllable)
    if (!decomp) continue

    const targetInitial = initials.find(ini => ini.text === decomp.initial)
    const targetFinal = allFinals.find(f => f.text === decomp.final)
    if (!targetInitial || !targetFinal) continue

    // Initial options from pool + ensure target is included
    const initOptsFromPool = config.pool.filter(p => p.id !== targetInitial.id)
    const initialOpts = shuffle([targetInitial, ...pickRandom(initOptsFromPool, Math.min(config.optionCount - 1, initOptsFromPool.length))])

    // Final options: target + random distractors
    const finalDistractors = allFinals.filter(f => f.id !== targetFinal.id)
    const finalOpts = shuffle([targetFinal, ...pickRandom(finalDistractors, Math.min(config.optionCount - 1, finalDistractors.length))])

    rounds.push({
      target: targetInitial, // placeholder, not really used
      options: [], // spelling uses initialOptions + finalOptions
      answeredCorrectly: false,
      clicksThisRound: 0,
      targetSyllable: syllable,
      initialOptions: initialOpts,
      finalOptions: finalOpts,
    })
  }
  return rounds
}

function generateTypingRounds(config: GameConfig): RoundData[] {
  const rounds: RoundData[] = []
  const used = new Set<string>()

  for (let i = 0; i < config.roundsPerGame; i++) {
    const available = config.pool.filter(p => !used.has(p.id))
    if (available.length === 0) break

    const target = pickRandom(available, 1)[0]!
    used.add(target.id)

    rounds.push({
      target,
      options: [],
      answeredCorrectly: false,
      clicksThisRound: 0,
      targetChar: target.pronunciation, // Chinese character pronunciation
    })
  }
  return rounds
}

export function useKingdomGameEngine(gameConfig: Ref<GameConfig | null>) {
  const state = reactive<KingdomGameState>(createInitialState())

  const currentRoundData = computed<RoundData | null>(() =>
    state.rounds[state.currentRound] ?? null
  )

  const stars = computed(() => calculateStars(state.score))
  const stickerGrade = computed(() => getStickerGrade(stars.value))
  const isLastRound = computed(() => state.currentRound >= (state.rounds.length - 1))

  function startGame(): void {
    const config = gameConfig.value
    if (!config) return

    let rounds: RoundData[] = []
    switch (config.mechanic) {
      case 'recognition':
      case 'bubble':
        rounds = generateRecognitionRounds(config)
        break
      case 'spelling':
        rounds = generateSpellingRounds(config)
        break
      case 'typing':
        rounds = generateTypingRounds(config)
        break
    }

    Object.assign(state, {
      ...createInitialState(),
      phase: 'countdown' as KingdomGamePhase,
      zoneId: config.zoneId,
      gameId: config.id,
      rounds,
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

    const config = gameConfig.value
    if (!config) return

    speechService.stop()
    stopAudio()

    if (config.mechanic === 'spelling' && round.targetSyllable) {
    // Play the Chinese character pronunciation (TTS), not the spelling
    // The child hears the character and must figure out the initial+final
    const syllable = round.targetSyllable
    const decomp = findSyllableDecomp(syllable)
    const toneMarked = decomp?.toneVariants[0] ?? syllable
    const charText = getCharForSyllable(toneMarked) || syllable
    speechService.speak(charText, { rate: 0.7, pitch: 1.1 })
  } else {
      // For recognition/bubble/typing, play local audio or TTS
      const audioPath = getAudioPath(round.target.category, round.target.text)
      if (audioPath) {
        playAudio(audioPath).then((success: boolean) => {
          if (!success) {
            speechService.speak(round.target.pronunciation, { rate: 0.7, pitch: 1.1 })
          }
        })
      } else {
        speechService.speak(round.target.pronunciation, { rate: 0.7, pitch: 1.1 })
      }
    }
  }

  function selectAnswer(elementId: string): 'correct' | 'wrong' {
    const round = currentRoundData.value
    if (!round || state.phase !== 'playing') return 'wrong'

    round.clicksThisRound++
    state.totalClicks++

    if (elementId === round.target.id) {
      return applyCorrectAnswer()
    }

    state.combo = 0
    return 'wrong'
  }

  function checkSpelling(initialId: string, finalId: string): 'correct' | 'wrong' {
    const round = currentRoundData.value
    if (!round || state.phase !== 'playing' || !round.targetSyllable) return 'wrong'

    round.clicksThisRound++
    state.totalClicks++

    const decomp = findSyllableDecomp(round.targetSyllable)
    if (!decomp) return 'wrong'

    const correctInitial = round.initialOptions?.find(i => i.id === initialId)
    const correctFinal = round.finalOptions?.find(f => f.id === finalId)

    if (correctInitial?.text === decomp.initial && correctFinal?.text === decomp.final) {
      return applyCorrectAnswer()
    }

    state.combo = 0
    return 'wrong'
  }

  function checkTyping(typedText: string): 'correct' | 'wrong' {
    const round = currentRoundData.value
    if (!round || state.phase !== 'playing') return 'wrong'

    round.clicksThisRound++
    state.totalClicks++

    const normalized = typedText.trim().toLowerCase()
    if (normalized === round.target.text.toLowerCase()) {
      return applyCorrectAnswer()
    }

    state.combo = 0
    return 'wrong'
  }

  function applyCorrectAnswer(): 'correct' {
    const round = currentRoundData.value!
    if (round.clicksThisRound === 1) {
      state.correctFirstTry++
    }

    round.answeredCorrectly = true
    state.combo++
    if (state.combo > state.maxCombo) {
      state.maxCombo = state.combo
    }

    let points = calculateScore(round.clicksThisRound)
    points += calculateComboBonus(state.combo)
    state.score += points
    state.phase = 'feedback'
    return 'correct'
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
    stopAudio()
    Object.assign(state, createInitialState())
  }

  return {
    state,
    currentRoundData,
    stars,
    stickerGrade,
    isLastRound,
    startGame,
    onCountdownEnd,
    selectAnswer,
    checkSpelling,
    checkTyping,
    nextRound,
    replayAudio,
    resetGame,
  }
}
