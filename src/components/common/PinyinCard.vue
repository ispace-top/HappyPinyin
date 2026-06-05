<script setup lang="ts">
import type { PinyinElement } from '@/types/pinyin'
import AudioButton from './AudioButton.vue'

defineProps<{
  element: PinyinElement
  selected?: boolean
  variant?: 'browse' | 'select'
}>()

defineEmits<{
  select: []
}>()

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
  <div
    class="pinyin-card"
    :class="{ selected, selectable: variant === 'select' }"
    :style="{
      '--card-gradient': cardGradient(element.category, element.subCategory),
      '--card-desc-color': descriptionColor(element.category, element.subCategory),
    }"
    @click="$emit('select')"
  >
    <span v-if="element.emoji" class="card-emoji" aria-hidden="true">{{ element.emoji }}</span>
    <p class="pinyin-text">{{ element.text }}</p>
    <p v-if="element.description" class="pinyin-desc">{{ element.description }}</p>
    <AudioButton v-if="variant === 'select'" :text="element.pronunciation" />
    <span v-else class="speaker-hint">🔈</span>
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
  min-height: 140px;
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
  font-size: var(--font-size-lg);
  opacity: 0.3;
  margin-top: var(--space-1);
}

@media (min-width: 768px) {
  .pinyin-card {
    min-height: 150px;
    padding: var(--space-4);
    gap: var(--space-2);
  }

  .card-emoji {
    font-size: 3rem;
  }

  .pinyin-desc {
    font-size: var(--font-size-base);
  }

  .pinyin-text {
    font-size: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .pinyin-text {
    font-size: 2.25rem;
  }
}
</style>
