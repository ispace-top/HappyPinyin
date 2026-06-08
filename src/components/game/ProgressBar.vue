<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  current: number  // 0-9, how many rounds completed
  total: number    // 10
  color: string    // per-level theme color
}>()

const slots = computed(() =>
  Array.from({ length: props.total }, (_, i) => i < props.current),
)
</script>

<template>
  <div class="progress-bar" role="progressbar" :aria-valuenow="current" :aria-valuemax="total">
    <div
      v-for="(filled, i) in slots"
      :key="i"
      class="slot"
      :class="{ filled, current: i === current && current < total }"
      :style="filled ? { backgroundColor: color } : undefined"
    />
  </div>
</template>

<style scoped>
.progress-bar {
  display: flex;
  gap: 6px;
  justify-content: center;
  align-items: center;
  padding: 4px 0;
}

.slot {
  width: 24px;
  height: 10px;
  border-radius: 5px;
  background: var(--color-divider, #e8e8e8);
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.slot.filled {
  transform: scaleY(1.1);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12), inset 0 1px 2px rgba(255,255,255,0.3);
}

.slot.current {
  transform: scaleY(1.4);
  outline: 2px solid var(--color-brand-orange, #FF8C42);
  outline-offset: 2px;
  box-shadow: 0 0 8px var(--color-brand-orange, #FF8C42);
}

@media (min-width: 768px) {
  .slot {
    width: 32px;
    height: 12px;
    border-radius: 6px;
  }
}
</style>
