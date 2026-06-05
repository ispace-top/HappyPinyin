<script setup lang="ts">
import { computed } from 'vue'
import { medialDisplay } from '@/utils/pinyinFilter'

const props = defineProps<{
  medials: Array<string | null>
  selectedMedial: string | null
}>()

defineEmits<{
  select: [medial: string | null]
}>()

function chipLabel(medial: string | null): string {
  if (medial === null) return '⭐ 直接拼'
  return medialDisplay(medial)
}

// If null is not available (e.g., j/q/x), show all as regular chips
const hasNull = computed(() => props.medials.includes(null))
</script>

<template>
  <div class="medial-chips" role="tablist" aria-label="介母选择">
    <button
      v-for="medial in medials"
      :key="medial ?? '__none__'"
      class="medial-chip"
      :class="{
        selected: selectedMedial === medial,
        'chip-direct': medial === null && hasNull,
      }"
      :aria-pressed="selectedMedial === medial"
      @click="$emit('select', medial)"
    >
      {{ chipLabel(medial) }}
    </button>
  </div>
</template>

<style scoped>
.medial-chips {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
  padding: var(--space-2) 0;
}

.medial-chip {
  min-width: 80px;
  min-height: var(--touch-target-min);
  padding: var(--space-2) var(--space-4);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 200ms var(--ease-bounce);
  font-family: inherit;
}

.medial-chip:hover {
  border-color: var(--color-brand-orange-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-card-hover);
}

.medial-chip.selected {
  background: var(--color-brand-orange);
  border-color: var(--color-brand-orange);
  color: #fff;
  box-shadow: var(--shadow-elevated);
  transform: translateY(-1px);
}

.medial-chip:focus-visible {
  outline: 2px solid var(--color-brand-orange);
  outline-offset: 2px;
}

.chip-direct {
  border-style: dashed;
}

@media (min-width: 768px) {
  .medial-chip {
    min-width: 100px;
    font-size: var(--font-size-md);
    padding: var(--space-2) var(--space-5);
  }
}
</style>
