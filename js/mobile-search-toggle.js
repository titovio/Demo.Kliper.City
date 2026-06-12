(function () {
  var ready = false;

  function findSearchWrap() {
    var input = document.querySelector('input[placeholder*="Поиск"]');
    return input ? input.parentElement : null;
  }

  function findCityButton() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button'));
    return buttons.find(function (button) {
      return button.textContent && button.textContent.indexOf('Тюмень') !== -1;
    });
  }

  function findNavPanel(cityButton, searchWrap) {
    var node = cityButton && cityButton.closest('.rounded-\\[22px\\]');
    if (node && searchWrap && node.contains(searchWrap)) return node;
    return searchWrap ? searchWrap.closest('.bg-\\[\\#030a1d\\]') : null;
  }

  function makeIcon() {
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg>';
  }

  function setup() {
    var searchWrap = findSearchWrap();
    var cityButton = findCityButton();
    var panel = findNavPanel(cityButton, searchWrap);
    if (!searchWrap || !cityButton || !panel) return;

    panel.classList.add('kliper-mobile-nav-panel');
    searchWrap.classList.add('kliper-mobile-search-wrap');
    cityButton.classList.add('kliper-mobile-city-button');

    if (!panel.querySelector('.kliper-mobile-search-trigger')) {
      var trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'kliper-mobile-search-trigger';
      trigger.setAttribute('aria-label', 'Открыть поиск');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.innerHTML = makeIcon();
      var citySlot = cityButton.parentElement || cityButton;
      citySlot.insertAdjacentElement('afterend', trigger);
      function toggleSearch(event) {
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
        var isOpen = panel.classList.toggle('kliper-mobile-search-open');
        trigger.setAttribute('aria-expanded', String(isOpen));
        trigger.setAttribute('aria-label', isOpen ? 'Закрыть поиск' : 'Открыть поиск');
        if (isOpen) {
          var input = searchWrap.querySelector('input');
          if (input) setTimeout(function () { input.focus(); }, 180);
        }
      }
      trigger.addEventListener('pointerdown', toggleSearch);
    }

    ready = true;
  }

  function markFeedPage() {
    var heading = Array.prototype.slice.call(document.querySelectorAll('h1, h2')).find(function (node) {
      return node.textContent && node.textContent.trim() === 'Лента города';
    });
    document.body.classList.toggle('kliper-feed-page', !!heading);
  }

  function boot() {
    setup();
    markFeedPage();
  }

  window.addEventListener('load', boot);
  document.addEventListener('click', function () {
    setTimeout(function () {
      if (!ready) setup();
      markFeedPage();
    }, 80);
  }, true);
  new MutationObserver(function () {
    setup();
    markFeedPage();
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
