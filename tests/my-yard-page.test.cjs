const assert = require('node:assert/strict');

const playwrightPath = process.env.PLAYWRIGHT_MODULE_PATH ||
  'C:/Users/oxv20/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/playwright@1.60.0/node_modules/playwright';
const { chromium } = require(playwrightPath);

const targetUrl = process.env.KLIPER_TEST_URL || 'http://127.0.0.1:4175/';
const executablePath = process.env.PLAYWRIGHT_BROWSER_PATH ||
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

async function readYardState(page) {
  return page.evaluate(() => {
    const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
    const root = document.querySelector('[data-kliper-my-yard-mounted="true"]');
    return {
      mountedCount: document.querySelectorAll('[data-kliper-my-yard-mounted="true"]').length,
      heading: clean(root?.querySelector('h1')?.textContent),
      activeTab: clean(root?.querySelector('.kliper-yard-tab.is-active')?.textContent),
      tabLabels: Array.from(root?.querySelectorAll('[data-yard-tab]') || []).map((node) => clean(node.textContent)),
      oldButtonCount: Array.from(document.querySelectorAll('main button'))
        .filter((node) => {
          const style = window.getComputedStyle(node);
          const rect = node.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
        })
        .map((node) => clean(node.textContent))
        .filter((text) => ['Лента района', 'Карта района', 'Компании рядом', 'Изменить район'].includes(text))
        .length,
      text: clean(root?.textContent),
      districtCatalogRoot: Boolean(document.querySelector('.kliper-district-catalog-root, #kliper-district-catalog-root')),
    };
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const pageErrors = [];
  const consoleErrors = [];

  page.on('pageerror', (error) => pageErrors.push(String(error && error.message || error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Array.from(document.querySelectorAll('button')).some((button) => button.textContent.trim() === 'Мой двор'), null, { timeout: 12000 });
  await page.locator('main button').filter({ hasText: /^Мой двор$/ }).first().click();
  await page.waitForFunction(() => document.querySelector('[data-kliper-my-yard-mounted="true"]'), null, { timeout: 12000 });

  const initial = await readYardState(page);
  assert.equal(initial.mountedCount, 1, 'my yard page should mount exactly once');
  assert.equal(initial.heading, 'Мой двор', 'my yard page should replace old district heading');
  assert.equal(initial.activeTab, 'Сегодня', 'today should be the default my yard tab');
  assert.equal(initial.oldButtonCount, 0, 'old district page buttons should not remain visible');
  assert.equal(initial.districtCatalogRoot, false, 'old district catalog overlay should not be mounted');
  assert.deepEqual(initial.tabLabels, ['Сегодня', 'Лента', 'Проблемы', 'Опросы', 'Находки и потери', 'Места рядом']);
  assert.ok(initial.text.includes('Публичная зона'), 'safety hint should render');

  await page.locator('[data-kliper-my-yard-mounted="true"] [data-yard-tab="problems"]').click();
  await page.waitForTimeout(250);
  const problems = await readYardState(page);
  assert.equal(problems.activeTab, 'Проблемы');
  assert.ok(problems.text.includes('Как работает поддержка?'), 'problems sidebar should render');
  assert.equal(problems.oldButtonCount, 0, 'old buttons should not return after tab switch');

  await page.locator('[data-kliper-my-yard-mounted="true"] [data-yard-tab="places"]').click();
  await page.waitForTimeout(250);
  const places = await readYardState(page);
  assert.equal(places.activeTab, 'Места рядом');
  assert.equal(places.heading, 'Места рядом');
  assert.ok(places.text.includes('Рядом по категориям'), 'places sidebar should render');
  assert.equal(places.oldButtonCount, 0, 'old buttons should not return after places switch');

  await browser.close();

  const runtimeErrors = pageErrors.concat(consoleErrors).join('\n');
  assert.equal(runtimeErrors.includes('NotFoundError'), false, 'my yard page should not trigger React NotFoundError');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
