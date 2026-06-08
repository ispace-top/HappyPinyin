<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import type { GameConfig } from '@/types/kingdom'
import type { useKingdomGameEngine } from '@/composables/useKingdomGameEngine'
import ProgressBar from '@/components/game/ProgressBar.vue'
import { speechService } from '@/services/speechService'
import { sfxManager } from '@/utils/sfxManager'
import { getBestChar, getBestEntry } from '@/utils/syllableChars'
import { syllableCombinations } from '@/data/syllableCombinations'
import { play as playAudio, getAudioPath } from '@/services/pinyinAudio'
import { initials } from '@/data/initials'
import { singleFinals, compoundFinals } from '@/data/finals'

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
const selectedInitial = ref<string | null>(null)
const selectedFinal = ref<string | null>(null)
const selectedTone = ref<number | null>(null)
const feedbackState = ref<'idle' | 'correct' | 'wrong'>('idle')
const feedbackActive = ref(false)

const toneRequired = computed(() => props.config.toneRequired ?? false)

const TONE_MARKS = ['ˉ', 'ˊ', 'ˇ', 'ˋ']
const TONE_LABELS = ['一声', '二声', '三声', '四声']

// Target character
const targetChar = computed(() => {
  const round = currentRoundData.value
  if (!round?.targetSyllable) return ''
  const decomp = syllableCombinations.find(s => s.syllable === round.targetSyllable)
  return decomp ? getBestChar(decomp.toneVariants, round.targetSyllable) : round.targetSyllable
})

const targetWords = computed(() => {
  const round = currentRoundData.value
  if (!round?.targetSyllable) return { w1: '', w2: '' }
  const decomp = syllableCombinations.find(s => s.syllable === round.targetSyllable)
  if (!decomp) return { w1: '', w2: '' }
  const entry = getBestEntry(decomp.toneVariants)
  return entry ? { w1: entry.word1, w2: entry.word2 } : { w1: '', w2: '' }
})

// Keyboard initials — from config.pool
const keyboardInitials = computed(() => props.config.pool || initials)

// Keyboard finals — from config.finalPool, or all finals
const keyboardFinals = computed(() => {
  if (props.config.finalPool && props.config.finalPool.length > 0) return props.config.finalPool
  return [...singleFinals, ...compoundFinals]
})

// Preview display
const previewText = computed(() => {
  const ini = keyboardInitials.value.find(i => i.id === selectedInitial.value)
  const fin = keyboardFinals.value.find(f => f.id === selectedFinal.value)
  const iText = ini?.text ?? ''
  const fText = fin?.text ?? ''
  return iText + fText
})

function tapPlay(path: string | null) {
  if (path) new Audio(path).play()
}

function handleSelectInitial(id: string) {
  if (feedbackActive.value) return
  selectedInitial.value = id
  const elem = keyboardInitials.value.find(i => i.id === id)
  if (elem) tapPlay(getAudioPath('initial', elem.text))
  // Reset final when initial changes
  if (selectedFinal.value) {
    selectedFinal.value = null
  }
}

function handleSelectFinal(id: string) {
  if (feedbackActive.value || !selectedInitial.value) return
  selectedFinal.value = id
  const elem = keyboardFinals.value.find(f => f.id === id)
  if (elem) tapPlay(getAudioPath('final', elem.text))
  if (!toneRequired.value) checkAndSubmit()
}

function handleSelectTone(tone: number) {
  if (feedbackActive.value) return
  selectedTone.value = tone
  checkAndSubmit()
}

function playSpellingResult(initId: string, finalId: string): Promise<boolean> {
  return new Promise((resolve) => {
    const ini = keyboardInitials.value.find(i => i.id === initId)
    const fin = keyboardFinals.value.find(f => f.id === finalId)
    if (!ini || !fin) { resolve(false); return }

    const initPath = getAudioPath('initial', ini.text)
    const finalPath = getAudioPath('final', fin.text)
    const combined = ini.text + fin.text
    const decomp = syllableCombinations.find(s => s.syllable === combined)
    const charText = decomp ? getBestChar(decomp.toneVariants, combined) : combined

    const playChain = initPath && finalPath
      ? playAudio(initPath).then((ok) => ok ? playAudio(finalPath) : Promise.resolve(false))
      : Promise.resolve(false)

    playChain.then(() => {
      speechService.speak(charText, { rate: 0.7, pitch: 1.1 })
      setTimeout(() => resolve(true), 300)
    })
  })
}

