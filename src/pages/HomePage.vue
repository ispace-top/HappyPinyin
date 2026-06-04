<script setup lang="ts">
import PandaMascot from '@/components/common/PandaMascot.vue'
</script>

<template>
  <div class="home-page">
    <section class="hero">
      <PandaMascot mood="thinking" />
      <h1 class="hero-title">快乐拼音</h1>
      <p class="hero-subtitle">和拼拼一起学拼音！</p>
    </section>

    <section class="feature-cards">
      <RouterLink to="/browser" class="feature-card">
        <span class="feature-icon">📖</span>
        <h2 class="feature-title">拼音浏览</h2>
        <p class="feature-desc">看看所有的声母、韵母和整体认读音节，点一点听发音</p>
      </RouterLink>

      <RouterLink to="/builder" class="feature-card builder">
        <span class="feature-icon">🧩</span>
        <h2 class="feature-title">拼读构建器</h2>
        <p class="feature-desc">像搭积木一样，把声母和韵母拼在一起，读出来！</p>
      </RouterLink>
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
  gap: var(--space-8);
  padding-top: var(--space-8);
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.hero-title {
  font-size: var(--font-size-3xl);
  font-weight: 800;
  color: var(--color-brand-orange);
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
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
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-card);
  transition: all var(--transition-normal);
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-elevated);
}

.feature-icon {
  font-size: var(--font-size-3xl);
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
    flex-direction: row;
    max-width: 600px;
  }

  .feature-card {
    flex: 1;
  }

  .hero-title {
    font-size: 3.5rem;
  }
}
</style>
