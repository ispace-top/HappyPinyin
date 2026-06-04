<div align="center">

<img src="public/favicon.svg" width="80" alt="HappyPinYin" />

# 🐼 快乐拼音 HappyPinYin

面向 5-8 岁儿童的汉语拼音学习 Web 应用

[![Vue](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Build](https://img.shields.io/github/actions/workflow/status/ispace-top/HappyPinyin/build.yml?label=docker%20build&logo=docker&logoColor=white)](https://github.com/ispace-top/HappyPinyin/actions)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)](CONTRIBUTING.md)

</div>

---

## ✨ 功能亮点

<table>
<tr>
<td width="33%">

🎯 **拼音浏览**

分类展示全部 **63 个拼音元素**（23 声母 + 24 韵母 + 16 整体认读音节）。点击卡片先听标准发音，再跟读助记口诀。

</td>
<td width="33%">

🧩 **拼读构建器**

像搭积木一样选择 **声母 → 介母 → 韵母 → 声调**，智能筛选合法组合。完成后展示对应**汉字和常用词组**。

</td>
<td width="33%">

🐼 **学习伙伴**

小熊猫"拼拼"全程陪伴，拼读成功有庆祝动画。**马卡龙糖果色系**界面，大按钮大字体，专为小手设计。

</td>
</tr>
</table>

## 🚀 快速开始

```bash
# 环境要求：Node.js 18+
npm install        # 安装依赖
npm run dev        # 启动开发服务器 → http://localhost:5173
npm run build      # 生产构建 → dist/
npm run preview    # 本地预览生产构建
```

> 🔊 **发音功能**：应用使用浏览器内置 SpeechSynthesis API。中文发音需要操作系统安装中文语音包：
> - **Windows**：设置 → 时间和语言 → 语音 → 添加语音 → 中文（简体）
> - **macOS**：系统偏好设置 → 辅助功能 → 语音 → 中文
> - **iOS / Android**：已内置中文语音，无需额外配置

## 📦 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Vue 3 + TypeScript |
| 构建 | Vite 6 |
| 路由 | Vue Router 4（Hash 模式） |
| 样式 | CSS Modules + CSS Custom Properties |
| 发音 | Web Speech API（SpeechSynthesis） |
| 部署 | 纯静态 SPA，零后端依赖 |

## 📁 项目结构

```
HappyPinYin/
├── docs/                          # 产品需求文档 + UI 设计文档
├── public/
│   └── favicon.svg                # 小熊猫图标
├── src/
│   ├── main.ts / App.vue          # 入口 + 根布局
│   ├── router/index.ts            # 3 个懒加载路由
│   ├── types/pinyin.ts            # TypeScript 类型定义
│   ├── data/                      # 拼音数据集（静态）
│   │   ├── initials.ts            #   23 声母
│   │   ├── finals.ts              #   6 单韵母 + 18 复韵母
│   │   ├── wholeSyllables.ts      #   16 整体认读音节
│   │   └── syllableCombinations.ts #  ~400 合法拼音组合
│   ├── utils/
│   │   ├── pinyinFilter.ts        #   智能筛选 + 拼音→汉字朗读转换
│   │   ├── toneMark.ts            #   声调标注算法
│   │   └── syllableChars.ts       #   音节→汉字+词组映射
│   ├── services/speechService.ts  #   SpeechSynthesis 封装
│   ├── composables/               #   useSpeech / useBuilder
│   ├── components/                #   9 个 UI 组件
│   └── pages/                     #   3 个页面
├── Dockerfile                     # Docker 构建配置
├── nginx.conf                     # Nginx 配置
└── README.md
```

---

## 🐳 部署指南

### 方式一：静态文件托管（推荐 ⭐）

构建产物为纯静态文件，可部署到任意静态服务器。

```bash
npm run build
# 将 dist/ 目录上传至服务器即可
```

#### ▲ Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

```bash
npm i -g vercel
vercel   # 自动识别 Vite 项目，零配置
```

- 免费额度 100 GB/月，自动 HTTPS，支持自定义域名

#### ▲ Cloudflare Pages

在 Cloudflare Dashboard 中连接 Git 仓库：
- **构建命令**：`npm run build`
- **输出目录**：`dist`
- 无限带宽，全球 CDN

#### ▲ GitHub Pages

```bash
npm i -D gh-pages
npm run build
npx gh-pages -d dist
```

或使用 GitHub Actions 自动部署（见下方示例）。

#### ▲ 阿里云 OSS / 腾讯云 COS

```bash
npm run build
ossutil cp -r dist/ oss://your-bucket/   # 阿里云
coscli cp -r dist/ cos://your-bucket/    # 腾讯云
```

配置静态网站托管 + CDN 加速，适合国内用户。

### 方式二：🐳 Docker

```bash
# 构建镜像
docker build -t happy-pinyin .

# 运行容器
docker run -d -p 8080:80 --name happy-pinyin happy-pinyin

# 访问 http://localhost:8080
```

**Docker Compose**（`docker-compose.yml`）：

```yaml
services:
  happy-pinyin:
    build: .
    ports:
      - "8080:80"
    restart: unless-stopped
```

### 方式三：Nginx 自建服务器

```bash
npm run build
cp -r dist/ /var/www/happy-pinyin/
```

Nginx 配置已提供在 `nginx.conf` 中，直接复制使用。

### GitHub Actions 自动部署

```yaml
# .github/workflows/deploy.yml
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
        with: { node-version: 20, cache: npm }
      - run: npm ci && npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with: { path: dist }
      - uses: actions/deploy-pages@v4
```

---

## 📱 打包为移动 App

| 方案 | 安装体验 | 离线 | 上架商店 | 包体积 | 推荐场景 |
|------|---------|------|---------|--------|---------|
| **PWA** | 浏览器一键安装 | ✅ | — | ~200 KB | 快速覆盖移动端 |
| **TWA** | Google Play 下载 | ✅ | ✅ Android | ~2 MB | 上架 Google Play |
| **Capacitor** | App Store 下载 | ✅ | ✅ iOS/Android | ~5 MB | 上架应用商店 |

> **推荐路径**：先加 PWA 支持（成本最低）→ 后续按需升级到 Capacitor 上架商店。

### PWA（渐进式 Web 应用）

```bash
npm i -D vite-plugin-pwa
```

```ts
// vite.config.ts
import { VitePWA } from 'vite-plugin-pwa'

VitePWA({
  registerType: 'autoUpdate',
  manifest: {
    name: '快乐拼音 HappyPinYin',
    short_name: '快乐拼音',
    theme_color: '#FF8C42',
    background_color: '#FFF8F3',
    display: 'standalone',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
})
```

配置后用户访问网站即可看到"添加到主屏幕"提示，支持离线使用。

### Electron 桌面应用

```bash
npm i -D electron electron-builder
npx electron-builder     # 生成 .exe / .dmg / .AppImage
```

---

## 🌐 浏览器兼容性

| 浏览器 | 版本 | 发音 | 备注 |
|--------|------|------|------|
| Chrome | 90+ | ✅ | 推荐，需系统安装中文语音 |
| Edge | 90+ | ✅ | 同 Chrome 内核 |
| Firefox | 90+ | ✅ | 中文语音可能需额外配置 |
| Safari macOS | 15+ | ✅ | 语音质量好 |
| Safari iOS | 15+ | △ | 需用户手势触发 |
| Chrome Android | 90+ | ✅ | 已内置中文语音 |

---

## ❓ 常见问题

<details>
<summary><b>为什么听不到发音？</b></summary>

请检查操作系统是否已安装中文语音包（见上方"快速开始"）。如果浏览器不支持 SpeechSynthesis，发音按钮会显示为灰色 🔇。
</details>

<details>
<summary><b>选完声母后有些韵母不见了？</b></summary>

这是智能筛选功能。不是所有声母都能跟所有韵母拼读（例如 b 不能跟 ü 拼），系统只会显示合法的拼音组合。
</details>

<details>
<summary><b>拼音教学内容是否权威？</b></summary>

教学内容严格遵循人教版/部编版小学语文教材拼音教学大纲，声母 23 个、韵母 24 个、整体认读音节 16 个，合法拼读组合参考《汉语拼音方案》。
</details>

<details>
<summary><b>可以离线使用吗？</b></summary>

当前版本需要首次加载后由浏览器缓存。添加 PWA 支持后（见上方）可实现完全离线使用。
</details>

---

## 📄 许可

MIT License
