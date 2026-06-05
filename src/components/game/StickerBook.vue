<script setup lang="ts">
import { computed } from 'vue'
import { STICKER_DEFS, ACHIEVEMENT_DEFS } from '@/types/game'
import { getCollectedStickers, getAchievements } from '@/utils/gameStorage'

const emit = defineEmits<{
  close: []
}>()

const collected = computed(() => getCollectedStickers())
const achievements = computed(() => getAchievements())

const collectedCount = computed(() => collected.value.length)
</script>

<template>
  <div class="sticker-book-overlay" @click.self="emit('close')">
    <div class="sticker-book">
      <button class="close-btn" @click="emit('close')" aria-label="关闭贴纸书">✕</button>
      <h2 class="book-title">我的贴纸书</h2>
      <p class="book-subtitle">已收集 {{ collectedCount }} / 6 张贴纸</p>

      <div class="sticker-grid">
        <div
          v-for="def in STICKER_DEFS"
          :key="def.id"
          class="sticker-slot"
          :class="{ collected: collected.includes(def.id) }"
        >
          <span v-if="collected.includes(def.id)" class="slot-emoji">{{ def.emoji }}</span>
          <span v-else class="slot-empty">?</span>
          <span class="slot-name">{{ def.name }}</span>
        </div>
      </div>

      <div class="achievement-section">
        <h3 class="section-title">成就徽章</h3>
        <div class="achievement-list">
          <div
            v-for="def in ACHIEVEMENT_DEFS"
            :key="def.id"
            class="achievement-item"
            :class="{ unlocked: achievements.includes(def.id) }"
          >
            <span class="achievement-icon">{{ achievements.includes(def.id) ? '🏅' : '🔒' }}</span>
            <div class="achievement-info">
              <span class="achievement-name">{{ def.name }}</span>
              <span class="achievement-desc">{{ def.description }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sticker-book-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

.sticker-book {
  background: #FFF9F0;
  border-radius: 20px;
  padding: 32px 24px;
  width: calc(100% - 40px);
  max-width: 440px;
  max-height: 85vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
  border: 3px solid #E8D5B7;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 14px;
  background: none;
  border: none;
  font-size: 1.3rem;
  cursor: pointer;
  color: #999;
  padding: 4px 8px;
  border-radius: 8px;
}

.close-btn:hover { background: rgba(0,0,0,0.05); }

.book-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--color-brand-orange, #FF8C42);
  text-align: center;
  margin-bottom: 4px;
}

.book-subtitle {
  font-size: 0.9rem;
  color: var(--color-text-secondary, #888);
  text-align: center;
  margin-bottom: 20px;
}

.sticker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.sticker-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 16px 8px;
  background: #fff;
  border-radius: 14px;
  border: 2px dashed #E0D5C0;
  min-height: 90px;
  justify-content: center;
}

.sticker-slot.collected {
  border-style: solid;
  border-color: #F0C75E;
  background: #FFFDF5;
}

.slot-emoji { font-size: 2rem; }
.slot-empty { font-size: 1.8rem; color: #D4C8B0; }
.slot-name { font-size: 0.75rem; font-weight: 600; color: var(--color-text-primary, #333); text-align: center; }

.achievement-section {
  border-top: 2px dashed #E8D5B7;
  padding-top: 16px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text-primary, #333);
  margin-bottom: 12px;
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: #fff;
  border-radius: 12px;
  opacity: 0.55;
}

.achievement-item.unlocked {
  opacity: 1;
  box-shadow: 0 2px 6px rgba(240, 199, 94, 0.2);
}

.achievement-icon { font-size: 1.5rem; }

.achievement-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.achievement-name { font-size: 0.9rem; font-weight: 600; color: var(--color-text-primary, #333); }
.achievement-desc { font-size: 0.75rem; color: var(--color-text-secondary, #888); }
</style>
