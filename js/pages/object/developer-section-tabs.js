(function () {
  var dom = window.KLIPER_DOM || {};
  var activeTab = 'objects';
  var shellClass = 'kliper-developer-section-shell';
  var objectAreaClass = 'kliper-developer-objects-area';
  var hiddenObjectClass = 'kliper-developer-section-hidden';
  var feedClass = 'kliper-developer-feed';
  var heroFactsClass = 'kliper-developer-hero-facts';

  function escapeHtml(value) {
    if (dom.escapeHtml) return dom.escapeHtml(value);
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getTitle() {
    return Array.prototype.slice.call(document.querySelectorAll('h1'))
      .map(function (node) { return normalize(node.textContent); })
      .find(Boolean) || '';
  }

  function isDeveloperPage() {
    var title = getTitle();
    if (!title || /^жк\s/i.test(title)) return false;
    if ([
      'Лента города',
      'Лучшее в Тюмени',
      'Новостройки',
      'Застройщики',
      'Готовые ЖК',
      'Мой район'
    ].indexOf(title) !== -1) return false;

    var hero = getHeroBlock();
    var text = normalize(hero ? hero.textContent : '').toLowerCase();
    return text.indexOf('застройщик') !== -1 ||
      text.indexOf('жк в базе') !== -1 ||
      text.indexOf('профиль компании') !== -1;
  }

  function getHeroBlock() {
    var h1 = Array.prototype.slice.call(document.querySelectorAll('h1')).find(function (node) {
      return normalize(node.textContent) === getTitle();
    });
    if (!h1) return null;

    var node = h1;
    var best = null;
    for (var i = 0; i < 8 && node; i += 1) {
      var className = typeof node.className === 'string' ? node.className : '';
      var hasHeroShape = className.indexOf('rounded') !== -1 || className.indexOf('hero') !== -1;
      if (hasHeroShape && node.offsetHeight > 100 && node.offsetWidth > 260) {
        best = node;
      }
      node = node.parentElement;
    }
    return best || h1.closest('section, article, div');
  }

  function getDeveloperGrid(hero) {
    var node = hero && hero.nextElementSibling;
    for (var i = 0; i < 8 && node; i += 1) {
      if (node.classList && node.classList.contains('grid') && node.children.length >= 2) {
        return node;
      }
      node = node.nextElementSibling;
    }
    return null;
  }

  function getDeveloperLeftColumn(hero) {
    var grid = getDeveloperGrid(hero);
    if (!grid) return null;
    return grid.children[0] || null;
  }

  function ensureDeveloperHeroFacts(hero) {
    if (!hero) return;
    var h1 = hero.querySelector('h1');
    if (!h1) return;
    var titleBlock = h1.parentElement;
    var titleRow = titleBlock && titleBlock.parentElement;
    if (!titleRow || hero.querySelector('.' + heroFactsClass)) return;

    var facts = document.createElement('div');
    facts.className = heroFactsClass;
    facts.innerHTML =
      '<span>12 районов</span>' +
      '<span>сдача 2026-2027</span>' +
      '<span>от 4,5 млн ₽</span>';
    titleRow.classList.add('kliper-developer-hero-title-row');
    titleRow.parentElement.insertBefore(facts, titleRow.nextSibling);
  }

  function getDeveloperPosts(title) {
    var developer = title || 'Застройщик';
    return [
      {
        badge: 'НОВОСТИ',
        object: 'ЖК Речной Порт',
        time: '1 час назад',
        title: 'Ход строительства и новые фото по объекту',
        text: developer + ' обновил статус работ и добавил свежие материалы для подписчиков.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
        likes: '130',
        comments: '29',
        logo: 'РП'
      },
      {
        badge: 'СДАНО',
        object: 'ЖК Семейный',
        time: 'Вчера',
        title: 'Дом готовится к передаче ключей',
        text: 'В ленту застройщика попадают важные обновления со всех его объектов.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
        likes: '86',
        comments: '14',
        logo: 'С'
      },
      {
        badge: 'ОТКРЫТИЕ',
        object: 'ЖК Зарека',
        time: '12 июн.',
        title: 'Во дворе открылся новый сервис для жителей',
        text: 'Новости сервисов, коммерции и дворовой инфраструктуры собираются в одном месте.',
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
        likes: '74',
        comments: '11',
        logo: 'З'
      },
      {
        badge: 'ПЛАНИРОВКИ',
        object: 'ЖК Набережный',
        time: '8 июн.',
        title: 'Добавлены новые планировки и цены',
        text: 'Подписчики видят обновления по всем ЖК застройщика без поиска по отдельным карточкам.',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
        likes: '112',
        comments: '18',
        logo: 'Н'
      }
    ];
  }

  function renderPost(post) {
    return '<article class="kliper-developer-feed-post">' +
      '<button class="kliper-developer-feed-post__media" type="button" aria-label="Открыть публикацию ' + escapeHtml(post.title) + '">' +
        '<img src="' + escapeHtml(post.image) + '" alt="' + escapeHtml(post.title) + '" loading="lazy">' +
        '<span class="kliper-developer-feed-post__badge">' + escapeHtml(post.badge) + '</span>' +
        '<span class="kliper-developer-feed-post__logo">' + escapeHtml(post.logo) + '</span>' +
        '<span class="kliper-developer-feed-post__stat kliper-developer-feed-post__stat--likes">♡ ' + escapeHtml(post.likes) + '</span>' +
        '<span class="kliper-developer-feed-post__stat kliper-developer-feed-post__stat--comments">○ ' + escapeHtml(post.comments) + '</span>' +
      '</button>' +
      '<div class="kliper-developer-feed-post__body">' +
        '<div class="kliper-developer-feed-post__source">' +
          '<span class="kliper-developer-feed-post__avatar">' + escapeHtml(post.logo) + '</span>' +
          '<strong>' + escapeHtml(post.object) + '</strong>' +
          '<small>Объект · ' + escapeHtml(post.time) + '</small>' +
        '</div>' +
        '<h3>' + escapeHtml(post.title) + '</h3>' +
        '<p>' + escapeHtml(post.text) + '</p>' +
        '<div class="kliper-developer-feed-post__actions">' +
          '<button type="button">Сохранить</button>' +
          '<button type="button">Поделиться</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function getDeveloperMapPoints() {
    return [
      ['ЖК Речной Порт', 23, 58, 'main'],
      ['ЖК Республики 205', 48, 46, 'city'],
      ['ЖК Квартал 1А', 38, 64, 'city'],
      ['ЖК Дом у озера', 66, 34, 'water'],
      ['ЖК Зарека', 74, 54, 'water'],
      ['ЖК Кварталы на Минской', 58, 72, 'city']
    ];
  }

  function renderMapPoint(title, x, y, tone, isModal) {
    return '<span class="kliper-developer-map-card__pin kliper-developer-map-card__pin--' + escapeHtml(tone) + (isModal ? ' kliper-developer-map-card__pin--visible' : '') + '" style="left:' + escapeHtml(x) + '%;top:' + escapeHtml(y) + '%;" title="' + escapeHtml(title) + '">' +
      '<span>' + escapeHtml(title) + '</span>' +
    '</span>';
  }

  function renderDeveloperMap() {
    var points = getDeveloperMapPoints();

    return '<section class="kliper-developer-map-card" role="button" tabindex="0" aria-label="Открыть карту объектов застройщика">' +
      '<div class="kliper-developer-map-card__scene">' +
        '<div class="kliper-developer-map-card__grid" aria-hidden="true"></div>' +
        '<div class="kliper-developer-map-card__route kliper-developer-map-card__route--one" aria-hidden="true"></div>' +
        '<div class="kliper-developer-map-card__route kliper-developer-map-card__route--two" aria-hidden="true"></div>' +
        points.map(function (point) {
          return renderMapPoint(point[0], point[1], point[2], point[3], false);
        }).join('') +
        '<div class="kliper-developer-map-card__copy">' +
          '<span>Карта объектов</span>' +
          '<strong>Расположение на карте</strong>' +
          '<small>Все ЖК застройщика в одной географии</small>' +
        '</div>' +
      '</div>' +
    '</section>';
  }

  function closeDeveloperMapModal(modal, handler) {
    if (modal) modal.remove();
    if (handler) document.removeEventListener('keydown', handler);
  }

  function showDeveloperMapModal(title) {
    var oldModal = document.querySelector('.kliper-developer-map-modal');
    if (oldModal) oldModal.remove();

    var points = getDeveloperMapPoints();
    var modal = document.createElement('div');
    modal.className = 'kliper-developer-map-modal';
    modal.innerHTML =
      '<button class="kliper-developer-map-modal__backdrop" type="button" aria-label="Закрыть карту объектов"></button>' +
      '<article class="kliper-developer-map-modal__card" role="dialog" aria-modal="true" aria-label="Карта объектов застройщика">' +
        '<button class="kliper-developer-map-modal__close" type="button" aria-label="Закрыть">×</button>' +
        '<div class="kliper-developer-map-modal__map">' +
          '<div class="kliper-developer-map-card__grid" aria-hidden="true"></div>' +
          '<div class="kliper-developer-map-card__route kliper-developer-map-card__route--one" aria-hidden="true"></div>' +
          '<div class="kliper-developer-map-card__route kliper-developer-map-card__route--two" aria-hidden="true"></div>' +
          points.map(function (point) {
            return renderMapPoint(point[0], point[1], point[2], point[3], true);
          }).join('') +
          '<div class="kliper-developer-map-modal__copy">' +
            '<p>' + escapeHtml(title || 'Застройщик') + '</p>' +
            '<h3>Карта объектов застройщика</h3>' +
            '<span>Все ЖК застройщика собраны на одной карте: городские проекты, объекты у воды и новые кварталы.</span>' +
          '</div>' +
        '</div>' +
      '</article>';

    function handleKeydown(event) {
      if (event.key === 'Escape') closeDeveloperMapModal(modal, handleKeydown);
    }

    modal.addEventListener('click', function (event) {
      if (event.target.closest('.kliper-developer-map-modal__backdrop') || event.target.closest('.kliper-developer-map-modal__close')) {
        closeDeveloperMapModal(modal, handleKeydown);
      }
    });
    document.addEventListener('keydown', handleKeydown);
    document.body.appendChild(modal);
  }

  function createShell(title) {
    var shell = document.createElement('section');
    shell.className = shellClass;
    shell.setAttribute('data-developer-section', activeTab);
    shell.innerHTML =
      '<nav class="kliper-developer-section-tabs" aria-label="Разделы страницы застройщика">' +
        '<button class="kliper-developer-section-tabs__button is-active" type="button" data-developer-section-target="objects">Объекты</button>' +
        '<button class="kliper-developer-section-tabs__button" type="button" data-developer-section-target="feed">Лента</button>' +
      '</nav>' +
      renderDeveloperMap() +
      '<section class="' + feedClass + '" aria-hidden="true">' +
        '<div class="kliper-developer-feed__head">' +
          '<div>' +
            '<h2>Лента застройщика</h2>' +
            '<p>Новости и обновления со всех объектов застройщика.</p>' +
          '</div>' +
          '<span>' + escapeHtml(title) + '</span>' +
        '</div>' +
        '<div class="kliper-developer-feed__list">' +
          getDeveloperPosts(title).map(renderPost).join('') +
        '</div>' +
      '</section>';

    shell.addEventListener('click', function (event) {
      var button = event.target.closest('[data-developer-section-target]');
      var map = event.target.closest('.kliper-developer-map-card');
      if (!button && !map) return;
      if (map && !button) {
        event.preventDefault();
        event.stopPropagation();
        showDeveloperMapModal(title);
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      activeTab = button.getAttribute('data-developer-section-target') || 'objects';
      shell.setAttribute('data-developer-section', activeTab);
      syncShell(shell);
    });
    shell.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (!event.target.closest('.kliper-developer-map-card')) return;
      event.preventDefault();
      showDeveloperMapModal(title);
    });

    return shell;
  }

  function syncShell(shell) {
    activeTab = shell.getAttribute('data-developer-section') || activeTab || 'objects';
    shell.setAttribute('data-developer-section', activeTab);
    Array.prototype.slice.call(shell.querySelectorAll('[data-developer-section-target]')).forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-developer-section-target') === activeTab);
    });
    var feed = shell.querySelector('.' + feedClass);
    var objects = shell.querySelector('.' + objectAreaClass);
    if (feed) feed.setAttribute('aria-hidden', activeTab === 'feed' ? 'false' : 'true');
    if (objects) objects.setAttribute('aria-hidden', activeTab === 'objects' ? 'false' : 'true');
    toggleObjectSiblings(shell, activeTab === 'feed');
  }

  function toggleObjectSiblings(shell, shouldHide) {
    if (!shell || !shell.parentElement) return;
    var node = shell.nextElementSibling;
    while (node) {
      node.classList.toggle(hiddenObjectClass, shouldHide);
      node = node.nextElementSibling;
    }
  }

  function restoreMovedObjects(shell) {
    var area = shell && shell.querySelector('.' + objectAreaClass);
    if (!area) return;
    while (area.firstChild) {
      shell.parentElement.insertBefore(area.firstChild, shell.nextSibling);
    }
    area.remove();
  }

  function unwrapShell(shell) {
    if (!shell || !shell.parentElement) return;
    var area = shell.querySelector('.' + objectAreaClass);
    if (area) {
      while (area.firstChild) shell.parentElement.insertBefore(area.firstChild, shell);
    }
    shell.remove();
  }

  function cleanupDeveloperDomBeforeReactNavigation() {
    Array.prototype.slice.call(document.querySelectorAll('.kliper-developer-map-modal')).forEach(function (node) {
      node.remove();
    });
    Array.prototype.slice.call(document.querySelectorAll('.kliper-developer-section-shell')).forEach(function (node) {
      unwrapShell(node);
    });
    Array.prototype.slice.call(document.querySelectorAll('.' + heroFactsClass)).forEach(function (node) {
      node.remove();
    });
    Array.prototype.slice.call(document.querySelectorAll('.kliper-developer-object-tabs__icon, .kliper-developer-review__avatar')).forEach(function (node) {
      node.remove();
    });
  }

  function cleanupNonDeveloperArtifacts() {
    Array.prototype.slice.call(document.querySelectorAll('.kliper-developer-map-modal')).forEach(function (node) {
      node.remove();
    });
    Array.prototype.slice.call(document.querySelectorAll('.' + shellClass)).forEach(function (node) {
      unwrapShell(node);
    });
    Array.prototype.slice.call(document.querySelectorAll('.' + heroFactsClass)).forEach(function (node) {
      node.remove();
    });
    Array.prototype.slice.call(document.querySelectorAll('.kliper-developer-hero-title-row')).forEach(function (node) {
      node.classList.remove('kliper-developer-hero-title-row');
    });
    Array.prototype.slice.call(document.querySelectorAll('.' + hiddenObjectClass)).forEach(function (node) {
      node.classList.remove(hiddenObjectClass);
      node.removeAttribute('aria-hidden');
    });
  }

  function stabilizeObjectCardNavigation() {
    var startedAt = Date.now();

    function resetWhenObjectPageOpens() {
      var title = getTitle();
      if (title && /^жк\s/i.test(title)) {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      if (Date.now() - startedAt < 700) {
        window.requestAnimationFrame(resetWhenObjectPageOpens);
      }
    }

    window.setTimeout(function () {
      window.requestAnimationFrame(resetWhenObjectPageOpens);
    }, 0);
  }

  function ensureDeveloperTabs() {
    var existing = document.querySelector('.' + shellClass);
    var currentTitle = getTitle();
    if (existing && /^жк\s/i.test(currentTitle)) {
      existing.classList.add(hiddenObjectClass);
      return;
    }
    if (!isDeveloperPage()) {
      cleanupNonDeveloperArtifacts();
      return;
    }

    var title = getTitle();
    var hero = getHeroBlock();
    if (!hero || !hero.parentElement) return;
    hero.classList.add('kliper-developer-card-hero');
    ensureDeveloperHeroFacts(hero);

    var leftColumn = getDeveloperLeftColumn(hero);
    if (!leftColumn) return;
    var anchor = Array.prototype.slice.call(leftColumn.children).find(function (node) {
      return node !== existing;
    });

    if (!existing) {
      existing = createShell(title);
      leftColumn.insertBefore(existing, anchor || null);
    } else {
      existing.classList.remove(hiddenObjectClass);
      activeTab = existing.getAttribute('data-developer-section') || activeTab || 'objects';
      restoreMovedObjects(existing);
      if (existing.parentElement !== leftColumn || existing.nextElementSibling !== anchor) {
        leftColumn.insertBefore(existing, anchor || null);
      }
    }

    syncShell(existing);
  }

  function scheduleSync() {
    window.requestAnimationFrame(ensureDeveloperTabs);
  }

  function getObjectCardClick(event) {
    var shell = document.querySelector('.' + shellClass);
    if (!shell) return null;
    var article = event.target.closest && event.target.closest('article');
    if (!article || article.closest('.' + feedClass)) return null;
    var label = normalize(article.getAttribute('aria-label'));
    if (label.indexOf('Открыть карточку ЖК') !== 0) return null;
    if (article.getBoundingClientRect().height <= 0) return null;
    var button = event.target.closest('button');
    if (button && button !== article) return null;
    return article;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleSync);
  } else {
    scheduleSync();
  }

  window.addEventListener('load', scheduleSync);
  document.addEventListener('click', function (event) {
    var objectCard = getObjectCardClick(event);
    if (objectCard) {
      cleanupDeveloperDomBeforeReactNavigation();
      stabilizeObjectCardNavigation();
    }
    window.setTimeout(scheduleSync, 180);
  }, true);

  var attempts = 0;
  var timer = window.setInterval(function () {
    attempts += 1;
    ensureDeveloperTabs();
    if (document.querySelector('.' + shellClass) || attempts > 70) {
      window.clearInterval(timer);
    }
  }, 160);
})();
