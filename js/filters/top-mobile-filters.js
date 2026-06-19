(function () {
  var dom = window.KLIPER_DOM || {};

  function text(node) {
    return dom.text ? dom.text(node) : (node && node.textContent ? node.textContent : '').trim();
  }

  function findWinnersPanel() {
    const headings = Array.from(document.querySelectorAll('h2'));
    const heading = headings.find((node) => ['Топ месяца', 'Победители месяца'].includes(text(node)));
    return heading ? heading.closest('[class*="rounded-"][class*="bg-white"]') : null;
  }

  function getActiveValue(row) {
    const active = Array.from(row.querySelectorAll('button')).find((button) => {
      const className = button.getAttribute('class') || '';
      return className.includes('bg-slate-950') || className.includes('bg-violet-600');
    });
    return text(active || row.querySelector('button'));
  }

  function clickMatching(row, value) {
    const button = Array.from(row.querySelectorAll('button')).find((item) => text(item) === value);
    if (button) button.click();
  }

  function makeField(label, row) {
    const field = document.createElement('label');
    field.className = 'kliper-mobile-filter-field';

    const caption = document.createElement('span');
    caption.textContent = label;

    const select = document.createElement('select');
    Array.from(row.querySelectorAll('button')).forEach((button) => {
      const optionText = text(button);
      if (!optionText || optionText.startsWith('Ещё') || optionText === 'Свернуть' || optionText === 'Все' || optionText === 'Все разделы') return;
      const option = document.createElement('option');
      option.value = optionText;
      option.textContent = optionText;
      select.appendChild(option);
    });
    select.value = getActiveValue(row);
    select.addEventListener('change', () => clickMatching(row, select.value));

    field.append(caption, select);
    return field;
  }

  function enhanceTopFilters() {
    const panel = findWinnersPanel();
    if (!panel) return;

    const rows = Array.from(panel.children).filter((child) => {
      const className = child.getAttribute('class') || '';
      return child.classList.contains('kliper-top-filter-row') ||
        (child.querySelectorAll('button').length > 1 && className.includes('overflow-x-auto'));
    });
    const groupRow = rows[0];
    const categoryRow = rows[1];
    if (!groupRow || !categoryRow) return;

    groupRow.classList.add('kliper-top-filter-row');
    categoryRow.classList.add('kliper-top-filter-row');

    const signature = [groupRow, categoryRow].map((row) => (
      Array.from(row.querySelectorAll('button'))
        .map((button) => `${text(button)}:${getActiveValue(row) === text(button) ? '1' : '0'}`)
        .join('|')
    )).join('::');

    let mobile = panel.querySelector(':scope > .kliper-top-mobile-filters');
    if (mobile && mobile.dataset.signature === signature) return;

    if (!mobile) {
      mobile = document.createElement('div');
      mobile.className = 'kliper-top-mobile-filters';
      groupRow.before(mobile);
    }
    mobile.dataset.signature = signature;
    mobile.replaceChildren();
    mobile.append(makeField('Раздел', groupRow), makeField('Категория', categoryRow));
  }

  function scheduleEnhance() {
    window.requestAnimationFrame(enhanceTopFilters);
  }

  if (dom.onReady) {
    dom.onReady(scheduleEnhance);
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleEnhance, { once: true });
  } else {
    scheduleEnhance();
  }

  new MutationObserver(scheduleEnhance).observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
