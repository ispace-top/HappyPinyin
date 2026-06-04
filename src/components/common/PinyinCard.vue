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

function categoryColor(category: string): string {
  switch (category) {
    case 'initial': return 'var(--color-initial-light)'
    case 'final': return 'var(--color-final-single-light)'
    case 'wholeSyllable': return 'var(--color-whole-light)'
    default: return 'var(--color-surface)'
  }
}
</script>

<template>
  <div
    class="pinyin-card"
    :class="{ selected, selectable: variant === 'select' }"
    :style="{ '--card-bg': categoryColor(element.category) }"
    @click="$emit('select')"
  >
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
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--card-bg, var(--color-surface));
  border-radius: var(--radius-lg);
  border: 3px solid transparent;
  box-shadow: var(--shadow-card);
  transition: all var(--transition-normal);
  min-height: 120px;
  cursor: pointer;
}

.pinyin-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.pinyin-card.selected {
  border-color: var(--color-brand-orange);
  background: var(--color-brand-orange-bg);
  transform: translateY(-2px);
  box-shadow: var(--shadow-elevated);
}

.pinyin-text {
  font-size: var(--font-size-pinyin);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.pinyin-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: center;
}

.speaker-hint {
  font-size: var(--font-size-lg);
  opacity: 0.4;
}
</style>
