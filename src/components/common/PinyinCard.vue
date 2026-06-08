<script setup lang="ts">
import { computed } from 'vue'
import type { PinyinElement } from '@/types/pinyin'
import AudioButton from './AudioButton.vue'

const props = defineProps<{
  element: PinyinElement & { displayText?: string }
  selected?: boolean
  variant?: 'browse' | 'select' | 'result'
  resultData?: {
    processText: string
    syllable: string
    character: string
    words: string
    phrase: string
  }
}>()

defineEmits<{
  select: []
}>()

// 优先使用 displayText 属性（用于显示），否则使用 text（用于音频路径查找）
const displayText = computed(() => props.element.displayText ?? props.element.text)

function pinyinFontSize(text: string): string {
  const len = text.length
  if (len <= 2) return '1.75rem'
  if (len <= 3) return '1.35rem'
  if (len <= 4) return '1.1rem'
  return '0.9rem'
}

function cardGradient(category: string, subCategory?: string): string {
  switch (category) {
    case 'initial': return 'linear-gradient(135deg, #E8F0FA 0%, #D0E3F5 100%)'
    case 'final':
      return subCategory === 'compound'
        ? 'linear-gradient(135deg, #E8F6EF 0%, #D0ECD8 100%)'
        : 'linear-gradient(135deg, #FAE8ED 0%, #F0D0D8 100%)'
    case 'wholeSyllable': return 'linear-gradient(135deg, #FDF6E3 0%, #F5E8C8 100%)'
    default: return 'linear-gradient(135deg, #FFFFFF 0%, #F5F5F5 100%)'
  }
}

function descriptionColor(category: string, subCategory?: string): string {
  switch (category) {
    case 'initial': return '#4A7AB5'
    case 'final':
      return subCategory === 'compound' ? '#5A9E75' : '#C75B7A'
    case 'wholeSyllable': return '#B8942E'
    default: return '#7F8C8D'
  }
}
</script>

<template>
  <!-- Result variant -->
  <div
    v-if="variant === 'result' && resultData"
    class="pinyin-card result-card"
    :style="{ '--card-gradient': cardGradient('final', 'compound') }"
  >
    <p class="result-process">{{ resultData.processText }}</p>
    <p class="result-syllable-main">{{ resultData.syllable }}</p>
    <p class="result-char-display">{{ resultData.character }}</p>
    <p class="result-words-display">{{ resultData.words }} · {{ resultData.phrase }}</p>
    <slot name="result-actions" />
  </div>

  <!-- Browse/Select variants -->
  <div
    v-else
    class="pinyin-card"
    :class="{ selected, selectable: variant === 'select' }"
    :style="{
      '--card-gradient': cardGradient(element.category, element.subCategory),
      '--card-desc-color': descriptionColor(element.category, element.subCategory),
    }"
    @click="$emit('select')"
  >
    <span v-if="element.emoji" class="card-emoji" aria-hidden="true">{{ element.emoji }}</span>
    <p class="pinyin-text" :style="{ fontSize: pinyinFontSize(displayText) }">{{ displayText }}</p>
    <p v-if="element.description" class="pinyin-desc">{{ element.description }}</p>
    <AudioButton v-if="variant === 'select'" :text="element.pronunciation" />
    <AudioButton v-else :text="element.pronunciation" subtle />
  </div>
</template>

<style scoped>
.pinyin-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-3);
  background: var(--card-gradient);
  border-radius: var(--radius-xl);
  border: 3px solid transparent;
  box-shadow: var(--shadow-card);
  transition: all var(--transition-normal);
  min-height: 130px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.pinyin-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.5) 0%, transparent 60%);
  pointer-events: none;
}

.pinyin-card:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: var(--shadow-elevated);
}

.pinyin-card.selected {
  border-color: var(--color-brand-orange);
  background: var(--color-brand-orange-bg);
  transform: translateY(-3px);
  box-shadow: var(--shadow-elevated);
}

.pinyin-card.selected::before {
  background: radial-gradient(circle at 50% 0%, rgba(255,140,66,0.15) 0%, transparent 60%);
}

.card-emoji {
  font-size: 2.5rem;
  line-height: 1;
  user-select: none;
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.06));
}

.pinyin-text {
  font-size: var(--font-size-pinyin);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.pinyin-desc {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--card-desc-color);
  text-align: center;
  line-height: 1.3;
}

.speaker-hint {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: rgba(255,255,255,0.6);
  font-size: var(--font-size-base);
  opacity: 0.5;
  margin-top: var(--space-1);
}

@media (min-width: 768px) {
  .pinyin-card {
    min-height: 140px;
  }
}

/* === Result Card Styles === */
.result-card {
  min-height: auto;
  padding: var(--space-6) var(--space-5);
  border: 3px solid var(--color-brand-orange-light);
  box-shadow: var(--shadow-elevated);
  cursor: default;
  gap: var(--space-3);
  animation: resultAppear 0.5s var(--ease-bounce);
  max-width: 400px;
  width: 100%;
}

.result-card:hover {
  transform: none;
}

.result-process {
  font-size: var(--font-size-base);
  font-weight: 400;
  color: var(--color-text-secondary);
  letter-spacing: 0.06em;
}

.result-syllable-main {
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-brand-orange);
  line-height: 1;
}

.result-char-display {
  font-size: 4rem;
  font-weight: 800;
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-md);
  padding: var(--space-2) var(--space-6);
  min-width: 80px;
  text-align: center;
}

.result-words-display {
  font-size: var(--font-size-md);
  font-weight: 500;
  color: #5A9E75;
  text-align: center;
}

@keyframes resultAppear {
  0%   { transform: scale(0.8); opacity: 0; }
  60%  { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

@media (min-width: 768px) {
  .result-syllable-main { font-size: 6rem; }
  .result-char-display { font-size: 5rem; }
  .result-words-display { font-size: var(--font-size-lg); }
}
</style>
