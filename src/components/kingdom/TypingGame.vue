<script setup lang="ts">
import { computed, watch, ref, nextTick } from 'vue'
import type { GameConfig } from '@/types/kingdom'
import type { useKingdomGameEngine } from '@/composables/useKingdomGameEngine'
import ProgressBar from '@/components/game/ProgressBar.vue'
import { speechService } from '@/services/speechService'
import { sfxManager } from '@/utils/sfxManager'

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
const inputText = ref('')
const feedbackState = ref<'idle' | 'correct' | 'wrong'>('idle')
const feedbackActive = ref(false)
const roundTransitioning = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const targetChar = computed(() => {
  const round = currentRoundData.value
  return round?.target.pronunciation || ''
})

function handleSubmit() {
  if (feedbackActive.value || roundTransitioning.value) return
  if (!inputText.value.trim()) return

  feedbackActive.value = true
  const result = props.engine.checkTyping(inputText.value)

  if (result === 'correct') {
    feedbackState.value = 'correct'
    sfxManager.play('pop-correct')
    setTimeout(() => {
      feedbackActive.value = false
      feedbackState.value = 'idle'
      roundTransitioning.value = true
      setTimeout(() => {
        roundTransitioning.value = false
        inputText.value = ''
        const hasMore = props.engine.nextRound()
        if (!hasMore) {
          emit('finished')
        } else {
          nextTick(() => {
            inputRef.value?.focus()
            props.engine.replayAudio()
          })
        }
      }, 300)
    }, 800)
  } else {
    feedbackState.value = 'wrong'
    sfxManager.play('pop-wrong')
    setTimeout(() => {
      feedbackActive.value = false
      feedbackState.value = 'idle'
      inputText.value = ''
      inputRef.value?.focus()
    }, 600)
  }
}

function handleReplay() {
  props.engine.replayAudio()
}

watch(() => state.currentRound, () => {
  nextTick(() => {
    inputText.value = ''
    feedbackState.value = 'idle'
    inputRef.value?.focus()
  })
})
</script>

<template>
  <div class="typing-game" :class="`feedback-${feedbackState}`">
    <div v-if="!speechSupported" class="tts-warning">
      ⚠️ 你的浏览器不支持语音功能
    </div>

    <div class="hud">
      <div class="panda-area">
        <span class="panda-emoji">🐼</span>
        <div class="panda-bubble">
          <span class="bubble-label">打一打</span>
          <button class="replay-btn" @click="handleReplay" aria-label="再听一次">🔈</button>
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

    <div v-if="currentRoundData" class="typing-area">
      <div class="char-display" :class="`state-${feedbackState}`">
        <span class="char-text">{{ targetChar }}</span>
        <span class="char-hint">请打出这个字的拼音</span>
      </div>

      <div class="input-row">
        <input
          ref="inputRef"
          v-model="inputText"
          class="pinyin-input"
          :class="`state-${feedbackState}`"
          type="text"
          placeholder="输入拼音..."
          :disabled="feedbackActive"
          @keyup.enter="handleSubmit"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
        <button
          class="submit-btn"
          :disabled="feedbackActive || !inputText.trim()"
          @click="handleSubmit"
        >
          确定
        </button>
      </div>

      <div v-if="feedbackState === 'wrong'" class="hint-text">
        再试试看~
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
  gap: 24px;
  padding: 24px 16px;
  min-height: 100%;
}

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
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  max-width: 500px;
}

.panda-area { display: flex; align-items: center; gap: 10px; }
.panda-emoji { font-size: 2.5rem; flex-shrink: 0; }

.panda-bubble {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface, #fff);
  border-radius: 12px;
  padding: 8px 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary, #333);
}

.replay-btn { background: none; border: none; font-size: 1.3rem; cursor: pointer; padding: 2px; }

.round-info { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
.round-text { font-size: 0.85rem; color: var(--color-text-secondary, #888); }
.round-dots { display: flex; gap: 4px; }

.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-divider, #e8e8e8); transition: background 0.2s; }
.dot.done { background: var(--color-brand-orange, #FF8C42); }
.dot.active { background: var(--color-brand-orange, #FF8C42); transform: scale(1.4); }

/* Typing area */
.typing-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  width: 100%;
  max-width: 400px;
  padding: 20px 0;
}

.char-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px;
  background: linear-gradient(135deg, #FFF9E6, #FDF0C8, #F5E0A0);
  border-radius: 24px;
  border: 3px solid #F0C75E;
  box-shadow: 0 6px 20px rgba(240,199,94,0.12);
  width: 100%;
  transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
}

.char-display.state-correct {
  border-color: #7EC8A0;
  background: linear-gradient(135deg, #E8F8EE, #C8F0D8);
  box-shadow: 0 0 24px rgba(126,200,160,0.3);
  animation: char-pop 0.4s ease-out;
}

.char-display.state-wrong {
  border-color: #FF6B6B;
  background: linear-gradient(135deg, #FFF0F0, #FFE0E0);
  box-shadow: 0 0 16px rgba(255,107,107,0.2);
}

@keyframes char-pop {
  0% { transform: scale(1); }
  40% { transform: scale(1.06); }
  100% { transform: scale(1); }
}

.char-text {
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-text-primary, #2C3E50);
  line-height: 1;
}

.char-hint {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #888);
}

.input-row {
  display: flex;
  gap: 10px;
  width: 100%;
}

.pinyin-input {
  flex: 1;
  padding: 14px 18px;
  border-radius: 14px;
  border: 2px solid var(--color-divider, #e0e0e0);
  background: linear-gradient(to bottom, #FFFFFF, #F9FAFB);
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-text-primary, #2C3E50);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  letter-spacing: 2px;
}

.pinyin-input:focus {
  border-color: var(--color-brand-orange, #FF8C42);
  box-shadow: 0 2px 12px rgba(255,140,66,0.12);
}

.pinyin-input.state-correct {
  border-color: #7EC8A0;
}

.pinyin-input.state-wrong {
  border-color: #FF6B6B;
  animation: shake 0.4s ease-out;
}

.submit-btn {
  padding: 14px 24px;
  border-radius: 14px;
  border: none;
  background: var(--color-brand-orange, #FF8C42);
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s, opacity 0.15s;
  white-space: nowrap;
}

.submit-btn:hover:not(:disabled) { transform: scale(1.03); }
.submit-btn:disabled { opacity: 0.5; cursor: default; }

.hint-text {
  font-size: 0.95rem;
  color: var(--color-brand-orange, #FF8C42);
  font-weight: 600;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
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
  .char-text { font-size: 3rem; }
  .input-row { flex-direction: column; }
  .submit-btn { width: 100%; }
}
</style>