function checkAndSubmit() {
  if (!selectedInitial.value || !selectedFinal.value) return

  feedbackActive.value = true
  const initId = selectedInitial.value
  const finalId = selectedFinal.value
  const tone = selectedTone.value

  setTimeout(async () => {
    await playSpellingResult(initId, finalId)

    const result = props.engine.checkTyping(initId, finalId, tone ?? undefined)

    if (result === 'correct') {
      feedbackState.value = 'correct'
      sfxManager.play('pop-correct')
      setTimeout(() => {
        feedbackActive.value = false
        feedbackState.value = 'idle'
        selectedInitial.value = null
        selectedFinal.value = null
        selectedTone.value = null
        const hasMore = props.engine.nextRound()
        if (!hasMore) {
          emit('finished')
        } else {
          nextTick(() => props.engine.replayAudio())
        }
      }, 600)
    } else {
      feedbackState.value = 'wrong'
      sfxManager.play('pop-wrong')
      setTimeout(() => {
        feedbackActive.value = false
        feedbackState.value = 'idle'
        selectedInitial.value = null
        selectedFinal.value = null
        selectedTone.value = null
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
    selectedTone.value = null
    feedbackState.value = 'idle'
  })
})
</script>

<template>
  <div class="typing-game">
    <div v-if="!speechSupported" class="tts-warning">
      ⚠️ 你的浏览器不支持语音功能
    </div>

    <div class="hud">
      <div class="panda-area">
        <span class="panda-emoji">🐼</span>
        <div class="panda-bubble">
          <span class="bubble-label">打出来</span>
        </div>
      </div>
      <div class="round-info">
        <span class="round-text">第 {{ state.currentRound + 1 }} / {{ state.rounds.length }} 题</span>
        <div class="round-dots">
          <span v-for="r in state.rounds.length" :key="r" class="dot" :class="{ done: r <= state.currentRound, active: r === state.currentRound + 1 }" />
        </div>
      </div>
    </div>

    <ProgressBar :current="state.currentRound" :total="state.rounds.length" :color="progressColor" />

    <!-- Character Card -->
    <div v-if="currentRoundData?.targetSyllable" class="char-card" :class="`state-${feedbackState}`">
      <div class="char-card-inner">
        <span class="char-big">{{ targetChar }}</span>
        <span class="char-pinyin">{{ currentRoundData.targetSyllable }}</span>
        <span v-if="targetWords.w1" class="char-words">{{ targetWords.w1 }} · {{ targetWords.w2 }}</span>
      </div>
      <button class="listen-btn" @click="handleReplay" aria-label="再听一次发音">
        <span class="listen-icon">🔊</span>
        <span class="listen-text">点我听发音</span>
      </button>
    </div>

    <!-- Preview Area -->
    <div class="preview-area" :class="{ active: selectedInitial }">
      <div class="preview-slot" :class="{ filled: selectedInitial }">
        {{ keyboardInitials.find(i => i.id === selectedInitial)?.text || '?' }}
      </div>
      <span class="preview-plus">+</span>
      <div class="preview-slot" :class="{ filled: selectedFinal }">
        {{ keyboardFinals.find(f => f.id === selectedFinal)?.text || '?' }}
      </div>
      <span class="preview-eq">=</span>
      <div class="preview-result" :class="{ filled: selectedInitial && selectedFinal }">
        {{ previewText || '?' }}
      </div>
    </div>

    <!-- Keyboard -->
    <div class="keyboard">
      <div class="keyboard-section">
        <h3 class="kb-label">声母</h3>
        <div class="kb-grid initials">
          <button
            v-for="init in keyboardInitials" :key="init.id"
            class="kb-key initial-key"
            :class="{
              selected: selectedInitial === init.id,
              correct: feedbackState === 'correct' && selectedInitial === init.id,
              wrong: feedbackState === 'wrong' && selectedInitial === init.id,
            }"
            :disabled="feedbackActive"
            @click="handleSelectInitial(init.id)"
          >
            {{ init.text }}
          </button>
        </div>
      </div>
      <div class="keyboard-section">
        <h3 class="kb-label">韵母</h3>
        <div class="kb-grid finals">
          <button
            v-for="fin in keyboardFinals" :key="fin.id"
            class="kb-key final-key"
            :class="{
              selected: selectedFinal === fin.id,
              correct: feedbackState === 'correct' && selectedFinal === fin.id,
              wrong: feedbackState === 'wrong' && selectedFinal === fin.id,
            }"
            :disabled="feedbackActive || !selectedInitial"
            @click="handleSelectFinal(fin.id)"
          >
            {{ fin.text }}
          </button>
        </div>
      </div>
    </div>

    <!-- Tone selection (only for tone-required levels) -->
    <div v-if="toneRequired && selectedInitial && selectedFinal && !feedbackActive" class="tone-section">
      <h3 class="kb-label">选声调</h3>
      <div class="tone-buttons">
        <button
          v-for="(mark, idx) in TONE_MARKS" :key="idx"
          class="tone-btn"
          :class="{ selected: selectedTone === idx }"
          @click="handleSelectTone(idx)"
        >
          <span class="tone-mark">{{ mark }}</span>
          <span class="tone-label">{{ TONE_LABELS[idx] }}</span>
        </button>
      </div>
    </div>

    <div class="score-hud">
      <span class="score">得分: {{ state.score }}</span>
      <span v-if="state.combo >= 2" class="combo">连击: x{{ state.combo }}</span>
    </div>
  </div>
