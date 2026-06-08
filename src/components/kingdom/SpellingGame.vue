<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import type { GameConfig } from '@/types/kingdom'
import type { useKingdomGameEngine } from '@/composables/useKingdomGameEngine'
import ProgressBar from '@/components/game/ProgressBar.vue'
import { speechService } from '@/services/speechService'
import { sfxManager } from '@/utils/sfxManager'
import { getCharForSyllable } from '@/utils/syllableChars'
import { syllableCombinations } from '@/data/syllableCombinations'
import { play as playAudio, getAudioPath } from '@/services/pinyinAudio'

function tapPlay(path: string | null) {
  if (path) new Audio(path).play()
}

const props = defineProps<{
  engine: ReturnType<typeof useKingdomGameEngine>
  config: GameConfig
}>()

const emit = defineEmits<{
  finished: []
}>()

const state = props.engine.state
const currentRoundData = props.engine.currentRoundData

const speechSupported = speechService.isSupported()

const progressColor = '#6C9BD2'
const selectedInitial = ref<string | null>(null)
const selectedFinal = ref<string | null>(null)
const feedbackState = ref<'idle' | 'correct' | 'wrong'>('idle')
const feedbackActive = ref(false)
const roundTransitioning = ref(false)

const targetChar = computed(() => {
  const round = currentRoundData.value
  if (!round?.targetSyllable) return ''
  const decomp = syllableCombinations.find(s => s.syllable === round.targetSyllable)
  const toneMarked = decomp?.toneVariants[0] ?? ''
  return toneMarked ? getCharForSyllable(toneMarked) || round.targetSyllable : round.targetSyllable
})

function handleSelectInitial(id: string) {
  if (feedbackActive.value || roundTransitioning.value) return
  selectedInitial.value = id
  const round = currentRoundData.value
  const elem = round?.initialOptions?.find(o => o.id === id)
  if (elem) tapPlay(getAudioPath('initial', elem.text))
  checkIfComplete()
}

function handleSelectFinal(id: string) {
  if (feedbackActive.value || roundTransitioning.value) return
  if (!selectedInitial.value) return
  selectedFinal.value = id
  const round = currentRoundData.value
  const elem = round?.finalOptions?.find(o => o.id === id)
  if (elem) tapPlay(getAudioPath('final', elem.text))
  checkIfComplete()
}

function playSpellingResult(initId: string, finalId: string): Promise<boolean> {
  return new Promise((resolve) => {
    const round = currentRoundData.value
    if (!round) { resolve(false); return }

    const initElem = round.initialOptions?.find(o => o.id === initId)
    const finalElem = round.finalOptions?.find(o => o.id === finalId)
    if (!initElem || !finalElem) { resolve(false); return }

    const initPath = getAudioPath('initial', initElem.text)
    const finalPath = getAudioPath('final', finalElem.text)

    // Build the combined syllable and find its Chinese character for TTS
    const combined = initElem.text + finalElem.text
    const decomp = syllableCombinations.find(s => s.syllable === combined)
    const toneMarked = decomp?.toneVariants[0]
    const charText = toneMarked ? (getCharForSyllable(toneMarked) || combined) : combined

    const playChain = initPath && finalPath
      ? playAudio(initPath).then((ok) => ok ? playAudio(finalPath) : Promise.resolve(false))
      : Promise.resolve(false)

    playChain.then(() => {
      // After initial + final audio, speak the character
      speechService.speak(charText, { rate: 0.7, pitch: 1.1 })
      // Resolve after a short delay for TTS to start
      setTimeout(() => resolve(true), 300)
    })
  })
}

function checkIfComplete() {
  if (!selectedInitial.value || !selectedFinal.value) return

  feedbackActive.value = true
  const initId = selectedInitial.value
  const finalId = selectedFinal.value

  // Pause briefly, then play combined result, THEN check
  setTimeout(async () => {
    await playSpellingResult(initId, finalId)

    // Now check correctness after spelling audio finishes
    const result = props.engine.checkSpelling(initId, finalId)

    if (result === 'correct') {
      feedbackState.value = 'correct'
      sfxManager.play('pop-correct')
      setTimeout(() => {
        feedbackActive.value = false
        feedbackState.value = 'idle'
        roundTransitioning.value = true
        setTimeout(() => {
          roundTransitioning.value = false
          selectedInitial.value = null
          selectedFinal.value = null
          const hasMore = props.engine.nextRound()
          if (!hasMore) {
            emit('finished')
          } else {
            nextTick(() => props.engine.replayAudio())
          }
        }, 300)
      }, 600)
    } else {
      feedbackState.value = 'wrong'
      sfxManager.play('pop-wrong')
      setTimeout(() => {
        feedbackActive.value = false
        feedbackState.value = 'idle'
        selectedInitial.value = null
        selectedFinal.value = null
      }, 800)
    }
  }, 400)
}

