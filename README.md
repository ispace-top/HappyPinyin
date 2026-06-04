# HappyPinYin（快乐拼音）

面向 5-8 岁儿童的汉语拼音学习 Web 应用。通过分类浏览和交互式拼读构建器，帮助幼小衔接和小学低年级学生在趣味互动中掌握汉语拼音的认读与拼读能力。

## 功能

- **拼音浏览** — 分类展示全部 63 个拼音元素（23 声母 + 24 韵母 + 16 整体认读音节），点击发音并跟读助记口诀
- **拼读构建器** — 像搭积木一样选择声母 → 介母 → 韵母 → 声调，智能筛选合法组合，完成拼读后展示对应汉字和常用词组
- **学习伙伴** — 小熊猫"拼拼"全程陪伴，拼读成功有庆祝动画
- **全平台适配** — 响应式设计，PC / 平板 / 手机均可使用

## 技术栈

| 类型 | 选型 |
|------|------|
| 框架 | Vue 3 + TypeScript |
| 构建 | Vite 6 |
| 路由 | Vue Router 4（Hash 模式） |
| 样式 | CSS Modules + CSS Custom Properties |
| 发音 | Web Speech API（SpeechSynthesis） |
| 部署 | 纯静态 SPA，无后端依赖 |

## 项目结构

```
HappyPinYin/
├── docs/
│   ├── requirements.md          # 产品需求文档
│   └── ui-design.md             # UI 设计文档
├── public/
│   └── favicon.svg              # 小熊猫图标
├── src/
│   ├── main.ts                  # 入口
│   ├── App.vue                  # 根组件（布局 + 路由）
│   ├── router/index.ts          # 路由配置（3 页面懒加载）
│   ├── types/pinyin.ts          # 全部 TypeScript 类型定义
│   ├── data/
│   │   ├── initials.ts          # 23 声母数据
│   │   ├── finals.ts            # 6 单韵母 + 18 复韵母
│   │   ├── wholeSyllables.ts    # 16 整体认读音节
│   │   └── syllableCombinations.ts  # ~400 合法拼音组合（声母+介母+韵母+声调）
│   ├── utils/
│   │   ├── pinyinFilter.ts      # 智能筛选：合法介母/韵母推导、拼音字母→汉字朗读转换
│   │   ├── toneMark.ts          # 声调标注算法
│   │   └── syllableChars.ts     # ~400 音节→汉字+词组映射表
│   ├── services/
│   │   └── speechService.ts     # SpeechSynthesis 封装（中文语音选择、队列管理）
│   ├── composables/
│   │   ├── useSpeech.ts         # 语音 Hook（单次朗读 / 序列朗读）
│   │   └── useBuilder.ts        # 拼读状态机（reactive 状态 + 6 种 action）
│   ├── components/
│   │   ├── common/              # AudioButton, PinyinCard, PandaMascot, CelebrationEffect
│   │   ├── layout/              # AppHeader, MobileNav
│   │   └── builder/             # BuilderStepper, SelectorGrid, TonePicker
│   ├── pages/
│   │   ├── HomePage.vue         # 首页
│   │   ├── BrowserPage.vue      # 拼音浏览
│   │   └── BuilderPage.vue      # 拼读构建器
│   └── styles/
│       ├── variables.css        # 设计 Tokens（色彩/字体/间距/圆角/阴影）
│       └── global.css           # 全局样式 + CSS Reset + prefers-reduced-motion
├── index.html                   # Vite 入口 HTML
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 快速开始

**前置要求**：Node.js 18+

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:5173

# 生产构建
npm run build
# 产物在 dist/ 目录

# 本地预览生产构建
npm run preview
```

> **发音功能**：应用使用浏览器内置的 SpeechSynthesis API。如需中文发音，请确保操作系统已安装中文语音包：
> - **Windows**：设置 → 时间和语言 → 语音 → 添加语音 → 中文（简体）
> - **macOS**：系统偏好设置 → 辅助功能 → 语音 → 中文
> - **iOS / Android**：通常已内置中文语音

---

## 部署指南

### 方式一：静态文件托管（推荐）

应用构建产物为纯静态文件，可部署到任意静态文件服务器。

```bash
npm run build
# 将 dist/ 目录上传到任意服务器即可
```

#### Vercel（零配置，推荐个人使用）

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目根目录执行
vercel
# 按提示操作，Vercel 会自动识别 Vite 项目
```

- **免费额度**：100 GB 带宽/月，足够个人项目使用
- **自动 HTTPS**：提供 `https://xxx.vercel.app` 域名
- **自定义域名**：支持绑定个人域名

#### GitHub Pages

```bash
npm run build

# 方式 A：使用 gh-pages 工具
npm i -D gh-pages
# 在 package.json 中：
#   "homepage": "https://<your-username>.github.io/happy-pinyin"
# 在 scripts 中添加：
#   "deploy": "gh-pages -d dist"
npm run deploy

# 方式 B：GitHub Actions（自动部署）
# 在 .github/workflows/deploy.yml 中配置：
#   push 到 main 分支 → 自动构建并部署到 gh-pages
```

GitHub Actions 示例（`.github/workflows/deploy.yml`）：

```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - uses: actions/deploy-pages@v4
```

#### Cloudflare Pages

```bash
# 在 Cloudflare Dashboard 中：
# Workers & Pages → Pages → 连接到 Git 仓库
# 构建命令：npm run build
# 构建输出目录：dist
```

- **免费额度**：无限带宽
- **全球 CDN**：中国大陆访问速度较好

