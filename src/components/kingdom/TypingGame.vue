<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import type { GameConfig } from '@/types/kingdom'
import type { useKingdomGameEngine } from '@/composables/useKingdomGameEngine'
import ProgressBar from '@/components/game/ProgressBar.vue'
import FallingCard from '@/components/kingdom/FallingCard.vue'
import PinyinKeyboard from '@/components/kingdom/PinyinKeyboard.vue'
import { speechService } from '@/services/speechService'
import { sfxManager } from '@/utils/sfxManager'
import { getBestChar, getBestEntry } from '@/utils/syllableChars'
import { syllableCombinations } from '@/data/syllableCombinations'

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

const progressColor = '#F0C75E'
const typedText = ref('')
const feedbackState = ref<'idle' | 'correct' | 'wrong'>('idle')
const feedbackActive = ref(false)
const selectedTone = ref<number | null>(null)
const roundTransitioning = ref(false)

const TONE_MARKS = ['ˉ', 'ˊ', 'ˇ', 'ˋ']
const TONE_LABELS = ['一声', '二声', '三声', '四声']

const toneRequired = computed(() => props.config.toneRequired ?? false)

const targetChar = computed(() => {
  const round = currentRoundData.value
  if (!round?.targetSyllable) return ''
  const decomp = syllableCombinations.find(s => s.syllable === round.targetSyllable)
  return decomp ? getBestChar(decomp.toneVariants, round.targetSyllable) : round.targetSyllable
})

const targetWords = computed(() => {
  const round = currentRoundData.value
  if (!round?.targetSyllable) return ''
  const decomp = syllableCombinations.find(s => s.syllable === round.targetSyllable)
  if (!decomp) return ''
  const entry = getBestEntry(decomp.toneVariants)
  if (!entry) return ''
  return entry.word1 ? `${entry.word1} · ${entry.word2}` : ''
})

function vibrateShort() {
  try { navigator.vibrate?.(100) } catch { /* not supported */ }
}

function handleFire() {
  if (feedbackActive.value || roundTransitioning.value || typedText.value.length === 0) return

  feedbackActive.value = true
  const submittedText = typedText.value
  const tone = toneRequired.value ? selectedTone.value ?? undefined : undefined

  const result = props.engine.checkTypingText(submittedText, tone)

  if (result === 'correct') {
    feedbackState.value = 'correct'
    sfxManager.play('pop-correct')
    setTimeout(() => {
      feedbackActive.value = false
      feedbackState.value = 'idle'
      typedText.value = ''
      selectedTone.value = null
      roundTransitioning.value = true
      setTimeout(() => {
        roundTransitioning.value = false
        const hasMore = props.engine.nextRound()
        if (!hasMore) {
          emit('finished')
        } else {
          nextTick(() => props.engine.replayAudio())
        }
      }, 300)
    }, 1200)
  } else {
    feedbackState.value = 'wrong'
    sfxManager.play('pop-wrong')
    vibrateShort()
    setTimeout(() => {
      feedbackActive.value = false
      feedbackState.value = 'idle'
    }, 800)
  }
}

function handleReplay() {
  props.engine.replayAudio()
}

watch(() => state.currentRound, () => {
  nextTick(() => {
    typedText.value = ''
    selectedTone.value = null
    feedbackState.value = 'idle'
    feedbackActive.value = false
  })
})
</script>