function handleReplay() {
  props.engine.replayAudio()
}

watch(() => state.currentRound, () => {
  nextTick(() => {
    selectedInitial.value = null
    selectedFinal.value = null
    feedbackState.value = 'idle'
  })
})
</script>

<template>
  <div class="spelling-game" :class="{ feedback: feedbackActive }">
    <div v-if="!speechSupported" class="tts-warning">
      ⚠️ 你的浏览器不支持语音功能
    </div>

    <div class="hud">
      <div class="panda-area">
        <span class="panda-emoji">🐼</span>
        <div class="panda-bubble">
          <span class="bubble-label">拼一拼</span>
        </div>
      </div>
      <div class="round-info">
        <span class="round-text">第 {{ state.currentRound + 1 }} / {{ state.rounds.length }} 题</span>
        <div class="round-dots">
          <span
            v-for="r in state.rounds.length" :key="r"
            class="dot"
            :class="{ done: r <= state.currentRound, active: r === state.currentRound + 1 }"
          />
        </div>
      </div>
    </div>

    <ProgressBar
      :current="state.currentRound"
      :total="state.rounds.length"
      :color="progressColor"
    />

    <!-- Character Card -->
    <div v-if="currentRoundData?.targetSyllable" class="char-card" :class="`state-${feedbackState}`">
      <div class="char-card-inner">
        <span class="char-big">{{ targetChar }}</span>
        <span class="char-pinyin">{{ currentRoundData.targetSyllable }}</span>
      </div>
      <button class="listen-btn" @click="handleReplay" aria-label="再听一次发音">
        <span class="listen-icon">🔊</span>
        <span class="listen-text">点我听发音</span>
      </button>
    </div>

    <div v-if="currentRoundData" class="spelling-area" :class="`feedback-${feedbackState}`">
      <div class="selector-group">
        <h3 class="selector-label">选声母</h3>
        <div class="selector-grid">
          <button
            v-for="opt in currentRoundData.initialOptions"
            :key="opt.id"
            class="spell-card initial-card"
            :class="{
              selected: selectedInitial === opt.id,
              correct: feedbackState === 'correct' && selectedInitial === opt.id,
              wrong: feedbackState === 'wrong' && selectedInitial === opt.id,
            }"
            :disabled="feedbackActive"
            @click="handleSelectInitial(opt.id)"
          >
            {{ opt.text }}
          </button>
        </div>
      </div>

      <div class="plus-sign">+</div>

      <div class="selector-group">
        <h3 class="selector-label">选韵母</h3>
        <div class="selector-grid">
          <button
            v-for="opt in currentRoundData.finalOptions"
            :key="opt.id"
            class="spell-card final-card"
            :class="{
              selected: selectedFinal === opt.id,
              correct: feedbackState === 'correct' && selectedFinal === opt.id,
              wrong: feedbackState === 'wrong' && selectedFinal === opt.id,
            }"
            :disabled="feedbackActive || !selectedInitial"
            @click="handleSelectFinal(opt.id)"
          >
            {{ opt.text }}
          </button>
        </div>
      </div>
    </div>

    <div class="score-hud">
      <span class="score">得分: {{ state.score }}</span>
      <span v-if="state.combo >= 2" class="combo">连击: x{{ state.combo }}</span>
    </div>
  </div>
</template>

<style scoped>
.spelling-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 24px 16px;
  min-height: 100%;
}

.spelling-game.feedback { pointer-events: none; }

.tts-warning {
  background: #FFF3CD;
  color: #856404;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  text-align: center;
  max-width: 400px;
}

.hud {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 500px;
  gap: 12px;
  flex-wrap: wrap;
}

.panda-area { display: flex; align-items: center; gap: 8px; }
.panda-emoji { font-size: 2rem; flex-shrink: 0; }

.panda-bubble {
  display: flex;
  align-items: center;
  gap: 4px;
  background: var(--color-surface, #fff);
  border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-size: 1rem;
  font-weight: 600;
}

.replay-btn { background: none; border: none; font-size: 1.3rem; cursor: pointer; padding: 2px; }

/* Character card — hero element */
.char-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 320px;
}

.char-card-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 32px 16px 20px;
  background: linear-gradient(160deg, #FFFFFF 0%, #F0F4FF 40%, #E8EEFA 100%);
  border-radius: 24px;
  border: 2px solid rgba(108,155,210,0.2);
  box-shadow: 0 8px 32px rgba(108,155,210,0.12), 0 2px 8px rgba(0,0,0,0.04);
  transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
}

