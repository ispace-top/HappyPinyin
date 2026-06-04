<script setup lang="ts">
import type { ToneOption } from '@/types/pinyin'

defineProps<{
  selectedTone?: number | null
}>()

defineEmits<{
  select: [tone: number]
}>()

const tones: ToneOption[] = [
  { value: 1, label: '一声', symbol: 'ˉ' },
  { value: 2, label: '二声', symbol: 'ˊ' },
  { value: 3, label: '三声', symbol: 'ˇ' },
  { value: 4, label: '四声', symbol: 'ˋ' },
  { value: 0, label: '轻声', symbol: '·' },
]

const toneColors: Record<number, string> = {
  1: 'var(--color-tone-1)',
  2: 'var(--color-tone-2)',
  3: 'var(--color-tone-3)',
  4: 'var(--color-tone-4)',
  0: 'var(--color-tone-neutral)',
}
</script>

<template>
  <div class="tone-picker">
    <button
      v-for="tone in tones"
      :key="tone.value"
      class="tone-btn"
      :class="{ selected: selectedTone === tone.value }"
      :style="{ '--tone-color': toneColors[tone.value] }"
      @click="$emit('select', tone.value)"
    >
      <span class="tone-symbol">{{ tone.symbol }}</span>
      <span class="tone-label">{{ tone.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.tone-picker {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
}

.tone-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  width: 80px;
  height: 80px;
  border: 3px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: inherit;
}

.tone-btn:hover {
  border-color: var(--tone-color);
  transform: translateY(-2px);
}

.tone-btn.selected {
  border-color: var(--tone-color);
  background: var(--tone-color);
  color: #fff;
}

.tone-symbol {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  line-height: 1;
}

.tone-label {
  font-size: var(--font-size-xs);
  font-weight: 500;
}

@media (min-width: 768px) {
  .tone-btn {
    width: 100px;
    height: 100px;
  }

  .tone-symbol {
    font-size: var(--font-size-3xl);
  }
}
</style>