<template>
  <div class="typing-game">
    <!-- Top section: fills space above keyboard -->
    <div class="top-section">
      <div v-if="!speechSupported" class="tts-warning">
        ⚠️ 你的浏览器不支持语音功能
      </div>

      <div class="hud">
        <div class="panda-area">
          <span class="panda-emoji">🐼</span>
          <span class="score-text">{{ state.score }} 分</span>
          <span v-if="state.combo >= 2" class="combo-text">x{{ state.combo }}</span>
        </div>
        <div class="round-dots">
          <span v-for="r in state.rounds.length" :key="r" class="dot" :class="{ done: r <= state.currentRound, active: r === state.currentRound + 1 }" />
        </div>
      </div>

      <ProgressBar :current="state.currentRound" :total="state.rounds.length" :color="progressColor" />

      <div class="content-area">
        <FallingCard
          v-if="currentRoundData?.targetSyllable"
          :character="targetChar"
          :words="targetWords"
          :feedback-state="feedbackState"
          @replay="handleReplay"
        />

        <div v-if="toneRequired" class="tone-row">
          <div class="tone-buttons">
            <button
              v-for="(mark, idx) in TONE_MARKS" :key="idx"
              class="tone-btn"
              :class="{ selected: selectedTone === idx }"
              :disabled="feedbackActive"
              @click="selectedTone = idx"
            >
              <span class="tone-mark">{{ mark }}</span>
              <span class="tone-name">{{ TONE_LABELS[idx] }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="submit-bar">
        <div class="typing-preview">{{ typedText || '输入拼音' }}</div>
        <button
          class="fire-btn"
          :disabled="feedbackActive || roundTransitioning || typedText.length === 0"
          @click="handleFire"
        >🚀 发射!</button>
      </div>
    </div>

    <!-- Keyboard pinned to bottom -->
    <PinyinKeyboard
      v-model="typedText"
      :disabled="feedbackActive || roundTransitioning"
    />
  </div>
</template>

<style scoped>
.typing-game {
  position: fixed;
  inset: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  overflow: hidden;
  background: linear-gradient(180deg, #FFF8F0 0%, #FFF0E0 50%, #F0F4FF 100%);
}

.top-section {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tts-warning {
  background: #FFF3CD;
  color: #856404;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  text-align: center;
  margin: 4px 8px 0;
  flex-shrink: 0;
}

/* Top HUD: compact single-line */
.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  flex-shrink: 0;
}

.panda-area {
  display: flex;
  align-items: center;
  gap: 6px;
}

.panda-emoji { font-size: 1.2rem; flex-shrink: 0; }

.score-text {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-brand-orange, #FF8C42);
  background: rgba(255, 255, 255, 0.7);
  border-radius: 8px;
  padding: 2px 8px;
}

.combo-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #F0C75E;
  animation: pulse 0.5s ease-in-out;
}

.round-dots { display: flex; gap: 3px; }

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-divider, #e8e8e8);
  transition: background 0.2s;
}

.dot.done { background: var(--color-brand-orange, #FF8C42); }
.dot.active { background: var(--color-brand-orange, #FF8C42); transform: scale(1.4); }

/* Content area */
.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 2px 16px;
  overflow: hidden;
  min-height: 0;
}

/* Tone selector */
.tone-row { display: flex; align-items: center; justify-content: center; }
.tone-buttons { display: flex; gap: 6px; }

.tone-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  padding: 3px 10px;
  border-radius: 8px;
  border: 2px solid var(--color-divider, #e0e0e0);
  background: linear-gradient(145deg, #FFFFFF, #F5F7FA);
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
}

.tone-btn:active:not(:disabled) { transform: scale(0.93); }
.tone-btn:disabled { opacity: 0.5; cursor: default; }

.tone-btn.selected {
  border-color: #F0C75E;
  background: #FFF9E6;
  box-shadow: 0 2px 8px rgba(240, 199, 94, 0.2);
}

.tone-mark { font-size: 1.1rem; font-weight: 800; color: #2C3E50; line-height: 1; }
.tone-name { font-size: 0.55rem; color: var(--color-text-secondary, #999); }

/* Submit bar */
.submit-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  flex-shrink: 0;
}

.typing-preview {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(108, 155, 210, 0.15);
  font-size: 1.1rem;
  font-weight: 700;
  color: #2C3E50;
  letter-spacing: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
}

.fire-btn {
  min-width: 80px;
  height: 36px;
  padding: 0 16px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #FF8C42, #FFB380);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s;
  box-shadow: 0 2px 8px rgba(255, 140, 66, 0.3);
  font-family: inherit;
  white-space: nowrap;
  -webkit-tap-highlight-color: transparent;
}

.fire-btn:active:not(:disabled) { transform: scale(0.93); }

.fire-btn:disabled {
  opacity: 0.4;
  background: linear-gradient(135deg, #ccc, #ddd);
  box-shadow: none;
  cursor: default;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

@media (min-width: 420px) {
  .fire-btn { min-width: 100px; }
  .typing-preview { font-size: 1.2rem; height: 40px; }
  .fire-btn { height: 40px; }
}

@media (min-width: 768px) {
  .fire-btn { min-width: 120px; font-size: 1.05rem; height: 44px; }
  .typing-preview { height: 44px; font-size: 1.4rem; }
}
</style>
