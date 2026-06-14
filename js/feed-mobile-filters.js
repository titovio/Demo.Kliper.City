(function () {
  var enhancedPanel = null;

  function cleanText(node) {
    return (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function isFeedPage() {
    return Array.prototype.some.call(document.querySelectorAll('h1, h2'), function (node) {
      return cleanText(node) === 'Лента города';
    });
  }

  function findFilterPanel() {
    if (!isFeedPage()) return null;

    Array.prototype.slice.call(document.querySelectorAll('.kliper-feed-mobile-filters')).forEach(function (node) {
      node.remove();
    });

    var candidates = Array.prototype.slice.call(document.querySelectorAll('main section div, main section'));
    var panels = candidates.filter(function (node) {
      var text = cleanText(node);
      var buttons = node.querySelectorAll('button');
      return text.indexOf('Тип публикации') !== -1 &&
        text.indexOf('Категория') !== -1 &&
        buttons.length >= 8 &&
        buttons.length <= 24;
    });

    panels.sort(function (a, b) {
      return cleanText(a).length - cleanText(b).length;
    });

    return panels[0] || null;
  }

  function findLabel(panel, labelText) {
    return Array.prototype.slice.call(panel.querySelectorAll('*')).find(function (node) {
      return !node.closest('.kliper-feed-mobile-filters') && cleanText(node) === labelText;
    });
  }

  function findRow(panel, labelText) {
    var label = findLabel(panel, labelText);
    var node = label;

    while (node && node !== panel) {
      if (node.querySelectorAll && node.querySelectorAll('button').length >= 2) {
        return node;
      }
      node = node.parentElement;
    }

    return null;
  }

  function isActiveButton(button) {
    var className = String(button.className || '');
    return className.indexOf('bg-violet-600') !== -1 ||
      className.indexOf('bg-violet-50') !== -1 ||
      className.indexOf('to-violet-700') !== -1 ||
      className.indexOf('text-violet-700') !== -1 ||
      button.getAttribute('aria-pressed') === 'true';
  }

  function getOptions(row) {
    return Array.prototype.slice.call(row.querySelectorAll('button'))
      .map(function (button) {
        return {
          text: cleanText(button),
          active: isActiveButton(button),
          button: button
        };
      })
      .filter(function (item) {
        return item.text;
      });
  }

  function currentOption(options) {
    return options.find(function (item) { return item.active; }) || options[0];
  }

  function makeSelect(title, row, type) {
    var options = getOptions(row);
    var current = currentOption(options);
    var wrap = document.createElement('div');
    wrap.className = 'kliper-feed-mobile-select';
    wrap.dataset.feedFilterType = type;
    wrap.innerHTML =
      '<label class="kliper-feed-mobile-select__button">' +
        '<span>' + title + '</span>' +
        '<strong>' + (current ? current.text : 'Выбрать') + '</strong>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>' +
        '<select class="kliper-feed-mobile-select__native" aria-label="' + title + '"></select>' +
      '</label>';

    var native = wrap.querySelector('.kliper-feed-mobile-select__native');
    options.forEach(function (option) {
      var item = document.createElement('option');
      item.value = option.text;
      item.textContent = option.text;
      item.selected = option === current;
      native.appendChild(item);
    });

    native.addEventListener('change', function (event) {
      event.stopPropagation();
      var selected = options.find(function (option) {
        return option.text === native.value;
      });
      if (selected) selected.button.click();
      window.setTimeout(enhance, 80);
    });

    return wrap;
  }

  function enhance() {
    Array.prototype.slice.call(document.querySelectorAll('.kliper-feed-mobile-filters')).forEach(function (node) {
      node.remove();
    });
    Array.prototype.slice.call(document.querySelectorAll('.kliper-feed-filter-panel')).forEach(function (node) {
      node.classList.remove('kliper-feed-filter-panel');
    });
    Array.prototype.slice.call(document.querySelectorAll('.kliper-feed-filter-row')).forEach(function (node) {
      node.classList.remove('kliper-feed-filter-row', 'kliper-feed-filter-row--type', 'kliper-feed-filter-row--category');
    });

    var panel = findFilterPanel();
    if (!panel) {
      document.body.classList.remove('kliper-feed-mobile-filters-ready');
      enhancedPanel = null;
      return;
    }

    var typeRow = findRow(panel, 'Тип публикации');
    var categoryRow = findRow(panel, 'Категория');
    if (!typeRow || !categoryRow) return;

    panel.classList.add('kliper-feed-filter-panel');
    typeRow.classList.add('kliper-feed-filter-row', 'kliper-feed-filter-row--type');
    categoryRow.classList.add('kliper-feed-filter-row', 'kliper-feed-filter-row--category');

    var mobile = document.createElement('div');
    mobile.className = 'kliper-feed-mobile-filters';
    mobile.appendChild(makeSelect('Тип публикации', typeRow, 'type'));
    mobile.appendChild(makeSelect('Категория', categoryRow, 'category'));
    panel.insertBefore(mobile, panel.firstChild);

    enhancedPanel = panel;
    document.body.classList.add('kliper-feed-mobile-filters-ready');
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('.kliper-feed-mobile-select')) {
      return;
    }

    window.setTimeout(enhance, 120);
  }, true);

  window.addEventListener('resize', function () {
    window.setTimeout(enhance, 80);
  });

  window.addEventListener('load', enhance);
  new MutationObserver(function () {
    window.clearTimeout(enhance.timer);
    enhance.timer = window.setTimeout(enhance, enhancedPanel ? 180 : 60);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
