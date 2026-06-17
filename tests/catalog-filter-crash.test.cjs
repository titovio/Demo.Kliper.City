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
    const cards = Array.from(document.querySelectorAll('[aria-label^="Открыть карточку"]'));
    const heading = Array.from(document.querySelectorAll('h1,h2'))
      .map((node) => clean(node.textContent))
      .find(Boolean) || '';
    const cardCountLabel = Array.from(document.querySelectorAll('p'))
      .map((node) => clean(node.textContent))
      .find((text) => /карточки$/.test(text)) || '';
    const visible = (node) => {
      if (!node) return false;
      const style = window.getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
    };
    const cleanFilterToggle = document.querySelector('[data-clean-filter-toggle]');

    return {
      heading,
      cardCountLabel,
      domCardCount: cards.length,
      resultToolbarVisible: (() => {
        const toolbar = document.querySelector('.kliper-cards-result-toolbar');
        if (!toolbar) return false;
        const style = window.getComputedStyle(toolbar);
        const rect = toolbar.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
      })(),
      resultToolbarText: clean(document.querySelector('.kliper-cards-result-toolbar')?.textContent),
      resultToolbarButtonCount: document.querySelectorAll('.kliper-cards-result-toolbar button').length,
      cleanFilterToggleText: visible(cleanFilterToggle) ? clean(cleanFilterToggle.textContent) : '',
      cleanFilterExpanded: visible(cleanFilterToggle) ? cleanFilterToggle.getAttribute('aria-expanded') || '' : '',
      cleanFilterVisible: (() => {
        const panel = document.querySelector('.kliper-cards-clean-filter');
        if (!panel) return false;
        const style = window.getComputedStyle(panel);
        const rect = panel.getBoundingClientRect();
        return !panel.hidden && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
      })(),
      cleanFilterText: clean(document.querySelector('.kliper-cards-clean-filter')?.textContent),
      visualTabs: Array.from(document.querySelectorAll('.kliper-cards-visual-filter [data-visual-cards-tab]'))
        .map((node) => clean(node.textContent)),
      activeVisualTabs: Array.from(document.querySelectorAll('.kliper-cards-visual-filter [data-visual-cards-tab].is-active'))
        .map((node) => clean(node.textContent)),
      filterToResultToolbarGap: (() => {
        const filter = document.querySelector('.kliper-cards-visual-filter');
        const toolbar = document.querySelector('.kliper-cards-result-toolbar');
        if (!filter || !toolbar) return null;
        return Math.round(toolbar.getBoundingClientRect().top - filter.getBoundingClientRect().bottom);
      })(),
      rootTextLength: clean(document.getElementById('root')?.textContent).length,
      bodyTextLength: clean(document.body.textContent).length,
      visualFilterExists: Boolean(document.querySelector('.kliper-cards-visual-filter')),
      hasPopupFilterText: Array.from(document.querySelectorAll('.kliper-cards-source-filter, .kliper-cards-source-filter-body, .kliper-cards-source-filter-overlay, .kliper-cards-old-filter-shell')).some((node) => {
        const style = window.getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
      }),
    };
  });
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

  await page.goto(targetUrl, { waitUntil: 'commit' });
  await page.waitForFunction(() => Boolean(document.querySelector('.kliper-cards-visual-filter')), null, { timeout: 12000 });
  await page.waitForTimeout(600);

  const initial = await readCatalogState(page);
  assert.equal(initial.heading, 'Застройщики');
  assert.ok(initial.visualFilterExists, 'visual catalog filter should be mounted');
  assert.ok(initial.domCardCount > 0, 'initial catalog should render cards');
  assert.equal(initial.resultToolbarVisible, true, 'result toolbar should be visible');
  assert.ok(initial.resultToolbarButtonCount >= 3, 'result toolbar should keep card view switch buttons');
  assert.ok(initial.filterToResultToolbarGap <= 20, 'result toolbar should sit directly below the visual filter');
  assert.equal(initial.cleanFilterToggleText, '', 'clean popup filter button should be hidden on developers tab');
  assert.equal(initial.cleanFilterExpanded, '', 'clean popup filter button should be absent on developers tab');
  assert.equal(initial.cleanFilterVisible, false, 'clean popup filter panel should be hidden by default');
  assert.equal(initial.hasPopupFilterText, false, 'old popup filter text should not be visible initially');
  assert.deepEqual(
    initial.visualTabs,
    ['Застройщики', 'Новостройки', 'Новые районы', 'Обжитые районы', 'Для бизнеса', 'Риелторы'],
    'visual tabs should include district age filters after new buildings'
  );

  await page.locator('.kliper-cards-visual-filter button', { hasText: 'Новостройки' }).click();
  await page.waitForTimeout(900);
  const afterNewBuildings = await readCatalogState(page);
  assert.equal(afterNewBuildings.heading, 'Новостройки');
  assert.ok(afterNewBuildings.domCardCount > 0, 'new buildings should render cards');
  assert.equal(afterNewBuildings.resultToolbarVisible, true, 'result toolbar should stay visible on new buildings tab');
  assert.ok(afterNewBuildings.resultToolbarButtonCount >= 3, 'result toolbar switch buttons should stay visible on new buildings tab');
  assert.ok(afterNewBuildings.filterToResultToolbarGap <= 20, 'result toolbar should stay directly below the visual filter on new buildings tab');
  assert.equal(afterNewBuildings.cleanFilterToggleText, 'Открыть фильтр', 'clean popup filter button should show on new buildings tab');
  assert.equal(afterNewBuildings.cleanFilterExpanded, 'false', 'clean popup filter should be collapsed by default on new buildings tab');
  assert.equal(afterNewBuildings.hasPopupFilterText, false, 'old popup filter text should stay hidden on new buildings tab');

  await page.locator('[data-visual-cards-tab="Новостройки"]').click();
  await page.waitForTimeout(250);
  const afterRepeatedNewBuildingsClick = await readCatalogState(page);
  assert.equal(afterRepeatedNewBuildingsClick.cleanFilterExpanded, 'true', 'repeated click on the active visual tab should open its clean filter');
  assert.equal(afterRepeatedNewBuildingsClick.cleanFilterVisible, true, 'active visual tab should expose its clean filter on the second click');

  await page.locator('[data-visual-cards-tab="Новостройки"]').click();
  await page.waitForTimeout(250);
  const afterThirdNewBuildingsClick = await readCatalogState(page);
  assert.equal(afterThirdNewBuildingsClick.cleanFilterExpanded, 'false', 'another click on the active visual tab should close its clean filter');
  assert.equal(afterThirdNewBuildingsClick.cleanFilterVisible, false, 'active visual tab should hide its clean filter on the third click');

  await page.locator('.kliper-cards-visual-filter button', { hasText: 'Новые районы' }).click();
  await page.waitForTimeout(900);
  const afterNewDistricts = await readCatalogState(page);
  assert.equal(afterNewDistricts.heading, 'Новостройки');
  assert.deepEqual(afterNewDistricts.activeVisualTabs, ['Новые районы'], 'new districts visual filter should be active inside new buildings');
  assert.equal(afterNewDistricts.cleanFilterToggleText, 'Открыть фильтр', 'clean popup filter should stay available for new districts visual filter');

  await page.locator('[data-clean-filter-toggle]').click();
  await page.waitForTimeout(250);
  const afterOpenCleanFilter = await readCatalogState(page);
  assert.equal(afterOpenCleanFilter.cleanFilterToggleText, 'Скрыть фильтр', 'clean popup filter button should switch to hide label');
  assert.equal(afterOpenCleanFilter.cleanFilterExpanded, 'true', 'clean popup filter button should report expanded state');
  assert.equal(afterOpenCleanFilter.cleanFilterVisible, true, 'clean popup filter panel should open');
  assert.ok(afterOpenCleanFilter.cleanFilterText.includes('Где'), 'clean popup filter should render location row');
  assert.ok(afterOpenCleanFilter.cleanFilterText.includes('Сценарий покупки'), 'clean popup filter should render new-buildings scenario row');
  assert.equal(afterOpenCleanFilter.cleanFilterText.includes('Новые районы'), false, 'new district filter should live in visual tabs');
  assert.equal(afterOpenCleanFilter.cleanFilterText.includes('Обжитые районы'), false, 'settled district filter should live in visual tabs');
  assert.ok(afterOpenCleanFilter.cleanFilterText.includes('Год сдачичастично сдан202620272028+'), 'clean popup filter should render year tags instead of rooms and price');
  assert.equal(afterOpenCleanFilter.cleanFilterText.includes('Комнат'), false, 'clean popup filter should not render rooms field');
  assert.equal(afterOpenCleanFilter.cleanFilterText.includes('Цена'), false, 'clean popup filter should not render price field');
  assert.equal(afterOpenCleanFilter.hasPopupFilterText, false, 'old popup filter text should stay hidden when clean filter is open');

  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.scrollBehavior = 'auto';
    window.scrollTo(0, 900);
  });
  await page.waitForTimeout(700);
  const scrollBeforeStabilityWait = await page.evaluate(() => window.scrollY);
  await page.waitForTimeout(1200);
  const scrollAfterStabilityWait = await page.evaluate(() => window.scrollY);
  assert.ok(
    Math.abs(scrollAfterStabilityWait - scrollBeforeStabilityWait) <= 45,
    'visual filter maintenance should not cause page scroll jumps'
  );

  await page.locator('[data-clean-filter-value="частично сдан"]').click();
  await page.waitForTimeout(900);
  const afterCompleted = await readCatalogState(page);

  const runtimeErrors = pageErrors.concat(consoleErrors).join('\n');
  assert.ok(!runtimeErrors.includes('NotFoundError'), 'switching filters must not trigger React NotFoundError');
  assert.equal(afterCompleted.heading, 'Сданные дома');
  assert.ok(afterCompleted.rootTextLength > 0, 'React root should not become empty');
  assert.ok(afterCompleted.bodyTextLength > 0, 'page body should not be blank');
  assert.ok(afterCompleted.domCardCount > 0, 'completed houses should render cards');
  assert.equal(afterCompleted.resultToolbarVisible, true, 'result toolbar should stay visible on completed houses tab');
  assert.ok(afterCompleted.resultToolbarButtonCount >= 3, 'result toolbar switch buttons should stay visible on completed houses tab');
  assert.ok(afterCompleted.filterToResultToolbarGap <= 20, 'result toolbar should stay directly below the visual filter on completed houses tab');
  assert.equal(afterCompleted.hasPopupFilterText, false, 'old popup filter text should stay hidden on completed houses tab');
  assert.ok(
    Array.from(await page.locator('.kliper-cards-visual-filter [data-visual-cards-tab]').evaluateAll((nodes) => nodes.map((node) => node.textContent.trim()))).indexOf('Сданные дома') === -1,
    'completed houses should not be shown as a top-level visual tab'
  );

  const afterOpenCompletedCleanFilter = await readCatalogState(page);
  assert.equal(afterOpenCompletedCleanFilter.cleanFilterVisible, true, 'clean popup filter panel should open on completed houses tab');
  assert.ok(afterOpenCompletedCleanFilter.cleanFilterText.includes('Сценарий покупки'), 'completed houses clean filter should match new-buildings scenario row');
  assert.ok(afterOpenCompletedCleanFilter.cleanFilterText.includes('семейная ипотека'), 'completed houses clean filter should match new-buildings tags row');
  assert.equal(afterOpenCompletedCleanFilter.cleanFilterText.includes('Новые районы'), false, 'completed houses clean filter should not duplicate new district visual tab');
  assert.equal(afterOpenCompletedCleanFilter.cleanFilterText.includes('Обжитые районы'), false, 'completed houses clean filter should not duplicate settled district visual tab');
  assert.ok(afterOpenCompletedCleanFilter.cleanFilterText.includes('Год сдачичастично сдан202620272028+'), 'completed houses clean filter should match new-buildings year tags row');
  assert.equal(afterOpenCompletedCleanFilter.cleanFilterText.includes('Комнат'), false, 'completed houses clean filter should not render rooms field');
  assert.equal(afterOpenCompletedCleanFilter.cleanFilterText.includes('Цена'), false, 'completed houses clean filter should not render price field');
  await page.locator('[data-clean-filter-toggle]').click();
  await page.waitForTimeout(250);

  await page.locator('.kliper-cards-visual-filter button', { hasText: 'Для бизнеса' }).click();
  await page.waitForTimeout(900);
  const afterBusiness = await readCatalogState(page);
  assert.equal(afterBusiness.heading, 'Для бизнеса');
  assert.equal(afterBusiness.resultToolbarVisible, true, 'result toolbar should stay visible on business tab');
  assert.ok(afterBusiness.resultToolbarButtonCount >= 3, 'result toolbar switch buttons should stay visible on business tab');
  assert.ok(afterBusiness.filterToResultToolbarGap <= 20, 'result toolbar should stay directly below the visual filter on business tab');
  assert.equal(afterBusiness.hasPopupFilterText, false, 'old popup filter should stay hidden on business tab');

  await page.locator('.kliper-cards-visual-filter button', { hasText: 'Риелторы' }).click();
  await page.waitForTimeout(900);
  const afterRealtors = await readCatalogState(page);
  assert.equal(afterRealtors.heading, 'Риелторы');
  assert.equal(afterRealtors.cleanFilterToggleText, '', 'clean popup filter button should be hidden on realtors tab');
  assert.equal(afterRealtors.cleanFilterVisible, false, 'clean popup filter panel should be absent on realtors tab');
  assert.equal(afterRealtors.hasPopupFilterText, false, 'old popup filter should stay hidden on realtors tab');

  await browser.close();
})().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