</template>

<style scoped>
.typing-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 16px 12px;
  min-height: 100%;
}

.tts-warning {
  background: #FFF3CD; color: #856404;
  padding: 8px 14px; border-radius: 10px;
  font-size: 0.8rem; text-align: center; max-width: 400px;
}

.hud {
  display: flex; justify-content: space-between; align-items: flex-start;
  width: 100%; max-width: 500px;
}

.panda-area { display: flex; align-items: center; gap: 8px; }
.panda-emoji { font-size: 1.8rem; flex-shrink: 0; }

.panda-bubble {
  display: flex; align-items: center; gap: 4px;
  background: var(--color-surface,#fff); border-radius: 10px;
  padding: 6px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  font-size: 0.9rem; font-weight: 600;
}

.round-info { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.round-text { font-size: 0.8rem; color: var(--color-text-secondary,#888); }
.round-dots { display: flex; gap: 3px; }
.dot { width: 7px; height: 7px; border-radius: 50%; background: var(--color-divider,#e8e8e8); }
.dot.done { background: var(--color-brand-orange,#FF8C42); }
.dot.active { background: var(--color-brand-orange,#FF8C42); transform: scale(1.4); }

/* Character Card — matching 拼读工坊 style, slightly smaller */
.char-card { display: flex; flex-direction: column; align-items: center; gap: 10px; width: 100%; max-width: 280px; }

.char-card-inner {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  width: 100%; padding: 24px 12px 14px;
  background: linear-gradient(160deg, #FFFFFF 0%, #F0F4FF 40%, #E8EEFA 100%);
  border-radius: 22px;
  border: 2px solid rgba(108,155,210,0.2);
  box-shadow: 0 6px 24px rgba(108,155,210,0.1), 0 2px 6px rgba(0,0,0,0.03);
  transition: border-color 0.3s, box-shadow 0.3s, background 0.3s;
}

.char-card.state-correct .char-card-inner {
  border-color: rgba(126,200,160,0.4);
  background: linear-gradient(160deg, #FFFFFF 0%, #F0FAF4 40%, #E8F6EE 100%);
  box-shadow: 0 6px 24px rgba(126,200,160,0.15), 0 2px 6px rgba(0,0,0,0.03);
}
.char-card.state-wrong .char-card-inner {
  border-color: rgba(255,107,107,0.3);
  background: linear-gradient(160deg, #FFFFFF 0%, #FFF5F5 40%, #FFEEEE 100%);
  box-shadow: 0 6px 24px rgba(255,107,107,0.1), 0 2px 6px rgba(0,0,0,0.03);
}

.char-big { font-size: 3.8rem; font-weight: 800; color: var(--color-text-primary,#2C3E50); line-height: 1.1; text-shadow: 0 2px 6px rgba(0,0,0,0.05); }

.char-pinyin { font-size: 1rem; font-weight: 600; color: var(--color-text-secondary,#888); margin-top: 4px; letter-spacing: 1px; }

.char-words { font-size: 0.8rem; color: var(--color-text-secondary,#999); margin-top: 2px; }

.listen-btn {
  display: flex; align-items: center; gap: 5px; padding: 8px 16px;
  background: linear-gradient(135deg, #6C9BD2, #8BB8E8);
  border: none; border-radius: 18px; color: white;
  font-size: 0.85rem; font-weight: 600; cursor: pointer;
  box-shadow: 0 3px 10px rgba(108,155,210,0.2);
  transition: transform 0.15s, box-shadow 0.15s;
}
.listen-btn:hover { transform: scale(1.03); box-shadow: 0 4px 14px rgba(108,155,210,0.3); }
.listen-icon { font-size: 1rem; }

/* Preview Area */
.preview-area {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 16px; background: rgba(255,255,255,0.6);
  border-radius: 14px; opacity: 0.5; transition: opacity 0.2s;
}
.preview-area.active { opacity: 1; }

.preview-slot {
  min-width: 38px; height: 38px; padding: 0 8px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px; font-size: 1.15rem; font-weight: 700;
  background: var(--color-divider,#e8e8e8); color: #aaa;
  white-space: nowrap; transition: all 0.2s;
}
.preview-slot.filled { background: #E8F0FA; color: #6C9BD2; }

.preview-result {
  min-width: 48px; height: 38px; padding: 0 10px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px; font-size: 1.15rem; font-weight: 700;
  background: var(--color-divider,#e8e8e8); color: #aaa;
  white-space: nowrap; transition: all 0.2s;
}
.preview-result.filled { background: #FFF9E6; color: #F0C75E; border: 2px solid #F0C75E; }

.preview-plus, .preview-eq { font-size: 1.2rem; font-weight: 700; color: #ccc; flex-shrink: 0; }

/* Keyboard */
.keyboard { width: 100%; max-width: 500px; display: flex; flex-direction: column; gap: 12px; }

.keyboard-section { display: flex; flex-direction: column; gap: 6px; }

.kb-label {
  font-size: 0.75rem; font-weight: 600; color: var(--color-text-secondary,#aaa);
  margin: 0; text-align: center; text-transform: uppercase; letter-spacing: 1px;
}

.kb-grid {
  display: flex; flex-wrap: wrap; gap: 5px; justify-content: center;
}

.kb-key {
  min-width: 44px; height: 38px; padding: 4px 10px;
  border-radius: 10px; border: 2px solid var(--color-divider,#e0e0e0);
  background: linear-gradient(145deg, #FFFFFF, #F5F7FA);
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  font-size: 0.95rem; font-weight: 700;
  color: var(--color-text-primary,#2C3E50);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}
.final-key { min-width: 50px; font-size: 0.85rem; }

.kb-key:hover:not(:disabled) { transform: translateY(-1px); border-color: var(--color-brand-orange,#FF8C42); }
.kb-key:active:not(:disabled) { transform: scale(0.93); }

.initial-key { background: linear-gradient(145deg, #FFFFFF, #E8F0FA); }
.final-key { background: linear-gradient(145deg, #FFFFFF, #E8F8EE); }

.kb-key.selected {
  border-color: #6C9BD2; background: #E8F0FA; color: #6C9BD2;
  box-shadow: 0 3px 12px rgba(108,155,210,0.2); transform: scale(1.05);
}
.kb-key.correct { border-color: #7EC8A0; background: #E8F8EE; color: #7EC8A0; }
.kb-key.wrong { border-color: #FF6B6B; background: #FFF0F0; color: #FF6B6B; }
.kb-key:disabled { opacity: 0.5; cursor: default; }

/* Tone selection */
.tone-section { display: flex; flex-direction: column; align-items: center; gap: 6px; }

.tone-buttons { display: flex; gap: 8px; }

.tone-btn {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 8px 16px; border-radius: 14px;
  border: 2px solid var(--color-divider,#e0e0e0);
  background: linear-gradient(145deg, #FFFFFF, #F5F7FA);
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  cursor: pointer; transition: all 0.15s ease;
}
.tone-btn:hover { transform: translateY(-1px); border-color: var(--color-brand-orange,#FF8C42); }
.tone-btn:active { transform: scale(0.93); }

.tone-btn.selected {
  border-color: #F0C75E; background: #FFF9E6;
  box-shadow: 0 3px 12px rgba(240,199,94,0.2); transform: scale(1.05);
}

.tone-mark { font-size: 1.6rem; font-weight: 800; color: var(--color-text-primary,#2C3E50); line-height: 1; }
.tone-label { font-size: 0.7rem; color: var(--color-text-secondary,#999); }

.score-hud {
  display: flex; gap: 14px; align-items: center;
  font-size: 1rem; font-weight: 600; color: var(--color-text-primary,#333);
}

.combo { color: var(--color-brand-orange,#FF8C42); animation: pulse 0.5s ease-in-out; }
@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }

@media (max-width: 400px) {
  .char-big { font-size: 3rem; }
  .char-card-inner { padding: 18px 10px 12px; }
  .kb-key { min-width: 38px; height: 34px; font-size: 0.82rem; padding: 2px 7px; }
  .final-key { min-width: 44px; font-size: 0.78rem; }
}
</style>
