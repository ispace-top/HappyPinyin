<script setup lang="ts">
import { computed, watch } from 'vue'
import { useBuilder } from '@/composables/useBuilder'
import { useSpeech } from '@/composables/useSpeech'
import { initials } from '@/data/initials'
import { medialDisplay, finalDisplay, pinyinToSpeech } from '@/utils/pinyinFilter'
import { formatResultSyllable } from '@/utils/toneMark'
import { getSyllableInfo } from '@/utils/syllableChars'
import type { SelectorItem } from '@/components/builder/SelectorGrid.vue'
import BuilderStepper from '@/components/builder/BuilderStepper.vue'
import SelectorGrid from '@/components/builder/SelectorGrid.vue'
import MedialChips from '@/components/builder/MedialChips.vue'
import TonePicker from '@/components/builder/TonePicker.vue'
import PinyinCard from '@/components/common/PinyinCard.vue'
import PandaMascot from '@/components/common/PandaMascot.vue'
import CelebrationEffect from '@/components/common/CelebrationEffect.vue'
import AudioButton from '@/components/common/AudioButton.vue'

const { state, availableMedials, availableFinals, availableTones, resultSyllable,
        showMedialChips, dispatch } = useBuilder()
const { speak, speakSequence } = useSpeech()

const showCelebration = computed(() => state.step === 'result' && resultSyllable.value !== null)

const finalItems = computed<SelectorItem[]>(() =>
  availableFinals.value.map(f => ({
    value: f,
    label: finalDisplay(f, state.selectedMedial),
  }))
)

const selectionPreview = computed(() => {
  const parts: string[] = []
  if (state.selectedInitial) parts.push(state.selectedInitial)
  if (state.selectedMedial) parts.push(medialDisplay(state.selectedMedial))
  if (state.selectedFinal) parts.push(finalDisplay(state.selectedFinal, state.selectedMedial))
  return parts.join(' + ')
})

const displayResult = computed(() => {
  if (!resultSyllable.value) return ''
  return formatResultSyllable(resultSyllable.value)
})

const resultCharInfo = computed(() => {
  if (!resultSyllable.value) return null
  return getSyllableInfo(resultSyllable.value)
})

function handleInitialSelect(item: typeof initialItems.value[number]) {
  dispatch({ type: 'SELECT_INITIAL', initial: item.value })
  const initEl = initials.find(i => i.text === item.value)
  if (initEl) speak(initEl.pronunciation, { rate: 0.5 })
}

function handleMedialSelect(medial: string | null) {
  dispatch({ type: 'SELECT_MEDIAL', medial })
  if (medial) speak(pinyinToSpeech(medialDisplay(medial)), { rate: 0.5 })
}

function handleFinalSelect(item: SelectorItem) {
  dispatch({ type: 'SELECT_FINAL', final: item.value })
  speak(pinyinToSpeech(finalDisplay(item.value, state.selectedMedial)), { rate: 0.5 })
}

function handleToneSelect(tone: number) {
  dispatch({ type: 'SELECT_TONE', tone })
  const toneNames: Record<number, string> = { 1: '一声', 2: '二声', 3: '三声', 4: '四声' }
  speak(toneNames[tone] ?? '', { rate: 0.5 })
}

watch(() => state.step, (newStep) => {
  if (newStep !== 'result' || !resultSyllable.value) return
  const sequence: string[] = []

  const initEl = initials.find(i => i.text === state.selectedInitial)
  if (initEl) sequence.push(initEl.pronunciation)

  if (state.selectedMedial) sequence.push(pinyinToSpeech(medialDisplay(state.selectedMedial)))

  if (state.selectedFinal) sequence.push(pinyinToSpeech(finalDisplay(state.selectedFinal, state.selectedMedial)))

  const toneNames: Record<number, string> = { 1: '一声', 2: '二声', 3: '三声', 4: '四声' }
  if (state.selectedTone !== null) sequence.push(toneNames[state.selectedTone] ?? '')

  const charInfo = getSyllableInfo(resultSyllable.value)
  if (charInfo) {
    sequence.push(charInfo[0])
    sequence.push(charInfo[1])
    sequence.push(charInfo[2])
  }

  speakSequence(sequence, { rate: 0.5 })
})

function handleBack() {
  dispatch({ type: 'GO_BACK' })
}

function handleReset() {
  dispatch({ type: 'RESET' })
}

function speakResult() {
  if (!resultSyllable.value) return
  const charInfo = getSyllableInfo(resultSyllable.value)
  const text = charInfo ? charInfo[0] : displayResult.value
  speak(text, { rate: 0.5 })
}

const initialItems = computed(() =>
  initials.map(init => ({
    value: init.text,
    element: init,
  }))
)
</script>

