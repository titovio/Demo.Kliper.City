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
    return hasExactHeading('Новостройки') || hasExactHeading('Сданные дома') || hasExactHeading('Застройщики');
  }

  function reset() {
    Array.prototype.forEach.call(document.querySelectorAll('.kliper-cards-filter-head, .kliper-cards-filter-body, .kliper-cards-param-field, .kliper-cards-param-popover'), function (node) {
      node.classList.remove(
        'kliper-cards-filter-head',
        'kliper-cards-filter-body',
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
      return ['Новостройки', 'Сданные дома', 'Застройщики'].indexOf(cleanText(node)) !== -1;
    });
    if (!title) return null;

    var node = title;
    while (node && node !== document.body) {
      if (node.tagName === 'SECTION' && cleanText(node).indexOf('Свернуть') !== -1) return node;
      node = node.parentElement;
    }
    return null;
  }

  function findFilterBody() {
    var candidates = Array.prototype.slice.call(document.querySelectorAll('main section'));
    return candidates.find(function (node) {
      var text = cleanText(node);
      return text.indexOf('Где') !== -1 &&
        text.indexOf('Сценарий покупки') !== -1 &&
        text.indexOf('Параметры') !== -1 &&
        text.indexOf('Год сдачи') !== -1 &&
        text.indexOf('Комнат') !== -1 &&
        text.indexOf('Цена') !== -1;
    }) || null;
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
    if (!head || !body) return;

    head.classList.add('kliper-cards-filter-head');
    body.classList.add('kliper-cards-filter-body');

    var opened = [
      markPopover('Год сдачи', 'Год сдачи', 'kliper-cards-param-popover--year'),
      markPopover('Комнат', 'Количество комнат', 'kliper-cards-param-popover--rooms'),
      markPopover('Цена', 'Цена, млн ₽', 'kliper-cards-param-popover--price')
    ].some(Boolean);

    document.body.classList.add('kliper-cards-mobile-filter-ready');
    document.body.classList.toggle('kliper-cards-param-open', opened);
  }

  function collapseFilterIfOpen() {
    var head = findFilterHead();
    if (!head) return;
    var collapseButton = Array.prototype.slice.call(head.querySelectorAll('button')).find(function (node) {
      return cleanText(node).indexOf('Свернуть') !== -1;
    });
    if (collapseButton) collapseButton.click();
  }

  function isCatalogTabButton(node) {
    if (!node) return false;
    return ['Застройщики', 'Новостройки', 'Сданные дома', 'Для бизнеса', 'Риелторы'].indexOf(cleanText(node)) !== -1;
  }

  function schedule(delay) {
    window.clearTimeout(enhanceTimer);
    enhanceTimer = window.setTimeout(enhance, delay || 80);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('button');
    if (isCatalogTabButton(button)) {
      window.setTimeout(collapseFilterIfOpen, 180);
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
