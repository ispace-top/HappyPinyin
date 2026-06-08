<script setup lang="ts">
import { ref, computed } from 'vue'
import { initials } from '@/data/initials'
import { singleFinals, compoundFinals } from '@/data/finals'
import { wholeSyllables } from '@/data/wholeSyllables'
import { useSpeech } from '@/composables/useSpeech'
import { descriptionToSpeech } from '@/utils/pinyinFilter'
import { getAudioPath } from '@/services/pinyinAudio'
import type { PinyinElement, PinyinCategory } from '@/types/pinyin'
import PinyinCard from '@/components/common/PinyinCard.vue'

type Tab = PinyinCategory | 'singleFinals' | 'compoundFinals'

const tabs: { key: Tab; label: string; count: number }[] = [
  { key: 'initial', label: '声母', count: initials.length },
  { key: 'singleFinals', label: '单韵母', count: singleFinals.length },
  { key: 'compoundFinals', label: '复韵母', count: compoundFinals.length },
  { key: 'wholeSyllable', label: '整体认读音节', count: wholeSyllables.length },
]

const activeTab = ref<Tab>('initial')
const { speakSequence, playAudioThenSpeak } = useSpeech()

const currentItems = computed<PinyinElement[]>(() => {
  switch (activeTab.value) {
    case 'initial': return initials
    case 'singleFinals': return singleFinals
    case 'compoundFinals': return compoundFinals
    case 'wholeSyllable': return wholeSyllables
    default: return []
  }
})

function handleCardClick(element: PinyinElement) {
  const ttsTexts: string[] = []
  if (element.description) {
    let desc = element.description
    if (element.subCategory === 'compound') {
      const letter = element.text
      desc = `${desc} ${letter} ${letter}`
    }
    ttsTexts.push(descriptionToSpeech(desc))
  }

  const audioPath = getAudioPath(element.category, element.text)
  if (audioPath) {
    playAudioThenSpeak(audioPath, ttsTexts, { rate: 0.6 })
  } else {
    speakSequence([element.pronunciation, ...ttsTexts], { rate: 0.6 })
  }
}

// Load tab from URL query param
const urlParams = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
const tabParam = urlParams.get('tab') as Tab | null
if (tabParam && tabs.some(t => t.key === tabParam)) {
  activeTab.value = tabParam
}
</script>

<template>
  <div class="browser-page">
    <div class="browser-header">
      <div class="browser-title-row">
        <h1 class="page-title">读一读</h1>
        <p class="page-subtitle">点击卡片先听发音，再听助记口诀</p>
      </div>
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <span class="tab-label">{{ tab.label }}</span>
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <div class="cards-grid">
      <TransitionGroup name="card-list">
        <PinyinCard
          v-for="item in currentItems"
          :key="item.id"
          :element="item"
          variant="browse"
          @select="handleCardClick(item)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.browser-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-top: var(--space-4);
}

.browser-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.browser-title-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-3);
  flex-shrink: 0;
}

.page-title {
  font-size: var(--font-size-xl);
  font-weight: 800;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.page-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.tabs {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  padding-bottom: var(--space-1);
  flex-shrink: 0;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-shrink: 0;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
}

.tab-btn.active {
  background: var(--color-brand-orange);
  border-color: var(--color-brand-orange);
  color: #fff;
}

.tab-count {
  font-size: var(--font-size-xs);
  opacity: 0.7;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  gap: var(--space-2);
}

.card-list-enter-active {
  transition: all var(--transition-normal);
}

.card-list-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

@media (min-width: 480px) {
  .cards-grid { grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); }
}

@media (min-width: 768px) {
  .cards-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }
}

@media (min-width: 1024px) {
  .cards-grid { grid-template-columns: repeat(8, 1fr); }
}

@media (max-width: 767px) {
  .browser-title-row { display: none; }
}
</style>