.char-card.state-correct .char-card-inner {
  border-color: rgba(126,200,160,0.4);
  background: linear-gradient(160deg, #FFFFFF 0%, #F0FAF4 40%, #E8F6EE 100%);
  box-shadow: 0 8px 32px rgba(126,200,160,0.18), 0 2px 8px rgba(0,0,0,0.04);
}

.char-card.state-wrong .char-card-inner {
  border-color: rgba(255,107,107,0.3);
  background: linear-gradient(160deg, #FFFFFF 0%, #FFF5F5 40%, #FFEEEE 100%);
  box-shadow: 0 8px 32px rgba(255,107,107,0.12), 0 2px 8px rgba(0,0,0,0.04);
}

.char-big {
  font-size: 4.5rem;
  font-weight: 800;
  color: var(--color-text-primary, #2C3E50);
  line-height: 1.1;
  text-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.char-pinyin {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-secondary, #888);
  margin-top: 4px;
  letter-spacing: 1px;
}

.listen-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #6C9BD2, #8BB8E8);
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(108,155,210,0.25);
  transition: transform 0.15s, box-shadow 0.15s;
}

.listen-btn:hover { transform: scale(1.04); box-shadow: 0 6px 16px rgba(108,155,210,0.35); }
.listen-btn:active { transform: scale(0.97); }

.listen-icon { font-size: 1.2rem; }

.round-info { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.round-text { font-size: 0.85rem; color: var(--color-text-secondary, #888); }
.round-dots { display: flex; gap: 4px; }

.dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--color-divider, #e8e8e8);
  transition: background 0.2s;
}
.dot.done { background: var(--color-brand-orange, #FF8C42); }
.dot.active { background: var(--color-brand-orange, #FF8C42); transform: scale(1.4); }

/* Spelling area */
.spelling-area {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  max-width: 500px;
  padding: 20px 0;
  flex-wrap: wrap;
}

.selector-group { display: flex; flex-direction: column; align-items: center; gap: 10px; flex: 1; min-width: 140px; }

.selector-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text-secondary, #888);
  margin: 0;
}

.selector-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
}

.plus-sign {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text-secondary, #888);
}

.spell-card {
  padding: 14px 8px;
  border-radius: 14px;
  border: 2px solid var(--color-divider, #e0e0e0);
  background: linear-gradient(145deg, #FFFFFF, #F5F7FA);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--color-text-primary, #2C3E50);
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34,1.56,0.64,1);
  text-align: center;
  -webkit-tap-highlight-color: transparent;
}

.initial-card { background: linear-gradient(145deg, #FFFFFF, #E8F0FA); }

.final-card { background: linear-gradient(145deg, #FFFFFF, #E8F8EE); }

.spell-card:hover:not(:disabled) {
  border-color: var(--color-brand-orange, #FF8C42);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255,140,66,0.1);
}

.spell-card:active:not(:disabled) { transform: scale(0.93); }

.spell-card.selected {
  border-color: #6C9BD2;
  background: #E8F0FA;
  color: #6C9BD2;
  box-shadow: 0 4px 16px rgba(108,155,210,0.2);
  transform: scale(1.05);
}

.spell-card.correct {
  border-color: #7EC8A0;
  background: #E8F8EE;
  color: #7EC8A0;
  box-shadow: 0 0 20px rgba(126,200,160,0.4);
  animation: pulse-correct 0.5s ease-out;
}

.spell-card.wrong {
  border-color: #FF6B6B;
  background: #FFF0F0;
  color: #FF6B6B;
  box-shadow: 0 0 16px rgba(255,107,107,0.25);
  animation: shake 0.45s ease-out;
}

.spell-card:disabled { opacity: 0.6; cursor: default; }

@keyframes pulse-correct {
  0% { transform: scale(1); }
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  15% { transform: translateX(-6px); }
  30% { transform: translateX(6px); }
  45% { transform: translateX(-4px); }
  60% { transform: translateX(4px); }
  75% { transform: translateX(-2px); }
  90% { transform: translateX(2px); }
}

.score-hud {
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary, #333);
}

.combo {
  color: var(--color-brand-orange, #FF8C42);
  animation: pulse 0.5s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@media (max-width: 400px) {
  .char-card-inner { padding: 24px 12px 14px; }
  .char-big { font-size: 3.5rem; }
  .spelling-area { flex-direction: column; }
  .plus-sign { transform: rotate(90deg); }
  .selector-grid { grid-template-columns: repeat(4, 1fr); }
}
</style>
