<script setup lang="ts">
import PandaMascot from '@/components/common/PandaMascot.vue'
</script>

<template>
  <div class="about-page">
    <section class="about-hero">
      <PandaMascot mood="idle" size="medium" />
      <h1 class="about-title">关于快乐拼音</h1>
    </section>

    <div class="about-cards">
      <div class="about-card">
        <h2 class="about-card-title"><span class="card-icon">📖</span> 我们的故事</h2>
        <p>快乐拼音是一个特别的六一儿童节礼物——一位爸爸送给女儿瑶瑶的拼音学习工具。</p>
        <p>我们希望用温暖的设计和有趣的交互，让每一个孩子都能在快乐中掌握汉语拼音，让学习变成一场愉快的探索之旅。</p>
      </div>

      <div class="about-card">
        <h2 class="about-card-title"><span class="card-icon">🏢</span> 组织信息</h2>
        <p><strong>i·Space 爱思培斯</strong></p>
        <p><a href="https://www.ispace.top" class="about-link" target="_blank" rel="noopener">www.ispace.top</a></p>
        <p class="about-copy">© 2026 i·Space. All rights reserved.</p>
      </div>

      <div class="about-card">
        <h2 class="about-card-title"><span class="card-icon">🛠</span> 技术栈</h2>
        <p>Vue 3 + TypeScript + Vite</p>
        <p>Web Speech API（浏览器语音合成）</p>
        <p>CSS Modules + Design Tokens</p>
        <p class="about-version">版本：1.0.0</p>
      </div>
    </div>

    <RouterLink to="/" class="about-back-btn">🏠 返回首页</RouterLink>
  </div>
</template>

<style scoped>
.about-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  padding: var(--space-8) var(--container-padding);
  padding-bottom: calc(var(--mobile-nav-height) + var(--space-8));
}

.about-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.about-title {
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-brand-orange);
}

.about-cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
  max-width: 560px;
}

.about-card {
  padding: var(--space-5) var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.about-card-title {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.card-icon { font-size: var(--font-size-xl); }

.about-card p {
  font-size: var(--font-size-base);
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.about-link {
  color: var(--color-brand-orange);
  font-weight: 600;
}

.about-copy {
  margin-top: var(--space-2);
  opacity: 0.6;
  font-size: var(--font-size-sm) !important;
}

.about-version {
  margin-top: var(--space-2);
  opacity: 0.5;
  font-size: var(--font-size-sm) !important;
}

.about-back-btn {
  padding: var(--space-3) var(--space-10);
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: #FFFFFF;
  background: var(--color-brand-orange);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
  font-family: inherit;
  box-shadow: var(--shadow-card);
}

.about-back-btn:hover { transform: scale(1.05); box-shadow: var(--shadow-elevated); }

@media (min-width: 768px) {
  .about-cards { max-width: 660px; }
}

@media (min-width: 1024px) {
  .about-page { padding-bottom: var(--space-8); }
  .about-cards {
    flex-direction: row;
    flex-wrap: wrap;
    max-width: 900px;
  }
  .about-card { flex: 1; min-width: 250px; }
}
</style>
