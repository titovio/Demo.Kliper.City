(function () {
  var enhanceTimer = 0;
  var dom = window.KLIPER_DOM || {};

  function cleanText(node) {
    return dom.text ? dom.text(node) : (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function hasExactHeading(text) {
    return Array.prototype.some.call(document.querySelectorAll('h1, h2'), function (node) {
      return cleanText(node) === text;
    });
  }

  function isCardsCatalogPage() {
    return hasExactHeading('Новостройки') || hasExactHeading('Готовые ЖК') || hasExactHeading('Застройщики');
  }

  function reset() {
    Array.prototype.forEach.call(document.querySelectorAll('.kliper-cards-filter-head, .kliper-cards-filter-row, .kliper-cards-filter-main, .kliper-cards-filter-title, .kliper-cards-filter-tabs, .kliper-cards-filter-actions, .kliper-cards-filter-body, .kliper-cards-filter-body--suppress, .kliper-cards-param-field, .kliper-cards-param-popover'), function (node) {
      node.classList.remove(
        'kliper-cards-filter-head',
        'kliper-cards-filter-no-body',
        'kliper-cards-filter-row',
        'kliper-cards-filter-main',
        'kliper-cards-filter-title',
        'kliper-cards-filter-tabs',
        'kliper-cards-filter-actions',
        'kliper-cards-filter-body',
        'kliper-cards-filter-body--suppress',
        'kliper-cards-param-field',
        'kliper-cards-param-popover',
        'kliper-cards-param-popover--year',
        'kliper-cards-param-popover--rooms',
        'kliper-cards-param-popover--price'
      );
    });
    document.body.classList.remove('kliper-cards-mobile-filter-ready', 'kliper-cards-param-open');
  }

  function findFilterHead() {
    var headings = Array.prototype.slice.call(document.querySelectorAll('h2'));
    var title = headings.find(function (node) {
      return ['Новостройки', 'Готовые ЖК', 'Застройщики'].indexOf(cleanText(node)) !== -1;
    });
    if (!title) return null;

    var node = title;
    while (node && node !== document.body) {
      if (node.tagName === 'SECTION' && (cleanText(node).indexOf('Свернуть') !== -1 || cleanText(node).indexOf('Развернуть') !== -1)) return node;
      node = node.parentElement;
    }
    return null;
  }

  function findFilterBody() {
    var candidates = Array.prototype.slice.call(document.querySelectorAll('main section, main section > div, main section > div > div')).filter(function (node) {
      var text = cleanText(node);
      if (!text || node.classList.contains('kliper-cards-filter-head')) return false;
      return text.indexOf('Где') !== -1 &&
        text.indexOf('Сценарий покупки') !== -1 &&
        text.indexOf('Параметры') !== -1 &&
        text.indexOf('Год сдачи') !== -1 &&
        text.indexOf('Комнат') !== -1 &&
        text.indexOf('Цена') !== -1;
    }).map(function (node) {
      var rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
      return {
        node: node,
        textLength: cleanText(node).length,
        area: rect ? rect.width * rect.height : Number.MAX_SAFE_INTEGER
      };
    });

    var best = candidates.sort(function (a, b) {
      return a.textLength - b.textLength || a.area - b.area;
    })[0];
    return best ? best.node : null;
  }

  function markPopover(buttonText, popoverTitle, modifier) {
    var button = Array.prototype.slice.call(document.querySelectorAll('button')).find(function (node) {
      return cleanText(node) === buttonText || cleanText(node).indexOf(buttonText) === 0;
    });
    var popover = null;
    var field = button && button.parentElement;

    if (field) {
      popover = Array.prototype.slice.call(field.children).find(function (node) {
        return node !== button && cleanText(node).indexOf(popoverTitle) !== -1;
      });
    }

    if (!popover) {
      var titleNode = Array.prototype.slice.call(document.querySelectorAll('p, h3')).find(function (node) {
        return cleanText(node) === popoverTitle;
      });
      popover = titleNode;
      while (popover && popover.parentElement && popover.parentElement !== document.body) {
        if (String(popover.className || '').indexOf('absolute') !== -1 && cleanText(popover).indexOf(popoverTitle) !== -1) break;
        popover = popover.parentElement;
      }
      field = popover && popover.parentElement;
    }

    if (!field) return false;

    field.classList.add('kliper-cards-param-field');
    if (popover) {
      popover.classList.add('kliper-cards-param-popover', modifier);
      return true;
    }
    return false;
  }

  function enhance() {
    reset();
    if (!isCardsCatalogPage()) return;

    var head = findFilterHead();
    var body = findFilterBody();
    if (!head) return;

    head.classList.add('kliper-cards-filter-head');
    head.classList.toggle('kliper-cards-filter-no-body', !body && currentCatalogTitle() === 'Застройщики');
    if (body) body.classList.add('kliper-cards-filter-body');
    markFilterHeadParts(head);
    stripCatalogTabTooltips();

    var opened = [
      markPopover('Год сдачи', 'Год сдачи', 'kliper-cards-param-popover--year'),
      markPopover('Комнат', 'Количество комнат', 'kliper-cards-param-popover--rooms'),
      markPopover('Цена', 'Цена, млн ₽', 'kliper-cards-param-popover--price')
    ].some(Boolean);

    document.body.classList.add('kliper-cards-mobile-filter-ready');
    document.body.classList.toggle('kliper-cards-param-open', opened);
  }

  function collapseFilterIfOpen() {
    var body = findFilterBody();
    if (body) {
      body.classList.add('kliper-cards-filter-body', 'kliper-cards-filter-body--suppress');
    }
  }

  function silentlyCollapseFilterAfterSwitch() {
    document.body.classList.add('kliper-cards-filter-switching');
    collapseFilterIfOpen();

    window.setTimeout(function () {
      var action = Array.prototype.slice.call(document.querySelectorAll('.kliper-cards-filter-actions button')).find(function (node) {
        return cleanText(node) === 'Свернуть фильтр';
      });
      if (action) action.click();
    }, 80);

    window.setTimeout(function () {
      document.body.classList.remove('kliper-cards-filter-switching');
      schedule(20);
    }, 180);
  }

  function isCatalogTabButton(node) {
    if (!node) return false;
    if (!node.closest('.kliper-cards-filter-tabs')) return false;
    return ['Застройщики', 'Новостройки', 'Готовые ЖК', 'Для бизнеса', 'Риелторы'].indexOf(cleanText(node)) !== -1;
  }

  function markFilterHeadParts(head) {
    var row = head && head.firstElementChild;
    var main = row && row.children && row.children[0];
    var actions = row && row.children && row.children[1];
    var title = main && main.children && main.children[0];
    var tabs = main && main.children && main.children[1];

    if (row) row.classList.add('kliper-cards-filter-row');
    if (main) main.classList.add('kliper-cards-filter-main');
    if (title) title.classList.add('kliper-cards-filter-title');
    if (tabs) tabs.classList.add('kliper-cards-filter-tabs');
    if (actions) actions.classList.add('kliper-cards-filter-actions');
  }

  function currentCatalogTitle() {
    var title = Array.prototype.slice.call(document.querySelectorAll('h2')).find(function (node) {
      return ['Застройщики', 'Новостройки', 'Готовые ЖК'].indexOf(cleanText(node)) !== -1;
    });
    return title ? cleanText(title) : '';
  }

  function isCurrentCatalogTabButton(node) {
    return isCatalogTabButton(node) && cleanText(node) === currentCatalogTitle();
  }

  function stripCatalogTabTooltips() {
    Array.prototype.forEach.call(document.querySelectorAll('button[title]'), function (button) {
      if (isCatalogTabButton(button)) button.removeAttribute('title');
    });
  }

  function isFilterExpandButton(node) {
    if (!node) return false;
    return cleanText(node).indexOf('Развернуть') !== -1;
  }

  function releaseFilterBody() {
    document.body.classList.remove('kliper-cards-filter-switching');
    Array.prototype.forEach.call(document.querySelectorAll('.kliper-cards-filter-body--suppress'), function (node) {
      node.classList.remove('kliper-cards-filter-body--suppress');
    });
  }

  function schedule(delay) {
    window.clearTimeout(enhanceTimer);
    enhanceTimer = window.setTimeout(enhance, delay || 80);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('button');
    if (isCatalogTabButton(button)) {
      if (isCurrentCatalogTabButton(button)) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        schedule(80);
        return;
      }
      silentlyCollapseFilterAfterSwitch();
    } else if (isFilterExpandButton(button)) {
      releaseFilterBody();
    }
    schedule(80);
  }, true);

  window.addEventListener('resize', function () {
    schedule(80);
  });

  window.addEventListener('load', function () {
    schedule(120);
  });

  new MutationObserver(function () {
    schedule(140);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
