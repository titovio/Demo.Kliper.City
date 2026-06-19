(function () {
  'use strict';

  var DATA = window.KLIPER_TYUMEN_DISTRICTS;
  if (!DATA || !Array.isArray(DATA.districts)) return;

  var GROUP_BY_LABEL = {
    'Новые районы': 'newDistrict',
    'Районы': 'establishedDistrict'
  };
  var STORAGE_KEY = 'kliper-district-subscriptions-v1';
  var activeLabel = '';
  var searchValue = '';
  var adminValue = 'Все округа';
  var observerTimer = 0;

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function loadSubscriptions() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      return [];
    }
  }

  function saveSubscriptions(items) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch (error) {}
  }

  function isSubscribed(id) { return loadSubscriptions().indexOf(id) !== -1; }

  function toggleSubscription(id) {
    var items = loadSubscriptions();
    var index = items.indexOf(id);
    if (index === -1) items.push(id); else items.splice(index, 1);
    saveSubscriptions(items);
    render();
    updateDialogSubscription(id);
  }

  function allAdmins() {
    var values = DATA.districts.map(function (item) { return item.administrativeDistrict; });
    return ['Все округа'].concat(values.filter(function (value, index) { return values.indexOf(value) === index; }).sort());
  }

  function getFiltered() {
    var group = GROUP_BY_LABEL[activeLabel];
    var query = searchValue.trim().toLowerCase();
    return DATA.districts.filter(function (item) {
      if (item.catalogGroup !== group || item.isPublished === false) return false;
      if (adminValue !== 'Все округа' && item.administrativeDistrict !== adminValue) return false;
      if (!query) return true;
      var haystack = [item.name, item.fullName, item.location].concat(item.aliases || []).join(' ').toLowerCase();
      return haystack.indexOf(query) !== -1;
    });
  }

  function getActiveVisualDistrictLabel() {
    var heading = Array.prototype.map.call(document.querySelectorAll('h1,h2'), function (node) {
      return node.textContent.trim();
    }).find(function (label) {
      return GROUP_BY_LABEL[label];
    });
    return heading || '';
  }

  function syncActiveLabelFromVisual() {
    activeLabel = getActiveVisualDistrictLabel();
  }

  function preserveScrollPosition() {
    var x = window.scrollX || 0;
    var y = window.scrollY || 0;
    return function () {
      if (Math.abs((window.scrollX || 0) - x) > 2 || Math.abs((window.scrollY || 0) - y) > 2) {
        window.scrollTo(x, y);
      }
    };
  }

  function markSourceElements(hidden) {
    var firstCard = document.querySelector('[aria-label^="Открыть карточку"]');
    if (firstCard) {
      var candidate = firstCard.parentElement;
      var best = candidate;
      var depth = 0;
      while (candidate && candidate !== document.body && depth < 7) {
        if (candidate.tagName === 'SECTION' || candidate.tagName === 'MAIN') break;
        var count = candidate.querySelectorAll('[aria-label^="Открыть карточку"]').length;
        if (count >= 2) best = candidate;
        candidate = candidate.parentElement;
        depth += 1;
      }
      if (best) best.classList.toggle('kliper-district-source-hidden', hidden);
    }

    Array.prototype.forEach.call(document.querySelectorAll('.kliper-cards-result-toolbar, .kliper-cards-source-filter'), function (node) {
      node.classList.toggle('kliper-district-source-hidden', hidden);
    });
  }

  function ensureRoot() {
    var root = document.querySelector('[data-kliper-district-catalog]');
    if (root) return root;
    var shell = Array.prototype.find.call(document.querySelectorAll('main section'), function (section) {
      var text = (section.textContent || '').replace(/\s+/g, ' ').trim();
      return text.indexOf('Новые районы') !== -1 || text.indexOf('Районы') !== -1;
    });
    if (!shell) return null;
    root = document.createElement('section');
    root.className = 'kliper-district-catalog';
    root.setAttribute('data-kliper-district-catalog', '');
    root.setAttribute('aria-live', 'polite');
    shell.insertAdjacentElement('afterend', root);
    root.addEventListener('click', onRootClick);
    root.addEventListener('input', onRootInput);
    root.addEventListener('change', onRootChange);
    return root;
  }

  function subscriptionIcon(active) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></svg>';
  }

  function cardHtml(item) {
    var subscribed = isSubscribed(item.id);
    var initials = item.name.replace(/[^А-ЯA-Z0-9]/gi, '').slice(0, 2).toUpperCase();
    return '<article class="kliper-district-card" data-theme="' + escapeHtml(item.coverTheme || 1) + '">' +
      '<button class="kliper-district-card__open" type="button" data-open-district="' + escapeHtml(item.slug) + '" aria-label="Открыть район ' + escapeHtml(item.name) + '">' +
        '<img class="kliper-district-card__cover" src="' + escapeHtml(item.coverImage) + '" alt="" loading="lazy">' +
        '<span class="kliper-district-card__initials" aria-hidden="true">' + escapeHtml(initials) + '</span>' +
        '<span class="kliper-district-card__shade"></span>' +
        '<span class="kliper-district-card__tag">' + escapeHtml(item.cardTag) + '</span>' +
        '<span class="kliper-district-card__content">' +
          '<span class="kliper-district-card__location"><span aria-hidden="true">⌖</span> ' + escapeHtml(item.administrativeDistrict) + '</span>' +
          '<strong class="kliper-district-card__title">' + escapeHtml(item.name) + '</strong>' +
          '<span class="kliper-district-card__status">' + escapeHtml(item.status) + ' · новости и места района</span>' +
        '</span>' +
      '</button>' +
      '<div class="kliper-district-card__metrics">' +
        '<span title="Нравится">♡ ' + escapeHtml(item.metrics.likes) + '</span>' +
        '<button type="button" class="kliper-district-card__subscribe' + (subscribed ? ' is-active' : '') + '" data-subscribe-district="' + escapeHtml(item.id) + '" aria-pressed="' + (subscribed ? 'true' : 'false') + '">' + subscriptionIcon(subscribed) + '<span>' + (subscribed ? 'Вы подписаны' : 'Подписаться') + '</span></button>' +
        '<span title="Обсуждения">◯ ' + escapeHtml(item.metrics.comments) + '</span>' +
      '</div>' +
    '</article>';
  }

  function render() {
    var root = ensureRoot();
    if (!root) return;
    syncActiveLabelFromVisual();
    var group = GROUP_BY_LABEL[activeLabel];
    var active = !!group;
    document.body.classList.toggle('kliper-district-catalog-active', active);
    markSourceElements(active);
    root.hidden = !active;
    if (!active) return;

    var items = getFiltered();
    root.innerHTML = '<div class="kliper-district-catalog__toolbar">' +
      '<div><strong>' + escapeHtml(activeLabel) + '</strong><span>' + items.length + ' районов</span></div>' +
      '<label class="kliper-district-catalog__search"><span class="sr-only">Поиск района</span><input type="search" data-district-search placeholder="Найти свой район" value="' + escapeHtml(searchValue) + '"></label>' +
      '<label class="kliper-district-catalog__select"><span class="sr-only">Административный округ</span><select data-district-admin>' +
        allAdmins().map(function (admin) { return '<option' + (admin === adminValue ? ' selected' : '') + '>' + escapeHtml(admin) + '</option>'; }).join('') +
      '</select></label>' +
    '</div>' +
    '<p class="kliper-district-catalog__hint">Выберите район и подпишитесь, чтобы получать местные новости, события и рекомендации.</p>' +
    (items.length ? '<div class="kliper-district-catalog__grid">' + items.map(cardHtml).join('') + '</div>' : '<div class="kliper-district-catalog__empty">По вашему запросу районы не найдены.</div>');
  }

  function findDistrict(slugOrId) {
    return DATA.districts.find(function (item) { return item.slug === slugOrId || item.id === slugOrId; });
  }

  function ensureDialog() {
    var dialog = document.querySelector('[data-kliper-district-dialog]');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.className = 'kliper-district-dialog';
    dialog.setAttribute('data-kliper-district-dialog', '');
    document.body.appendChild(dialog);
    dialog.addEventListener('click', function (event) {
      if (event.target === dialog || event.target.closest('[data-close-district-dialog]')) closeDialog();
      var subscribe = event.target.closest('[data-dialog-subscribe]');
      if (subscribe) toggleSubscription(subscribe.getAttribute('data-dialog-subscribe'));
    });
    return dialog;
  }

  function openDialog(slug, pushHash) {
    var item = findDistrict(slug);
    if (!item) return;
    var dialog = ensureDialog();
    var subscribed = isSubscribed(item.id);
    dialog.innerHTML = '<div class="kliper-district-dialog__panel">' +
      '<button class="kliper-district-dialog__close" type="button" data-close-district-dialog aria-label="Закрыть">×</button>' +
      '<div class="kliper-district-dialog__hero" data-theme="' + escapeHtml(item.coverTheme || 1) + '"><img src="' + escapeHtml(item.coverImage) + '" alt=""><span></span></div>' +
      '<div class="kliper-district-dialog__body">' +
        '<span class="kliper-district-dialog__tag">' + escapeHtml(item.cardTag) + '</span>' +
        '<h2>' + escapeHtml(item.name) + '</h2>' +
        '<p class="kliper-district-dialog__location">' + escapeHtml(item.administrativeDistrict) + ' административный округ · ' + escapeHtml(item.location) + '</p>' +
        '<p>' + escapeHtml(item.description) + '</p>' +
        '<div class="kliper-district-dialog__actions"><button type="button" data-dialog-subscribe="' + escapeHtml(item.id) + '" class="' + (subscribed ? 'is-active' : '') + '">' + (subscribed ? 'Вы подписаны' : 'Подписаться на район') + '</button><button type="button" data-close-district-dialog>Закрыть</button></div>' +
        '<section class="kliper-district-dialog__feed"><h3>Лента района</h3><p>Здесь будут появляться новости, события, важные уведомления и рекомендации, связанные с районом.</p></section>' +
      '</div>' +
    '</div>';
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    if (pushHash !== false) history.replaceState(null, '', '#district=' + encodeURIComponent(item.slug));
  }

  function closeDialog() {
    var dialog = document.querySelector('[data-kliper-district-dialog]');
    if (dialog) {
      if (typeof dialog.close === 'function' && dialog.open) dialog.close();
      else dialog.removeAttribute('open');
    }
    if (window.location.hash.indexOf('#district=') === 0) history.replaceState(null, '', window.location.pathname + window.location.search);
  }

  function updateDialogSubscription(id) {
    var dialog = document.querySelector('[data-kliper-district-dialog]');
    if (!dialog || !dialog.open) return;
    var button = dialog.querySelector('[data-dialog-subscribe="' + id + '"]');
    if (!button) return;
    var subscribed = isSubscribed(id);
    button.classList.toggle('is-active', subscribed);
    button.textContent = subscribed ? 'Вы подписаны' : 'Подписаться на район';
  }

  function onRootClick(event) {
    var subscribe = event.target.closest('[data-subscribe-district]');
    if (subscribe) {
      event.preventDefault(); event.stopPropagation();
      toggleSubscription(subscribe.getAttribute('data-subscribe-district'));
      return;
    }
    var open = event.target.closest('[data-open-district]');
    if (open) openDialog(open.getAttribute('data-open-district'));
  }

  function onRootInput(event) {
    if (!event.target.matches('[data-district-search]')) return;
    searchValue = event.target.value;
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(render, 120);
  }

  function onRootChange(event) {
    if (!event.target.matches('[data-district-admin]')) return;
    adminValue = event.target.value;
    render();
  }

  document.addEventListener('click', function (event) {
    var tab = event.target.closest('button');
    if (!tab) return;
    var label = (tab.textContent || '').trim();
    activeLabel = GROUP_BY_LABEL[label] ? label : '';
    var restoreScroll = preserveScrollPosition();
    window.setTimeout(function () {
      render();
      restoreScroll();
    }, 80);
    window.setTimeout(function () {
      render();
      restoreScroll();
    }, 300);
    window.setTimeout(restoreScroll, 520);
  }, true);

  function restoreFromHash() {
    var match = window.location.hash.match(/^#district=([^&]+)/);
    if (match) openDialog(decodeURIComponent(match[1]), false);
  }

  var mutationObserver = new MutationObserver(function () {
    if (!activeLabel) return;
    window.clearTimeout(observerTimer);
    observerTimer = window.setTimeout(render, 80);
  });
  mutationObserver.observe(document.documentElement, { childList: true, subtree: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { render(); restoreFromHash(); });
  } else {
    render(); restoreFromHash();
  }

  window.addEventListener('hashchange', restoreFromHash);
})();
