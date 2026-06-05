<script setup lang="ts">
import type { BuilderStep } from '@/types/pinyin'

defineProps<{
  currentStep: BuilderStep
}>()

const steps: { key: BuilderStep; label: string; icon: string }[] = [
  { key: 'initial', label: '选声母', icon: '1' },
  { key: 'final',   label: '选韵母', icon: '2' },
  { key: 'tone',    label: '选声调', icon: '3' },
]

const stepOrder: BuilderStep[] = ['initial', 'final', 'tone', 'result']
</script>

<template>
  <div class="stepper">
    <template v-for="(s, i) in steps" :key="s.key">
      <div
        class="step"
        :class="{
          completed: stepOrder.indexOf(currentStep) > i,
          active: s.key === currentStep,
          upcoming: stepOrder.indexOf(currentStep) < i,
        }"
      >
        <div class="step-circle">
          <span v-if="stepOrder.indexOf(currentStep) > i" class="check">✓</span>
          <span v-else>{{ s.icon }}</span>
        </div>
        <span class="step-label">{{ s.label }}</span>
      </div>
      <div v-if="i < steps.length - 1" class="step-line" :class="{ done: stepOrder.indexOf(currentStep) > i }" />
    </template>
  </div>
</template>

<style scoped>
.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  padding: var(--space-1) 0;
}

.step {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-shrink: 0;
}

.step-circle {
  width: 22px;
  height: 22px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 700;
  transition: all var(--transition-normal);
  border: 2px solid var(--color-border);
  color: var(--color-text-secondary);
  background: var(--color-surface);
}

.step.active .step-circle {
  border-color: var(--color-brand-orange);
  background: var(--color-brand-orange-bg);
  color: var(--color-brand-orange);
  animation: pulse 1.5s ease-in-out infinite;
}

.step.completed .step-circle {
  border-color: var(--color-success);
  background: var(--color-success);
  color: #fff;
}

.step.upcoming .step-circle { opacity: 0.5; }

.check { font-size: 0.625rem; }

.step-label {
  font-size: 0.625rem;
  color: var(--color-text-secondary);
  font-weight: 500;
  white-space: nowrap;
}

.step.active .step-label {
  color: var(--color-brand-orange);
  font-weight: 600;
}

.step-line {
  width: 20px;
  height: 2px;
  background: var(--color-border);
  margin: 0 var(--space-1);
  transition: background var(--transition-normal);
}

.step-line.done { background: var(--color-success); }

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 var(--color-brand-orange-bg); }
  50% { box-shadow: 0 0 0 4px transparent; }
}

@media (min-width: 1024px) {
  .step-circle { width: 20px; height: 20px; }
  .step-line { width: 16px; }
}
</style>
