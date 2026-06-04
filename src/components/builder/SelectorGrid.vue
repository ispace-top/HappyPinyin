<script setup lang="ts">
export interface SelectorItem {
  value: string
  label: string
  desc?: string
}

defineProps<{
  items: SelectorItem[]
  selectedValue?: string | null
}>()

defineEmits<{
  select: [item: SelectorItem]
}>()
</script>

<template>
  <div class="selector-grid">
    <button
      v-for="item in items"
      :key="item.value"
      class="selector-item"
      :class="{ selected: item.value === selectedValue }"
      @click.stop="$emit('select', item)"
    >
      <span class="item-text">{{ item.label }}</span>
      <span v-if="item.desc" class="item-desc">{{ item.desc }}</span>
    </button>
  </div>
</template>

<style scoped>
.selector-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: var(--space-3);
  width: 100%;
}

.selector-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-3);
  min-height: var(--touch-target-min);
  background: var(--color-surface);
  border: 3px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  font-family: inherit;
}

.selector-item:hover {
  border-color: var(--color-brand-orange-light);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card-hover);
}

.selector-item.selected {
  border-color: var(--color-brand-orange);
  background: var(--color-brand-orange-bg);
  box-shadow: var(--shadow-elevated);
}

.item-text {
  font-size: var(--font-size-pinyin);
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1.2;
}

.item-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

@media (min-width: 768px) {
  .selector-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: var(--space-4);
  }
}
</style>