#### 阿里云 OSS / 腾讯云 COS + CDN

```bash
npm run build

# 使用阿里云 OSS CLI
ossutil cp -r dist/ oss://your-bucket/happy-pinyin/

# 或使用腾讯云 COS CLI
coscli cp -r dist/ cos://your-bucket/happy-pinyin/
```

适合国内用户，访问速度快。需配置静态网站托管和 CDN 加速。

#### Nginx（自建服务器）

```nginx
server {
    listen 80;
    server_name pinyin.example.com;
    root /var/www/happy-pinyin;
    index index.html;

    # SPA 路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip 压缩
    gzip on;
    gzip_types text/css application/javascript text/html;
}
```

### 方式二：Docker 部署

```bash
# 构建镜像
docker build -t happy-pinyin .

# 运行容器
docker run -p 8080:80 happy-pinyin
# 访问 http://localhost:8080
```

`Dockerfile`：

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 方式三：Electron 桌面应用

如需打包为桌面应用（Windows/macOS/Linux），可使用 Electron：

```bash
# 添加 Electron 依赖
npm i -D electron electron-builder

# 在 package.json 中添加脚本和配置
# 然后构建
npm run electron:build
```

这会生成 `.exe`（Windows）、`.dmg`（macOS）、`.AppImage`（Linux）安装包。

> **注意**：Electron 打包后体积较大（~150 MB 起步），仅推荐在需要离线使用或固定设备场景下使用。

---

## 打包为移动 App

### PWA（渐进式 Web 应用，推荐）

PWA 可安装到手机主屏幕，离线使用，获得接近原生 App 的体验。

**当前状态**：本项目尚未添加 PWA 支持。添加方法：

```bash
# 安装 Vite PWA 插件
npm i -D vite-plugin-pwa

# 在 vite.config.ts 中配置
```

```typescript
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '快乐拼音 HappyPinYin',
        short_name: '快乐拼音',
        description: '儿童拼音学习工具',
        theme_color: '#FF8C42',
        background_color: '#FFF8F3',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png}'],
        runtimeCaching: [],
      },
    }),
  ],
})
```

配置完成后，用户访问网站时会看到"添加到主屏幕"提示。

### TWA（Trusted Web Activity，Android 上架应用商店）

TWA 可以将 PWA 打包为 APK/AAB 并上架 Google Play：

```bash
# 使用 Bubblewrap 工具
npm i -g @bubblewrap/cli
bubblewrap init --manifest https://your-domain.com/manifest.json
bubblewrap build
```

### Capacitor（跨平台原生 App）

如需真正的原生 App（访问原生 API、上架 App Store），可使用 Capacitor：

```bash
npm i @capacitor/core @capacitor/cli
npx cap init

# Android
npm i @capacitor/android
npx cap add android
npx cap sync
npx cap open android  # 在 Android Studio 中构建 APK

# iOS（需 macOS + Xcode）
npm i @capacitor/ios
npx cap add ios
npx cap sync
npx cap open ios    # 在 Xcode 中构建 IPA
```

| 方案 | 安装体验 | 离线 | 上架商店 | 体积 | 开发成本 |
|------|---------|------|---------|------|---------|
| **PWA** | 浏览器内安装 | ✓ | × | ~200 KB | 低（加插件即可） |
| **TWA** | Google Play | ✓ | ✓（仅 Android） | ~2 MB | 中 |
| **Capacitor** | App Store + Google Play | ✓ | ✓ | ~5 MB | 中 |
| **Electron** | 下载安装包 | ✓ | ×（需自行分发） | ~150 MB | 低 |

> **建议**：先用 PWA 覆盖移动端场景（零额外成本），后续按需升级到 Capacitor 上架应用商店。

---

## 浏览器兼容性

| 浏览器 | 最低版本 | 发音支持 | 备注 |
|--------|---------|---------|------|
| Chrome | 90+ | ✓ | 推荐，中文语音需系统安装 |
| Edge | 90+ | ✓ | 同 Chrome 内核 |
| Firefox | 90+ | ✓ | 中文语音可能需额外配置 |
| Safari (macOS) | 15+ | ✓ | 中文语音质量较好 |
| Safari (iOS) | 15+ | △ | 需用户手势触发，首次使用需点击 |
| Chrome (Android) | 90+ | ✓ | 已内置中文语音 |
| 微信内置浏览器 | — | △ | 部分版本不支持 SpeechSynthesis |

---

## 常见问题

**Q：为什么听不到发音？**

A：请检查操作系统是否安装了中文语音包（见上方"快速开始"）。如果浏览器不支持 SpeechSynthesis，页面的发音按钮会显示为灰色。

**Q：拼读时选完声母后有些韵母不见了？**

A：这是正常的智能筛选功能。不是所有声母都能跟所有韵母拼读（例如 b 不能跟 ü 拼），系统只会显示合法的拼音组合。

**Q：可以离线使用吗？**

A：当前版本需要首次加载后浏览器缓存。添加 PWA 支持（见上方）后可实现完全离线使用。

**Q：拼音教学内容是否权威？**

A：教学内容严格遵循人教版/部编版小学语文教材拼音教学大纲，声母 23 个、韵母 24 个、整体认读音节 16 个，合法拼读组合参考《汉语拼音方案》。

---

## 开发

```bash
# 类型检查
npm run build    # vue-tsc + vite build

# 开发模式（HMR 热更新）
npm run dev

# 格式化（如配置了 Prettier）
npx prettier --write src/
```
