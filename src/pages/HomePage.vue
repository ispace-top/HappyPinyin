<script setup lang="ts">
import PandaMascot from '@/components/common/PandaMascot.vue'
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <div class="hero-left">
        <PandaMascot mood="thinking" size="medium" showBubble bubbleText="你好呀！" />
      </div>
      <div class="hero-right">
        <h1 class="hero-title">快乐拼音</h1>
        <p class="hero-subtitle">声母 · 韵母 · 整体认读音节</p>
        <p class="hero-dedication">💕 为瑶瑶定制的六一礼物</p>
      </div>
    </section>

    <section class="feature-cards">
      <RouterLink to="/browser" class="feature-card card-read">
        <span class="feature-icon">📖</span>
        <div class="feature-text">
          <h2 class="feature-title">读一读</h2>
          <p class="feature-desc">认识声母和韵母，点一点听发音</p>
        </div>
      </RouterLink>

      <RouterLink to="/builder" class="feature-card card-build">
        <span class="feature-icon">🧩</span>
        <div class="feature-text">
          <h2 class="feature-title">拼一拼</h2>
          <p class="feature-desc">像搭积木一样，把拼音拼出来！</p>
        </div>
      </RouterLink>

      <div class="feature-card card-play disabled" aria-disabled="true">
        <span class="feature-icon">🎮</span>
        <div class="feature-text">
          <h2 class="feature-title">玩一玩</h2>
          <p class="feature-desc">趣味游戏即将上线</p>
        </div>
        <span class="coming-soon">即将推出</span>
      </div>
    </section>

    <section class="tips">
      <div class="tip">
        <span class="tip-icon">💡</span>
        <span>点击卡片上的 <strong>🔈</strong> 按钮可以听发音哦</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  min-height: calc(100dvh - var(--header-height) - var(--mobile-nav-height));
  padding: var(--space-4) 0;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: 0;
}

.hero-left {
  display: flex;
  justify-content: center;
}

.hero-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}

.hero-title {
  font-size: var(--font-size-2xl);
  font-weight: 800;
  color: var(--color-brand-orange);
  letter-spacing: 0.06em;
}

.hero-subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.hero-dedication {
  font-size: var(--font-size-xs);
  color: #E8839A;
  font-weight: 500;
  margin-top: var(--space-1);
}

.feature-cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 420px;
}

.feature-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  border-left: 4px solid transparent;
  box-shadow: var(--shadow-card);
  transition: all var(--transition-normal);
  cursor: pointer;
  position: relative;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-elevated);
}

.card-read {
  border-left-color: var(--color-initial);
}

.card-build {
  border-left-color: var(--color-brand-orange);
}

.card-play {
  border-left-color: var(--color-border);
  opacity: 0.55;
  cursor: default;
  pointer-events: none;
}

.feature-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-neutral-50);
  border-radius: var(--radius-md);
}

.card-read .feature-icon { background: var(--color-initial-light); }
.card-build .feature-icon { background: var(--color-brand-orange-bg); }
.card-play .feature-icon { background: var(--color-divider); }

.feature-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
}

.feature-title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-primary);
}

.feature-desc {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
}

.coming-soon {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  background: var(--color-divider);
  padding: 2px 8px;
  border-radius: var(--radius-full);
}

.tips {
  width: 100%;
  max-width: 420px;
}

.tip {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-brand-orange-bg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.tip-icon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

@media (min-width: 768px) {
  .feature-cards {
    flex-direction: column;
    max-width: 500px;
  }

  .hero-title {
    font-size: 3.5rem;
  }
}

@media (min-width: 1024px) {
  .home-page {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: var(--space-12);
    min-height: calc(100dvh - var(--header-height));
    max-width: 1000px;
    margin: 0 auto;
    padding: 0;
  }

  .hero {
    gap: var(--space-4);
    flex-shrink: 0;
  }

  .hero-title { font-size: var(--font-size-2xl); }
  .hero-subtitle { font-size: var(--font-size-sm); }

  .feature-cards {
    flex: 1;
    max-width: 420px;
  }

  .tips { display: none; }
}
</style>
