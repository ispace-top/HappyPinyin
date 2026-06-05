import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const BASE = 'http://localhost:5174';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

console.log('Taking screenshots...\n');

// ============================================================
// Desktop: 2 张 (1280×800)
// ============================================================
const desktopCtx = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  deviceScaleFactor: 1,
});

// 1. 桌面端 - 首页
{
  const page = await desktopCtx.newPage();
  await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/desktop-home.png`, fullPage: false });
  console.log('  ✓ desktop-home.png');
  await page.close();
}

// 2. 桌面端 - 拼读构建器
{
  const page = await desktopCtx.newPage();
  await page.goto(`${BASE}/#/builder`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/desktop-builder.png`, fullPage: false });
  console.log('  ✓ desktop-builder.png');
  await page.close();
}

// ============================================================
// Mobile: 2 张 (390×844, 2x retina)
// ============================================================
const mobileCtx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
});

// 3. 移动端 - 首页
{
  const page = await mobileCtx.newPage();
  await page.goto(`${BASE}/#/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/mobile-home.png`, fullPage: false });
  console.log('  ✓ mobile-home.png');
  await page.close();
}

// 4. 移动端 - 拼音浏览
{
  const page = await mobileCtx.newPage();
  await page.goto(`${BASE}/#/browser`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/mobile-browser.png`, fullPage: false });
  console.log('  ✓ mobile-browser.png');
  await page.close();
}

await browser.close();
console.log('\nDone!');
