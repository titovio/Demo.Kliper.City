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

async function readCatalogState(page) {
  return page.evaluate(() => {
    const clean = (value) => String(value || '').replace(/\s+/g, ' ').trim();
    const visible = (node) => {
      if (!node) return false;
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
    };
    const buttons = Array.from(document.querySelectorAll('main button'))
      .filter(visible)
      .map((node) => clean(node.textContent))
      .filter(Boolean);
    const mainText = clean(document.querySelector('main')?.textContent);
    return {
      heading: Array.from(document.querySelectorAll('h1,h2'))
        .map((node) => clean(node.textContent))
        .find(Boolean) || '',
      cardCountLabel: Array.from(document.querySelectorAll('p'))
        .map((node) => clean(node.textContent))
        .find((text) => /карточки$/.test(text)) || '',
      domCardCount: document.querySelectorAll('[aria-label^="Открыть карточку"]').length,
      buttons,
      mainText,
      oldVisualFilterExists: Boolean(document.querySelector('.kliper-cards-visual-filter')),
      oldVisualTabExists: Boolean(document.querySelector('[data-visual-cards-tab]')),
      oldVisualScriptLoaded: Array.from(document.scripts).some((script) => /cards-visual-section-filter/.test(script.src)),
      rootTextLength: clean(document.getElementById('root')?.textContent).length,
      bodyTextLength: clean(document.body.textContent).length,
    };
  });
}

async function clickMainButton(page, label) {
  await page.locator('main button').filter({ hasText: new RegExp(`^${label}$`) }).first().click();
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const pageErrors = [];
  const consoleErrors = [];

  page.on('pageerror', (error) => pageErrors.push(String(error && error.message || error)));
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text());
  });

  await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => document.querySelectorAll('main button').length > 3, null, { timeout: 12000 });
  await page.waitForTimeout(600);

  const initial = await readCatalogState(page);
  assert.equal(initial.oldVisualFilterExists, false, 'removed visual catalog filter should not be mounted');
  assert.equal(initial.oldVisualTabExists, false, 'removed visual catalog tab data attributes should not exist');
  assert.equal(initial.oldVisualScriptLoaded, false, 'removed visual filter script should not be loaded');
  assert.ok(initial.domCardCount > 0, 'initial catalog should render cards');
  assert.ok(initial.buttons.includes('Застройщики'), 'React catalog tabs should render developers tab');
  assert.ok(initial.buttons.includes('Новостройки'), 'React catalog tabs should render new buildings tab');
  assert.ok(initial.buttons.includes('Готовые ЖК'), 'React catalog tabs should render ready residential complexes tab');
  assert.equal(initial.buttons.includes('Новые районы'), false, 'new districts should not be a top-level real estate tab');
  assert.equal(
    initial.buttons.indexOf('Готовые ЖК'),
    initial.buttons.indexOf('Новостройки') + 1,
    'ready residential complexes tab should sit immediately after new buildings'
  );

  await clickMainButton(page, 'Новостройки');
  await page.waitForTimeout(700);
  const afterNewBuildings = await readCatalogState(page);
  assert.equal(afterNewBuildings.heading, 'Новостройки');
  assert.ok(afterNewBuildings.domCardCount > 0, 'new buildings should render cards');
  assert.equal(afterNewBuildings.buttons.includes('Новые районы'), false, 'new districts should stay hidden from React tabs');
  assert.ok(afterNewBuildings.buttons.includes('Районы'), 'settled district filter should be available in React tabs');
  assert.ok(afterNewBuildings.mainText.includes('Все районы'), 'React detail filter should render default location value');
  assert.equal(afterNewBuildings.mainText.includes('Подобрать новостройку'), false, 'instant new building filter should not render a title');
  assert.equal(afterNewBuildings.mainText.includes('Показать ЖК'), false, 'instant new building filter should not render submit button');
  assert.equal(afterNewBuildings.mainText.includes('Выберите район'), false, 'new building picker should not render full district list drawer');
  assert.ok(afterNewBuildings.mainText.includes('Выгодно'), 'React detail filter should render buyer tag drawers');
  assert.ok(afterNewBuildings.mainText.includes('Инвестиции'), 'React detail filter should render investment drawer');
  assert.ok(afterNewBuildings.mainText.includes('Год сдачи'), 'React detail filter should render year row');
  assert.equal(afterNewBuildings.oldVisualFilterExists, false, 'old visual filter should not reappear on new buildings');

  await clickMainButton(page, 'Готовые ЖК');
  await page.waitForTimeout(500);
  const afterReadyComplexes = await readCatalogState(page);
  assert.equal(afterReadyComplexes.heading, 'Готовые ЖК');
  assert.ok(afterReadyComplexes.rootTextLength > 0, 'React root should not become empty after ready complexes tab');
  assert.ok(afterReadyComplexes.bodyTextLength > 0, 'page body should not become blank after ready complexes tab');
  assert.equal(afterReadyComplexes.oldVisualFilterExists, false, 'old visual filter should not reappear on ready complexes');

  await clickMainButton(page, 'Районы');
  await page.waitForTimeout(500);
  const afterSettledDistricts = await readCatalogState(page);
  assert.equal(afterSettledDistricts.heading, 'Районы');
  assert.ok(afterSettledDistricts.rootTextLength > 0, 'React root should not become empty after settled district filter');
  assert.ok(afterSettledDistricts.bodyTextLength > 0, 'page body should not become blank after settled district filter');
  assert.equal(afterSettledDistricts.oldVisualFilterExists, false, 'old visual filter should not reappear on settled districts');

  await clickMainButton(page, 'Застройщики');
  await page.waitForTimeout(500);
  const afterDevelopers = await readCatalogState(page);
  assert.equal(afterDevelopers.heading, 'Застройщики');
  assert.equal(afterDevelopers.mainText.includes('Где'), false, 'developers section should not render detail filter body');
  assert.equal(afterDevelopers.oldVisualFilterExists, false, 'old visual filter should not reappear on developers');

  const runtimeErrors = pageErrors.concat(consoleErrors).join('\n');
  assert.ok(!runtimeErrors.includes('NotFoundError'), 'switching filters must not trigger React NotFoundError');

  await browser.close();
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
