(function () {
  var activeTab = 'Связанные компании';
  var likedCards = readStoredList('kliper-liked-cards');
  var subscribedCards = readStoredList('kliper-subscribed-cards');
  var cardSets = {
    'Связанные компании': [
    {
      title: 'Кофейня у дома',
      displayTitle: 'Coffee Port',
      tag: 'кафе',
      category: 'Еда',
      filter: 'Кафе',
      location: '1 этаж · для жителей дома',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=82',
      logo: 'CP',
      likes: 92,
      follows: 38,
      comments: 8
    },
    {
      title: 'Пункт выдачи CityBox',
      displayTitle: 'CityBox',
      tag: 'сервис ЖК',
      category: 'Покупки',
      filter: 'ПВЗ',
      location: '1 этаж · уведомления о графике',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=82',
      logo: 'CB',
      likes: 74,
      follows: 31,
      comments: 6
    },
    {
      title: 'Детская студия Ладушки',
      displayTitle: 'Ладушки',
      tag: 'дети',
      category: 'Дети и образование',
      filter: 'Детские центры',
      location: 'двор · пробное занятие',
      image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=82',
      logo: 'Л',
      likes: 86,
      follows: 44,
      comments: 11
    },
    {
      title: 'УК Комфорт',
      displayTitle: 'УК Комфорт',
      tag: 'дом',
      category: 'Дом',
      filter: 'УК и ЖКХ',
      location: 'управление · заявки и новости',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=82',
      logo: 'УК',
      likes: 58,
      follows: 24,
      comments: 5
    }
    ],
    'Сервисы ЖК': [
      {
        title: 'Пункт выдачи CityBox',
        displayTitle: 'CityBox',
        tag: 'пвз',
        category: 'Покупки',
        filter: 'ПВЗ',
        location: '1 этаж · выдача заказов',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=82',
        logo: 'CB',
        likes: 74,
        follows: 31,
        comments: 6
      },
      {
        title: 'УК Комфорт',
        displayTitle: 'УК Комфорт',
        tag: 'управление',
        category: 'Дом',
        filter: 'УК и ЖКХ',
        location: 'заявки · новости дома',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=82',
        logo: 'УК',
        likes: 58,
        follows: 24,
        comments: 5
      },
      {
        title: 'Домовой чат',
        displayTitle: 'Домовой чат',
        tag: 'чат',
        category: 'Дом',
        filter: 'Домовой чат',
        location: 'для соседей · быстрые вопросы',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=82',
        logo: 'Ч',
        likes: 63,
        follows: 49,
        comments: 18
      }
    ],
    'Бизнес аренда': [
      {
        title: 'Coffee Port',
        displayTitle: 'Coffee Port',
        tag: 'кафе',
        category: 'Еда',
        filter: 'Кафе',
        location: '1 этаж · коммерция',
        image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=900&q=82',
        logo: 'CP',
        likes: 92,
        follows: 38,
        comments: 8
      },
      {
        title: 'Beauty Lab',
        displayTitle: 'Beauty Lab',
        tag: 'красота',
        category: 'Красота и спорт',
        filter: 'Салоны',
        location: '1 этаж · запись онлайн',
        image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=82',
        logo: 'BL',
        likes: 81,
        follows: 33,
        comments: 9
      },
      {
        title: 'Аптека Здоровье',
        displayTitle: 'Аптека Здоровье',
        tag: 'аптека',
        category: 'Здоровье',
        filter: 'Аптеки',
        location: 'рядом с домом · товары для здоровья',
        image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=900&q=82',
        logo: 'АЗ',
        likes: 69,
        follows: 28,
        comments: 7
      }
    ]
  };
  var tabMeta = {
    'Связанные компании': { count: '18', note: 'в базе' },
    'Сервисы ЖК': { count: '7', note: 'для жителей' },
    'Бизнес аренда': { count: '12', note: 'пока пусто' }
  };

  function activeCards() {
    return cardSets[activeTab] || cardSets['Связанные компании'];
  }

  function allCards() {
    return Object.keys(cardSets).reduce(function (items, key) {
      return items.concat(cardSets[key]);
    }, []);
  }

  function slug(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[^a-zа-я0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function readStoredList(key) {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function writeStoredList(key, list) {
    window.localStorage.setItem(key, JSON.stringify(Array.from(new Set(list))));
  }

  function hasItem(list, card) {
    return list.indexOf(slug(card.displayTitle)) !== -1 || list.indexOf(slug(card.title)) !== -1;
  }

  function toggleStored(key, list, card) {
    var id = slug(card.displayTitle);
    var exists = list.indexOf(id) !== -1;
    var next = exists ? list.filter(function (item) { return item !== id; }) : list.concat(id);
    writeStoredList(key, next);
    return next;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function icon(name) {
    if (name === 'heart') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"></path></svg>';
    }
    if (name === 'bell') {
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"></path><path d="M13.7 21a2 2 0 0 1-3.4 0"></path></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"></path></svg>';
  }

  function getCardById(id) {
    return allCards().find(function (card) {
      return slug(card.displayTitle) === id || slug(card.title) === id;
    });
  }

  function createCard(card) {
    var id = slug(card.displayTitle);
    var isLiked = hasItem(likedCards, card);
    var isSubscribed = hasItem(subscribedCards, card);
    var article = document.createElement('article');
    article.className = 'kliper-ecosystem-card';
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', 'Открыть карточку ' + card.displayTitle);
    article.setAttribute('data-ecosystem-card-id', id);
    article.setAttribute('data-ecosystem-category', card.category || '');
    article.setAttribute('data-ecosystem-filter', card.filter || '');
    article.style.backgroundImage = 'url("' + card.image + '")';
    article.innerHTML =
      '<div class="kliper-ecosystem-card__tag">' + escapeHtml(card.tag) + '</div>' +
      '<button class="kliper-ecosystem-card__logo" type="button" data-ecosystem-story="' + id + '" aria-label="Открыть историю ' + escapeHtml(card.displayTitle) + '">' + escapeHtml(card.logo) + '</button>' +
      '<div class="kliper-ecosystem-card__body">' +
        '<p class="kliper-ecosystem-card__location">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.4"></circle></svg>' +
          escapeHtml(card.location) +
        '</p>' +
        '<h3>' + escapeHtml(card.displayTitle) + '</h3>' +
        '<div class="kliper-ecosystem-card__stats">' +
          '<button class="kliper-ecosystem-stat kliper-ecosystem-stat--like' + (isLiked ? ' is-active' : '') + '" type="button" data-ecosystem-like="' + id + '" aria-label="Лайкнуть ' + escapeHtml(card.displayTitle) + '">' + icon('heart') + '<span>' + escapeHtml(card.likes + (isLiked ? 1 : 0)) + '</span></button>' +
          '<span class="kliper-ecosystem-stat-group">' +
            '<button class="kliper-ecosystem-stat kliper-ecosystem-stat--follow' + (isSubscribed ? ' is-active' : '') + '" type="button" data-ecosystem-subscribe="' + id + '" aria-label="Подписаться на ' + escapeHtml(card.displayTitle) + '">' + icon('bell') + '<span>' + escapeHtml(card.follows + (isSubscribed ? 1 : 0)) + '</span></button>' +
            '<button class="kliper-ecosystem-stat kliper-ecosystem-stat--comment" type="button" data-ecosystem-open="' + id + '" aria-label="Открыть рецензии ' + escapeHtml(card.displayTitle) + '">' + icon('comment') + '<span>' + escapeHtml(card.comments) + '</span></button>' +
          '</span>' +
        '</div>' +
      '</div>';
    return article;
  }

  function showStory(card) {
    if (!card) return;
    var oldStory = document.querySelector('.kliper-ecosystem-story');
    if (oldStory) oldStory.remove();

    var story = document.createElement('div');
    story.className = 'kliper-ecosystem-story';
    story.innerHTML =
      '<button class="kliper-ecosystem-story__backdrop" type="button" aria-label="Закрыть историю"></button>' +
      '<article class="kliper-ecosystem-story__card" style="background-image:url(\'' + card.image + '\')">' +
        '<div class="kliper-ecosystem-story__progress" aria-hidden="true"><span></span><span></span><span></span></div>' +
        '<button class="kliper-ecosystem-story__close" type="button" aria-label="Закрыть">×</button>' +
        '<div class="kliper-ecosystem-story__head">' +
          '<span class="kliper-ecosystem-story__logo">' + escapeHtml(card.logo) + '</span>' +
          '<span><strong>' + escapeHtml(card.displayTitle) + '</strong><small>' + escapeHtml(card.category || 'Карточка') + ' · ' + escapeHtml(card.filter || card.tag) + '</small></span>' +
        '</div>' +
        '<button class="kliper-ecosystem-story__next" type="button" aria-label="Следующая история">›</button>' +
        '<div class="kliper-ecosystem-story__body">' +
          '<p>' + escapeHtml(card.tag) + '</p>' +
          '<h3>' + escapeHtml(card.displayTitle) + '</h3>' +
          '<span>' + escapeHtml(card.location) + '</span>' +
        '</div>' +
      '</article>';
    document.body.appendChild(story);

    story.addEventListener('click', function (event) {
      if (event.target.closest('.kliper-ecosystem-story__close') || event.target.closest('.kliper-ecosystem-story__backdrop')) {
        story.remove();
      }
    });
  }

  function showDrawer(card) {
    if (!card) return;
    var oldDrawer = document.querySelector('.kliper-ecosystem-drawer');
    if (oldDrawer) oldDrawer.remove();

    var isLiked = hasItem(likedCards, card);
    var isSubscribed = hasItem(subscribedCards, card);
    var drawer = document.createElement('div');
    drawer.className = 'kliper-ecosystem-drawer';
    drawer.innerHTML =
      '<button class="kliper-ecosystem-drawer__backdrop" type="button" aria-label="Закрыть карточку"></button>' +
      '<aside class="kliper-ecosystem-drawer__panel" role="dialog" aria-modal="true" aria-label="Карточка ' + escapeHtml(card.displayTitle) + '">' +
        '<button class="kliper-ecosystem-drawer__close" type="button" aria-label="Закрыть">×</button>' +
        '<div class="kliper-ecosystem-drawer__hero" style="background-image:url(\'' + card.image + '\')">' +
          '<button class="kliper-ecosystem-drawer__story" type="button" data-ecosystem-story="' + slug(card.displayTitle) + '">' + escapeHtml(card.logo) + '</button>' +
          '<span>' + escapeHtml(card.tag) + '</span>' +
          '<h3>' + escapeHtml(card.displayTitle) + '</h3>' +
          '<p>' + escapeHtml(card.location) + '</p>' +
        '</div>' +
        '<div class="kliper-ecosystem-drawer__body">' +
          '<div class="kliper-ecosystem-drawer__meta">' +
            '<span>Категория</span><strong>' + escapeHtml(card.category || 'Каталог') + '</strong>' +
            '<span>Раздел</span><strong>' + escapeHtml(card.filter || card.tag) + '</strong>' +
            '<span>В объекте</span><strong>ЖК Речной Порт</strong>' +
          '</div>' +
          '<div class="kliper-ecosystem-drawer__actions">' +
            '<button class="' + (isLiked ? 'is-active ' : '') + 'kliper-ecosystem-drawer__action" type="button" data-ecosystem-like="' + slug(card.displayTitle) + '">' + icon('heart') + '<span>' + escapeHtml(card.likes + (isLiked ? 1 : 0)) + '</span></button>' +
            '<button class="' + (isSubscribed ? 'is-active ' : '') + 'kliper-ecosystem-drawer__action" type="button" data-ecosystem-subscribe="' + slug(card.displayTitle) + '">' + icon('bell') + '<span>' + escapeHtml(card.follows + (isSubscribed ? 1 : 0)) + '</span></button>' +
            '<button class="kliper-ecosystem-drawer__action" type="button">' + icon('comment') + '<span>' + escapeHtml(card.comments) + '</span></button>' +
          '</div>' +
          '<button class="kliper-ecosystem-drawer__primary" type="button" data-ecosystem-goto="' + slug(card.displayTitle) + '">Открыть в каталоге</button>' +
        '</div>' +
      '</aside>';
    document.body.appendChild(drawer);

    drawer.addEventListener('click', handleEcosystemAction, true);
    drawer.addEventListener('click', function (event) {
      if (event.target.closest('.kliper-ecosystem-drawer__close') || event.target.closest('.kliper-ecosystem-drawer__backdrop')) {
        drawer.remove();
      }
    });
  }

  function findSection() {
    var headings = Array.prototype.slice.call(document.querySelectorAll('h2,h3'));
    var heading = headings.find(function (node) {
      return node.textContent && node.textContent.trim() === 'Экосистема объекта';
    });
    if (!heading) return null;
    return heading.closest('section[class*="rounded"], div[class*="rounded"]') ||
      heading.closest('section') ||
      heading.parentElement;
  }

  function isResidentialObjectPage() {
    var title = Array.prototype.slice.call(document.querySelectorAll('h1')).map(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim();
    }).find(Boolean) || '';

    if (title.toLowerCase().indexOf('жк ') === 0) return true;
    return /новостройк|сданн/i.test(title) && (document.body.textContent || '').toLowerCase().indexOf('жк ') !== -1;
  }

  function restoreOriginalEcosystem() {
    Array.prototype.slice.call(document.querySelectorAll('.kliper-ecosystem-polished')).forEach(function (node) {
      node.remove();
    });
    Array.prototype.slice.call(document.querySelectorAll('.kliper-ecosystem-original-hidden')).forEach(function (node) {
      node.classList.remove('kliper-ecosystem-original-hidden');
    });
  }

  function containsAllCards(node) {
    var text = node.textContent || '';
    if (activeCards().every(function (card) {
      return text.indexOf(card.title) !== -1;
    })) {
      return true;
    }
    return allCards().filter(function (card) {
      return text.indexOf(card.title) !== -1;
    }).length >= 2;
  }

  function findOldGrid(section) {
    var nodes = Array.prototype.slice.call(section.querySelectorAll('div,section,article'));
    var holders = nodes.filter(function (node) {
      return !node.closest('.kliper-ecosystem-polished') && !node.classList.contains('kliper-ecosystem-grid') && containsAllCards(node);
    });
    holders.sort(function (a, b) {
      var ar = a.getBoundingClientRect();
      var br = b.getBoundingClientRect();
      return (ar.width * ar.height) - (br.width * br.height);
    });
    return holders[0] || null;
  }

  function findCardRoot(node, section) {
    var current = node;
    var previous = node;

    while (current && current.parentElement && current.parentElement !== section) {
      var parent = current.parentElement;
      var text = parent.textContent || '';
      var cardMatches = allCards().filter(function (card) {
        return text.indexOf(card.title) !== -1;
      }).length;

      if (cardMatches > 1) return current;
      previous = current;
      current = parent;
    }

    return previous;
  }

  function hideOriginalCards(section) {
    allCards().forEach(function (card) {
      var nodes = Array.prototype.slice.call(section.querySelectorAll('h3,h4,p,span,div,article,button')).filter(function (node) {
        return !node.closest('.kliper-ecosystem-polished') && (node.textContent || '').indexOf(card.title) !== -1;
      });

      nodes.forEach(function (node) {
        var root = findCardRoot(node, section);
        if (root && root !== section && !root.closest('.kliper-ecosystem-polished')) {
          root.classList.add('kliper-ecosystem-original-hidden');
        }
      });
    });

    var oldGrid = findOldGrid(section);
    if (oldGrid && oldGrid !== section) {
      oldGrid.classList.add('kliper-ecosystem-original-hidden');
    }
  }

  function createGrid() {
    var grid = document.createElement('div');
    grid.className = 'kliper-ecosystem-grid';
    activeCards().forEach(function (card) {
      grid.appendChild(createCard(card));
    });
    return grid;
  }

  function createTabs() {
    var tabs = document.createElement('div');
    tabs.className = 'kliper-ecosystem-tabs';
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Разделы экосистемы объекта');
    tabs.innerHTML = Object.keys(cardSets).map(function (tabName) {
      var meta = tabMeta[tabName] || { count: '', note: '' };
      return '<button class="kliper-ecosystem-tab' + (tabName === activeTab ? ' is-active' : '') + '" type="button" role="tab" aria-selected="' + (tabName === activeTab ? 'true' : 'false') + '" data-ecosystem-tab="' + escapeHtml(tabName) + '">' +
        '<span>' + escapeHtml(tabName) + '</span>' +
        '<small>' + escapeHtml(meta.count + ' ' + meta.note).trim() + '</small>' +
      '</button>';
    }).join('');
    return tabs;
  }

  function createPolishedBlock() {
    var block = document.createElement('div');
    block.className = 'kliper-ecosystem-polished';
    block.appendChild(createTabs());
    block.appendChild(createGrid());
    return block;
  }

  function findOriginalTabs(section) {
    var labels = ['Связанные компании', 'Сервисы ЖК', 'Сервисы дома', 'Коммерция / Бизнес аренда', 'Бизнес аренда', 'Все объекты'];
    var buttons = Array.prototype.slice.call(section.querySelectorAll('button')).filter(function (button) {
      var text = button.textContent.replace(/\s+/g, ' ').trim();
      return labels.some(function (label) {
        return text.indexOf(label) !== -1;
      });
    });
    if (buttons.length < 2) return null;

    var candidate = buttons[0].parentElement;
    while (candidate && candidate !== section) {
      var text = candidate.textContent || '';
      var found = labels.filter(function (label) {
        return text.indexOf(label) !== -1;
      }).length;
      if (found >= 3) return candidate;
      candidate = candidate.parentElement;
    }
    return null;
  }

  function mountCards(force) {
    if (!isResidentialObjectPage()) {
      restoreOriginalEcosystem();
      return;
    }

    var section = findSection();
    if (!section) return;

    var previousBlock = section.querySelector('.kliper-ecosystem-polished');
    if (previousBlock && !force) return;
    if (previousBlock) previousBlock.remove();

    var originalTabs = findOriginalTabs(section);
    if (originalTabs) originalTabs.classList.add('kliper-ecosystem-original-hidden');
    hideOriginalCards(section);

    section.appendChild(createPolishedBlock());
  }

  function updateVisibleCard(card) {
    var id = slug(card.displayTitle);
    Array.prototype.slice.call(document.querySelectorAll('[data-ecosystem-card-id="' + id + '"]')).forEach(function (node) {
      var replacement = createCard(card);
      node.replaceWith(replacement);
    });
    Array.prototype.slice.call(document.querySelectorAll('.kliper-ecosystem-drawer')).forEach(function (drawer) {
      drawer.remove();
      showDrawer(card);
    });
  }

  function handleEcosystemAction(event) {
    if (!event.target || !event.target.closest) return;

    var storyButton = event.target.closest('[data-ecosystem-story]');
    if (storyButton) {
      event.preventDefault();
      event.stopPropagation();
      showStory(getCardById(storyButton.getAttribute('data-ecosystem-story')));
      return;
    }

    var likeButton = event.target.closest('[data-ecosystem-like]');
    if (likeButton) {
      event.preventDefault();
      event.stopPropagation();
      var likeCard = getCardById(likeButton.getAttribute('data-ecosystem-like'));
      if (!likeCard) return;
      likedCards = toggleStored('kliper-liked-cards', likedCards, likeCard);
      updateVisibleCard(likeCard);
      return;
    }

    var subscribeButton = event.target.closest('[data-ecosystem-subscribe]');
    if (subscribeButton) {
      event.preventDefault();
      event.stopPropagation();
      var subscribeCard = getCardById(subscribeButton.getAttribute('data-ecosystem-subscribe'));
      if (!subscribeCard) return;
      subscribedCards = toggleStored('kliper-subscribed-cards', subscribedCards, subscribeCard);
      updateVisibleCard(subscribeCard);
      return;
    }

    var gotoButton = event.target.closest('[data-ecosystem-goto]');
    if (gotoButton) {
      event.preventDefault();
      event.stopPropagation();
      openCatalogCategory(getCardById(gotoButton.getAttribute('data-ecosystem-goto')));
      return;
    }

    var cardNode = event.target.closest('[data-ecosystem-card-id], [data-ecosystem-open]');
    if (cardNode) {
      event.preventDefault();
      event.stopPropagation();
      showDrawer(getCardById(cardNode.getAttribute('data-ecosystem-card-id') || cardNode.getAttribute('data-ecosystem-open')));
    }
  }

  function clickButtonByText(text) {
    var button = Array.prototype.slice.call(document.querySelectorAll('button')).find(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim() === text;
    });
    if (button) button.click();
    return !!button;
  }

  function openCatalogCategory(card) {
    if (!card) return;
    var drawer = document.querySelector('.kliper-ecosystem-drawer');
    if (drawer) drawer.remove();

    clickButtonByText('Карточки');
    window.setTimeout(function () {
      clickButtonByText(card.category);
      window.setTimeout(function () {
        clickButtonByText(card.filter);
      }, 180);
    }, 180);
  }

  function scheduleMount() {
    window.requestAnimationFrame(mountCards);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleMount);
  } else {
    scheduleMount();
  }

  window.addEventListener('load', scheduleMount);
  document.addEventListener('click', function (event) {
    handleEcosystemAction(event);
    if (event.defaultPrevented) return;

    var button = event.target && event.target.closest ? event.target.closest('[data-ecosystem-tab], button') : null;
    var text = button ? button.textContent.replace(/\s+/g, ' ').trim() : '';
    var dataTab = button ? button.getAttribute('data-ecosystem-tab') : '';
    Object.keys(cardSets).forEach(function (tabName) {
      if (dataTab === tabName || text.indexOf(tabName) !== -1 || (tabName === 'Сервисы ЖК' && text.indexOf('Сервисы дома') !== -1) || (tabName === 'Бизнес аренда' && text.indexOf('Коммерция / Бизнес аренда') !== -1)) {
        activeTab = tabName;
      }
    });
    window.setTimeout(function () {
      mountCards(true);
    }, 120);
  }, true);

  var attempts = 0;
  var timer = window.setInterval(function () {
    attempts += 1;
    mountCards();
    if (document.querySelector('.kliper-ecosystem-grid') || attempts > 40) {
      window.clearInterval(timer);
    }
  }, 150);
})();
