(function () {
  var activeSection = 'project';
  var dom = window.KLIPER_DOM || {};
  var tabs = [
    { id: 'project', label: 'Проект' },
    { id: 'objects', label: 'Объекты' },
    { id: 'feed', label: 'Лента' }
  ];
  var projectSelectors = [
    '.kliper-object-map-pair',
    '.kliper-aerial-view',
    '.kliper-map-location',
    '.kliper-object-gallery',
    '.kliper-object-plans'
  ];
  var legacyBlockHeadings = [
    'Сервисы и stories',
    'Новости и предложения'
  ];
  var feedPosts = [
    {
      badge: 'НОВОСТИ',
      author: 'ЖК Речной Порт',
      role: 'Компания',
      time: '1 час назад',
      title: 'Дом 1: завершены фасадные работы',
      text: 'Первая очередь перешла к внутренним сетям и подготовке мест общего пользования.',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
      likes: '130',
      comments: '29',
      logo: 'РП'
    },
    {
      badge: 'ОТКРЫТИЕ',
      author: 'Coffee Port',
      role: 'Сервис ЖК',
      time: 'Вчера',
      title: 'Coffee Port готовит открытие на первом этаже',
      text: 'Кофейня для жителей появится в коммерческом блоке у центрального входа.',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=80',
      likes: '98',
      comments: '17',
      logo: 'CP'
    },
    {
      badge: 'СДАНО',
      author: 'ЖК Речной Порт',
      role: 'Компания',
      time: '12 июн.',
      title: 'Первая очередь готовится к передаче ключей',
      text: 'Завершается проверка документов и общих зон перед встречами с владельцами квартир.',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=80',
      likes: '112',
      comments: '22',
      logo: 'РП'
    },
    {
      badge: 'ПОДПИСКА',
      author: 'Клипер.Сити',
      role: 'Редакция',
      time: '8 июн.',
      title: 'Персональные условия для покупателей и владельцев',
      text: 'Персональные условия для будущих покупателей и удобный контроль хода строительства для владельцев квартир.',
      image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
      likes: '76',
      comments: '12',
      logo: 'К'
    }
  ];

  function escapeHtml(value) {
    if (dom.escapeHtml) return dom.escapeHtml(value);
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function isResidentialObjectPage() {
    var title = Array.prototype.slice.call(document.querySelectorAll('h1')).map(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim();
    }).find(Boolean) || '';

    if (title.toLowerCase().indexOf('жк ') === 0) return true;
    return /новостройк|готов/i.test(title) && (document.body.textContent || '').toLowerCase().indexOf('жк ') !== -1;
  }

  function createTabs() {
    var nav = document.createElement('nav');
    nav.className = 'kliper-object-section-tabs';
    nav.setAttribute('aria-label', 'Разделы страницы ЖК');
    nav.innerHTML = tabs.map(function (tab) {
      return '<button class="kliper-object-section-tabs__button' + (tab.id === activeSection ? ' is-active' : '') + '" type="button" data-object-section="' + tab.id + '">' +
        escapeHtml(tab.label) +
      '</button>';
    }).join('');

    nav.addEventListener('click', function (event) {
      var button = event.target.closest('[data-object-section]');
      if (!button) return;
      activeSection = button.getAttribute('data-object-section') || 'project';
      syncSections();
    });

    return nav;
  }

  function createFeedBlock() {
    var section = document.createElement('section');
    section.className = 'kliper-object-feed';
    section.innerHTML =
      '<div class="kliper-object-feed__head">' +
        '<div>' +
          '<h2>Лента ЖК</h2>' +
          '<p>Публикации объекта в том же формате, что и в общей городской ленте и у подписчиков.</p>' +
        '</div>' +
        '<span>городская лента</span>' +
      '</div>' +
      '<div class="kliper-object-feed__list">' +
        feedPosts.map(renderFeedPost).join('') +
      '</div>';
    return section;
  }

  function renderFeedPost(post) {
    return '<article class="kliper-object-feed-post">' +
      '<button class="kliper-object-feed-post__media" type="button" aria-label="Открыть публикацию ' + escapeHtml(post.title) + '">' +
        '<img src="' + escapeHtml(post.image) + '" alt="' + escapeHtml(post.title) + '" loading="lazy">' +
        '<span class="kliper-object-feed-post__badge">' + escapeHtml(post.badge) + '</span>' +
        '<span class="kliper-object-feed-post__target">' + escapeHtml(post.logo) + '</span>' +
        '<span class="kliper-object-feed-post__stat kliper-object-feed-post__stat--likes">♡ ' + escapeHtml(post.likes) + '</span>' +
        '<span class="kliper-object-feed-post__stat kliper-object-feed-post__stat--comments">○ ' + escapeHtml(post.comments) + '</span>' +
      '</button>' +
      '<div class="kliper-object-feed-post__body">' +
        '<div class="kliper-object-feed-post__source">' +
          '<span class="kliper-object-feed-post__avatar">' + escapeHtml(post.logo) + '</span>' +
          '<strong>' + escapeHtml(post.author) + '</strong>' +
          '<small>' + escapeHtml(post.role) + ' · ' + escapeHtml(post.time) + '</small>' +
          '<button class="kliper-object-feed-post__more" type="button" aria-label="Дополнительные действия">...</button>' +
        '</div>' +
        '<h3>' + escapeHtml(post.title) + '</h3>' +
        '<p>' + escapeHtml(post.text) + '</p>' +
        '<div class="kliper-object-feed-post__actions">' +
          '<button type="button">Сохранить</button>' +
          '<button type="button">Поделиться</button>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function getProjectBlocks() {
    return projectSelectors.map(function (selector) {
      return document.querySelector(selector);
    }).filter(Boolean);
  }

  function getEcosystemBlock() {
    var ecosystem = document.querySelector('.kliper-ecosystem-polished');
    if (!ecosystem) return null;
    return ecosystem.parentElement || ecosystem;
  }

  function getAllManagedBlocks() {
    var blocks = getProjectBlocks();
    var ecosystem = getEcosystemBlock();
    var feed = document.querySelector('.kliper-object-feed');
    if (ecosystem) blocks.push(ecosystem);
    if (feed) blocks.push(feed);
    return blocks;
  }

  function findBlockByHeading(label) {
    var heading = Array.prototype.slice.call(document.querySelectorAll('h2,h3')).find(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim() === label;
    });
    if (!heading) return null;
    return heading.closest('section[class*="rounded"], div[class*="rounded"]') || heading.closest('section') || heading.parentElement;
  }

  function getLegacyBlocks() {
    return legacyBlockHeadings.map(findBlockByHeading).filter(Boolean);
  }

  function findFirstObjectBlock() {
    var candidates = getAllManagedBlocks();
    if (!candidates.length) return null;
    return candidates.sort(function (a, b) {
      var position = a.compareDocumentPosition(b);
      return position & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
    })[0];
  }

  function ensureFeedBlock(anchor) {
    var feed = document.querySelector('.kliper-object-feed');
    if (!anchor || !anchor.parentElement) return null;
    if (feed) {
      if (feed.previousSibling !== anchor) {
        anchor.parentElement.insertBefore(feed, anchor.nextSibling);
      }
      return feed;
    }
    feed = createFeedBlock();
    anchor.parentElement.insertBefore(feed, anchor.nextSibling);
    return feed;
  }

  function ensureTabs() {
    var nav = document.querySelector('.kliper-object-section-tabs');
    var anchor = findFirstObjectBlock();
    if (!anchor || !anchor.parentElement) return null;

    if (!nav) {
      nav = createTabs();
      anchor.parentElement.insertBefore(nav, anchor);
    } else if (anchor !== nav && nav.nextSibling !== anchor) {
      anchor.parentElement.insertBefore(nav, anchor);
    }

    ensureFeedBlock(nav);
    return nav;
  }

  function setHidden(node, hidden) {
    if (!node) return;
    node.classList.toggle('kliper-object-section-hidden', hidden);
    node.setAttribute('aria-hidden', hidden ? 'true' : 'false');
  }

  function syncSections() {
    if (!isResidentialObjectPage()) {
      Array.prototype.slice.call(document.querySelectorAll('.kliper-object-section-tabs, .kliper-object-feed')).forEach(function (node) {
        node.remove();
      });
      getAllManagedBlocks().forEach(function (node) {
        node.classList.remove('kliper-object-section-hidden');
        node.removeAttribute('aria-hidden');
      });
      getLegacyBlocks().forEach(function (node) {
        node.classList.remove('kliper-object-section-hidden');
        node.removeAttribute('aria-hidden');
      });
      return;
    }

    var nav = ensureTabs();
    if (!nav) return;

    Array.prototype.slice.call(nav.querySelectorAll('[data-object-section]')).forEach(function (button) {
      button.classList.toggle('is-active', button.getAttribute('data-object-section') === activeSection);
    });

    getProjectBlocks().forEach(function (node) {
      setHidden(node, activeSection !== 'project');
    });

    setHidden(getEcosystemBlock(), activeSection !== 'objects');
    setHidden(document.querySelector('.kliper-object-feed'), activeSection !== 'feed');
    getLegacyBlocks().forEach(function (node) {
      setHidden(node, true);
    });
  }

  function scheduleSync() {
    window.requestAnimationFrame(syncSections);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleSync);
  } else {
    scheduleSync();
  }

  window.addEventListener('load', scheduleSync);
  document.addEventListener('click', function () {
    window.setTimeout(scheduleSync, 160);
  }, true);

  var attempts = 0;
  var timer = window.setInterval(function () {
    attempts += 1;
    syncSections();
    if (document.querySelector('.kliper-object-section-tabs') || attempts > 70) {
      window.clearInterval(timer);
    }
  }, 160);
})();
