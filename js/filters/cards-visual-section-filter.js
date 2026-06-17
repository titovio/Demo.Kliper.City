(function () {
  var labels = ['Застройщики', 'Новостройки', 'Новые районы', 'Обжитые районы', 'Для бизнеса', 'Риелторы'];
  var districtAgeLabels = ['Новые районы', 'Обжитые районы'];
  var pageLabels = ['Застройщики', 'Новостройки', 'Сданные дома', 'Для бизнеса', 'Риелторы'];
  var shellClass = 'kliper-cards-visual-filter';
  var readyClass = 'kliper-cards-visual-filter-ready';
  var timer = 0;
  var filterOpen = false;
  var optionState = {
    where: 'Все районы',
    scenario: 'Для семьи',
    business: 'Офис',
    year: '2026',
    districtAge: ''
  };

  function hasCleanFilter(active) {
    return active !== 'Застройщики' && active !== 'Риелторы';
  }

  function isDistrictAgeLabel(label) {
    return districtAgeLabels.indexOf(label) !== -1;
  }

  function cleanText(node) {
    return (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function currentTitle() {
    var title = Array.prototype.slice.call(document.querySelectorAll('h1,h2')).find(function (node) {
      return pageLabels.indexOf(cleanText(node)) !== -1;
    });
    return title ? cleanText(title) : '';
  }

  function findSourceHead() {
    var marked = document.querySelector('.kliper-cards-source-filter, .kliper-cards-filter-head');
    if (marked) return marked;

    var title = Array.prototype.slice.call(document.querySelectorAll('h2')).find(function (node) {
      return pageLabels.indexOf(cleanText(node)) !== -1;
    });
    if (!title) return null;

    var node = title;
    while (node && node !== document.body) {
      var text = cleanText(node);
      if (node.tagName === 'SECTION' && pageLabels.every(function (label) {
        return text.indexOf(label) !== -1;
      })) {
        return node;
      }
      node = node.parentElement;
    }

    return null;
  }

  function findSourceBodies() {
    var matches = Array.prototype.slice.call(document.querySelectorAll('main section section, main section > div, main section > div > div, main section > div > div > div')).filter(function (node) {
      var text = cleanText(node);
      if (!text || node.classList.contains(shellClass)) return false;
      if (node.closest('.' + shellClass)) return false;
      if (node.querySelector('.' + shellClass + ', .kliper-cards-source-filter')) return false;
      if (node.querySelector('[aria-label^="Открыть карточку"]')) return false;
      return text.indexOf('Где') !== -1 &&
        text.indexOf('Параметры') !== -1;
    });

    matches = matches.filter(function (node) {
      return !matches.some(function (other) {
        return other !== node && node.contains(other);
      });
    });

    return matches.map(function (node) {
      var rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
      return {
        node: node,
        textLength: cleanText(node).length,
        area: rect ? rect.width * rect.height : Number.MAX_SAFE_INTEGER
      };
    }).sort(function (a, b) {
      return a.textLength - b.textLength || a.area - b.area;
    }).map(function (item) {
      return item.node;
    });
  }

  function markSourceBodies(bodies) {
    if (!bodies.length) {
      Array.prototype.forEach.call(document.querySelectorAll('.' + shellClass + ' .kliper-cards-source-filter-body'), function (node) {
        node.classList.remove('kliper-cards-source-filter-body');
        node.removeAttribute('aria-hidden');
      });
      return;
    }

    var keep = new Set(bodies);
    Array.prototype.forEach.call(document.querySelectorAll('.kliper-cards-source-filter-body'), function (node) {
      if (keep.has(node)) return;
      if (node.closest('.' + shellClass)) {
        node.classList.remove('kliper-cards-source-filter-body');
        node.removeAttribute('aria-hidden');
      }
    });

    bodies.forEach(function (body) {
      if (body.getAttribute('aria-hidden') !== 'true') body.setAttribute('aria-hidden', 'true');
      if (!body.classList.contains('kliper-cards-source-filter-body')) {
        body.classList.add('kliper-cards-source-filter-body');
      }
    });
  }

  function disableSourcePopupFilter(head) {
    if (!head) return;
    Array.prototype.forEach.call(head.querySelectorAll('button'), function (button) {
      var text = cleanText(button);
      if (text.indexOf('Развернуть') !== -1 || text.indexOf('Свернуть') !== -1) {
        button.setAttribute('aria-hidden', 'true');
        button.setAttribute('tabindex', '-1');
        button.disabled = true;
        button.style.display = 'none';
      }
    });
  }

  function markResultToolbar() {
    var toolbar = Array.prototype.slice.call(document.querySelectorAll('main section > div > div, main section > div')).find(function (node) {
      var text = cleanText(node);
      if (!/^\d+\s+карточки$/.test(text)) return false;
      return node.querySelectorAll('button').length >= 3 ||
        (!!node.nextElementSibling && !!node.nextElementSibling.querySelector('[aria-label^="Открыть карточку"]'));
    });

    Array.prototype.forEach.call(document.querySelectorAll('.kliper-cards-result-toolbar'), function (node) {
      if (node !== toolbar) node.classList.remove('kliper-cards-result-toolbar');
    });

    if (toolbar) {
      toolbar.classList.add('kliper-cards-result-toolbar');
    }
  }

  function markOldFilterShells() {
    var visual = document.querySelector('.' + shellClass);
    var firstCard = document.querySelector('[aria-label^="Открыть карточку"]');
    var resultStart = firstCard || Array.prototype.slice.call(document.querySelectorAll('main section > div, main section > div > div')).find(function (node) {
      return /^\d+\s+карточки/.test(cleanText(node));
    });
    if (!visual || !resultStart || !visual.getBoundingClientRect || !resultStart.getBoundingClientRect) {
      Array.prototype.forEach.call(document.querySelectorAll('.' + shellClass + ' .kliper-cards-old-filter-shell'), function (node) {
        node.classList.remove('kliper-cards-old-filter-shell');
        node.removeAttribute('aria-hidden');
      });
      return;
    }

    var visualBottom = visual.getBoundingClientRect().bottom;
    var resultTop = resultStart.getBoundingClientRect().top;
    var keep = [];
    Array.prototype.forEach.call(document.querySelectorAll('main section > div, main section > div > div'), function (node) {
      if (node.classList.contains(shellClass)) return;
      if (node.querySelector('.' + shellClass + ', [aria-label^="Открыть карточку"]')) return;
      if (cleanText(node)) return;

      var rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
      if (!rect || rect.height < 20) return;
      if (rect.top < visualBottom - 1 || rect.top > resultTop) return;

      if (node.getAttribute('aria-hidden') !== 'true') node.setAttribute('aria-hidden', 'true');
      if (!node.classList.contains('kliper-cards-old-filter-shell')) {
        node.classList.add('kliper-cards-old-filter-shell');
      }
      keep.push(node);
    });

    Array.prototype.forEach.call(document.querySelectorAll('.' + shellClass + ' .kliper-cards-old-filter-shell'), function (node) {
      if (keep.indexOf(node) !== -1) return;
      node.classList.remove('kliper-cards-old-filter-shell');
      node.removeAttribute('aria-hidden');
    });
  }

  function markSourceOverlays() {
    Array.prototype.forEach.call(document.querySelectorAll('aside, body div'), function (node) {
      var text = cleanText(node);
      if (text.indexOf('Выбрать район') === -1 || text.indexOf('Все районы города') === -1) return;
      if (node.tagName !== 'ASIDE' && window.getComputedStyle(node).position !== 'fixed') return;

      if (node.getAttribute('aria-hidden') !== 'true') node.setAttribute('aria-hidden', 'true');
      if (!node.classList.contains('kliper-cards-source-filter-overlay')) {
        node.classList.add('kliper-cards-source-filter-overlay');
      }

      var parent = node.parentElement;
      while (parent && parent !== document.body) {
        if (window.getComputedStyle(parent).position === 'fixed') {
          if (parent.getAttribute('aria-hidden') !== 'true') parent.setAttribute('aria-hidden', 'true');
          if (!parent.classList.contains('kliper-cards-source-filter-overlay')) {
            parent.classList.add('kliper-cards-source-filter-overlay');
          }
          break;
        }
        parent = parent.parentElement;
      }
    });
  }

  function findSourceButton(label) {
    var head = findSourceHead();
    if (!head) return null;
    return Array.prototype.slice.call(head.querySelectorAll('button')).find(function (button) {
      return button.getAttribute('aria-label') === label || cleanText(button) === label;
    }) || null;
  }

  function renderButton(label, active) {
    var icons = {
      'Застройщики': '<path d="M3 21h18M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"></path>',
      'Новостройки': '<path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6M8 10h1M15 10h1"></path>',
      'Новые районы': '<path d="M4 20V7l5-3 6 3 5-3v13l-5 3-6-3-5 3ZM9 4v13M15 7v13"></path>',
      'Обжитые районы': '<path d="M3 21h18M5 21v-9l7-6 7 6v9M9 21v-5h6v5M7 9V5h3"></path>',
      'Для бизнеса': '<path d="M4 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2ZM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M2 12h20M10 12v2h4v-2"></path>',
      'Риелторы': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM19 8v6M16 11h6"></path>'
    };
    return '<button class="kliper-cards-visual-filter__tab' + (active ? ' is-active' : '') + '" type="button" data-visual-cards-tab="' + label + '" aria-label="' + label + '" aria-pressed="' + (active ? 'true' : 'false') + '">' +
      '<span class="kliper-cards-visual-filter__tab-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + icons[label] + '</svg></span>' +
      '<span class="kliper-cards-visual-filter__tab-label">' + label + '</span>' +
    '</button>';
  }

  function optionButton(group, label, active, dark) {
    return '<button class="kliper-cards-clean-filter__chip' + (active ? ' is-active' : '') + (dark ? ' is-dark' : '') + '" type="button" data-clean-filter-group="' + group + '" data-clean-filter-value="' + label + '">' +
      '<span>' + label + '</span>' +
    '</button>';
  }

  function fieldButton(label) {
    return '<button class="kliper-cards-clean-filter__field" type="button">' +
      '<span>' + label + '</span>' +
      '<span class="kliper-cards-clean-filter__chevron" aria-hidden="true"></span>' +
    '</button>';
  }

  function cleanFilterRows(active) {
    var whereOptions = ['Все районы', 'В городе', 'У воды', 'За городом', 'Центральный'];
    var whereRow = '<div class="kliper-cards-clean-filter__row">' +
      '<div class="kliper-cards-clean-filter__label">Где</div>' +
      '<div class="kliper-cards-clean-filter__controls">' +
        whereOptions.map(function (label) {
          return optionButton('where', label, optionState.where === label);
        }).join('') +
        optionButton('where', 'Выбрать район', false) +
        optionButton('where', 'На карте', false, true) +
      '</div>' +
    '</div>';

    if (active === 'Для бизнеса') {
      return whereRow +
        '<div class="kliper-cards-clean-filter__row">' +
          '<div class="kliper-cards-clean-filter__label">Формат бизнеса</div>' +
          '<div class="kliper-cards-clean-filter__controls">' +
            ['Офис', 'Торговля', 'Общепит', 'Склад', 'Услуги'].map(function (label) {
              return optionButton('business', label, optionState.business === label);
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="kliper-cards-clean-filter__row kliper-cards-clean-filter__row--fields">' +
          '<div class="kliper-cards-clean-filter__label">Параметры</div>' +
          '<div class="kliper-cards-clean-filter__fields">' +
            fieldButton('Сделка') +
            fieldButton('Площадь') +
            fieldButton('Бюджет') +
          '</div>' +
        '</div>';
    }

    if (active === 'Новостройки' || active === 'Сданные дома') {
      return whereRow +
        '<div class="kliper-cards-clean-filter__row">' +
          '<div class="kliper-cards-clean-filter__label">Сценарий покупки</div>' +
          '<div class="kliper-cards-clean-filter__controls">' +
            ['Для семьи', 'Выгодно', 'Комфорт+', 'Инвестиции'].map(function (label) {
              return optionButton('scenario', label, optionState.scenario === label);
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="kliper-cards-clean-filter__row kliper-cards-clean-filter__row--compact">' +
          '<div class="kliper-cards-clean-filter__label"></div>' +
          '<div class="kliper-cards-clean-filter__controls">' +
            ['семейная ипотека', 'детский сад рядом', 'школа рядом', 'двор без машин', 'парк рядом'].map(function (label) {
              return optionButton('scenarioTag', label, false);
            }).join('') +
          '</div>' +
        '</div>' +
        '<div class="kliper-cards-clean-filter__row kliper-cards-clean-filter__row--fields">' +
          '<div class="kliper-cards-clean-filter__label">Год сдачи</div>' +
          '<div class="kliper-cards-clean-filter__controls">' +
            ['частично сдан', '2026', '2027', '2028+'].map(function (label) {
              return optionButton('year', label, optionState.year === label || (active === 'Сданные дома' && label === 'частично сдан'));
            }).join('') +
          '</div>' +
        '</div>';
    }

    return whereRow +
      '<div class="kliper-cards-clean-filter__row kliper-cards-clean-filter__row--fields">' +
        '<div class="kliper-cards-clean-filter__label">Параметры</div>' +
        '<div class="kliper-cards-clean-filter__fields">' +
          fieldButton(active === 'Сданные дома' ? 'Год сдачи' : 'Тип') +
          fieldButton(active === 'Риелторы' ? 'Опыт' : 'Район') +
          fieldButton(active === 'Застройщики' ? 'ЖК в базе' : 'Бюджет') +
        '</div>' +
      '</div>';
  }

  function renderCleanFilter(active) {
    if (!hasCleanFilter(active)) return '';
    return '<section class="kliper-cards-clean-filter' + (filterOpen ? ' is-open' : '') + '" data-clean-filter-section="' + active + '" ' + (filterOpen ? '' : 'hidden ') + 'aria-label="Фильтр карточек">' +
      cleanFilterRows(active) +
    '</section>';
  }

  function preserveScrollPosition() {
    var x = window.scrollX || 0;
    var y = window.scrollY || 0;
    return function () {
      if (Math.abs((window.scrollY || 0) - y) > 2 || Math.abs((window.scrollX || 0) - x) > 2) {
        window.scrollTo(x, y);
      }
    };
  }

  function syncCleanFilterPanel(shell, active) {
    var panel = shell.querySelector('.kliper-cards-clean-filter');
    if (!hasCleanFilter(active)) {
      if (panel) panel.remove();
      return;
    }

    if (!panel) {
      shell.insertAdjacentHTML('beforeend', renderCleanFilter(active));
      return;
    }

    panel.classList.toggle('is-open', filterOpen);
    panel.hidden = !filterOpen;
    if (panel.getAttribute('data-clean-filter-section') !== active) {
      panel.innerHTML = cleanFilterRows(active);
      panel.setAttribute('data-clean-filter-section', active);
      return;
    }

    var nextHtml = cleanFilterRows(active);
    if (panel.innerHTML !== nextHtml) {
      panel.innerHTML = nextHtml;
    }
  }

  function createShell(active) {
    var shell = document.createElement('section');
    shell.className = shellClass;
    shell.setAttribute('aria-label', 'Разделы карточек');
    shell.innerHTML =
      '<div class="kliper-cards-visual-filter__row">' +
        '<div class="kliper-cards-visual-filter__title">' + active + '</div>' +
        '<nav class="kliper-cards-visual-filter__tabs" aria-label="Выбор раздела карточек">' +
          labels.map(function (label) { return renderButton(label, label === active); }).join('') +
        '</nav>' +
        '<button class="kliper-cards-visual-filter__filter-toggle" type="button" data-clean-filter-toggle' + (hasCleanFilter(active) ? '' : ' hidden') + ' aria-expanded="' + (filterOpen ? 'true' : 'false') + '">' +
          '<span class="kliper-cards-visual-filter__filter-icon" aria-hidden="true"></span>' +
          '<span data-clean-filter-toggle-label>' + (filterOpen ? 'Скрыть фильтр' : 'Открыть фильтр') + '</span>' +
        '</button>' +
      '</div>' +
      renderCleanFilter(active);

    shell.addEventListener('click', function (event) {
      var toggle = event.target.closest('[data-clean-filter-toggle]');
      if (toggle) {
        if (!hasCleanFilter(currentTitle() || active)) return;
        filterOpen = !filterOpen;
        syncShell(shell, currentTitle() || active);
        return;
      }

      var option = event.target.closest('[data-clean-filter-value]');
      if (option) {
        var group = option.getAttribute('data-clean-filter-group');
        var value = option.getAttribute('data-clean-filter-value');
        optionState[group] = value;
        if (group === 'year') {
          var targetSection = value === 'частично сдан' ? 'Сданные дома' : 'Новостройки';
          var sectionButton = findSourceButton(targetSection);
          if (sectionButton && currentTitle() !== targetSection) sectionButton.click();
          schedule(120);
        }
        syncShell(shell, currentTitle() || active);
        return;
      }

      var button = event.target.closest('[data-visual-cards-tab]');
      if (!button) return;
      var label = button.getAttribute('data-visual-cards-tab');
      var sourceLabel = isDistrictAgeLabel(label) ? 'Новостройки' : label;
      var isAlreadyActive = button.classList.contains('is-active') || button.getAttribute('aria-pressed') === 'true';

      if (isAlreadyActive) {
        if (!hasCleanFilter(sourceLabel)) return;
        filterOpen = !filterOpen;
        syncShell(shell, sourceLabel);
        return;
      }

      filterOpen = false;
      optionState.districtAge = isDistrictAgeLabel(label) ? label : '';
      var sourceButton = findSourceButton(sourceLabel);
      var restoreScroll = preserveScrollPosition();
      if (sourceButton) sourceButton.click();
      window.setTimeout(restoreScroll, 0);
      window.setTimeout(restoreScroll, 260);
      syncShell(shell, sourceLabel);
      schedule(120);
    });

    return shell;
  }

  function syncShell(shell, active) {
    if (active === 'Сданные дома') {
      optionState.year = 'частично сдан';
    } else if (active === 'Новостройки' && optionState.year === 'частично сдан') {
      optionState.year = '2026';
    }

    shell.classList.toggle('is-clean-filter-open', hasCleanFilter(active) && filterOpen);

    var title = shell.querySelector('.kliper-cards-visual-filter__title');
    if (title) title.textContent = active;

    Array.prototype.forEach.call(shell.querySelectorAll('[data-visual-cards-tab]'), function (button) {
      var label = button.getAttribute('data-visual-cards-tab');
      var isActive = active === 'Новостройки' && optionState.districtAge ?
        optionState.districtAge === label :
        label === active;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    var toggle = shell.querySelector('[data-clean-filter-toggle]');
    var toggleLabel = shell.querySelector('[data-clean-filter-toggle-label]');
    if (!hasCleanFilter(active)) filterOpen = false;
    if (toggle) {
      toggle.hidden = !hasCleanFilter(active);
      toggle.setAttribute('aria-expanded', hasCleanFilter(active) && filterOpen ? 'true' : 'false');
    }
    if (toggleLabel) toggleLabel.textContent = filterOpen ? 'Скрыть фильтр' : 'Открыть фильтр';

    syncCleanFilterPanel(shell, active);
  }

  function ensureVisualFilter() {
    var active = currentTitle();
    var head = findSourceHead();
    var bodies = findSourceBodies();
    var existing = document.querySelector('.' + shellClass);

    if (!head || pageLabels.indexOf(active) === -1) {
      document.body.classList.remove(readyClass);
      if (existing) existing.remove();
      return;
    }

    document.body.classList.add(readyClass);
    head.classList.add('kliper-cards-source-filter');
    markSourceBodies(bodies);
    disableSourcePopupFilter(head);
    markResultToolbar();
    markOldFilterShells();
    markSourceOverlays();

    if (!existing) {
      existing = createShell(active);
      head.insertAdjacentElement('beforebegin', existing);
      markOldFilterShells();
      markSourceOverlays();
    } else if (existing.nextElementSibling !== head) {
      head.insertAdjacentElement('beforebegin', existing);
      markOldFilterShells();
      markSourceOverlays();
    }

    syncShell(existing, active);
  }

  function schedule(delay) {
    window.clearTimeout(timer);
    timer = window.setTimeout(ensureVisualFilter, delay || 80);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { schedule(120); });
  } else {
    schedule(120);
  }

  window.addEventListener('load', function () { schedule(160); });
  window.addEventListener('resize', function () { schedule(120); });
  document.addEventListener('click', function () { schedule(160); }, true);

  new MutationObserver(function () {
    schedule(32);
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
