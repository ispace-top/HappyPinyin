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
import { getBestSpeech } from '@/utils/syllableChars'

interface RoundData {
  target: PinyinElement
  options: PinyinElement[]
  answeredCorrectly: boolean
  clicksThisRound: number
  // Spelling/typing
  targetSyllable?: string
  targetTone?: number        // 0-3 for tone-required mode
  initialOptions?: PinyinElement[]
  finalOptions?: PinyinElement[]
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

function generateSyllableRounds(config: GameConfig): RoundData[] {
  const rounds: RoundData[] = []
  const used = new Set<string>()
  const allFinals = config.finalPool || [...singleFinals, ...compoundFinals]

  const hasFixedPool = config.syllablePool && config.syllablePool.length > 0

  while (rounds.length < config.roundsPerGame) {
    let syllable: string
    let decomp: SyllableComponent | undefined

    if (hasFixedPool) {
      const available = config.syllablePool!.filter(s => !used.has(s))
      if (available.length === 0) break
      syllable = pickRandom(available, 1)[0]!
      used.add(syllable)
      decomp = findSyllableDecomp(syllable)
      if (!decomp) continue
    } else {
      // Dynamic generation: randomly combine initial + final
      let attempts = 0
      do {
        const randInit = pickRandom(config.pool, 1)[0]!
        const randFinal = pickRandom(allFinals, 1)[0]!
        syllable = randInit.text + randFinal.text
        attempts++
        if (attempts > 50) break
      } while (used.has(syllable) || !findSyllableDecomp(syllable))
      if (attempts > 50 && used.has(syllable)) break
      used.add(syllable)
      decomp = findSyllableDecomp(syllable)
      if (!decomp) continue
    }

    const targetInitial = initials.find(ini => ini.text === decomp!.initial)
    const targetFinal = allFinals.find(f => f.text === decomp!.final)
    if (!targetInitial || !targetFinal) continue

    // Initial options from pool + ensure target is included
    const initOptsFromPool = config.pool.filter(p => p.id !== targetInitial.id)
    const initialOpts = shuffle([targetInitial, ...pickRandom(initOptsFromPool, Math.min(config.optionCount - 1, initOptsFromPool.length))])

    // Final options: target + random distractors
    const finalDistractors = allFinals.filter(f => f.id !== targetFinal.id)
    const finalOpts = shuffle([targetFinal, ...pickRandom(finalDistractors, Math.min(config.optionCount - 1, finalDistractors.length))])

    rounds.push({
      target: targetInitial,
      options: [],
      answeredCorrectly: false,
      clicksThisRound: 0,
      targetSyllable: syllable,
      targetTone: config.toneRequired ? Math.floor(Math.random() * 4) : undefined,
      initialOptions: initialOpts,
      finalOptions: finalOpts,
    })
  }
  return rounds
}

// generateTypingRounds uses the same syllable-based logic as spelling
const generateTypingRounds = generateSyllableRounds

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
        rounds = generateSyllableRounds(config)
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

    if ((config.mechanic === 'spelling' || config.mechanic === 'typing') && round.targetSyllable) {
    // Play the Chinese character pronunciation (TTS), not the spelling
    // The child hears the character and must figure out the initial+final
    const syllable = round.targetSyllable
    const decomp = findSyllableDecomp(syllable)
    const charText = decomp ? getBestSpeech(decomp.toneVariants, syllable) : syllable
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

  function checkSpelling(initialId: string, finalId: string, tone?: number): 'correct' | 'wrong' {
    const round = currentRoundData.value
    if (!round || state.phase !== 'playing' || !round.targetSyllable) return 'wrong'

    round.clicksThisRound++
    state.totalClicks++

    const decomp = findSyllableDecomp(round.targetSyllable)
    if (!decomp) return 'wrong'

    const correctInitial = round.initialOptions?.find(i => i.id === initialId)
    const correctFinal = round.finalOptions?.find(f => f.id === finalId)

    if (correctInitial?.text === decomp.initial && correctFinal?.text === decomp.final) {
      // If tone is required, check it too
      if (round.targetTone !== undefined && tone !== round.targetTone) {
        state.combo = 0
        return 'wrong'
      }
      return applyCorrectAnswer()
    }

    state.combo = 0
    return 'wrong'
  }

  function checkTyping(initialId: string, finalId: string, tone?: number): 'correct' | 'wrong' {
    return checkSpelling(initialId, finalId, tone)
  }

  function checkTypingText(pinyinText: string, tone?: number): 'correct' | 'wrong' {
    const round = currentRoundData.value
    if (!round || state.phase !== 'playing' || !round.targetSyllable) return 'wrong'

    round.clicksThisRound++
    state.totalClicks++

    const normalized = pinyinText.trim().toLowerCase()
    const target = round.targetSyllable.toLowerCase()

    if (normalized !== target) {
      state.combo = 0
      return 'wrong'
    }

    if (round.targetTone !== undefined && tone !== round.targetTone) {
      state.combo = 0
      return 'wrong'
    }

    return applyCorrectAnswer()
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
    checkTypingText,
    nextRound,
    replayAudio,
    resetGame,
  }
}
