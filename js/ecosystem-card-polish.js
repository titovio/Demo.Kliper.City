(function () {
  var activeTab = 'Связанные компании';
  var cardSets = {
    'Связанные компании': [
    {
      title: 'Кофейня у дома',
      displayTitle: 'Coffee Port',
      tag: 'кафе',
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
      tag: 'сервис дома',
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
      location: 'управление · заявки и новости',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=82',
      logo: 'УК',
      likes: 58,
      follows: 24,
      comments: 5
    }
    ],
    'Сервисы дома': [
      {
        title: 'Пункт выдачи CityBox',
        displayTitle: 'CityBox',
        tag: 'пвз',
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
    'Сервисы дома': { count: '7', note: 'для жителей' },
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

  function createCard(card) {
    var article = document.createElement('article');
    article.className = 'kliper-ecosystem-card';
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', 'Открыть карточку ' + card.displayTitle);
    article.style.backgroundImage = 'url("' + card.image + '")';
    article.innerHTML =
      '<div class="kliper-ecosystem-card__tag">' + escapeHtml(card.tag) + '</div>' +
      '<div class="kliper-ecosystem-card__logo">' + escapeHtml(card.logo) + '</div>' +
      '<div class="kliper-ecosystem-card__body">' +
        '<p class="kliper-ecosystem-card__location">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.4"></circle></svg>' +
          escapeHtml(card.location) +
        '</p>' +
        '<h3>' + escapeHtml(card.displayTitle) + '</h3>' +
        '<div class="kliper-ecosystem-card__stats">' +
          '<span class="kliper-ecosystem-stat kliper-ecosystem-stat--like">' + icon('heart') + escapeHtml(card.likes) + '</span>' +
          '<span class="kliper-ecosystem-stat kliper-ecosystem-stat--follow">' + icon('bell') + escapeHtml(card.follows) + '</span>' +
          '<span class="kliper-ecosystem-stat kliper-ecosystem-stat--comment">' + icon('comment') + escapeHtml(card.comments) + '</span>' +
        '</div>' +
      '</div>';
    return article;
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
    var labels = ['Связанные компании', 'Сервисы дома', 'Коммерция / Бизнес аренда', 'Бизнес аренда', 'Все объекты'];
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
    var button = event.target && event.target.closest ? event.target.closest('[data-ecosystem-tab], button') : null;
    var text = button ? button.textContent.replace(/\s+/g, ' ').trim() : '';
    var dataTab = button ? button.getAttribute('data-ecosystem-tab') : '';
    Object.keys(cardSets).forEach(function (tabName) {
      if (dataTab === tabName || text.indexOf(tabName) !== -1 || (tabName === 'Бизнес аренда' && text.indexOf('Коммерция / Бизнес аренда') !== -1)) {
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
