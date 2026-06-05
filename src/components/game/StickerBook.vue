<script setup lang="ts">
import { computed, ref } from 'vue'
import { STICKER_DEFS, ACHIEVEMENT_DEFS } from '@/types/game'
import { getCollectedStickers, getAchievements } from '@/utils/gameStorage'

const emit = defineEmits<{
  close: []
}>()

const collected = computed(() => getCollectedStickers())
const achievements = computed(() => getAchievements())
const collectedCount = computed(() => collected.value.length)

const currentPage = ref(0)

function nextPage() {
  if (currentPage.value < 1) currentPage.value++
}

function prevPage() {
  if (currentPage.value > 0) currentPage.value--
}

// Page 0: sticker collection (pages 1-3 on left, 4-6 on right)
// Page 1: achievements (back of the book)
</script>

<template>
  <div class="book-overlay" @click.self="emit('close')">
    <div class="book-scene">
      <button class="book-close" @click="emit('close')" aria-label="关闭贴纸书">✕</button>

      <div class="book" :class="{ 'page-flipped': currentPage === 1 }">
        <!-- Page 0: Sticker Collection -->
        <div class="book-page page-front">
          <div class="page-content">
            <h2 class="page-title">我的贴纸书</h2>
            <p class="page-subtitle">已收集 {{ collectedCount }} / 6 张贴纸</p>
            <div class="sticker-grid">
              <div
                v-for="def in STICKER_DEFS"
                :key="def.id"
                class="sticker-slot"
                :class="{ collected: collected.includes(def.id) }"
              >
                <span v-if="collected.includes(def.id)" class="sticker-peel">
                  <span class="sticker-gloss" />
                  <span class="sticker-emoji">{{ def.emoji }}</span>
                </span>
                <span v-else class="sticker-shadow">?</span>
                <span class="sticker-label">{{ def.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Page 1: Achievements -->
        <div class="book-page page-back">
          <div class="page-content">
            <h2 class="page-title">成就徽章</h2>
            <div class="achievement-grid">
              <div
                v-for="def in ACHIEVEMENT_DEFS"
                :key="def.id"
                class="achievement-card"
                :class="{ unlocked: achievements.includes(def.id) }"
              >
                <span class="achievement-medal">{{ achievements.includes(def.id) ? '🏅' : '🔒' }}</span>
                <div class="achievement-text">
                  <span class="achievement-name">{{ def.name }}</span>
                  <span class="achievement-desc">{{ def.description }}</span>
                </div>
                <span v-if="achievements.includes(def.id)" class="badge-glow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="page-nav">
        <button :disabled="currentPage === 0" @click="prevPage" aria-label="上一页">◀</button>
        <span class="page-indicator">{{ currentPage + 1 }} / 2</span>
        <button :disabled="currentPage === 1" @click="nextPage" aria-label="下一页">▶</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.book-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  backdrop-filter: blur(6px);
}

.book-close {
  position: absolute;
  top: -36px;
  right: 0;
  background: rgba(255,255,255,0.9);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  color: #666;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-scene {
  position: relative;
  perspective: 1200px;
  width: calc(100% - 32px);
  max-width: 500px;
}

/* === Book Structure === */
.book {
  position: relative;
  width: 100%;
  min-height: 420px;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.book.page-flipped {
  transform: rotateY(-180deg);
}

.book-page {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  border-radius: 8px 16px 16px 8px;
  background: #FFF9F0;
  box-shadow:
    0 4px 20px rgba(0,0,0,0.1),
    inset 0 0 0 3px #E8D5B7;
  overflow: hidden;
}

/* spine shadow */
.book-page::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  background: linear-gradient(90deg, rgba(0,0,0,0.06), transparent);
  border-radius: 8px 0 0 8px;
}

/* paper texture overlay */
.book-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 28px,
    rgba(180,160,130,0.03) 28px,
    rgba(180,160,130,0.03) 29px
  );
  pointer-events: none;
  border-radius: 8px 16px 16px 8px;
}

.page-content {
  position: relative;
  z-index: 1;
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-back {
  transform: rotateY(180deg);
}

.page-title {
  font-size: 1.3rem;
  font-weight: 800;
  color: #C8753A;
  margin-bottom: 4px;
  font-family: var(--font-family-display, 'Nunito', 'PingFang SC', sans-serif);
}

.page-subtitle {
  font-size: 0.85rem;
  color: #B8A080;
  margin-bottom: 20px;
}

/* === Sticker Grid === */
.sticker-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  width: 100%;
}

.sticker-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 6px 10px;
  background: #fff;
  border-radius: 12px;
  border: 2px dashed #E8D5B7;
  min-height: 100px;
  justify-content: center;
  position: relative;
}

.sticker-slot.collected {
  border-style: solid;
  border-color: #F0C75E;
  background: linear-gradient(135deg, #FFFDF5, #FFF9EC);
  box-shadow: 0 2px 8px rgba(240, 199, 94, 0.15);
}

.sticker-peel {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, rgba(255,255,255,0.6), #F0C75E 70%);
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.sticker-gloss {
  position: absolute;
  top: 4px;
  left: 8px;
  width: 16px;
  height: 10px;
  background: rgba(255,255,255,0.7);
  border-radius: 50%;
  transform: rotate(-20deg);
}

.sticker-emoji {
  font-size: 1.6rem;
  position: relative;
  z-index: 1;
}

.sticker-shadow {
  font-size: 2rem;
  color: #D4C8B0;
  opacity: 0.5;
}

.sticker-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: #8B7355;
  text-align: center;
}

/* === Achievement Page === */
.achievement-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

.achievement-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #fff;
  border-radius: 14px;
  opacity: 0.45;
  position: relative;
  overflow: hidden;
  border: 2px solid #E8D5B7;
}

.achievement-card.unlocked {
  opacity: 1;
  border-color: #F0C75E;
  background: linear-gradient(135deg, #FFFDF5, #FFF9EC);
}

.achievement-medal {
  font-size: 2rem;
  flex-shrink: 0;
}

.achievement-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.achievement-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #5C3D2E;
}

.achievement-desc {
  font-size: 0.75rem;
  color: #B8A080;
}

.badge-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 50%, rgba(240,199,94,0.12), transparent 70%);
  pointer-events: none;
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* === Navigation === */
.page-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.page-nav button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.15);
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.page-nav button:hover:not(:disabled) {
  background: rgba(255,255,255,0.3);
}

.page-nav button:disabled {
  opacity: 0.3;
  cursor: default;
}

.page-indicator {
  color: #fff;
  font-size: 0.9rem;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

@media (min-width: 768px) {
  .book {
    min-height: 460px;
  }

  .sticker-grid {
    gap: 18px;
  }

  .sticker-peel {
    width: 60px;
    height: 60px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .book {
    transition: none;
  }
}
</style>
