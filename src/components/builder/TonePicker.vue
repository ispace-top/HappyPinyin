<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  selectedTone?: number | null
  availableTones?: number[]
}>()

defineEmits<{
  select: [tone: number]
}>()

interface ToneItem { value: number; symbol: string; label: string; color: string; gradient: string }

const allTones: ToneItem[] = [
  { value: 1, symbol: 'ˉ', label: '一声', color: '#EF4444', gradient: 'linear-gradient(135deg, #FEF2F2 0%, #FECACA 100%)' },
  { value: 2, symbol: 'ˊ', label: '二声', color: '#F59E0B', gradient: 'linear-gradient(135deg, #FFFBEB 0%, #FDE68A 100%)' },
  { value: 3, symbol: 'ˇ', label: '三声', color: '#22C55E', gradient: 'linear-gradient(135deg, #F0FDF4 0%, #BBF7D0 100%)' },
  { value: 4, symbol: 'ˋ', label: '四声', color: '#3B82F6', gradient: 'linear-gradient(135deg, #EFF6FF 0%, #BFDBFE 100%)' },
]

const tones = computed(() => {
  if (!props.availableTones || props.availableTones.length === 0) return allTones
  return allTones.filter(t => props.availableTones!.includes(t.value))
})
</script>

<template>
  <div class="tone-picker">
    <button
      v-for="tone in tones"
      :key="tone.value"
      class="tone-card"
      :class="{ selected: selectedTone === tone.value }"
      :style="{
        '--tone-gradient': tone.gradient,
        '--tone-color': tone.color,
      }"
      @click="$emit('select', tone.value)"
    >
      <span class="tone-symbol">{{ tone.symbol }}</span>
      <span class="tone-label">{{ tone.label }}</span>
    </button>
  </div>
</template>

<style scoped>
.tone-picker {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
  width: 100%;
}

@media (min-width: 480px) {
  .tone-picker {
    grid-template-columns: repeat(4, 1fr);
  }
}

.tone-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  min-height: 100px;
  padding: var(--space-2) var(--space-2);
  background: var(--tone-gradient);
  border: 3px solid transparent;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: inherit;
  position: relative;
  overflow: hidden;
}

.tone-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle at 50% 0%, rgba(255,255,255,0.5) 0%, transparent 60%);
  pointer-events: none;
}

.tone-card:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: var(--shadow-elevated);
}

.tone-card.selected {
  border-color: var(--tone-color);
  background: var(--tone-color);
  transform: translateY(-3px);
  box-shadow: var(--shadow-elevated);
}

.tone-card.selected .tone-symbol,
.tone-card.selected .tone-label {
  color: #fff;
}

.tone-symbol {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--tone-color);
}

.tone-label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--tone-color);
}

@media (min-width: 480px) {
  .tone-picker {
    grid-template-columns: repeat(4, 1fr);
    max-width: 500px;
  }
}

@media (min-width: 768px) {
  .tone-card {
    min-height: 110px;
  }
  .tone-symbol {
    font-size: 3rem;
  }
  .tone-label {
    font-size: var(--font-size-base);
  }
}
</style>