<template>
  <div class="builder-page">
    <BuilderStepper :current-step="state.step" />

    <!-- Step: Initial -->
    <div v-if="state.step === 'initial'" class="step-content">
      <p class="step-prompt">选择一个声母开始吧！</p>
      <div class="initials-grid">
        <PinyinCard
          v-for="item in initialItems"
          :key="item.value"
          :element="item.element"
          variant="select"
          :selected="state.selectedInitial === item.value"
          @select="handleInitialSelect(item)"
        />
      </div>
    </div>

    <!-- Step: Final (medial chips integrated) -->
    <div v-else-if="state.step === 'final'" class="step-content">
      <div class="step-toolbar">
        <button class="back-btn" @click="handleBack">← 返回</button>
        <p class="step-prompt">
          选了声母 <strong>{{ state.selectedInitial }}</strong>，选一个韵母吧！
        </p>
      </div>

      <MedialChips
        v-if="showMedialChips"
        :medials="availableMedials"
        :selected-medial="state.selectedMedial"
        @select="handleMedialSelect"
      />

      <SelectorGrid
        :items="finalItems"
        :selected-value="state.selectedFinal"
        @select="handleFinalSelect"
      />
    </div>

    <!-- Step: Tone -->
    <div v-else-if="state.step === 'tone'" class="step-content">
      <div class="step-toolbar">
        <button class="back-btn" @click="handleBack">← 返回</button>
        <p class="step-prompt">选声调：</p>
      </div>
      <TonePicker :selected-tone="state.selectedTone" :available-tones="availableTones" @select="handleToneSelect" />
    </div>

    <!-- Step: Result -->
    <div v-else-if="state.step === 'result'" class="step-content result-step">
      <CelebrationEffect v-if="showCelebration" />
      <div class="result-layout">
        <div class="result-display">
          <p class="result-process">{{ selectionPreview }}</p>
          <div class="result-syllable-wrapper">
            <Transition name="pop">
              <p v-if="displayResult" class="result-syllable">{{ displayResult }}</p>
            </Transition>
          </div>

          <Transition name="pop">
            <div v-if="resultCharInfo" class="result-char-info">
              <p class="result-char">{{ resultCharInfo[0] }}</p>
              <p class="result-words">{{ resultCharInfo[1] }} · {{ resultCharInfo[2] }}</p>
            </div>
          </Transition>

          <div class="result-actions">
            <AudioButton :text="resultCharInfo?.[0] ?? displayResult" @click="speakResult" />
          </div>
        </div>

        <div class="result-sidebar">
          <PandaMascot mood="happy" />
          <button class="reset-btn" @click="handleReset">再拼一个</button>
        </div>
      </div>
    </div>

    <!-- Current selection preview (hidden on initial/result) -->
    <div v-if="state.step === 'final' || state.step === 'tone'" class="selection-preview">
      <span class="preview-label">当前选择：</span>
      <span class="preview-value">{{ selectionPreview || '未选择完整' }}</span>
    </div>
  </div>
</template>

<style scoped>
.builder-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-4);
}

.step-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.step-toolbar {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  width: 100%;
}

.step-prompt {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  text-align: center;
}

.step-prompt strong {
  color: var(--color-brand-orange);
  font-weight: 700;
}

.back-btn {
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-family: inherit;
  align-self: flex-start;
}

.back-btn:hover {
  background: var(--color-divider);
  color: var(--color-text-primary);
}

.initials-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-3);
  width: 100%;
}

.selection-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-surface);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-card);
  font-size: var(--font-size-base);
}

.preview-label { color: var(--color-text-secondary); }

.preview-value {
  font-weight: 700;
  color: var(--color-brand-orange);
  font-size: var(--font-size-lg);
}

.result-step { gap: var(--space-4); }

.result-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  width: 100%;
}

.result-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.result-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.result-process {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}

.result-syllable-wrapper {
  min-height: 80px;
  display: flex;
  align-items: center;
}

.result-syllable {
  font-size: var(--font-size-pinyin-large);
  font-weight: 800;
  color: var(--color-brand-orange);
  line-height: 1;
}

.result-char-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-6);
  background: var(--color-brand-orange-bg);
  border-radius: var(--radius-lg);
}

.result-char {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-text-primary);
}

.result-words {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.result-actions {
  display: flex;
  gap: var(--space-4);
}

.reset-btn {
  padding: var(--space-3) var(--space-8);
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: #fff;
  background: var(--color-brand-orange);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
  font-family: inherit;
  box-shadow: var(--shadow-card);
}

.reset-btn:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-elevated);
}

.pop-enter-active { transition: all 0.5s var(--ease-bounce); }
.pop-leave-active { transition: all 0.2s ease-in; }
.pop-enter-from { transform: scale(0); opacity: 0; }
.pop-leave-to { transform: scale(0.5); opacity: 0; }

/* PC Layout Optimization */
@media (min-width: 480px) {
  .initials-grid { grid-template-columns: repeat(3, 1fr); }
}

@media (min-width: 768px) {
  .initials-grid { grid-template-columns: repeat(4, 1fr); }
  .result-syllable { font-size: 6rem; }
  .result-char { font-size: 4rem; }
}

@media (min-width: 1024px) {
  .builder-page {
    padding-top: var(--space-2);
    gap: var(--space-2);
  }

  .step-toolbar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-3);
  }

  .step-toolbar .back-btn {
    align-self: auto;
    order: -1;
  }

  .step-toolbar .step-prompt {
    flex: 1;
    text-align: left;
    font-size: var(--font-size-md);
  }

  .initials-grid {
    grid-template-columns: repeat(8, 1fr);
  }

  .result-layout {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: var(--space-8);
    max-width: 800px;
  }

  .result-display {
    flex: 1.5;
  }

  .result-sidebar {
    flex: 1;
  }

  .selection-preview {
    padding: var(--space-2) var(--space-4);
  }
}
</style>
