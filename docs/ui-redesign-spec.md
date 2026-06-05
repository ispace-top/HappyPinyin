# HappyPinYin UI Redesign Specification

**版本**: v2.0
**日期**: 2026-06-05
**状态**: 设计规范（待实现）
**关联**: [原始 UI 设计文档](./ui-design.md) | [产品需求文档](./requirements.md)

---

## 目录

1. [总览：变更范围与文件清单](#1-总览变更范围与文件清单)
2. [响应式策略重构](#2-响应式策略重构)
3. [HomePage 首页重设计](#3-homepage-首页重设计)
4. [BrowserPage 浏览页重设计](#4-browserpage-浏览页重设计)
5. [BuilderPage 构建器页重设计](#5-builderpage-构建器页重设计)
6. [Result Character Card 结果卡片重设计](#6-result-character-card-结果卡片重设计)
7. [Global Audio Toggle 全局音频开关](#7-global-audio-toggle-全局音频开关)
8. [About Page 关于页（新增）](#8-about-page-关于页新增)
9. [Header/Logo 精细化用法](#9-headerlogo-精细化用法)
10. [实现优先级与依赖](#10-实现优先级与依赖)

---

## 1. 总览：变更范围与文件清单

### 1.1 新增文件

| 文件路径 | 用途 |
|----------|------|
| `src/composables/useAudioMode.ts` | 全局音频模式 composable（auto/manual） |
| `src/pages/AboutPage.vue` | 关于我们页面 |
| `src/components/layout/AppFooter.vue` | 全局页脚（桌面端显示版权/关于链接） |

### 1.2 修改文件

| 文件路径 | 变更内容 |
|----------|----------|
| `src/router/index.ts` | 新增 `/about` 路由 |
| `src/pages/HomePage.vue` | 完整重设计（大熊猫、响应式布局） |
| `src/pages/BrowserPage.vue` | 重设计（分组标签、侧边Tab布局） |
| `src/pages/BuilderPage.vue` | 重设计（侧边Stepper、结果卡片） |
| `src/components/layout/AppHeader.vue` | 新增音频开关、HomePage大Logo模式 |
| `src/components/layout/MobileNav.vue` | 构建器页隐藏逻辑优化 |
| `src/components/common/PandaMascot.vue` | 新增尺寸变体（large/medium） |
| `src/components/common/PinyinCard.vue` | 新增 `variant="result"` 结果卡片模式 |
| `src/components/builder/BuilderStepper.vue` | 新增 `vertical` 属性支持纵向布局 |
| `src/components/builder/TonePicker.vue` | 按钮尺寸响应式调整 |
| `src/styles/variables.css` | 新增少量设计token |
| `src/App.vue` | 新增 AppFooter 渲染 |

### 1.3 不修改的文件

- `src/data/*` — 数据层不变
- `src/utils/*` — 工具函数不变
- `src/services/speechService.ts` — TTS服务不变
- `src/composables/useBuilder.ts` — 构建器状态机不变
- `src/composables/useSpeech.ts` — 发音composable不变（由useAudioMode包装）
- `src/components/common/AudioButton.vue` — 按钮自身不变（由useAudioMode控制行为）
- `src/components/common/CelebrationEffect.vue` — 庆祝动画不变
- `src/components/builder/SelectorGrid.vue` — 网格组件不变
- `src/components/builder/MedialChips.vue` — 筛选项不变

---

## 2. 响应式策略重构

### 2.1 三级断点体系

不再使用传统 px 断点链，改用**语义级三断点**策略，以设备形态为锚点：

```
断点名称          | CSS 媒体查询                        | 目标设备
------------------|-------------------------------------|---------------------------
phone-portrait    | (max-width: 639px)                  | 手机竖屏（< 640px）
tablet            | (min-width: 640px) and (max-width: 1023px) | 小平板 / 手机横屏
desktop           | (min-width: 1024px)                 | 大平板 / 桌面
```

**设计理由**：640px 是手机横屏与小平板的分界。1024px 以上有足够水平空间实现真正双栏/三栏布局。三个断点足够覆盖所有使用场景，避免碎片化。

### 2.2 各断点布局策略速查

```
┌────────────────────┬──────────────────┬──────────────────┬──────────────────┐
│ 页面                │ phone-portrait   │ tablet           │ desktop          │
├────────────────────┼──────────────────┼──────────────────┼──────────────────┤
│ 内容容器最大宽度     │ 100% (无max)     │ 720px            │ 960px            │
│ 内容容器水平padding │ 16px (space-4)   │ 24px (space-6)   │ 32px (space-8)   │
│ Header高度          │ 56px             │ 56px             │ 64px             │
│ 底部导航            │ 显示             │ 显示             │ 隐藏             │
│ 卡片列数(浏览页)    │ 2-3列            │ 3-4列            │ 5-6列            │
│ 首页卡片布局        │ 纵向堆叠         │ 纵向堆叠         │ 横向并排         │
│ 构建器Stepper       │ 横向顶部         │ 横向顶部         │ 纵向左侧         │
│ 声调按钮            │ 80x80, 2行       │ 100x100, 1行     │ 100x100, 1行     │
│ 小熊猫位置          │ 右下悬浮(首页)   │ 内容区内嵌       │ 内容区内嵌       │
│ 字体缩放            │ 基准             | 基准             | 基准             │
└────────────────────┴──────────────────┴──────────────────┴──────────────────┘
```

### 2.3 横屏手机特殊处理 (max-height: 500px)

当设备处于横屏且高度受限时：

```css
@media (orientation: landscape) and (max-height: 500px) {
  :root {
    --header-height: 44px;
    --mobile-nav-height: 48px;
  }

  /* 构建器：stepper 进一步内联、内容减少 padding */
  .builder-page { gap: var(--space-1); padding-top: var(--space-1); }
  .step-content { gap: var(--space-2); }

  /* 首页：hero区域压缩 */
  .hero { gap: var(--space-1); }
  .hero-panda { width: 80px; height: 80px; }
  .hero-title { font-size: var(--font-size-2xl); }

  /* 浏览页：tabs保持单行、卡片最多3列 */
  .cards-grid { grid-template-columns: repeat(3, 1fr); }
}
```

### 2.4 新增 CSS 变量

```css
/* 追加到 src/styles/variables.css */
:root {
  /* === 内容容器 === */
  --container-padding: var(--space-4);       /* phone-portrait: 16px */
  --container-max-width: none;               /* phone-portrait: 全宽 */

  /* === 音频开关 === */
  --audio-toggle-size: 40px;
  --audio-toggle-bg: var(--color-brand-orange-bg);
}

@media (min-width: 640px) {
  :root {
    --container-padding: var(--space-6);     /* tablet: 24px */
    --container-max-width: 720px;
  }
}

@media (min-width: 1024px) {
  :root {
    --container-padding: var(--space-8);     /* desktop: 32px */
    --container-max-width: 960px;
    --header-height: 64px;
  }
}
```

### 2.5 通用页面容器模式

所有页面内容包裹器使用统一的 `.page-container`：

```css
.page-container {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
  /* 底部为MobileNav留空 */
  padding-bottom: calc(var(--mobile-nav-height) + var(--space-4));
}

@media (min-width: 1024px) {
  .page-container {
    padding-bottom: var(--space-8); /* 桌面端无底部导航 */
  }
}
```

---

## 3. HomePage 首页重设计

### 3.1 设计目标

- **小熊猫是视觉主角**，尺寸大而温暖，立即建立情感连接
- **三张功能卡片视觉区分明确**，配色活泼但不混乱
- **响应式布局**：竖屏纵向堆叠、横屏水平分栏
- 维持"3秒认知原则"——儿童和家长在3秒内理解"这是什么"

### 3.2 phone-portrait 布局 (< 640px)

```
┌──────────────────────────────────────────┐
│            Header (56px)                 │  品牌色底 + 大Logo
│   🐼  快乐拼音   [读一读] [拼一拼] 🔈     │
├──────────────────────────────────────────┤
│                                          │
│         ┌──────────────────┐            │
│         │                  │            │
│         │   🐼 拼拼大图    │            │  200×200 SVG
│         │   (大号小熊猫)   │            │  idle bounce动画
│         │                  │            │
│         │ "你好呀！我是    │            │  气泡文字
│         │  拼拼～"        │            │
│         └──────────────────┘            │
│                                          │
│          快 乐 拼 音                     │  品牌名, 40px/800
│      声母 · 韵母 · 整体认读音节          │  副标题, 16px/400
│     💕 为瑶瑶定制的六一礼物              │  献词, 12px/500 粉红
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 📖  读一读                    👉  │  │  功能卡片1
│  │     认识声母和韵母                  │  │  (声母蓝 #6C9BD2)
│  │     点一点卡片听发音，学助记口诀     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 🧩  拼一拼                    👉  │  │  功能卡片2
│  │     像搭积木一样，把拼音拼出来！     │  │  (品牌橙 #FF8C42)
│  │     选声母→选韵母→选声调→拼成功     │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 🎮  玩一玩           [即将推出]   │  │  功能卡片3 (禁用)
│  │     趣味游戏即将上线                │  │  (灰色, 不可点击)
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ 💡 小提示：点击卡片上的🔈按钮可以   │  │  新手提示
│  │    听发音哦～                      │  │
│  └────────────────────────────────────┘  │
│                                          │
├──────────────────────────────────────────┤
│          MobileNav (64px)               │  底部导航
└──────────────────────────────────────────┘
```

### 3.3 desktop 布局 (>= 1024px)

```
┌──────────────────────────────────────────────────────────────┐
│                     Header (64px)                             │
│   🐼 快乐拼音          [读一读]  [拼一拼]  [🔊 自动朗读]      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐   ┌─────────────────────────────┐ │
│  │                      │   │                             │ │
│  │                      │   │   快 乐 拼 音               │ │  ← 48px/800
│  │     🐼 拼拼大图      │   │   声母·韵母·整体认读音节    │ │  ← 18px/400
│  │     (240×240)       │   │   💕 为瑶瑶定制的六一礼物   │ │  ← 14px/500
│  │                      │   │                             │ │
│  │   "你好呀！          │   │  ┌───────────────────────┐  │ │
│  │   我是拼拼～"        │   │  │ 📖 读一读        👉  │  │ │
│  │                      │   │  │   认识声母和韵母     │  │ │
│  │                      │   │  │   点一点听发音       │  │ │
│  │                      │   │  └───────────────────────┘  │ │
│  │                      │   │                             │ │
│  │                      │   │  ┌───────────────────────┐  │ │
│  │                      │   │  │ 🧩 拼一拼        👉  │  │ │
│  │                      │   │  │   声母+韵母+声调     │  │ │
│  │                      │   │  │   像搭积木一样拼     │  │ │
│  │                      │   │  └───────────────────────┘  │ │
│  │                      │   │                             │ │
│  │                      │   │  ┌───────────────────────┐  │ │
│  │                      │   │  │ 🎮 玩一玩  [即将推出] │  │ │
│  │                      │   │  └───────────────────────┘  │ │
│  └──────────────────────┘   └─────────────────────────────┘ │
│    flex: 1 (左: 熊猫区)        flex: 1.2 (右: 文字+卡片)      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 PandaMascot 组件修改

新增 `size` 属性，支持三种尺寸：

```typescript
// props 新增
defineProps<{
  mood?: 'idle' | 'happy' | 'thinking'
  size?: 'small' | 'medium' | 'large'  // 新增
  showBubble?: boolean                  // 新增：是否显示气泡
  bubbleText?: string                   // 新增：气泡文字
}>()
```

尺寸规格：

```
size    | SVG viewBox | 渲染宽度 | 使用场景
--------|-------------|----------|------------------
small   | 80×80      | 80px     | 构建器结果页侧边栏
medium  | 120×120    | 120px    | 浏览页/构建器内容区
large   | 200×200    | 200px    | 首页 Hero 区域
        |             | (桌面240)| 桌面端首页放大至240px
```

**HomePage 使用**：
```html
<PandaMascot mood="thinking" size="large" :showBubble="true"
  bubbleText="你好呀！我是拼拼～" />
```

### 3.5 HomePage 组件规格

#### Hero 区域

```css
/* phone-portrait */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-10) 0 var(--space-6);
}

.hero-title {
  font-size: var(--font-size-3xl);      /* 48px */
  font-weight: 800;
  color: var(--color-brand-orange);      /* #FF8C42 */
  line-height: 1.2;
  letter-spacing: 0.08em;               /* 字间距增加，更醒目 */
}

.hero-subtitle {
  font-size: var(--font-size-md);       /* 16px */
  font-weight: 400;
  color: var(--color-text-secondary);   /* #7F8C8D */
}

.hero-dedication {
  font-size: var(--font-size-sm);       /* 12px */
  font-weight: 500;
  color: #E8839A;                       /* 温暖粉色，与品牌区分 */
  margin-top: var(--space-2);
}

/* desktop */
@media (min-width: 1024px) {
  .hero {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: var(--space-12);
    padding: var(--space-12) var(--space-8);
  }

  .hero-left {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .hero-right {
    flex: 1.2;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .hero-title {
    font-size: 3.5rem;                  /* 56px */
  }
}
```

#### 功能卡片

每张卡片使用彩色左边框（4px solid）作为分类视觉锚点。

```css
.feature-cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  width: 100%;
}

.feature-card {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-5) var(--space-6);       /* 20px 24px */
  background: var(--color-surface);
  border-radius: var(--radius-xl);              /* 20px */
  border-left: 4px solid transparent;
  box-shadow: var(--shadow-card);
  transition: transform var(--transition-normal),
              box-shadow var(--transition-normal);
  cursor: pointer;
  min-height: 88px;                             /* > 2×44px 触控友好 */
}

.feature-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-elevated);
}

/* 三张卡片的左边框颜色 */
.card-read  { border-left-color: #6C9BD2; }     /* 声母蓝 */
.card-build { border-left-color: #FF8C42; }      /* 品牌橙 */
.card-play  { border-left-color: #D0D0D0; }      /* 灰色 */

/* 图标区 */
.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);               /* 12px */
  font-size: 2rem;                               /* 32px */
  flex-shrink: 0;
}

.card-read .feature-icon  { background: #E8F0FA; }  /* 声母浅蓝 */
.card-build .feature-icon { background: #FFF3E9; }  /* 品牌浅橙 */
.card-play .feature-icon  { background: #F5F5F5; }   /* 浅灰 */

/* 文字区 */
.feature-text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
}

.feature-title {
  font-size: var(--font-size-xl);               /* 24px */
  font-weight: 700;
  color: var(--color-text-primary);
}

.feature-desc {
  font-size: var(--font-size-base);             /* 14px */
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* 禁用卡片 */
.feature-card.disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}

.coming-soon-badge {
  font-size: var(--font-size-xs);               /* 10px */
  color: var(--color-text-secondary);
  background: #F0F0F0;
  padding: 2px 10px;
  border-radius: var(--radius-full);
  margin-left: auto;
}
```

#### 新手提示

```css
.tip-banner {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: #FFF3E9;                           /* 品牌浅橙背景 */
  border-radius: var(--radius-md);               /* 12px */
  font-size: var(--font-size-sm);               /* 12px */
  color: #B8754A;                                /* 暖棕色文字 */
  line-height: 1.5;
}
```

### 3.6 HomePage 实现变更清单

| 操作 | 说明 |
|------|------|
| 修改 `HomePage.vue` | 完整重写template/style，保持script逻辑 |
| 修改 `PandaMascot.vue` | 新增 `size`/`showBubble`/`bubbleText` props |
| 无新文件 | HomePage改动在现有文件内完成 |

---

## 4. BrowserPage 浏览页重设计

### 4.1 设计目标

- **Category tabs 醒目有趣**：使用药片形(Pill)按钮，激活态使用分类主题色填充
- **卡片呈"画廊"布局**：自适应列数 + 分组标签清晰
- **组标签(唇音/舌尖音等)** 作为视觉分隔，帮助儿童理解拼音分类体系
- **响应式**：竖屏 tabs 顶部横滚、横屏 tabs 可左侧竖排

### 4.2 phone-portrait 布局 (< 640px)

```
┌──────────────────────────────────────┐
│          Header (56px)              │
├──────────────────────────────────────┤
│                                      │
│  读一读                              │  h1, 32px/800
│  点击卡片听发音，学助记口诀          │  副标题, 14px/400
│                                      │
│  ┌──────┬──────┬──────┬──────────┐  │
│  │ 声母 │ 单韵母│ 复韵母│ 整体认读 │  │  ← Tab药片, 可横滚
│  │  23  │   6  │  18  │   16    │  │     激活态用分类色填充
│  └──────┴──────┴──────┴──────────┘  │
│                                      │
│  ┌── 唇音(双唇音) ────────────────┐  │
│  │ ┌──────┐ ┌──────┐ ┌──────┐    │  │  组标签 + 卡片
│  │ │  📢  │ │  🏔  │ │  🐱  │    │  │  唇音粉红背景
│  │ │  b   │ │  p   │ │  m   │    │  │
│  │ │ 听广播│ │ 爬山坡│ │ 摸猫猫│   │  │
│  │ └──────┘ └──────┘ └──────┘    │  │
│  │ ┌──────┐                       │  │
│  │ │  🛫  │                       │  │
│  │ │  f   │                       │  │
│  │ │ 大飞机│                       │  │
│  │ └──────┘                       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌── 舌尖音(舌尖中音) ──────────┐   │
│  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ │
│  │ │ 🥁 d │ │ 🌮 t │ │ 👃 n │ │ 🎺 l │ │
│  │ └──────┘ └──────┘ └──────┘ └──────┘ │
│  └────────────────────────────────┘   │
│                                      │
│  ... (更多分组)                       │
│                                      │
├──────────────────────────────────────┤
│        MobileNav (64px)              │
└──────────────────────────────────────┘
```

### 4.3 desktop 布局 (>= 1024px)

Tabs 从顶部横排变为左侧竖排（类似设置页），留出更多横向空间给卡片网格：

```
┌──────────────────────────────────────────────────────────────┐
│                     Header (64px)                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐  ┌──────────────────────────────────────────┐ │
│  │          │  │  读一读                                   │ │
│  │ 📖 声母  │  │  点击卡片听发音，学助记口诀                │ │
│  │   23     │  │                                          │ │
│  │          │  │  ┌── 唇音(双唇音) ───────────────────┐  │ │
│  │ ♪ 单韵母 │  │  │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──┐ │  │ │
│  │    6     │  │  │ │ 📢 b │ │ 🏔 p │ │ 🐱 m │ │🛫│ │  │ │
│  │          │  │  │ └──────┘ └──────┘ └──────┘ └──┘ │  │ │
│  │ ♫ 复韵母 │  │  └──────────────────────────────────┘  │ │
│  │   18     │  │                                          │ │
│  │          │  │  ┌── 舌尖音(舌尖中音) ───────────────┐  │ │
│  │ ⚡ 整体  │  │  │ ┌──────┐ ┌──────┐ ┌──┐ ┌──────┐ │  │ │
│  │   16     │  │  │ │ 🥁 d │ │ 🌮 t │ │👃│ │ 🎺 l │ │  │ │
│  │          │  │  │ └──────┘ └──────┘ └──┘ └──────┘ │  │ │
│  └──────────┘  │  └──────────────────────────────────┘  │ │
│   左侧Tab栏     │  ... (更多分组)                         │ │
│   width: 160px │                                          │ │
│   position:    └──────────────────────────────────────────┘ │
│   sticky       │   卡片区: grid, minmax(120px, 1fr), 5-6列  │
│   top: 80px    │                                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 4.4 Tab 组件规格

```css
/* === Tabs 容器 === */
.browser-tabs {
  display: flex;
  gap: var(--space-2);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;          /* Firefox */
  padding-bottom: var(--space-1);  /* 防止active边框被裁剪 */
}

.browser-tabs::-webkit-scrollbar { display: none; }

/* === Tab 按钮 === */
.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  flex-shrink: 0;
  padding: var(--space-2) var(--space-4);     /* 8px 16px */
  height: 40px;
  border-radius: var(--radius-full);          /* 9999px 药片形 */
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  font-size: var(--font-size-sm);             /* 12px */
  font-weight: 600;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);     /* 150ms */
  font-family: inherit;
  white-space: nowrap;
}

/* 各Tab激活态使用对应分类色 */
.tab-btn[data-tab="initial"].active {
  background: #6C9BD2;
  border-color: #6C9BD2;
  color: #FFFFFF;
}

.tab-btn[data-tab="singleFinals"].active {
  background: #E8839A;
  border-color: #E8839A;
  color: #FFFFFF;
}

.tab-btn[data-tab="compoundFinals"].active {
  background: #7EC8A0;
  border-color: #7EC8A0;
  color: #FFFFFF;
}

.tab-btn[data-tab="wholeSyllable"].active {
  background: #F0C75E;
  border-color: #F0C75E;
  color: #FFFFFF;
}

/* 数量徽章 */
.tab-count {
  font-size: var(--font-size-xs);            /* 10px */
  opacity: 0.75;
  font-weight: 500;
}

/* === 桌面端左侧竖排 Tabs === */
@media (min-width: 1024px) {
  .browser-layout {
    display: flex;
    gap: var(--space-6);
    align-items: flex-start;
  }

  .browser-tabs {
    flex-direction: column;
    gap: var(--space-2);
    overflow-x: visible;
    position: sticky;
    top: calc(var(--header-height) + var(--space-4));
    width: 150px;
    flex-shrink: 0;
  }

  .tab-btn {
    justify-content: flex-start;
    width: 100%;
    font-size: var(--font-size-base);        /* 14px */
    height: 44px;
  }

  .browser-content {
    flex: 1;
    min-width: 0;                            /* 防止flex溢出 */
  }
}
```

### 4.5 分组标签规格

声母按发音部位分组，韵母按单/复/鼻分组，整体认读音节不再分组。

```css
.group-section {
  margin-bottom: var(--space-5);              /* 20px */
}

.group-label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);     /* 4px 12px */
  margin-bottom: var(--space-3);              /* 12px */
  font-size: var(--font-size-sm);             /* 12px */
  font-weight: 600;
  color: #FFFFFF;
  border-radius: var(--radius-sm);            /* 8px */
  letter-spacing: 0.04em;
}

/* 各分组标签背景色 */
.group-label[data-group="唇音"]   { background: #C75B7A; }  /* 粉红 */
.group-label[data-group="舌尖音"] { background: #E8A050; }  /* 暖橙 */
.group-label[data-group="舌根音"] { background: #C9A03A; }  /* 金棕 */
.group-label[data-group="舌面音"] { background: #6CAD6F; }  /* 草绿 */
.group-label[data-group="翘舌音"] { background: #5A8EC7; }  /* 天蓝 */
.group-label[data-group="平舌音"] { background: #8B6BAE; }  /* 薰紫 */
.group-label[data-group="特殊声母"] { background: #7E8C9A; } /* 蓝灰 */
.group-label[data-group="单韵母"] { background: #E8839A; }   /* 玫瑰粉 */
.group-label[data-group="复韵母"] { background: #7EC8A0; }   /* 薄荷绿 */
.group-label[data-group="鼻韵母"] { background: #6C9BD2; }   /* 天空蓝 */
```

**组卡片区域**：使用浅色背景框将同组卡片包围：

```css
.group-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-3);
  padding: var(--space-3);
  background: rgba(0, 0, 0, 0.02);             /* 极浅灰区分 */
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
}

@media (min-width: 480px) {
  .group-cards { grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); }
}

@media (min-width: 1024px) {
  .group-cards { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
}
```

### 4.6 语音队列顺序播放

浏览页卡片点击行为保持不变：点击卡片 → 先读拼音字母 → 再读助记词。实现逻辑在 `handleCardClick` 中，无需修改。

### 4.7 BrowserPage 实现变更清单

| 操作 | 说明 |
|------|------|
| 修改 `BrowserPage.vue` | 完整重写template/style，新增分组标签渲染 |
| 修改 `PinyinCard.vue` | 无需修改（props传递现有数据即可） |
| 修改 `variables.css` | 新增 `--container-padding` 等通用变量 |

---

## 5. BuilderPage 构建器页重设计

### 5.1 设计目标

- **桌面端**：Step指示器纵向置于左侧，释放水平空间给选择器区域
- **移动端**：Step指示器横向置于顶部（保持现有模式），但优化间距和视觉
- **结果页**：结果卡片使用新的Result Character Card（见第6节）
- **"再拼一个"按钮始终可见**：固定在结果区域，不随滚动消失

### 5.2 phone-portrait 布局 (< 640px)

保持与现有结构类似，但优化间距和预览区：

```
┌──────────────────────────────────────┐
│          Header (56px)              │
├──────────────────────────────────────┤
│                                      │
│  [1 选声母]──[2 选韵母]──[3 选声调]  │  ← BuilderStepper (横向, 紧凑)
│                                      │
│  已选: [b] + [_] + [?]              │  ← 实时预览区 (仅 final/tone步骤显示)
│                                      │
├──────────────────────────────────────┤
│                                      │
│  选择一个声母开始吧！                 │  ← 提示文字
│                                      │
│  ┌── 唇音 ────────────────────────┐  │
│  │ ┌──────┐ ┌──────┐ ┌──────┐   │  │  ← SelectorGrid
│  │ │ 📢 b │ │ 🏔 p │ │ 🐱 m │   │  │     (当前步骤的选项)
│  │ └──────┘ └──────┘ └──────┘   │  │
│  │ ┌──────┐                       │  │
│  │ │ 🛫 f │                       │  │
│  │ └──────┘                       │  │
│  └────────────────────────────────┘  │
│                                      │
│  ... (更多分组)                       │
│                                      │
├──────────────────────────────────────┤
│        MobileNav (64px) 隐藏         │  ← 构建器页隐藏底部导航
└──────────────────────────────────────┘
```

### 5.3 desktop 布局 (>= 1024px)

Stepper纵向置于左侧，内容区占据右侧：

```
┌──────────────────────────────────────────────────────────────┐
│                     Header (64px)                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────┐  ┌────────────────────────────────────┐ │
│  │                │  │                                    │ │
│  │  ● 1 选声母    │  │  选择一个声母开始吧！                │ │
│  │    ↕           │  │                                    │ │
│  │  ○ 2 选韵母    │  │  ┌── 唇音 ────────────────────┐  │ │
│  │    ↕           │  │  │ ┌──────┐ ┌──────┐ ┌──────┐ │  │ │
│  │  ○ 3 选声调    │  │  │ │ 📢 b │ │ 🏔 p │ │ 🐱 m │ │  │ │
│  │    ↕           │  │  │ └──────┘ └──────┘ └──────┘ │  │ │
│  │  ○ 完成        │  │  └────────────────────────────┘  │ │
│  │                │  │                                    │ │
│  │  ────────────  │  │  ┌── 舌尖音 ──────────────────┐  │ │
│  │  已选: b + _   │  │  │ ┌──────┐ ┌──────┐ ┌──┐   │  │ │
│  │                │  │  │ │ 🥁 d │ │ 🌮 t │ │..│   │  │ │
│  │                │  │  │ └──────┘ └──────┘ └──┘   │  │ │
│  │                │  │  └────────────────────────────┘  │ │
│  │                │  │                                    │ │
│  └────────────────┘  └────────────────────────────────────┘ │
│   width: 200px           flex: 1, 选择器区域                 │
│   position: sticky                                        │
│   top: 80px                                               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 5.4 BuilderStepper 修改 — 新增 `vertical` 属性

```typescript
// BuilderStepper.vue props
defineProps<{
  currentStep: BuilderStep
  vertical?: boolean          // 新增：桌面端纵向布局
  selectionPreview?: string   // 新增：当前选择预览文本（桌面端显示在stepper下方）
}>()
```

**纵向样式**：

```css
/* 纵向stepper — 桌面端 */
.stepper.vertical {
  flex-direction: column;
  gap: 0;
  padding: var(--space-4);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.stepper.vertical .step {
  flex-direction: row;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
}

.stepper.vertical .step-line {
  width: 2px;
  height: 24px;
  margin: 0 auto;
  margin-left: 17px;       /* 对齐圆心 */
}

.stepper.vertical .step-label {
  font-size: var(--font-size-base);
}

/* 预览区嵌入stepper底部 */
.stepper-preview {
  margin-top: var(--space-4);
  padding-top: var(--space-3);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-align: center;
}
```

**横向样式（移动端）** — 保持现有，但微调间距：

```css
.stepper.horizontal {
  flex-direction: row;
  justify-content: center;
  gap: 0;
  padding: var(--space-3) 0;  /* 更紧凑 */
}

/* 移动端隐藏预览区（已有独立的selection-preview bar） */
.stepper.horizontal .stepper-preview {
  display: none;
}
```

### 5.5 预览区优化

移动端预览区从 `position: fixed` 改为跟随内容流：

```css
.selection-preview {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  background: var(--color-brand-orange-bg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  /* 移除 fixed 定位，改为正常流 */
}

.preview-value {
  font-weight: 700;
  color: var(--color-brand-orange);
  font-size: var(--font-size-lg);          /* 20px */
}
```

### 5.6 "再拼一个"按钮持久可见

结果页布局重新组织，确保按钮不随滚动消失：

```html
<!-- 结果步骤 -->
<div class="result-step">
  <!-- 庆祝特效覆盖层 -->
  <CelebrationEffect v-if="showCelebration" />

  <div class="result-card-wrapper">
    <!-- 新的Result Character Card -->
    <ResultCharCard :syllable="resultSyllable" :info="resultCharInfo"
      :process="selectionPreview" @replay="speakResult" />
  </div>

  <div class="result-actions-bar">
    <button class="retry-btn" @click="handleReset">🔄 再拼一个</button>
    <PandaMascot mood="happy" size="small" :showBubble="true"
      bubbleText="太棒了!" />
  </div>
</div>
```

```css
.result-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  padding-bottom: var(--space-10);         /* 底部留白 */
}

.result-actions-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-6);
  position: sticky;
  bottom: 0;
  background: linear-gradient(transparent 0%, var(--color-bg) 40%);
  padding: var(--space-4) 0;
  width: 100%;
}

.retry-btn {
  padding: var(--space-3) var(--space-10);  /* 12px 40px */
  font-size: var(--font-size-lg);           /* 20px */
  font-weight: 700;
  color: #FFFFFF;
  background: var(--color-brand-orange);
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
  font-family: inherit;
  box-shadow: var(--shadow-md);
  min-height: var(--touch-target-min);       /* 48px */
}

.retry-btn:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-elevated);
}

@media (min-width: 1024px) {
  .retry-btn {
    padding: var(--space-4) var(--space-12); /* 16px 48px */
    font-size: var(--font-size-xl);          /* 24px */
  }
}
```

### 5.7 BuilderPage 实现变更清单

| 操作 | 说明 |
|------|------|
| 修改 `BuilderPage.vue` | 结果区使用新ResultCharCard、sticky操作栏 |
| 修改 `BuilderStepper.vue` | 新增 `vertical` 属性 + 纵向布局样式 |
| 修改 `MobileNav.vue` | 确认构建器页隐藏逻辑（已有`v-if`） |

---

## 6. Result Character Card 结果卡片重设计

### 6.1 设计目标

- 匹配 `PinyinCard` 的视觉风格（渐变背景、圆角、轻微高光）
- 汉字更大更醒目（4-5rem）
- 词语/短语清晰可读
- 出现时有轻微动画
- 包含拼音拼读过程展示

### 6.2 视觉规格

```
┌───────────────────────────────────────────┐
│                                           │
│           b + a + ˉ                       │  ← 拼读过程 (16px/400, 灰色)
│                                           │
│         ╔═══════════════════════╗         │
│         ║                     ║         │
│         ║        bā           ║         │  拼音音节 (56px/800, 橙色)
│         ║       (ba)          ║         │  无调号 (16px/400)
│         ║                     ║         │
│         ║    ┌─────────────┐  ║         │
│         ║    │     八      │  ║         │  汉字 (64px/800)
│         ║    └─────────────┘  ║         │
│         ║                     ║         │
│         ║   八仙过海·四面八方  ║         │  词语 (16px/500, 彩色)
│         ║                     ║         │
│         ╚═══════════════════════╝         │
│             卡片区域                       │
│                                           │
│         [🔊 再听一遍]                     │  ← 音频按钮
│                                           │
│         [🔄 再拼一个]                     │  ← 主操作按钮
│                                           │
└───────────────────────────────────────────┘
```

卡片渐变色根据拼音类别动态确定：
- 声母蓝系 → 韵母粉系：`linear-gradient(135deg, #E8F0FA 0%, #FAE8ED 100%)`
- 声母蓝系 → 复韵母绿系：`linear-gradient(135deg, #E8F0FA 0%, #E8F6EF 100%)`
- 零声母 → 韵母：`linear-gradient(135deg, #FFF3E9 0%, #FAE8ED 100%)`

### 6.3 PinyinCard 新增 `variant="result"` 模式

```typescript
// PinyinCard.vue 新增props
defineProps<{
  // ... existing props ...
  variant?: 'browse' | 'select' | 'result'   // 新增 'result'
  resultData?: {                             // 新增: 结果卡片专用数据
    processText: string      // "b + a + ˉ"
    syllable: string         // "bā"
    plainSyllable: string    // "ba"
    character: string        // "八"
    words: string            // "八仙过海"
    phrase: string           // "四面八方"
  }
}>()
```

**Result模式CSS**：

```css
.pinyin-card.result-card {
  min-height: auto;
  padding: var(--space-6) var(--space-8);  /* 24px 32px */
  border: 3px solid var(--color-brand-orange-light);
  background: var(--result-gradient);
  box-shadow: var(--shadow-elevated), var(--shadow-glow);
  cursor: default;
  gap: var(--space-4);
}

.pinyin-card.result-card:hover {
  transform: none;                          /* result卡片不可交互 */
}

.result-process {
  font-size: var(--font-size-base);        /* 14px */
  font-weight: 400;
  color: var(--color-text-secondary);
  letter-spacing: 0.06em;
}

.result-syllable-main {
  font-size: var(--font-size-pinyin-large); /* 80px (移动端) */
  font-weight: 800;
  color: var(--color-brand-orange);
  line-height: 1;
  margin: var(--space-1) 0;
}

.result-syllable-plain {
  font-size: var(--font-size-base);
  font-weight: 400;
  color: var(--color-text-secondary);
  opacity: 0.7;
}

.result-char-display {
  font-size: var(--font-size-3xl);          /* 48px (移动端) */
  font-weight: 800;
  color: var(--color-text-primary);
  background: rgba(255, 255, 255, 0.6);
  border-radius: var(--radius-md);
  padding: var(--space-1) var(--space-4);
  min-width: 80px;
  text-align: center;
}

.result-words-display {
  font-size: var(--font-size-md);           /* 16px */
  font-weight: 500;
  color: #7EC8A0;                           /* 复韵母绿，柔和可读 */
  text-align: center;
}

/* 出现动画 */
.pinyin-card.result-card {
  animation: resultAppear 0.5s var(--ease-bounce);
}

@keyframes resultAppear {
  0%   { transform: scale(0.8); opacity: 0; }
  60%  { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* 桌面端放大 */
@media (min-width: 768px) {
  .result-syllable-main { font-size: 6rem; }
  .result-char-display { font-size: 4rem; }
  .result-words-display { font-size: var(--font-size-lg); }
}
```

### 6.4 构建器结果页集成

在 `BuilderPage.vue` 结果步骤中，替换现有的 `result-display` 为：

```html
<PinyinCard
  v-if="resultCharInfo"
  variant="result"
  :resultData="{
    processText: selectionPreview,
    syllable: displayResult,
    plainSyllable: resultSyllable ?? '',
    character: resultCharInfo[0],
    words: resultCharInfo[1],
    phrase: resultCharInfo[2],
  }"
/>
```

### 6.5 实现变更清单

| 操作 | 说明 |
|------|------|
| 修改 `PinyinCard.vue` | 新增 `variant="result"` 模式 + 对应CSS |
| 修改 `BuilderPage.vue` | 结果区使用新卡片组件 |

---

## 7. Global Audio Toggle 全局音频开关

### 7.1 设计目标

- 一个醒目但不突兀的全局开关
- 两个状态：**自动朗读** / **手动模式**
- 放置在 Header 中，对所有页面可见
- 默认开启（儿童需要语音反馈）
- 偏好持久化到 `localStorage`
- 通过 composable 共享状态

### 7.2 数据流架构

```
                    ┌─────────────────────┐
                    │    localStorage      │
                    │  key: "audioMode"    │
                    │  value: "auto"|"manual"│
                    └──────────┬──────────┘
                               │ 初始化读取
                               ▼
                    ┌─────────────────────┐
                    │  useAudioMode()     │
                    │  (composable)       │
                    │                     │
                    │  audioMode: ref     │
                    │  isAutoMode: computed│
                    │  toggle(): fn       │
                    │  shouldAutoSpeak(): │
                    │    computed          │
                    └──────────┬──────────┘
                               │ provide / inject
            ┌──────────────────┼──────────────────┐
            ▼                  ▼                  ▼
    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
    │ AppHeader    │  │ BuilderPage  │  │ BrowserPage  │
    │ AudioToggle  │  │ 跳过自动发音 │  │ 跳过自动发音 │
    │ UI 组件      │  │ (手动模式)   │  │ (手动模式)   │
    └──────────────┘  └──────────────┘  └──────────────┘
```

### 7.3 Composable: `useAudioMode.ts`

```typescript
// src/composables/useAudioMode.ts
import { ref, computed, watch } from 'vue'

type AudioMode = 'auto' | 'manual'
const STORAGE_KEY = 'happypinyin_audio_mode'

// 全局单例状态（模块级，所有组件共享）
const audioMode = ref<AudioMode>(loadMode())

function loadMode(): AudioMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'manual') return 'manual'
    return 'auto'
  } catch {
    return 'auto'  // 默认自动
  }
}

function persistMode(mode: AudioMode): void {
  try {
    localStorage.setItem(STORAGE_KEY, mode)
  } catch { /* 忽略存储失败 */ }
}

export function useAudioMode() {
  const isAutoMode = computed(() => audioMode.value === 'auto')

  function toggle(): void {
    audioMode.value = audioMode.value === 'auto' ? 'manual' : 'auto'
    persistMode(audioMode.value)
  }

  function setMode(mode: AudioMode): void {
    audioMode.value = mode
    persistMode(mode)
  }

  // 辅助方法：根据当前模式决定是否执行自动发音
  function shouldAutoSpeak(): boolean {
    return audioMode.value === 'auto'
  }

  return {
    audioMode,
    isAutoMode,
    toggle,
    setMode,
    shouldAutoSpeak,
  }
}
```

### 7.4 AudioToggle UI 组件（嵌入 AppHeader）

位置：Header 内，导航链接右侧（移动端）/ 导航链接和Logo之间（桌面端）

```html
<!-- 在 AppHeader.vue 的 template 中 -->
<button
  class="audio-toggle"
  :class="{ manual: !isAutoMode }"
  :aria-label="isAutoMode ? '自动朗读已开启，点击关闭' : '自动朗读已关闭，点击开启'"
  :title="isAutoMode ? '自动朗读：开' : '手动模式：关'"
  @click="toggle"
>
  <span class="toggle-icon">{{ isAutoMode ? '🔊' : '🔇' }}</span>
  <span class="toggle-label">{{ isAutoMode ? '自动' : '手动' }}</span>
</button>
```

**样式规格**：

```css
.audio-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);   /* 4px 12px */
  height: 36px;
  border-radius: var(--radius-full);        /* 药片形 */
  background: var(--audio-toggle-bg);       /* #FFF3E9 */
  border: 2px solid var(--color-brand-orange-light);
  font-size: var(--font-size-xs);           /* 10px */
  font-weight: 600;
  color: var(--color-brand-orange);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-family: inherit;
  white-space: nowrap;
  flex-shrink: 0;
}

.audio-toggle:hover {
  background: var(--color-brand-orange-light);
  border-color: var(--color-brand-orange);
}

/* 手动模式（关闭）样式 */
.audio-toggle.manual {
  background: #F5F5F5;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

.audio-toggle.manual:hover {
  background: #EBEBEB;
}

.toggle-icon {
  font-size: var(--font-size-md);           /* 16px */
  line-height: 1;
}

.toggle-label {
  font-size: var(--font-size-xs);           /* 10px */
}

/* 移动端：仅显示图标，隐藏文字 */
@media (max-width: 639px) {
  .toggle-label { display: none; }
  .audio-toggle {
    min-width: 36px;
    justify-content: center;
    padding: var(--space-1);
  }
}

/* 桌面端：放在导航右侧 */
@media (min-width: 1024px) {
  .audio-toggle {
    margin-left: var(--space-4);
    height: 40px;
    font-size: var(--font-size-sm);
  }

  .toggle-label { font-size: var(--font-size-sm); }
}
```

### 7.5 各页面的自动发音控制

`useAudioMode` 返回的 `shouldAutoSpeak()` 用于包装所有自动发音调用：

**BuilderPage 修改**：
```typescript
// 在 handleInitialSelect, handleMedialSelect 等函数中
const { shouldAutoSpeak } = useAudioMode()

function handleInitialSelect(item: typeof initialItems.value[number]) {
  dispatch({ type: 'SELECT_INITIAL', initial: item.value })
  if (shouldAutoSpeak()) {
    const initEl = initials.find(i => i.text === item.value)
    if (initEl) speak(initEl.pronunciation, { rate: 0.5 })
  }
}
```

**BrowserPage 不变**：浏览页的发音完全由用户主动点击卡片触发，不受自动模式影响。

**watch 中的自动序列发音**：
```typescript
watch(() => state.step, (newStep) => {
  if (newStep !== 'result' || !resultSyllable.value) return
  if (!shouldAutoSpeak()) return    // 手动模式下跳过序列发音
  // ... 序列发音逻辑
})
```

### 7.6 Header 布局调整 (容纳 AudioToggle)

```
phone-portrait Header:
┌───────────────────────────────────────────┐
│ [🐼] 快乐拼音    [读一读] [拼一拼] [🔊]   │
└───────────────────────────────────────────┘

desktop Header:
┌───────────────────────────────────────────────┐
│ [🐼] 快乐拼音   [读一读] [拼一拼]  [🔊 自动]  │
└───────────────────────────────────────────────┘
```

### 7.7 实现变更清单

| 操作 | 说明 |
|------|------|
| 新建 `src/composables/useAudioMode.ts` | 全局音频模式 composable |
| 修改 `src/components/layout/AppHeader.vue` | 新增 AudioToggle 按钮 + 导入useAudioMode |
| 修改 `src/pages/BuilderPage.vue` | 在自动发音调用处包装 `shouldAutoSpeak()` |
| `BrowserPage.vue` 不变 | 浏览页不受影响（仅手动点击触发） |

---

## 8. About Page 关于页（新增）

### 8.1 设计目标

- 简洁温暖的"关于我们"页面
- 保持儿童友好的视觉风格
- 展示品牌故事、组织信息、技术栈
- 有清晰的返回首页方式

### 8.2 布局 (phone-portrait < 640px)

```
┌──────────────────────────────────────┐
│          Header (56px)              │
│   ← 返回    关于快乐拼音             │  返回箭头 + 标题
├──────────────────────────────────────┤
│                                      │
│         ┌──────────────┐            │
│         │   🐼 拼拼    │            │  小熊猫 (120px)
│         │              │            │  idle动画
│         └──────────────┘            │
│                                      │
│        关于快乐拼音                   │  h1, 28px/700
│                                      │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │  📖 我们的故事                  │  │  内容卡片
│  │                                │  │  (白色底, 阴影)
│  │  快乐拼音是一个特别的六一儿童节  │  │  正文, 15px/400
│  │  礼物——一位爸爸送给女儿瑶瑶的    │  │  行高 1.8
│  │  拼音学习工具。                  │  │
│  │                                │  │
│  │  我们希望用温暖的设计和有趣的     │  │
│  │  交互，让每一个孩子都能在快乐中   │  │
│  │  掌握汉语拼音。                  │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🏢 组织信息                    │  │  信息卡片
│  │                                │  │
│  │  i·Space 爱思培斯               │  │
│  │  www.ispace.top               │  │
│  │                                │  │
│  │  © 2026 i·Space.              │  │
│  │  All rights reserved.          │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │  🛠 技术栈                      │  │  技术卡片
│  │                                │  │
│  │  Vue 3 + TypeScript + Vite    │  │
│  │  Web Speech API                │  │
│  │  CSS Modules + Design Tokens   │  │
│  │                                │  │
│  │  版本: 1.0.0                   │  │  (可从package.json读取)
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │     🏠 返回首页                 │  │  返回按钮 (品牌橙)
│  └────────────────────────────────┘  │
│                                      │
├──────────────────────────────────────┤
│        MobileNav (64px)              │
└──────────────────────────────────────┘
```

### 8.3 布局 (desktop >= 1024px)

```
┌──────────────────────────────────────────────────────────────┐
│                     Header (64px)                             │
│   ← 返回    关于快乐拼音                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                  ┌──────────────┐                            │
│                  │   🐼 拼拼    │   关于快乐拼音               │
│                  │   (140px)   │                            │
│                  └──────────────┘                            │
│                                                              │
│  ┌──────────────────────┐ ┌──────────────────────────────┐  │
│  │ 📖 我们的故事         │ │ 🏢 组织信息                  │  │
│  │                      │ │                              │  │
│  │ 快乐拼音是一个特别的   │ │ i·Space 爱思培斯             │  │
│  │ 六一儿童节礼物...     │ │ www.ispace.top              │  │
│  │                      │ │ © 2026 i·Space.             │  │
│  └──────────────────────┘ └──────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 🛠 技术栈 · 版本 1.0.0                               │   │
│  │ Vue 3 + TypeScript + Vite · Web Speech API           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│              ┌──────────────────────┐                        │
│              │    🏠 返回首页        │                        │
│              └──────────────────────┘                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 8.4 组件规格

**AboutPage.vue** — 完整独立页面：

```css
.about-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-6);
  padding-top: var(--space-8);
}

.about-hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
}

.about-title {
  font-size: var(--font-size-2xl);          /* 32px mobile */
  font-weight: 700;
  color: var(--color-brand-orange);
}

.about-card {
  width: 100%;
  max-width: 560px;
  padding: var(--space-6);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.about-card-title {
  font-size: var(--font-size-lg);           /* 20px */
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.about-card p {
  font-size: var(--font-size-base);         /* 14px */
  color: var(--color-text-secondary);
  line-height: 1.8;
}

.about-link {
  color: var(--color-brand-orange);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
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
  margin-bottom: var(--space-4);
  box-shadow: var(--shadow-card);
}

.about-back-btn:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-elevated);
}

/* 桌面端双栏布局 */
@media (min-width: 1024px) {
  .about-cards-row {
    display: flex;
    gap: var(--space-6);
    max-width: 900px;
  }

  .about-cards-row .about-card {
    flex: 1;
  }
}
```

### 8.5 路由注册

```typescript
// src/router/index.ts 中新增
{
  path: '/about',
  name: 'about',
  component: () => import('@/pages/AboutPage.vue'),
}
```

### 8.6 入口点

在 AppFooter 中添加"关于我们"链接：

```html
<!-- src/components/layout/AppFooter.vue -->
<footer class="app-footer">
  <div class="footer-inner">
    <RouterLink to="/about" class="footer-link">关于快乐拼音</RouterLink>
    <span class="footer-dot">·</span>
    <span class="footer-copy">© 2026 i·Space</span>
  </div>
</footer>
```

```css
.app-footer {
  padding: var(--space-4) 0;
  text-align: center;
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-8);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.footer-link {
  color: var(--color-brand-orange);
  font-weight: 500;
  transition: opacity var(--transition-fast);
}

.footer-link:hover { opacity: 0.7; }

.footer-dot { opacity: 0.4; }

.footer-copy { opacity: 0.6; }

/* 仅在桌面端显示（移动端有MobileNav，空间有限） */
@media (max-width: 1023px) {
  .app-footer { display: none; }
}
```

**备用入口**：HomePage 底部附近也添加一个小文字链接：
```html
<RouterLink to="/about" class="about-subtle-link">关于快乐拼音</RouterLink>
```

### 8.7 实现变更清单

| 操作 | 说明 |
|------|------|
| 新建 `src/pages/AboutPage.vue` | 关于页完整组件 |
| 新建 `src/components/layout/AppFooter.vue` | 全局页脚（桌面端） |
| 修改 `src/router/index.ts` | 新增 `/about` 路由 |
| 修改 `src/App.vue` | 在 `<RouterView />` 后添加 `<AppFooter />` |
| 修改 `HomePage.vue` | 底部新增"关于快乐拼音"小链接 |

---

## 9. Header/Logo 精细化用法

### 9.1 设计目标

- **HomePage**: Logo更大、更突出，Header使用品牌色背景
- **子页面**: Header紧凑，白色背景
- **"快乐拼音"品牌文字始终可见**
- AudioToggle嵌入Header

### 9.2 Header 双模式

通过 `route.name` 检测当前页面，在 HomePage 应用特殊样式：

```html
<!-- AppHeader.vue -->
<header class="app-header" :class="{ 'is-home': isHomePage }">
  <!-- 内容不变 -->
</header>
```

```typescript
const route = useRoute()
const isHomePage = computed(() => route.name === 'home')
```

```css
/* 默认子页面Header — 紧凑白色 */
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  height: var(--header-height);
}

/* HomePage Header — 品牌色背景 + 更大Logo */
.app-header.is-home {
  background: linear-gradient(135deg, #FFF3E9 0%, #FFFFFF 100%);
  border-bottom: 2px solid var(--color-brand-orange-light);
}

.app-header.is-home .logo-icon {
  width: 36px;
  height: 36px;
}

.app-header.is-home .logo-text {
  font-size: var(--font-size-xl);           /* 24px */
}

/* 默认子页面Logo */
.logo-icon {
  width: 28px;
  height: 28px;
}

.logo-text {
  font-size: var(--font-size-lg);           /* 20px */
  font-weight: 700;
  color: var(--color-brand-orange);
}
```

### 9.3 桌面端 Header 微调

```css
@media (min-width: 1024px) {
  .app-header {
    height: var(--header-height);            /* 64px */
  }

  .app-header.is-home .logo-icon {
    width: 44px;
    height: 44px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo-text {
    font-size: var(--font-size-xl);
  }
}
```

### 9.4 实现变更清单

| 操作 | 说明 |
|------|------|
| 修改 `src/components/layout/AppHeader.vue` | 新增 `is-home` 条件样式 + AudioToggle |
| 其余组件无需修改 | Logo使用方式不变 |

---

## 10. 实现优先级与依赖

### 10.1 推荐实现顺序

```
Phase 1 (基础 — 无依赖冲突):
  ├── 7. Global Audio Toggle          ← useAudioMode composable
  ├── 9. Header/Logo 双模式           ← 仅CSS变更
  └── 2. 响应式策略 (CSS变量新增)      ← variables.css

Phase 2 (独立页面 — 可并行):
  ├── 3. HomePage 重设计              ← 依赖 Phase1 (AudioToggle在Header)
  ├── 8. About Page                   ← 完全独立
  └── 6. Result Character Card        ← 依赖 PinyinCard.vue 修改

Phase 3 (复杂页面 — 依赖 Phase 1+2):
  ├── 4. BrowserPage 重设计           ← 依赖 PinyinCard (无变更)
  └── 5. BuilderPage 重设计           ← 依赖 BuilderStepper + ResultCard
```

### 10.2 关键依赖关系

```
useAudioMode         ← 无依赖
  ├── AppHeader      ← 依赖 useAudioMode
  └── BuilderPage    ← 依赖 useAudioMode

PinyinCard (variant="result")  ← 无外部依赖
  └── BuilderPage    ← 依赖 PinyinCard result模式

BuilderStepper (vertical属性)  ← 无外部依赖
  └── BuilderPage    ← 依赖 BuilderStepper vertical

Router (/about)       ← 无依赖
  ├── AboutPage      ← 依赖 Router
  └── AppFooter      ← 依赖 Router
```

### 10.3 风险评估

| 风险 | 等级 | 缓解措施 |
|------|------|----------|
| PinyinCard result模式破坏现有browse/select模式 | 低 | 使用v-if/variant隔离，三种模式独立CSS |
| AudioToggle在移动端占用Header空间过大 | 低 | 移动端仅显示emoji图标，不显示文字标签 |
| 桌面端BuilderPage侧边Stepper布局溢出 | 中 | 使用CSS Grid + minmax限制stepper最小宽度 |
| localStorage写入失败（隐私模式） | 低 | try-catch包装，失败时回退到默认值 |

---

## 附录A: 全部新增/修改CSS变量汇总

```css
/* 追加到 src/styles/variables.css 末尾 */

/* === 内容容器（响应式） === */
--container-padding: var(--space-4);
--container-max-width: none;

@media (min-width: 640px) {
  --container-padding: var(--space-6);
  --container-max-width: 720px;
}

@media (min-width: 1024px) {
  --container-padding: var(--space-8);
  --container-max-width: 960px;
}

/* === 音频开关 === */
--audio-toggle-size: 36px;
--audio-toggle-bg: #FFF3E9;

/* === 结果卡片 === */
--result-card-min-width: 280px;
--result-card-max-width: 420px;
```

---

## 附录B: 文件变更总览

| 文件 | 操作 | 变更量估计 |
|------|------|-----------|
| `src/composables/useAudioMode.ts` | **新建** | ~35行 |
| `src/pages/AboutPage.vue` | **新建** | ~180行 |
| `src/components/layout/AppFooter.vue` | **新建** | ~50行 |
| `src/styles/variables.css` | 修改 | +15行 |
| `src/router/index.ts` | 修改 | +6行 |
| `src/App.vue` | 修改 | +2行 |
| `src/pages/HomePage.vue` | 重写 | ~220行 |
| `src/pages/BrowserPage.vue` | 重写 | ~180行 |
| `src/pages/BuilderPage.vue` | 修改 | ~80行变更 |
| `src/components/layout/AppHeader.vue` | 修改 | ~70行变更 |
| `src/components/layout/MobileNav.vue` | 修改 | ~5行变更 |
| `src/components/common/PandaMascot.vue` | 修改 | ~40行变更 |
| `src/components/common/PinyinCard.vue` | 修改 | ~60行变更 |
| `src/components/builder/BuilderStepper.vue` | 修改 | ~50行变更 |
| **总估计** | | **~1000行 (含新建)** |

---

*文档结束。本规范制定于 2026-06-05，作为 HappyPinYin v2.0 UI 重设计的实施依据。*
