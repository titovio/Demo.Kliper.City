(function () {
  var dom = window.KLIPER_DOM || {};
  var activeTab = 'objects';
  var shellClass = 'kliper-developer-section-shell';
  var objectAreaClass = 'kliper-developer-objects-area';
  var feedClass = 'kliper-developer-feed';

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
    var text = normalize(document.body.textContent).toLowerCase();
    return text.indexOf('застройщик') !== -1 ||
      text.indexOf('жк в базе') !== -1 ||
      text.indexOf('объекты застройщика') !== -1;
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

  function createShell(title) {
    var shell = document.createElement('section');
    shell.className = shellClass;
    shell.setAttribute('data-developer-section', activeTab);
    shell.innerHTML =
      '<nav class="kliper-developer-section-tabs" aria-label="Разделы страницы застройщика">' +
        '<button class="kliper-developer-section-tabs__button is-active" type="button" data-developer-section-target="objects">Объекты</button>' +
        '<button class="kliper-developer-section-tabs__button" type="button" data-developer-section-target="feed">Лента</button>' +
      '</nav>' +
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
      '</section>' +
      '<div class="' + objectAreaClass + '"></div>';

    shell.addEventListener('click', function (event) {
      var button = event.target.closest('[data-developer-section-target]');
      if (!button) return;
      activeTab = button.getAttribute('data-developer-section-target') || 'objects';
      syncShell(shell);
    });

    return shell;
  }

  function syncShell(shell) {
    shell.setAttribute('data-developer-section', activeTab);
    Array.prototype.slice.call(shell.querySelectorAll('[data-developer-section-target]')).forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-developer-section-target') === activeTab);
    });
    var feed = shell.querySelector('.' + feedClass);
    var objects = shell.querySelector('.' + objectAreaClass);
    if (feed) feed.setAttribute('aria-hidden', activeTab === 'feed' ? 'false' : 'true');
    if (objects) objects.setAttribute('aria-hidden', activeTab === 'objects' ? 'false' : 'true');
  }

  function unwrapShell(shell) {
    if (!shell || !shell.parentElement) return;
    var area = shell.querySelector('.' + objectAreaClass);
    if (area) {
      while (area.firstChild) shell.parentElement.insertBefore(area.firstChild, shell);
    }
    shell.remove();
  }

  function ensureDeveloperTabs() {
    var existing = document.querySelector('.' + shellClass);
    if (!isDeveloperPage()) {
      unwrapShell(existing);
      return;
    }

    var title = getTitle();
    var hero = getHeroBlock();
    if (!hero || !hero.parentElement) return;
    hero.classList.add('kliper-developer-card-hero');

    if (!existing) {
      existing = createShell(title);
      hero.parentElement.insertBefore(existing, hero.nextSibling);

      var area = existing.querySelector('.' + objectAreaClass);
      var node = existing.nextSibling;
      while (node) {
        var next = node.nextSibling;
        if (node.nodeType === 1 || normalize(node.textContent)) {
          area.appendChild(node);
        }
        node = next;
      }
    }

    syncShell(existing);
  }

  function scheduleSync() {
    window.requestAnimationFrame(ensureDeveloperTabs);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleSync);
  } else {
    scheduleSync();
  }

  window.addEventListener('load', scheduleSync);
  document.addEventListener('click', function () {
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
