<script setup lang="ts">
const props = withDefaults(defineProps<{
  modelValue: string
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const ROW_1 = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']
const ROW_2 = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l']
const ROW_3 = ['z', 'x', 'c', 'v', 'b', 'n', 'm']

function append(letter: string) {
  if (props.disabled) return
  emit('update:modelValue', props.modelValue + letter)
}

function handleBackspace() {
  if (props.disabled) return
  if (props.modelValue.length > 0) {
    emit('update:modelValue', props.modelValue.slice(0, -1))
  }
}
</script>

<template>
  <div class="pinyin-keyboard" :class="{ disabled: props.disabled }">
    <div class="kb-row">
      <button
        v-for="letter in ROW_1" :key="letter"
        class="kb-key"
        :disabled="props.disabled"
        @click="append(letter)"
      >{{ letter }}</button>
    </div>
    <div class="kb-row">
      <button
        v-for="letter in ROW_2" :key="letter"
        class="kb-key"
        :disabled="props.disabled"
        @click="append(letter)"
      >{{ letter }}</button>
    </div>
    <div class="kb-row">
      <button
        v-for="letter in ROW_3" :key="letter"
        class="kb-key"
        :disabled="props.disabled"
        @click="append(letter)"
      >{{ letter }}</button>
      <button
        class="kb-key kb-backspace"
        :disabled="props.disabled || modelValue.length === 0"
        @click="handleBackspace"
      >⌫</button>
    </div>
  </div>
</template>

<style scoped>
.pinyin-keyboard {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 8px 6px;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
  background: linear-gradient(180deg, #F0F4FF 0%, #E8EEFA 100%);
  border-top: 2px solid rgba(108, 155, 210, 0.15);
  width: 100%;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  flex-shrink: 0;
}

.pinyin-keyboard.disabled {
  opacity: 0.7;
  pointer-events: none;
}

.kb-row {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.kb-key {
  min-width: 32px;
  height: 36px;
  padding: 2px 3px;
  border-radius: 7px;
  border: 2px solid rgba(108, 155, 210, 0.15);
  background: linear-gradient(145deg, #FFFFFF, #F5F7FA);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  font-size: 0.85rem;
  font-weight: 700;
  color: #2C3E50;
  cursor: pointer;
  transition: all 0.1s ease;
  text-align: center;
  font-family: inherit;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.kb-key:hover:not(:disabled) {
  border-color: #6C9BD2;
  transform: translateY(-1px);
}

.kb-key:active:not(:disabled) {
  transform: scale(0.9);
  background: #E8F0FA;
}

.kb-key:disabled {
  opacity: 0.4;
  cursor: default;
}

.kb-backspace {
  min-width: 36px;
  font-size: 1rem;
}

@media (min-width: 380px) {
  .kb-key {
    min-width: 34px;
    height: 38px;
    font-size: 0.9rem;
  }
}

@media (min-width: 420px) {
  .kb-key {
    min-width: 38px;
    height: 42px;
    font-size: 1rem;
  }
}

@media (min-width: 768px) {
  .pinyin-keyboard {
    gap: 7px;
    padding: 12px 10px;
    padding-bottom: max(12px, env(safe-area-inset-bottom));
  }
  .kb-row { gap: 6px; }
  .kb-key {
    min-width: 46px;
    height: 48px;
    font-size: 1.1rem;
    border-radius: 10px;
  }
  .kb-backspace { min-width: 48px; font-size: 1.2rem; }
}
</style>
