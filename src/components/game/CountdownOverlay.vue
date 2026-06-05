<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{
  done: []
}>()

const current = ref<'3' | '2' | '1' | 'go' | 'done'>('3')

const sequence: Array<{ label: '3' | '2' | '1' | 'go'; duration: number }> = [
  { label: '3', duration: 400 },
  { label: '2', duration: 400 },
  { label: '1', duration: 400 },
  { label: 'go', duration: 500 },
]

let timeoutId: ReturnType<typeof setTimeout> | null = null

onMounted(() => {
  let i = 0
  function step() {
    if (i < sequence.length) {
      current.value = sequence[i]!.label
      timeoutId = setTimeout(() => {
        i++
        step()
      }, sequence[i]!.duration)
    } else {
      current.value = 'done'
      emit('done')
    }
  }
  step()
})

onBeforeUnmount(() => {
  if (timeoutId) clearTimeout(timeoutId)
})
</script>

<template>
  <Transition name="overlay">
    <div v-if="current !== 'done'" class="overlay" role="status" aria-live="assertive">
      <Transition name="number" mode="out-in">
        <span v-if="current !== 'go'" :key="current" class="number">
          {{ current }}
        </span>
        <span v-else key="go" class="go-text">开始!</span>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.number,
.go-text {
  font-family: var(--font-family-display, 'Nunito', 'PingFang SC', sans-serif);
  font-weight: 800;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.number {
  font-size: 6rem;
  line-height: 1;
}

.go-text {
  font-size: 3.5rem;
  line-height: 1;
  background: linear-gradient(135deg, #FFB380, #FF8C42);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* overlay transition */
.overlay-enter-active { transition: opacity 0.2s ease-out; }
.overlay-leave-active { transition: opacity 0.3s ease-out; }
.overlay-enter-from,
.overlay-leave-to { opacity: 0; }

/* number enter/leave */
.number-enter-active {
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.number-leave-active {
  transition: all 0.15s ease-in;
}
.number-enter-from {
  transform: scale(1.4);
  opacity: 0;
}
.number-leave-to {
  transform: scale(0.6);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .number-enter-active,
  .number-leave-active {
    transition: opacity 0.1s;
  }
  .number-enter-from,
  .number-leave-to {
    transform: none;
    opacity: 0;
  }
}
</style>
