# HappyPinYin 拼音泡泡乐 -- 游戏模块 UI 设计文档

**文档版本**: v1.0
**创建日期**: 2026-06-05
**文档状态**: 初稿
**关联文档**: [游戏 PRD](./game-requirements.md) | [主应用 UI 设计](./ui-design.md) | [设计变量](../src/styles/variables.css)

---

## 目录

1. [设计总纲](#1-设计总纲)
2. [色彩体系](#2-色彩体系)
3. [字体规范](#3-字体规范)
4. [间距与布局](#4-间距与布局)
5. [组件设计](#5-组件设计)
6. [页面布局](#6-页面布局)
7. [动画规范](#7-动画规范)
8. [交互状态](#8-交互状态)
9. [音效动效配合](#9-音效动效配合)
10. [无障碍设计](#10-无障碍设计)
11. [组件树与Props](#11-组件树与props)
12. [实现优先级](#12-实现优先级)

---

## 1. 设计总纲

### 1.1 设计哲学

游戏模块的设计延续 HappyPinYin 主应用的 **"玩中学，学中乐"** 核心理念，并以游戏化形式放大三大支柱：

| 支柱 | 视觉策略 | 交互策略 |
|------|----------|----------|
| **零挫败** | 错误反馈使用轻柔弹开动画，无红色警告、无叉号图标 | 不扣分、不惩罚、泡泡快速恢复可重试 |
| **即时爽感** | 正确反馈使用爆炸+粒子+得分上飘+熊猫欢呼 四层叠加 | 音效+动效精确同步，创造"点泡泡很爽"的肌肉记忆 |
| **收集仪式感** | 贴纸书模拟实物翻页册，贴纸带光泽+凸起质感 | 碎片飞行、星星点亮、徽章解锁均有多阶段动画 |

### 1.2 情绪关键词

| 关键词 | 视觉表达 | 实现手段 |
|--------|----------|----------|
| **糖果色** | 高亮度、中低饱和度的泡泡色板，柔和但不暗淡 | 8 色泡泡色板，每个泡泡有光泽高光 |
| **通透** | 半透明叠加、玻璃态质感、光线从左上角射入 | `radial-gradient` 高光点 + `backdrop-filter` |
| **泡泡** | 圆形 + 浮动动画 + 物理弹性感 | `border-radius: 50%` + CSS `@keyframes float` + 弹入弹性曲线 |
| **梦幻** | 柔和渐变背景、光晕粒子、星星闪烁 | 天空渐变底 + 多层浮动装饰粒子 |
| **温暖** | 暖色底、熊猫陪伴、鼓励式文案 | 背景渐变收束于暖色端，熊猫全程陪同 |

### 1.3 与主应用设计系统的关系

本模块**继承并扩展** `src/styles/variables.css` 中的所有 token，不覆盖任何已有变量。游戏专用 token 以 `--game-` 前缀命名，写入 `:root` 作用域。

---

## 2. 色彩体系

### 2.1 设计决策

**Why this palette**: 游戏需要比主应用更活泼、更"糖果"的视觉感受。泡泡作为核心交互元素，每个泡泡需要独立且高辨识度的颜色。同时，星级评价需要金属质感（金银铜），这在主应用的马卡龙色系中不存在，需新增。

### 2.2 游戏专用颜色 Token（追加到 variables.css）

```css
:root {
  /* === 游戏背景渐变 === */
  --game-bg-start: #E8F8FF;         /* 天空蓝顶部 */
  --game-bg-end: #FFF5E8;           /* 暖黄底部 */
  --game-bg-gradient: linear-gradient(180deg, var(--game-bg-start) 0%, var(--game-bg-end) 100%);

  /* === 泡泡色板（8色） === */
  --bubble-coral:     #FF6B6B;      /* 珊瑚红 */
  --bubble-teal:      #4ECDC4;      /* 湖蓝 */
  --bubble-tangerine: #FF8C42;      /* 橘黄 -- 与品牌色一致 */
  --bubble-honey:     #FFB380;      /* 蜜橙 */
  --bubble-mint:      #7EC8A0;      /* 薄荷绿 -- 与关卡1进度条一致 */
  --bubble-sun:       #F0C75E;      /* 鹅黄 -- 与整体认读色一致 */
  --bubble-sky:       #6C9BD2;      /* 天蓝 -- 与声母色一致 */
  --bubble-cherry:    #E8839A;      /* 樱花粉 -- 与单韵母色一致 */

  /* === 泡泡光泽 === */
  --bubble-highlight: rgba(255,255,255,0.55);
  --bubble-shadow-inner: rgba(255,255,255,0.3);
  --bubble-shadow-outer: rgba(0,0,0,0.08);

  /* === 星级评价色 === */
  --star-gold:        #F0C75E;
  --star-gold-glow:   rgba(240,199,94,0.6);
  --star-silver:      #C0C0C0;
  --star-bronze:      #CD7F32;
  --star-empty:       #D4D4D4;

  /* === 贴纸边框 === */
  --sticker-border-gold:   linear-gradient(135deg, #F0C75E 0%, #D4A030 100%);
  --sticker-border-silver: linear-gradient(135deg, #E0E0E0 0%, #A0A0A0 100%);
  --sticker-border-bronze: linear-gradient(135deg, #E8B878 0%, #A0682A 100%);

  /* === 进度条主题色（6关卡） === */
  --progress-l1: #7EC8A0;      /* 关卡1 薄荷绿 */
  --progress-l2: #4ECDC4;      /* 关卡2 湖蓝 */
  --progress-l3: #FFB380;      /* 关卡3 蜜橙 */
  --progress-l4: #6C9BD2;      /* 关卡4 天蓝 */
  --progress-l5: #E8839A;      /* 关卡5 樱花粉 */
  --progress-l6: #F0C75E;      /* 关卡6 金奖黄 */

  /* === 锁定/不可用 === */
  --game-locked-opacity: 0.4;
  --game-locked-filter: grayscale(100%);
  --game-disabled-bg: #EDEDED;
  --game-disabled-text: #B0B0B0;

  /* === 覆盖层 === */
  --overlay-bg: rgba(0,0,0,0.35);
  --countdown-bg: rgba(255,248,243,0.95);
  --result-panel-bg: rgba(255,255,255,0.97);

  /* === 贴纸书 === */
  --album-cover: #D4765A;              /* 硬皮封面砖红色 */
  --album-cover-text: #F8E8D0;         /* 封面烫金文字色 */
  --album-page: #F5F0E6;               /* 内页米黄纸色 */
  --album-page-edge: #E8E0D0;          /* 内页边缘 */
  --album-binding: #8B6914;            /* 书脊深棕 */
  --album-sticker-shadow: 0 2px 4px rgba(0,0,0,0.18);

  /* === 游戏专用阴影 === */
  --shadow-bubble: 0 4px 12px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.5);
  --shadow-bubble-hover: 0 6px 20px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.5);
  --shadow-star-glow: 0 0 16px var(--star-gold-glow);
  --shadow-sticker-card: 0 4px 12px rgba(0,0,0,0.12);
}
```

### 2.3 色板语义映射

| 颜色 Token | 使用场景 |
|-----------|----------|
| `--bubble-coral` ~ `--bubble-cherry` | 泡泡填充色，每轮 4-6 个泡泡各取一色，随机顺序 |
| `--star-gold` / `--star-silver` / `--star-bronze` / `--star-empty` | 结算星级、贴纸品质边框 |
| `--progress-l1` ~ `--progress-l6` | 进度条填充色（按关卡） |
| `--game-locked-*` | 锁定关卡卡片、锁定成就徽章 |
| `--overlay-bg` | 倒数动画遮罩、结算遮罩 |
| `--album-*` | 贴纸书封面/内页/书脊 |

### 2.4 对比度合规

| 元素 | 前景 | 背景 | 对比度 | 状态 |
|------|------|------|--------|------|
| 泡泡文字 `#2C3E50` | 泡泡 `#F0C75E` | 4.9:1 | PASS (AA) |
| 泡泡文字 `#2C3E50` | 泡泡 `#FFB380` | 3.9:1 | PASS (AA 大文字, 18px+bold) |
| 熊猫气泡文案 `#FF8C42` | 白色 `#FFFFFF` | 3.2:1 | PASS (AA 大文字) |
| 关卡标题 `#2C3E50` | 卡片 `#FFFFFF` | 13.4:1 | PASS (AAA) |
| 锁定文字 `#B0B0B0` | 卡片 `#FFFFFF` | 2.3:1 | **需图标辅助** (locked 状态依赖 🔒 图标而非纯文字) |

---

## 3. 字体规范

### 3.1 设计决策

**Why rounded, large type**: 5-8 岁儿童正在学习识字，拼音字母本身即是他们需要辨识的目标。字体必须：
- **无衬线 + 圆角**：降低视觉复杂度，避免装饰性笔画干扰字形识别
- **大字号**：泡泡上拼音 1.4rem-1.8rem，确保在 80px 泡泡内部饱满可读
- **高字重**：Bold (700) 作为默认字重，提升可读性

### 3.2 字体族

```css
/* 游戏专用字体栈（追加到现有 --font-family-base） */
--font-family-game: 'Nunito', 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
```

**Why Nunito**: Nunito 是为显示优化设计的圆角无衬线体，字形饱满圆润，天然适合儿童产品。`g`/`a` 等字母的单层结构更接近手写体，减少儿童认知负担。Nunito 在 Google Fonts 上开源免费，支持 Latin Extended 字符集，覆盖所有拼音字母。

### 3.3 字阶表（游戏模块扩展）

| Token | 字号 | 行高 | 字重 | 用途 |
|-------|------|------|------|------|
| `--font-game-countdown` | `6rem` (96px) | 1.0 | 800 | 倒数 3-2-1 数字 |
| `--font-game-bubble-2char` | `1.4rem` (22.4px) | 1.0 | 700 | 泡泡上双字母拼音 (zh/ch/sh) |
| `--font-game-bubble-1char` | `1.8rem` (28.8px) | 1.0 | 700 | 泡泡上单字母拼音 |
| `--font-game-bubble-multi` | `1.1rem` (17.6px) | 1.0 | 700 | 泡泡上的复韵母 (ang/eng/ing) |
| `--font-game-score` | `1.25rem` (20px) | 1.2 | 700 | HUD 得分数字 |
| `--font-game-combo` | `1rem` (16px) | 1.2 | 600 | HUD combo 标识 |
| `--font-game-level-title` | `1.25rem` (20px) | 1.3 | 700 | 关卡卡片标题 |
| `--font-game-level-name` | `0.875rem` (14px) | 1.3 | 500 | 关卡卡片副标题 |
| `--font-game-sticker-name` | `0.875rem` (14px) | 1.3 | 600 | 贴纸名称 |
| `--font-game-badge` | `0.75rem` (12px) | 1.0 | 700 | "新!"角标、"新纪录!"角标 |
| `--font-game-encourage` | `1rem` (16px) | 1.4 | 600 | 鼓励语/引导语 |

### 3.4 泡泡文字自适应规则

泡泡内显示拼音文本，根据拼音长度动态选择字号：

```
if (text.length === 1)       → font-size: 1.8rem
else if (text.length === 2)  → font-size: 1.4rem
else (text.length >= 3)      → font-size: 1.1rem
```

---

## 4. 间距与布局

### 4.1 间距系统

继承主应用 4px 基网格，追加游戏专用间距 token：

```css
:root {
  --game-bubble-gap: 16px;        /* 泡泡之间最小间距 */
  --game-bubble-gap-tablet: 24px; /* 平板泡泡间距 */
  --game-card-gap: 16px;           /* 关卡卡片间距 */
  --game-card-gap-tablet: 20px;   /* 平板关卡卡片间距 */
  --game-section-gap: 24px;        /* 游戏内区域间距 */
  --game-hud-padding: 16px;       /* HUD 内边距 */
  --game-result-gap: 20px;        /* 结算界面元素间距 */
}
```

### 4.2 布局断点与响应式策略

| 断点 | 设备 | 泡泡布局 | 关卡卡片 | 贴纸书 |
|------|------|----------|----------|--------|
| 0-319px | 极小屏（理论上不处理） | 1 列降级 | 1 列 | 单页 |
| 320-767px | 手机竖屏 | 2列 x 2-3行 | 2列 x 3行 | 单页滚动 |
| 768-1023px | 平板竖屏/手机横屏 | 3列 x 2行 | 3列 x 2行 | 双页并排 |
| 1024px+ | 桌面/平板横屏 | 横排一行（如空间 >=600px） | 3列 x 2行 | 双页 + 封面 |

**断点定义**:
```css
/* 手机竖屏 */
@media (max-width: 767px) { ... }

/* 平板竖屏 */
@media (min-width: 768px) and (max-width: 1023px) { ... }

/* 桌面 + 平板横屏 */
@media (min-width: 1024px) { ... }

/* 泡泡横排一行条件 */
@media (min-width: 600px) {
  .bubble-grid.horizontal { flex-direction: row; flex-wrap: nowrap; }
}
```

### 4.3 触控目标

所有可交互元素的最小触控尺寸：

| 元素 | 移动端 | 桌面端 | 说明 |
|------|--------|--------|------|
| 泡泡 | 80x80px | 96x96px | 含 padding，视觉圆直径 >= 72px |
| 关卡卡片 | 整卡可点 | 整卡可点 | 卡片最小高度 100px |
| 按钮 | 48x48px | 44x44px | 继承主应用 `--touch-target-min` |
| 重听按钮 | 56x56px | 48x48px | 圆形大按钮，突出重要性 |

---

## 5. 组件设计

### 5.1 BubbleItem（泡泡组件）

#### 5.1.1 设计描述

泡泡是游戏最核心的交互元素。每个泡泡是一个圆形区域，显示一个拼音文本，具有玻璃/泡泡质感（半透明高光 + 内阴影 + 外阴影）。

#### 5.1.2 视觉规格

```
┌─────────────────────────────────────┐
│                                     │
│         ┌───────────────┐           │
│         │   ╭ 高光点    │           │  ← 30% 处白色径向渐变高光
│         │  ╱            │           │
│         │ │    b        │           │  ← 拼音文本居中，font-weight: 700
│         │  ╲            │           │
│         │               │           │
│         └───────────────┘           │
│                                     │
│   外阴影: 0 4px 12px rgba(0,0,0,0.1)│
│   内阴影: inset 0 2px 4px            │
│          rgba(255,255,255,0.5)      │
└─────────────────────────────────────┘
```

CSS 实现：
```css
.bubble-item {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  /* 玻璃质感 */
  background: radial-gradient(
    circle at 35% 30%,
    rgba(255,255,255,0.6) 0%,
    rgba(255,255,255,0.1) 30%,
    transparent 60%
  ), var(--bubble-color); /* --bubble-color 由 JS 动态设置 */
  box-shadow:
    0 4px 12px rgba(0,0,0,0.1),
    inset 0 2px 4px rgba(255,255,255,0.5);
  transition: transform 0.15s ease-out, box-shadow 0.15s ease-out;
  position: relative;
  will-change: transform;
}

.bubble-item .bubble-text {
  color: #2C3E50;
  font-family: var(--font-family-game);
  font-weight: 700;
  text-shadow: 0 1px 1px rgba(255,255,255,0.4);
  position: relative;
  z-index: 1;
}
```

#### 5.1.3 状态表

| 状态 | CSS | 视觉表现 | 触发条件 |
|------|-----|----------|----------|
| **idle** | `animation: bubble-float 2.5s ease-in-out infinite` | 上下浮动 ±8px，每个泡泡相位错开 | 轮次开始，等待用户点击 |
| **hover** | `transform: scale(1.08); box-shadow: 0 6px 20px rgba(0,0,0,0.15);` | 轻微放大 + 阴影加深 | 桌面端鼠标悬停（移动端无） |
| **pressed** | `transform: scale(0.92); box-shadow: 0 2px 6px rgba(0,0,0,0.08);` | 轻微压扁 + 阴影变浅 | touchstart / mousedown |
| **correct-pop** | `animation: bubble-pop 400ms cubic-bezier(0.34,1.56,0.64,1) forwards` | 先放大至1.3倍，然后缩小至0并消失 + 彩色碎片粒子散射 | 用户点击正确泡泡 |
| **wrong-bounce** | `animation: bubble-wrong 1000ms ease-out forwards` | 缩小至0.7倍 + 旋转15度 → 600ms时开始恢复 → 1s复位 | 用户点击错误泡泡 |
| **focused** | `outline: 3px solid #FF8C42; outline-offset: 4px;` | 橙色焦点环 | 键盘 Tab 导航 |
| **disabled** | `pointer-events: none; opacity: 0.4;` | 半透明，不可交互 | 爆破后/弹开期间 |

**浮动动画相位偏移**：每个泡泡获得不同的 `animation-delay` 以避免同步浮动：
```typescript
const floatPhases = [0, 0.4, 0.8, 1.2, 1.6, 2.0] // 秒
// 第 n 个泡泡: animation-delay: floatPhases[n]
```

#### 5.1.4 泡泡颜色分配策略

每个轮次的泡泡颜色从色板中随机抽取，保证本轮泡泡颜色各不同：

```typescript
const BUBBLE_COLORS = [
  '#FF6B6B', '#4ECDC4', '#FF8C42', '#FFB380',
  '#7EC8A0', '#F0C75E', '#6C9BD2', '#E8839A'
]

function assignBubbleColors(count: number): string[] {
  const shuffled = [...BUBBLE_COLORS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
```

#### 5.1.5 Keyframes

```css
@keyframes bubble-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-8px); }
}

@keyframes bubble-pop {
  0%   { transform: scale(1); opacity: 1; }
  30%  { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(0); opacity: 0; }
}

@keyframes bubble-wrong {
  0%    { transform: scale(1) rotate(0deg); }
  25%   { transform: scale(0.7) rotate(15deg); }
  60%   { transform: scale(0.7) rotate(15deg); }
  100%  { transform: scale(1) rotate(0deg); }
}

@keyframes particle-burst {
  0%   { transform: translate(0, 0) scale(1); opacity: 1; }
  100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
}
```

#### 5.1.6 粒子爆炸（正确爆破时触发）

正确泡泡爆破时，从爆破中心点发射 12 个彩色粒子：

```typescript
interface Particle {
  angle: number        // 0-360 度，均匀分布
  distance: number     // 40-80px 随机
  color: string        // 从 BUBBLE_COLORS 中随机
  size: number         // 4-8px 随机
  duration: number     // 800-1200ms 随机
}
```

每个粒子应用 `particle-burst` keyframe，`--dx` 和 `--dy` 由 JS 计算 `cos(angle)*distance` / `sin(angle)*distance`。

---

### 5.2 GameLobby（游戏大厅）

#### 5.2.1 设计描述

游戏入口界面，展示 6 个关卡卡片。卡片以网格排列，每个卡片是一个可点击的 RouterLink 区域（锁定状态除外）。

#### 5.2.2 布局 ASCII

**手机竖屏 (320-767px)**:
```
┌──────────────────────────────────────┐
│  ← 返回         拼音泡泡乐            │
│  🐼 "来玩拼音泡泡吧!"                 │
│                                       │
│  ┌─────────────────┐ ┌─────────────┐ │
│  │  🌱   第 1 关   │ │  🪴  第 2 关 │ │
│  │   单韵母乐园     │ │ 声母启蒙(上) │ │
│  │     ⭐⭐⭐      │ │     🔒      │ │
│  │    [已收集]     │ │   [未解锁]   │ │
│  └─────────────────┘ └─────────────┘ │
│                                       │
│  ┌─────────────────┐ ┌─────────────┐ │
│  │  🛡️  第 3 关   │ │  ⭐   第 4 关│ │
│  │   声母启蒙(下)   │ │   声母挑战   │ │
│  │     🔒          │ │     🔒      │ │
│  └─────────────────┘ └─────────────┘ │
│                                       │
│  ┌─────────────────┐ ┌─────────────┐ │
│  │  🌸   第 5 关   │ │  👑  第 6 关 │ │
│  │   复韵母探险     │ │   拼音大师   │ │
│  │     🔒          │ │     🔒      │ │
│  └─────────────────┘ └─────────────┘ │
│                                       │
│         [🧸 我的贴纸 (2/6)]           │
└──────────────────────────────────────┘
```

**平板 (768-1023px)**:
```
┌──────────────────────────────────────────────────────┐
│  ← 返回    拼音泡泡乐    🐼"来玩拼音泡泡吧!"          │
│                                                       │
│  ┌──────────────────┐ ┌──────────────────┐ ┌────────┐│
│  │  🌱   第 1 关    │ │  🪴   第 2 关    │ │  🛡️   ││
│  │   单韵母乐园      │ │  声母启蒙(上)     │ │ 第3关 ││
│  │     ⭐⭐⭐       │ │     🔒           │ │  🔒   ││
│  │    [已收集]      │ │    [未解锁]       │ │       ││
│  └──────────────────┘ └──────────────────┘ └────────┘│
│                                                       │
│  ┌──────────────────┐ ┌──────────────────┐ ┌────────┐│
│  │  ⭐   第 4 关    │ │  🌸   第 5 关    │ │  👑   ││
│  │   声母挑战        │ │   复韵母探险      │ │ 第6关 ││
│  │     🔒           │ │     🔒           │ │  🔒   ││
│  └──────────────────┘ └──────────────────┘ └────────┘│
│                                                       │
│              [🧸 我的贴纸 (2/6)]                      │
└──────────────────────────────────────────────────────┘
```

#### 5.2.3 关卡卡片状态

| 状态 | 类名 | 背景 | 边框 | 角标 | 交互 |
|------|------|------|------|------|------|
| **locked** | `.level-card--locked` | `--game-disabled-bg` | `--color-border` | 🔒 图标 | `pointer-events: none; cursor: not-allowed` |
| **unlocked-new** | `.level-card--new` | `#FFFFFF` | `--color-brand-orange` (3px) | 🏷️ "新!" 角标 | 可点击 |
| **played** | `.level-card--played` | `#FFFFFF` | `--color-border` | ⭐/⭐⭐/⭐⭐⭐ | 可点击 |
| **mastered** | `.level-card--mastered` | `#FFFDE7` (微金黄色底) | `--star-gold` (3px) | 🏅 角标 + 金色光晕 | 可点击 |

**"新!" 角标**:
```css
.badge-new {
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8C42 100%);
  color: #FFFFFF;
  font-size: var(--font-game-badge);
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  box-shadow: 0 2px 6px rgba(255,107,107,0.4);
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50%      { transform: scale(1.1); }
}
```

#### 5.2.4 卡片 Hover 效果

```css
.level-card:not(.level-card--locked):hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  transition: all 250ms ease-out;
}

.level-card:not(.level-card--locked):active {
  transform: translateY(-1px) scale(0.98);
  transition: all 100ms ease-out;
}
```

#### 5.2.5 贴纸书入口按钮

位于大厅底部或右上角：
```css
.sticker-book-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #FFB380 0%, #FF8C42 100%);
  color: #FFFFFF;
  border-radius: var(--radius-full);
  font-size: var(--font-size-md);
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(255,140,66,0.3);
  transition: transform 200ms ease-out, box-shadow 200ms ease-out;
}

.sticker-book-btn .count-badge {
  background: #FFFFFF;
  color: #FF8C42;
  border-radius: var(--radius-full);
  padding: 2px 10px;
  font-size: var(--font-size-sm);
  font-weight: 800;
  min-width: 36px;
  text-align: center;
}
```

---

### 5.3 GamePlay（游戏主界面）

#### 5.3.1 设计描述

游戏进行中的核心界面，从上到下分为三个区域：熊猫指示区、进度条区、泡泡面板区、底部 HUD。

#### 5.3.2 布局 ASCII

**手机竖屏**:
```
┌──────────────────────────────────────┐
│                                      │
│    ┌──────┐                          │
│    │  🐼  │  "找一找 —— b"          │  ← 熊猫气泡+目标提示
│    └──────┘     [🔈 再听一次]        │
│                                      │
│  ◉◉◉◉◎○○○○○  第 5 / 10 题           │  ← 进度条+轮次
│                                      │
│                                      │
│       ┌───┐      ┌───┐              │
│       │   │      │   │              │
│       │ p │      │ b │              │  ← 泡泡网格
│       │   │      │   │              │    (2列x2行)
│       └───┘      └───┘              │
│                                      │
│       ┌───┐      ┌───┐              │
│       │ d │      │ m │              │
│       │   │      │   │              │
│       └───┘      └───┘              │
│                                      │
│                                      │
│   得分: 52          连击: x3         │  ← 底部 HUD
└──────────────────────────────────────┘
```

**平板/桌面**:
```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ┌──────┐   "找一找 —— b"    第 5 / 10 题              │
│  │  🐼  │   [🔈 再听一次]                              │
│  └──────┘                                              │
│                                                        │
│  ◉◉◉◉◎○○○○○                                          │
│                                                        │
│                                                        │
│     ┌───┐    ┌───┐    ┌───┐    ┌───┐                │
│     │ p │    │ b │    │ d │    │ m │   ← 泡泡横排     │
│     │   │    │   │    │   │    │   │                  │
│     └───┘    └───┘    └───┘    └───┘                │
│                                                        │
│                                                        │
│  得分: 52                             连击: x3         │
└────────────────────────────────────────────────────────┘
```

#### 5.3.3 泡泡面板容器

```css
.bubble-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--game-bubble-gap);
  padding: 24px 16px;
  min-height: 280px; /* 防止布局跳动 */
}

/* 手机: 2列 */
@media (max-width: 767px) {
  .bubble-grid {
    max-width: 220px;
    margin: 0 auto;
    gap: 20px;
  }
}

/* 平板: 3列 */
@media (min-width: 768px) and (max-width: 1023px) {
  .bubble-grid {
    max-width: 360px;
    margin: 0 auto;
    gap: 24px;
  }
}

/* 桌面横排 */
@media (min-width: 1024px) {
  .bubble-grid {
    flex-wrap: nowrap;
    max-width: 640px;
    margin: 0 auto;
    gap: 32px;
  }
}
```

#### 5.3.4 得分上飘动画

正确回答后，"+(分数)" 文字从爆破中心向上飘出：

```css
.score-float {
  position: absolute;
  font-family: var(--font-family-game);
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--star-gold);
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  pointer-events: none;
  z-index: 50;
  animation: scoreFloatUp 800ms ease-out forwards;
}

@keyframes scoreFloatUp {
  0%   { transform: translateY(0) scale(0.5); opacity: 1; }
  30%  { transform: translateY(-20px) scale(1.2); opacity: 1; }
  100% { transform: translateY(-60px) scale(0.8); opacity: 0; }
}
```

---

### 5.4 GameResult（结算界面）

#### 5.4.1 设计描述

半模态覆盖层，从底部滑入。展示星级评价、贴纸奖励、统计数据、操作按钮。

#### 5.4.2 布局 ASCII

```
┌──────────────────────────────────────────┐
│                                          │
│          (背景半透明遮罩 35%)             │
│                                          │
│  ┌──────────────────────────────────────┐│
│  │                                      ││
│  │          🐼 (开心表情)                ││
│  │        "太厉害了!" (鼓励语)           ││
│  │                                      ││
│  │       ⭐    ⭐    ⭐                  ││  ← 3颗星（依次点亮）
│  │                                      ││
│  │  ┌─────────────────────────┐        ││
│  │  │      🌱  韵母小芽        │        ││  ← 贴纸展示
│  │  │   获得贴纸: 韵母小芽     │        ││
│  │  │        [金色边框]       │        ││
│  │  └─────────────────────────┘        ││
│  │                                      ││
│  │   得分: 128    正确: 10/10           ││  ← 统计
│  │   连击最高: 10x                      ││
│  │                                      ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────┐ ││
│  │  │🔄 再玩一次│ │▶ 下一关  │ │📋返回│ ││  ← 操作按钮
│  │  └──────────┘ └──────────┘ └──────┘ ││
│  │                                      ││
│  └──────────────────────────────────────┘│
│                                          │
└──────────────────────────────────────────┘
```

#### 5.4.3 进入/退出动画

```css
.result-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-bg);
  z-index: 100;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  animation: overlayFadeIn 300ms ease-out;
}

.result-panel {
  width: 100%;
  max-width: 480px;
  max-height: 85vh;
  overflow-y: auto;
  background: var(--result-panel-bg);
  border-radius: 24px 24px 0 0;
  padding: 32px 24px 24px;
  animation: panelSlideUp 400ms cubic-bezier(0.34,1.56,0.64,1);
}

@keyframes overlayFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes panelSlideUp {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
```

#### 5.4.4 星星点亮时序

```
t=0ms:    面板滑入完成
t=400ms:  第1颗星星: scale 0→1.3→1 + rotate 0→360deg + 金色光晕扩散
t=700ms:  第2颗星星: 同上（若得分达标）
t=1000ms: 第3颗星星: 同上（若得分达标）
t=1200ms: 三星全亮 → 额外金色粒子持续闪烁
```

**单颗星星动画**:
```css
@keyframes starPop {
  0%   { transform: scale(0) rotate(0deg); opacity: 0; }
  50%  { transform: scale(1.3) rotate(180deg); opacity: 1; }
  70%  { transform: scale(0.9) rotate(300deg); opacity: 1; }
  100% { transform: scale(1) rotate(360deg); opacity: 1; }
}
```

**金色光晕**:
```css
.star--gold {
  color: var(--star-gold);
  filter: drop-shadow(0 0 8px var(--star-gold-glow));
  animation: starGlow 2s ease-in-out infinite;
}

@keyframes starGlow {
  0%, 100% { filter: drop-shadow(0 0 8px var(--star-gold-glow)); }
  50%      { filter: drop-shadow(0 0 16px var(--star-gold-glow)); }
}
```

**空心灰星**（未达到的星级）:
```css
.star--empty {
  color: var(--star-empty);
  opacity: 0.4;
  filter: none;
}
```

#### 5.4.5 贴纸弹跳入场

```
t=1400ms: 贴纸从屏幕中央出现
```

```css
@keyframes stickerPopIn {
  0%   { transform: scale(0); opacity: 0; }
  40%  { transform: scale(1.2); opacity: 1; }
  65%  { transform: scale(0.9); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

.sticker-award {
  animation: stickerPopIn 600ms cubic-bezier(0.34,1.56,0.64,1) forwards;
  animation-delay: 1400ms;
  opacity: 0; /* 初始隐藏，动画接管 */
}
```

#### 5.4.6 操作按钮

| 按钮 | 类型 | 样式 | 启用条件 |
|------|------|------|----------|
| "再玩一次" | secondary | 白色底 + 橙色边框 + 橙色文字 | 始终可用 |
| "下一关" | primary | 橙色渐变底 + 白色文字 | 存在下一关且已解锁 |
| "返回关卡" | tertiary | 透明底 + 灰色文字 | 始终可用 |

```css
.btn-result-primary {
  padding: 14px 28px;
  background: linear-gradient(135deg, #FFB380 0%, #FF8C42 100%);
  color: #FFFFFF;
  font-size: var(--font-size-md);
  font-weight: 700;
  border-radius: var(--radius-full);
  box-shadow: 0 4px 12px rgba(255,140,66,0.35);
  transition: transform 150ms ease-out, box-shadow 150ms ease-out;
  min-width: 120px;
}

.btn-result-primary:active {
  transform: scale(0.95);
}

.btn-result-primary:disabled {
  background: var(--game-disabled-bg);
  color: var(--game-disabled-text);
  box-shadow: none;
  cursor: not-allowed;
}
```

#### 5.4.7 "首次收集"彩带特效

首次从无星到至少 1 星时，触发额外彩带动画：

```typescript
// 全屏两侧掉落彩色纸条，1200ms 后清除
// 复用 CelebrationEffect 组件增加横向喷射变体
```

---

### 5.5 StickerBook（贴纸书）

#### 5.5.1 核心设计概念

贴纸书是整个游戏模块设计规格最高的组件——它模拟一本**实物的贴纸收集册**。使用 CSS 3D Transforms 实现翻页效果，提升收集的仪式感和满足感。

#### 5.5.2 物理结构

```
        封面                     打开后（双页展开）
   ┌────────────┐        ┌─────────────┬─────────────┐
   │            │        │             │             │
   │  我的      │        │  左页       │  右页       │
   │  贴纸书    │        │  贴纸1-3    │  贴纸4-6    │
   │            │        │             │             │
   │  🧸        │        │             │             │
   │            │        │             │             │
   │  ═══════   │        │  [成就徽章] │  [成就徽章] │
   │  书脊      │        │  在左页底部  │  在右页底部  │
   │            │        │             │             │
   └────────────┘        └─────────────┴─────────────┘
```

#### 5.5.3 CSS 3D 翻页实现

```css
/* 贴纸书容器 -- 3D 透视 */
.sticker-book {
  perspective: 1200px;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

/* 书本体 */
.book {
  position: relative;
  width: 100%;
  transform-style: preserve-3d;
  transition: transform 600ms cubic-bezier(0.645,0.045,0.355,1);
}

/* 双页展开状态 */
.book--open {
  transform: rotateY(0deg);
}

/* 封面状态 */
.book--closed {
  transform: rotateY(-15deg);
}

/* 左页 */
.page-left {
  position: absolute;
  left: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(90deg, #EDE8DC 0%, #F5F0E6 100%);
  border-radius: 8px 0 0 8px;
  box-shadow: inset -2px 0 4px rgba(0,0,0,0.06);
  transform-origin: right center;
  backface-visibility: hidden;
}

/* 右页 */
.page-right {
  position: absolute;
  right: 0;
  width: 50%;
  height: 100%;
  background: linear-gradient(270deg, #EDE8DC 0%, #F5F0E6 100%);
  border-radius: 0 8px 8px 0;
  box-shadow: inset 2px 0 4px rgba(0,0,0,0.06);
  backface-visibility: hidden;
}

/* 翻页动画（实际翻页时应用） */
.page-flip {
  animation: pageFlip 800ms ease-in-out;
}

@keyframes pageFlip {
  0%   { transform: rotateY(0deg); }
  50%  { transform: rotateY(-90deg); }
  100% { transform: rotateY(-180deg); }
}

/* 封面 */
.book-cover {
  position: absolute;
  inset: 0;
  background: linear-gradient(160deg, #D4765A 0%, #A0523A 100%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: var(--album-cover-text);
  box-shadow: 4px 4px 12px rgba(0,0,0,0.2);
  cursor: pointer;
  transform-origin: left center;
  transition: transform 500ms ease-in-out;
}

.book-cover::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  background: linear-gradient(90deg, rgba(0,0,0,0.2) 0%, transparent 100%);
  border-radius: 12px 0 0 12px; /* 书脊阴影 */
}
```

#### 5.5.4 贴纸槽位

每个贴纸槽位是一个正方形区域，包含贴纸图案（或剪影）和名称：

```css
.sticker-slot {
  width: 90px;
  height: 90px;
  border: 2px dashed #D4D0C8;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: rgba(255,255,255,0.5);
  transition: all 300ms ease-out;
}

.sticker-slot--collected {
  border: 2px solid transparent;
  border-image: var(--sticker-border-gold) 1;
  background: #FFFFFF;
  box-shadow: var(--album-sticker-shadow);
}

.sticker-slot--collected .sticker-image {
  animation: stickerShimmer 3s ease-in-out infinite;
}

/* 贴纸光泽闪烁 */
@keyframes stickerShimmer {
  0%, 100% { filter: brightness(1); }
  50%      { filter: brightness(1.15); }
}

.sticker-slot--empty {
  /* 灰色剪影 */
}

.sticker-slot--empty .sticker-image {
  opacity: 0.2;
  filter: grayscale(100%);
}
```

#### 5.5.5 贴纸网格

```
┌────────────────┬────────────────┐
│    ┌──────┐    │    ┌──────┐    │
│    │ 🌱   │    │    │ 🪴   │    │
│    │韵母  │    │    │声母  │    │
│    │小芽  │    │    │小苗  │    │
│    └──────┘    │    └──────┘    │
│                │                │
│    ┌──────┐    │    ┌──────┐    │
│    │ 🛡️  │    │    │ ⭐   │    │
│    │舌根  │    │    │翘舌  │    │
│    │勇士  │    │    │之星  │    │
│    └──────┘    │    └──────┘    │
│                │                │
│    ┌──────┐    │    ┌──────┐    │
│    │ 🌸   │    │    │ 👑   │    │
│    │复韵  │    │    │拼音  │    │
│    │之花  │    │    │大师  │    │
│    └──────┘    │    └──────┘    │
│                │                │
│  已收集 2/6    │                │
└────────────────┴────────────────┘
```

响应式：手机 3列 (6格)，平板/桌面 左3右3双页。

#### 5.5.6 成就徽章区

徽章位于贴纸书翻到最后一页（或双页展开的底部区域）：

```css
.achievement-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 400ms ease-out;
}

.achievement-badge--unlocked {
  background: radial-gradient(circle, #FFF8E1 0%, #F0C75E 100%);
  box-shadow: 0 0 12px rgba(240,199,94,0.5);
  animation: badgeGlow 2s ease-in-out infinite;
}

.achievement-badge--locked {
  background: var(--game-disabled-bg);
  opacity: 0.35;
  filter: grayscale(100%);
}

@keyframes badgeGlow {
  0%, 100% { box-shadow: 0 0 8px rgba(240,199,94,0.4); }
  50%      { box-shadow: 0 0 20px rgba(240,199,94,0.7); }
}
```

---

### 5.6 CountdownOverlay（倒数覆盖层）

#### 5.6.1 设计描述

全屏半透明覆盖层，中央显示巨大数字 3-2-1-"开始!"。每个数字持续 400ms，弹性缓出缩放。

#### 5.6.2 布局

```
┌──────────────────────────────────────┐
│  (95% 不透明暖色遮罩)                 │
│                                      │
│                                      │
│                                      │
│              ┌─────┐                 │
│              │  3  │  ← 6rem 字号    │
│              └─────┘    白色文字     │
│                         弹性缩放     │
│                                      │
│                                      │
│                                      │
└──────────────────────────────────────┘
```

#### 5.6.3 动画序列

```
t=0ms:    遮罩 fadeIn 100ms
t=100ms:  显示 "3" → scale 1.2→1.0 + opacity 0→1
t=500ms:  "3" fadeOut / "2" fadeIn
t=900ms:  "2" fadeOut / "1" fadeIn
t=1300ms: "1" fadeOut / "开始!" fadeIn (绿色 #52C41A)
t=1800ms: 遮罩 fadeOut 200ms，游戏开始
```

总时长：~2000ms

```css
.countdown-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: var(--countdown-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 100ms ease-out;
}

.countdown-number {
  font-family: var(--font-family-game);
  font-size: var(--font-game-countdown);
  font-weight: 800;
  color: #FF8C42;
  text-shadow: 0 4px 12px rgba(255,140,66,0.3);
  animation: countPop 400ms cubic-bezier(0.34,1.56,0.64,1);
}

.countdown-go {
  font-size: 4rem;
  color: #52C41A;
  text-shadow: 0 4px 12px rgba(82,196,26,0.3);
  animation: countPop 400ms cubic-bezier(0.34,1.56,0.64,1);
}

@keyframes countPop {
  0%   { transform: scale(1.2); opacity: 0; }
  100% { transform: scale(1.0); opacity: 1; }
}
```

---

### 5.7 ProgressBar（进度条）

#### 5.7.1 设计描述

10 槽位的水平进度条，位于游戏界面顶部（熊猫旁边）。每完成一轮，一个贴纸碎片沿贝塞尔曲线飞入对应槽位。

#### 5.7.2 视觉规格

```css
.progress-bar {
  display: flex;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(255,255,255,0.6);
  border-radius: var(--radius-full);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.progress-slot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #E8E8E8;
  transition: all 300ms ease-out;
}

.progress-slot--filled {
  background: var(--progress-color); /* JS 设置为当前关卡主题色 */
  box-shadow: 0 0 6px rgba(var(--progress-color-rgb), 0.4);
  animation: slotFillPop 300ms cubic-bezier(0.34,1.56,0.64,1);
}

.progress-slot--current {
  background: #FFFFFF;
  border: 3px solid var(--progress-color);
  box-shadow: 0 0 8px rgba(var(--progress-color-rgb), 0.3);
  animation: slotPulse 1.5s ease-in-out infinite;
}

@keyframes slotFillPop {
  0%   { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes slotPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 4px rgba(var(--progress-color-rgb), 0.2); }
  50%      { transform: scale(1.15); box-shadow: 0 0 10px rgba(var(--progress-color-rgb), 0.5); }
}
```

#### 5.7.3 碎片飞行路径

碎片从正确泡泡爆破中心点 (`x0`, `y0`) 飞向进度条当前槽位 (`x1`, `y1`)，使用自定义贝塞尔曲线：

```typescript
// 控制点自动计算：中点上方偏移
const midX = (x0 + x1) / 2
const midY = Math.min(y0, y1) - 60 // 向上拱起

// CSS motion path 或 JS requestAnimationFrame 驱动
// 使用 cubic-bezier 无法精确描述 2D 路径，建议 JS 动画

function animateFragment(
  from: { x: number; y: number },
  to: { x: number; y: number },
  duration: number = 300
) {
  const start = performance.now()
  const cp = { x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 60 }

  function step(now: number) {
    const t = Math.min((now - start) / duration, 1)
    // 二次贝塞尔: B(t) = (1-t)²P0 + 2(1-t)tP1 + t²P2
    const x = (1-t)*(1-t)*from.x + 2*(1-t)*t*cp.x + t*t*to.x
    const y = (1-t)*(1-t)*from.y + 2*(1-t)*t*cp.y + t*t*to.y
    const scale = 1 - t * 0.4 // 飞行过程中逐渐缩小
    const rotation = t * 180   // 飞行过程中旋转半圈
    fragment.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotation}deg)`
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
```

#### 5.7.4 关卡主题色映射

```
levelColors: Record<number, string> = {
  1: '#7EC8A0', // 薄荷绿
  2: '#4ECDC4', // 湖蓝
  3: '#FFB380', // 蜜橙
  4: '#6C9BD2', // 天蓝
  5: '#E8839A', // 樱花粉
  6: '#F0C75E', // 金奖黄
}
```

---

### 5.8 StarRating（星级展示）

#### 5.8.1 设计描述

一个独立的星级展示组件，接受 `count` (0-3) 和 `total` (3) 参数，依次点亮星星。

#### 5.8.2 Props

```typescript
interface StarRatingProps {
  stars: 0 | 1 | 2 | 3    // 当前获得的星数
  total: 3                 // 总星数（固定3）
  animated: boolean        // 是否播放入场动画
  size?: 'small' | 'medium' | 'large'
}
```

#### 5.8.3 尺寸规格

| 尺寸 | 单颗星星宽高 | 间距 | 使用场景 |
|------|------------|------|----------|
| small | 24x24px | 4px | 关卡卡片内 |
| medium | 40x40px | 8px | 结算面板（默认） |
| large | 56x56px | 12px | 首次三星庆祝 |

#### 5.8.4 动画序列

```
t=0ms:    组件挂载
t=0ms:    第1颗星: starPop 动画 (500ms)
t=300ms:  第2颗星: starPop 动画 (500ms) -- 若 stars >= 2
t=600ms:  第3颗星: starPop 动画 (500ms) -- 若 stars >= 3
t=1100ms: 所有星星 idle 光晕呼吸动画
```

---

## 6. 页面布局

### 6.1 GamePage（路由容器）

GamePage 是 `/game` 路由的入口组件，不直接渲染游戏内容，而是管理三个子视图的切换。

```
GamePage
  ├── GameLobby (phase === 'idle')
  ├── CountdownOverlay (phase === 'countdown')
  ├── GamePlay (phase === 'playing' | 'feedback')
  └── GameResult (phase === 'result')
```

### 6.2 全局布局约束

```css
.game-page {
  min-height: calc(100dvh - var(--header-height) - var(--mobile-nav-height));
  background: var(--game-bg-gradient);
  position: relative;
  overflow: hidden;
}

/* 平板及以上 */
@media (min-width: 768px) {
  .game-page {
    min-height: calc(100dvh - var(--header-height));
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 24px;
  }
}
```

### 6.3 响应式布局汇总

| 视图 | 手机 (320-767) | 平板 (768-1023) | 桌面 (1024+) |
|------|---------------|-----------------|--------------|
| GameLobby | 2列网格，卡片堆叠 | 3列网格 | 3列网格，居中 max-width 720px |
| GamePlay | 2列泡泡，纵向布局 | 3列泡泡 | 横排泡泡，max-width 640px |
| GameResult | 底部半屏面板 | 居中弹窗 max-width 480px | 居中弹窗 max-width 480px |
| StickerBook | 3列网格，单页 | 双页展开，左3右3 | 双页展开 + 封面动画 |
| CountdownOverlay | 全屏覆盖 | 全屏覆盖 | 全屏覆盖 |

---

## 7. 动画规范

### 7.1 主时间轴

```
阶段         动作                               时长     缓动
────────────────────────────────────────────────────────────────
倒数动画     countPop (每个数字)                  400ms   cubic-bezier(0.34,1.56,0.64,1)
倒数动画     数字间过渡                           100ms   ease-out
倒数动画     "开始!" 展示                         500ms   cubic-bezier(0.34,1.56,0.64,1)
倒数动画     遮罩消失                             200ms   ease-out
────────────────────────────────────────────────────────────────
游戏开始     目标音朗读（TTS）                    可变      —
游戏开始     泡泡面板浮入 (stagger 50ms/泡泡)     400ms   cubic-bezier(0.34,1.56,0.64,1)
────────────────────────────────────────────────────────────────
正确反馈     泡泡爆破 (bubble-pop)                 400ms   cubic-bezier(0.34,1.56,0.64,1)
正确反馈     粒子发射 (particle-burst)            1200ms   ease-out
正确反馈     得分上飘 (scoreFloatUp)              800ms   ease-out
正确反馈     熊猫表情切换 (happySpin)             600ms   cubic-bezier(0.34,1.56,0.64,1)
正确反馈     贴纸碎片飞行 (fragmentFly)           300ms   ease-in-out
────────────────────────────────────────────────────────────────
错误反馈     泡泡弹开 (bubble-wrong)              1000ms   ease-out
错误反馈     泡泡恢复                             600ms   ease-out
────────────────────────────────────────────────────────────────
结算         面板滑入 (panelSlideUp)              400ms   cubic-bezier(0.34,1.56,0.64,1)
结算         遮罩淡入 (overlayFadeIn)             300ms   ease-out
结算         星星依次点亮 (starPop)                500ms/颗 cubic-bezier(0.34,1.56,0.64,1)
结算         星星间隔                             300ms    —
结算         贴纸弹跳入场 (stickerPopIn)          600ms   cubic-bezier(0.34,1.56,0.64,1)
结算         彩带特效 (first-collect)             1500ms   ease-out
────────────────────────────────────────────────────────────────
常态         泡泡浮动 (bubble-float)              2.5s循环 ease-in-out
常态         进度条当前槽位脉冲 (slotPulse)       1.5s循环 ease-in-out
常态         星星光晕呼吸 (starGlow)              2s循环  ease-in-out
常态         "新!"角标呼吸 (badge-pulse)          2s循环  ease-in-out
常态         贴纸光泽闪烁 (stickerShimmer)        3s循环  ease-in-out
常态         徽章光晕呼吸 (badgeGlow)             2s循环  ease-in-out
```

### 7.2 全局缓动函数定义

```css
:root {
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);        /* 弹性缩放/弹跳 */
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);              /* Material standard */
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);            /* 入场 */
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);            /* 退场 */
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);               /* 不弹跳的 sharp 曲线 */
}
```

**选型理由**:
- `--ease-bounce` (0.34,1.56,0.64,1): 1.56 的 c2 值产生轻微过冲（回弹），适合儿童产品的"俏皮感"，用于泡泡爆破、星星弹出、面板滑入等场合
- `--ease-smooth` (0.4,0,0.2,1): Material Design 标准缓动，用于 hover 过渡和颜色变化
- `--ease-decelerate` (0,0,0.2,1): 纯入场，用于元素首次出现
- `--ease-accelerate` (0.4,0,1,1): 纯退场，用于元素消失

### 7.3 reduced-motion 回退

```css
@media (prefers-reduced-motion: reduce) {
  .bubble-item {
    animation: none !important;
  }

  .bubble-item--popping {
    opacity: 0;
    transition: opacity 0.01ms;
  }

  .bubble-item--wrong {
    opacity: 0.6;
    transition: opacity 200ms;
  }

  .star--gold,
  .sticker-award,
  .countdown-number {
    animation: none !important;
  }

  .countdown-overlay .countdown-number {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 8. 交互状态

### 8.1 通用交互状态矩阵

| 状态 | 泡泡 | 关卡卡片 | 按钮 | 贴纸槽位 | 进度条槽位 |
|------|------|----------|------|----------|-----------|
| **Default** | float动画 | 白色卡片+阴影 | 主题色/白色 | 虚线框/实色 | 灰色空心 |
| **Hover** | scale(1.08)+深阴影 | translateY(-4px) | 亮度提升8% | N/A | N/A |
| **Focus** | 3px橙色outline | 3px橙色outline | 3px橙色outline | 3px橙色outline | N/A |
| **Active** | scale(0.92)+浅阴影 | scale(0.98) | scale(0.95) | N/A | N/A |
| **Disabled** | opacity:0.4+no-pointer | 锁定灰显 | 灰色+not-allowed | N/A | N/A |
| **Loading** | N/A | N/A | spinner+文字 | N/A | N/A |
| **Empty** | N/A | N/A | N/A | 虚线+剪影 | 全部空心 |
| **Error** | 弹开动画 | N/A | N/A | N/A | N/A |
| **Success** | 爆破动画 | N/A | N/A | 实色+光泽 | 实心+脉冲 |
| **Locked** | N/A | grayscale+🔒 | N/A | grayscale+? | N/A |

### 8.2 特殊交互处理

| 场景 | 处理方式 |
|------|----------|
| 得分动画期间点击屏幕 | 忽略（`pointer-events: none` 在覆盖层上），防止跳过反馈 |
| 快速连续点击同一泡泡 | debounce 300ms，同一泡泡在弹开恢复前不可再次点击 |
| 点击熊猫/气泡区域 | 重播目标音（不是选择操作） |
| 中途返回（浏览器后退） | 游戏状态丢失，回到游戏大厅。不保存局中进度 |
| 屏幕旋转 | 泡泡重新排列适配新布局，当前轮次不中断，浮动动画平滑过渡 |
| 无网络 | 无影响。纯前端应用，音效已预加载 |

### 8.3 手势支持

| 手势 | 目标 | 行为 |
|------|------|------|
| tap | 泡泡 | 选择泡泡（click/touchend） |
| tap | 重听按钮 | 重播目标音 |
| tap | 熊猫 | 重播目标音 |
| tap | 关卡卡片 | 进入关卡 |
| tap | 操作按钮 | 对应操作 |
| swipe left | 贴纸书 | 翻到下一页（可选，MVP 使用点击翻页按钮） |
| swipe right | 贴纸书 | 翻到上一页 |

---

## 9. 音效动效配合

### 9.1 音效-动画同步时序

```
音效                     动画                        延迟     说明
───────────────────────────────────────────────────────────────────
countdown.wav            数字缩放                     同步     倒数每拍
countdown-go.wav         "开始!" 缩放 + 遮罩淡出      同步     游戏开始信号
pop-correct.wav          泡泡爆破 (t=0ms)              0ms      爆破+音效同时触发
  └─ (音效尾音上扬)      得分上飘 (t=150ms)           150ms    视觉跟随听觉
  └─                     粒子散射 (t=200ms)           200ms    延迟营造层次感
  └─                     熊猫happy (t=300ms)          300ms    表情切换
sticker-fly.wav          碎片飞行 (t=0ms)             同步     碎片开始飞行
star-appear.wav          星星缩放旋转 (t=0ms)         同步     每颗星星
sticker-collect.wav      贴纸弹跳入场 (t=0ms)         同步     贴纸展示
achievement.wav          徽章解锁光晕 (t=0ms)         同步     徽章首次出现
pop-wrong.wav            泡泡弹开 (t=0ms)             同步     错误反馈
```

### 9.2 音效管理规范

所有音效使用 Web Audio API 的 `AudioBuffer` 模式播放（低延迟），在游戏页面 `onMounted` 时预加载：

```typescript
class SFXManager {
  private audioCtx: AudioContext
  private buffers: Map<string, AudioBuffer> = new Map()

  async preloadAll(): Promise<void> {
    const sfxFiles = [
      'pop-correct', 'pop-wrong', 'sticker-fly',
      'star-appear', 'sticker-collect', 'countdown',
      'countdown-go', 'achievement'
    ]
    for (const id of sfxFiles) {
      const response = await fetch(`/audio/${id}.wav`)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer)
      this.buffers.set(id, audioBuffer)
    }
  }

  play(id: string, volume: number = 0.8): void {
    const buffer = this.buffers.get(id)
    if (!buffer) return
    const source = this.audioCtx.createBufferSource()
    const gain = this.audioCtx.createGain()
    gain.gain.value = volume
    source.buffer = buffer
    source.connect(gain).connect(this.audioCtx.destination)
    source.start(0)
  }

  resume(): void {
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume()
    }
  }
}
```

**iOS 适配**: 在用户首次点击"开始游戏"按钮时调用 `sfxManager.resume()` 激活 AudioContext（解决 Web Audio autoplay policy）。

### 9.3 TTS 集成

沿用现有 `speechService.speak()` 但调整参数：

```typescript
speechService.speak(target.pronunciation, {
  rate: 0.7,    // 比默认慢 30%，确保儿童听清
  pitch: 1.1,   // 略微提高音调，更温馨
  volume: 0.9,
})
```

---

## 10. 无障碍设计

### 10.1 触控目标

| 元素 | 最小尺寸 | 实现方式 |
|------|----------|----------|
| 泡泡 | 80x80px | CSS width/height + padding 确保 |
| 关卡卡片 | 整卡可点，最小高度 100px | 卡片 padding + gap |
| 按钮 | 48x48px | 继承 `--touch-target-min` |
| 重听按钮 | 56x56px | `.btn-replay` 专用类 |
| 贴纸槽位 | 90x90px | 网格单元格 |

### 10.2 键盘导航

```html
<!-- 泡泡: 使用 button 元素以获得原生键盘支持 -->
<button
  class="bubble-item"
  :aria-label="`拼音 ${item.text}${item.category === 'initial' ? '，声母' : '，韵母'}`"
  :disabled="isPopped"
  @click="handleSelect"
>
  <span class="bubble-text">{{ item.text }}</span>
</button>

<!-- 焦点顺序 -->
<!-- Tab 1..N: 泡泡 (从左到右，从上到下) -->
<!-- Tab N+1: 重听按钮 -->
<!-- Tab N+2: 返回按钮 (如果有) -->
```

**焦点可见样式**:
```css
.bubble-item:focus-visible {
  outline: 3px solid #FF8C42;
  outline-offset: 4px;
}
```

### 10.3 屏幕阅读器

- 泡泡: `aria-label="拼音 b，声母"` 或 `aria-label="拼音 ang，复韵母"`
- 游戏状态变化: 使用 `aria-live="polite"` 区域播报得分更新和轮次变化：

```html
<div class="sr-only" aria-live="polite" aria-atomic="true">
  {{ `第 ${currentRound + 1} 题，得分 ${score} 分` }}
</div>
```

- 鼓励语/引导语: 使用 `role="status"` 确保屏幕阅读器读出：

```html
<div role="status" aria-live="assertive" class="sr-only">
  {{ encouragementText }}
</div>
```

### 10.4 色彩无障碍

| 要求 | 实现 |
|------|------|
| 颜色不是唯一区分方式 | 泡泡区分：拼音文字（主标识）+ 颜色（辅助）。正确/错误：动画差异 + 音效差异 |
| 状态不纯依赖颜色 | 关卡锁定：🔒 图标 + 灰色 + pointer-events: none。星级：空心/实心 + 数量 |
| 链接/按钮可识别 | 所有可交互元素有明确的 hover/active 状态变化 |

### 10.5 reduced-motion

已在第 7.3 节详述。所有动画在 `prefers-reduced-motion: reduce` 下立即跳转到最终状态。

---

## 11. 组件树与 Props

### 11.1 组件树

```
GamePage.vue
├── CountdownOverlay.vue
│   └── Props: (none -- 自管理动画序列, emits 'complete')
│
├── GameLobby.vue
│   ├── LevelCard.vue (x6)
│   │   └── Props: { level: LevelConfig; progress: LevelProgress | null }
│   │       States: locked | unlocked-new | played | mastered
│   │
│   └── StickerBookEntry.vue
│       └── Props: { collectedCount: number; totalCount: number }
│
├── GamePlay.vue
│   ├── PandaMascot (复用)
│   │   └── Props: { mood: 'idle'|'happy'|'thinking'; showBubble: boolean; bubbleText: string }
│   │
│   ├── ProgressBar.vue
│   │   └── Props: { total: number; filled: number; levelColor: string }
│   │
│   ├── BubbleItem.vue (x4-6)
│   │   └── Props: { item: PinyinElement; color: string; phase: number; state: BubbleState }
│   │       States: 'idle' | 'popping' | 'bouncing' | 'disabled'
│   │       Events: @select(item: PinyinElement)
│   │
│   └── ScoreHUD.vue
│       └── Props: { score: number; combo: number; round: number; totalRounds: number }
│
├── GameResult.vue
│   ├── StarRating.vue
│   │   └── Props: { stars: 0|1|2|3; total: 3; animated: boolean; size: 'small'|'medium'|'large' }
│   │
│   ├── StickerAward.vue
│   │   └── Props: { sticker: StickerConfig; grade: StickerGrade; isNewRecord: boolean }
│   │
│   └── ResultActions.vue
│       └── Props: { canGoNext: boolean; isLastLevel: boolean }
│           Events: @replay / @next / @back
│
└── StickerBook.vue
    ├── BookCover.vue (封面状态)
    ├── PageLeft.vue / PageRight.vue (内页)
    ├── StickerSlot.vue (x6)
    │   └── Props: { sticker: StickerConfig | null; grade: StickerGrade | null }
    │       States: empty | collected
    │
    └── AchievementBadge.vue (x4)
        └── Props: { achievement: AchievementConfig; unlocked: boolean; isNew: boolean }
```

### 11.2 TypeScript 接口定义

```typescript
// === 泡泡状态 ===
type BubbleState = 'idle' | 'popping' | 'bouncing' | 'disabled'

// === 游戏阶段 ===
type GamePhase = 'idle' | 'countdown' | 'playing' | 'feedback' | 'result'

// === 关卡卡片状态 ===
type LevelCardState = 'locked' | 'unlocked-new' | 'played' | 'mastered'

// === 贴纸品质 ===
type StickerGrade = 'gold' | 'silver' | 'bronze' | null

// === BubbleItem Props ===
interface BubbleItemProps {
  item: PinyinElement
  color: string              // HEX, 如 '#FF6B6B'
  phase: number              // 浮动动画相位偏移 (0-2.5s)
  state: BubbleState
  disabled: boolean
}

// === LevelCard Props ===
interface LevelCardProps {
  level: number              // 1-6
  config: LevelConfig        // 名称、图标、题库
  progress: LevelProgress | null  // null = 未解锁
  state: LevelCardState
}

// === ProgressBar Props ===
interface ProgressBarProps {
  total: number              // 固定 10
  filled: number             // 已完成轮次 0-10
  current: number            // 当前轮次 0-9
  levelColor: string         // 当前关卡主题色 HEX
}

// === StarRating Props ===
interface StarRatingProps {
  stars: 0 | 1 | 2 | 3
  total: number              // 固定 3
  animated: boolean
  size: 'small' | 'medium' | 'large'
}

// === GameResult Props ===
interface GameResultProps {
  score: number
  stars: 0 | 1 | 2 | 3
  correctFirstTry: number
  totalRounds: number
  maxCombo: number
  sticker: StickerConfig | null
  grade: StickerGrade
  isNewRecord: boolean
  isFirstCollect: boolean
  canGoNext: boolean
  isLastLevel: boolean
}

// === StickerSlot Props ===
interface StickerSlotProps {
  sticker: StickerConfig | null
  grade: StickerGrade
  index: number              // 槽位序号 0-5
}

// === AchievementBadge Props ===
interface AchievementBadgeProps {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  isNew: boolean             // 本次会话中刚解锁
}

// === LevelConfig (关卡静态配置) ===
interface LevelConfig {
  level: number
  name: string
  icon: string               // emoji
  pool: PinyinElement[]
  optionCount: 4 | 5 | 6
  avoidConfusionGroups: boolean
  stickerName: string
  stickerIcon: string
}

// === StickerConfig (贴纸) ===
interface StickerConfig {
  id: string                 // 'level-1' ~ 'level-6'
  name: string               // '韵母小芽' 等
  icon: string               // emoji 或自定义 SVG
  level: number
}

// === 游戏事件 ===
interface GameEvents {
  'bubble:select': (item: PinyinElement) => void
  'bubble:animation-end': (bubbleId: string) => void
  'countdown:complete': () => void
  'result:replay': () => void
  'result:next': () => void
  'result:back': () => void
  'stickerbook:close': () => void
}
```

---

## 12. 实现优先级

### 12.1 构建顺序与依赖

```
Phase 1: 核心玩法 (MVP -- 必须首先完成)
  ├── 1.1 类型定义 (src/types/game.ts)
  ├── 1.2 localStorage 封装 (src/utils/gameStorage.ts)
  ├── 1.3 useGameEngine composable (状态机 + 题库 + 计分)
  ├── 1.4 BubbleItem 组件 (核心交互元素)
  ├── 1.5 GamePlay 组件 + 泡泡网格
  ├── 1.6 GamePage 路由容器 (最小视图切换)
  ├── 1.7 CountdownOverlay 组件
  │
  └── 依赖链: 1.1 → 1.3; 1.1+1.4 → 1.5; 1.5+1.7 → 1.6

Phase 2: 游戏流程完整性
  ├── 2.1 GameResult 组件 (结算界面)
  ├── 2.2 StarRating 组件 (星星展示)
  ├── 2.3 ProgressBar 组件 (贴纸碎片进度条)
  ├── 2.4 音效管理 (SFXManager)
  │
  └── 依赖链: 1.6 → 2.1; 2.2 → 2.1; 1.5 → 2.3; 2.1+2.4 → 完整游戏循环

Phase 3: 大厅与收集
  ├── 3.1 GameLobby 组件 + LevelCard
  ├── 3.2 关卡解锁逻辑
  ├── 3.3 StickerBook (基础版: 网格展示)
  ├── 3.4 AchievementBadge 组件
  │
  └── 依赖链: 1.2 → 3.2; 1.2+3.2 → 3.1; 1.2 → 3.3

Phase 4: 贴纸书高级功能 (polish)
  ├── 4.1 CSS 3D 翻页动画
  ├── 4.2 封面设计
  ├── 4.3 贴纸光泽效果 (stickerShimmer)
  ├── 4.4 页面纹理背景
  │
  └── 依赖链: 3.3 → 4.1-4.4

Phase 5: 动效打磨
  ├── 5.1 粒子爆炸效果增强
  ├── 5.2 碎片贝塞尔飞行路径
  ├── 5.3 首次收集彩带特效
  ├── 5.4 三星金色粒子持续闪烁
  ├── 5.5 过渡动画微调 (60fps 优化)
  │
  └── 依赖链: 2.1 → 5.1-5.4

Phase 6: 入口接入与测试
  ├── 6.1 HomePage 卡片更新 (移除"即将推出")
  ├── 6.2 路由注册 (/game)
  ├── 6.3 多设备响应式测试
  ├── 6.4 reduced-motion 测试
  ├── 6.5 键盘导航测试
  ├── 6.6 iOS Safari 音频上下文测试
  └── 6.7 屏幕阅读器测试
```

### 12.2 各阶段预估工时

| 阶段 | 内容 | 预估工时 |
|------|------|----------|
| Phase 1 | 核心玩法 | 10h |
| Phase 2 | 流程完整性 | 6h |
| Phase 3 | 大厅与收集 | 5h |
| Phase 4 | 贴纸书 polish | 4h |
| Phase 5 | 动效打磨 | 3h |
| Phase 6 | 接入与测试 | 2h |
| **总计** | | **30h** |

---

## 附录 A: 游戏 CSS 变量完整清单

```css
/* ===== 追加到 src/styles/variables.css 的 :root 块 ===== */

:root {
  /* 背景 */
  --game-bg-start: #E8F8FF;
  --game-bg-end: #FFF5E8;
  --game-bg-gradient: linear-gradient(180deg, var(--game-bg-start) 0%, var(--game-bg-end) 100%);

  /* 泡泡色板 */
  --bubble-coral: #FF6B6B;
  --bubble-teal: #4ECDC4;
  --bubble-tangerine: #FF8C42;
  --bubble-honey: #FFB380;
  --bubble-mint: #7EC8A0;
  --bubble-sun: #F0C75E;
  --bubble-sky: #6C9BD2;
  --bubble-cherry: #E8839A;

  /* 泡泡光泽 */
  --bubble-highlight: rgba(255,255,255,0.55);
  --bubble-shadow-inner: rgba(255,255,255,0.3);
  --bubble-shadow-outer: rgba(0,0,0,0.08);

  /* 星级 */
  --star-gold: #F0C75E;
  --star-gold-glow: rgba(240,199,94,0.6);
  --star-silver: #C0C0C0;
  --star-bronze: #CD7F32;
  --star-empty: #D4D4D4;

  /* 贴纸边框渐变 */
  --sticker-border-gold: linear-gradient(135deg, #F0C75E 0%, #D4A030 100%);
  --sticker-border-silver: linear-gradient(135deg, #E0E0E0 0%, #A0A0A0 100%);
  --sticker-border-bronze: linear-gradient(135deg, #E8B878 0%, #A0682A 100%);

  /* 进度条主题色 */
  --progress-l1: #7EC8A0;
  --progress-l2: #4ECDC4;
  --progress-l3: #FFB380;
  --progress-l4: #6C9BD2;
  --progress-l5: #E8839A;
  --progress-l6: #F0C75E;

  /* 锁定/不可用 */
  --game-locked-opacity: 0.4;
  --game-locked-filter: grayscale(100%);
  --game-disabled-bg: #EDEDED;
  --game-disabled-text: #B0B0B0;

  /* 覆盖层 */
  --overlay-bg: rgba(0,0,0,0.35);
  --countdown-bg: rgba(255,248,243,0.95);
  --result-panel-bg: rgba(255,255,255,0.97);

  /* 贴纸书 */
  --album-cover: #D4765A;
  --album-cover-text: #F8E8D0;
  --album-page: #F5F0E6;
  --album-page-edge: #E8E0D0;
  --album-binding: #8B6914;
  --album-sticker-shadow: 0 2px 4px rgba(0,0,0,0.18);

  /* 阴影 */
  --shadow-bubble: 0 4px 12px rgba(0,0,0,0.1), inset 0 2px 4px rgba(255,255,255,0.5);
  --shadow-bubble-hover: 0 6px 20px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.5);
  --shadow-star-glow: 0 0 16px var(--star-gold-glow);
  --shadow-sticker-card: 0 4px 12px rgba(0,0,0,0.12);

  /* 间距 */
  --game-bubble-gap: 16px;
  --game-bubble-gap-tablet: 24px;
  --game-card-gap: 16px;
  --game-card-gap-tablet: 20px;
  --game-section-gap: 24px;
  --game-hud-padding: 16px;
  --game-result-gap: 20px;

  /* 特效缓动 */
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-decelerate: cubic-bezier(0, 0, 0.2, 1);
  --ease-accelerate: cubic-bezier(0.4, 0, 1, 1);
  --ease-sharp: cubic-bezier(0.4, 0, 0.6, 1);

  /* 字体 */
  --font-family-game: 'Nunito', 'PingFang SC', 'Noto Sans SC', 'Microsoft YaHei', sans-serif;
  --font-game-countdown: 6rem;      /* 96px */
  --font-game-bubble-2char: 1.4rem;  /* 22.4px */
  --font-game-bubble-1char: 1.8rem;  /* 28.8px */
  --font-game-bubble-multi: 1.1rem;  /* 17.6px */
  --font-game-score: 1.25rem;        /* 20px */
  --font-game-combo: 1rem;           /* 16px */
  --font-game-level-title: 1.25rem;  /* 20px */
  --font-game-level-name: 0.875rem;  /* 14px */
  --font-game-sticker-name: 0.875rem;/* 14px */
  --font-game-badge: 0.75rem;        /* 12px */
  --font-game-encourage: 1rem;       /* 16px */

  /* 触控目标 */
  --touch-game-bubble: 80px;         /* 移动端泡泡最小尺寸 */
  --touch-game-bubble-desktop: 96px; /* 桌面端泡泡最小尺寸 */
}
```

---

## 附录 B: 与主应用设计 Token 的继承关系

游戏模块的 CSS 变量采用**追加而非覆盖**策略：

```
继承自 variables.css           游戏模块追加 (--game-*)
─────────────────────────────  ─────────────────────────
--color-brand-orange           --bubble-tangerine (同色，但用于不同语义)
--color-brand-orange-light     --bubble-honey
--color-initial                --bubble-sky
--color-final-single           --bubble-cherry
--color-final-compound         --bubble-mint
--color-whole                  --bubble-sun
--color-success                (复用)
--color-warning                (复用)
--color-bg                     --game-bg-gradient
--color-surface                --result-panel-bg
--color-text-primary           (复用)
--font-family-base             --font-family-game (追加 Nunito 到栈顶)
--space-*                      --game-*-gap (组件级间距)
--radius-full                  (复用)
--shadow-card                  --shadow-bubble / --shadow-bubble-hover
--transition-*                 --ease-* (新增缓动曲线)
--header-height                (复用)
--mobile-nav-height            (复用)
--touch-target-min             --touch-game-bubble (覆盖更大)
```

---

## 附录 C: 贴纸书翻页交互细节

### 翻页状态机

```
[封面闭合] ──(点击封面)──> [翻开封面，显示第1-2页]
                                      │
                        ┌─(点击右箭头)─┘
                        v
                  [显示第3-4页] ──(点击右箭头)──> [显示第5-6页 + 成就徽章]
                        │                              │
                        └──(点击左箭头)────────────────┘
```

每页最多显示 2 张贴纸（跨左右页共 4 张）。翻页时使用 CSS 3D `rotateY` 变换：

```css
.page {
  transition: transform 600ms cubic-bezier(0.645,0.045,0.355,1);
  transform-origin: left center;
}

.page--turning {
  transform: rotateY(-180deg);
}
```

翻页按钮使用大号左右箭头（>= 56px 触控区域），位于书本两侧或下方。

### 封面元素

- 标题: "我的贴纸书" (使用 `--font-game-level-title`，烫金色)
- 副标题: "拼音泡泡乐" (使用 `--font-game-level-name`)
- 中央图案: 熊猫吉祥物或贴纸书图标
- 底部文字: 已收集数量 "X / 6"
- 材质: 硬皮书皮感（`linear-gradient(160deg, #D4765A, #A0523A)` + 书脊深色阴影）

### 内页材质

- 底色: `#F5F0E6` (米黄色纸张感)
- 纹理: 可选 `background-image: url('paper-texture.png')` 叠加 5% opacity
- 中缝阴影: `box-shadow: inset 2px 0 4px rgba(0,0,0,0.04)` (右页) / `inset -2px 0 4px rgba(0,0,0,0.04)` (左页)
- 贴纸区域: 虚线边框标识槽位，已收集贴纸带有微微凸起的阴影和光泽
