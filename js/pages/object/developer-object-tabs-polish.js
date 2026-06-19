(function () {
  var labels = {
    'Готовые ЖК': 'Готовые ЖК',
    'Бизнес аренда': 'Для бизнеса'
  };
  var icons = {
    'Новостройки': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V9l8-5 8 5v11"/><path d="M9 20v-7h6v7"/><path d="M7 11h.01M17 11h.01"/></svg>',
    'Готовые ЖК': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12.5 9 17 20 6"/><path d="M5 20h14"/></svg>',
    'Для бизнеса': '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7"/><path d="M5 7h14v12H5z"/><path d="M5 12h14"/><path d="M10 12v1h4v-1"/></svg>'
  };
  var timer = 0;

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getTitleNode(button) {
    return button.querySelector('.kliper-developer-object-tabs__title') ||
      Array.prototype.slice.call(button.children).find(function (node) {
        return node.tagName === 'SPAN' &&
          !node.classList.contains('kliper-developer-object-tabs__icon') &&
          !node.classList.contains('kliper-developer-object-tabs__count');
      });
  }

  function getMetaNode(button, title) {
    return button.querySelector('.kliper-developer-object-tabs__count') ||
      Array.prototype.slice.call(button.children).find(function (node) {
        return node.tagName === 'SPAN' &&
          node !== title &&
          !node.classList.contains('kliper-developer-object-tabs__icon');
      });
  }

  function polishTabs() {
    var heading = Array.prototype.slice.call(document.querySelectorAll('p')).find(function (node) {
      return normalize(node.textContent) === 'Объекты застройщика';
    });
    if (!heading) return;

    var block = heading.parentElement && heading.parentElement.parentElement;
    if (!block) return;
    block.classList.add('kliper-developer-object-tabs');
    if (heading.parentElement) {
      heading.parentElement.classList.add('kliper-developer-objects-heading-hidden');
    }

    Array.prototype.forEach.call(block.querySelectorAll('button'), function (button) {
      var title = getTitleNode(button);
      var current = normalize(title ? title.textContent : '') || normalize(button.getAttribute('aria-label'));
      var nextLabel = labels[current] || current;
      var meta = getMetaNode(button, title);
      var count = meta && normalize(meta.textContent).match(/\d+/);
      if (!nextLabel || !icons[nextLabel]) return;

      button.parentElement.classList.add('kliper-developer-object-tabs__list');
      button.classList.add('kliper-developer-object-tabs__button');
      if (title) {
        title.textContent = nextLabel;
        title.classList.add('kliper-developer-object-tabs__title');
      }
      if (!button.querySelector('.kliper-developer-object-tabs__icon')) {
        var icon = document.createElement('span');
        icon.className = 'kliper-developer-object-tabs__icon';
        icon.innerHTML = icons[nextLabel] || icons['Новостройки'];
        button.insertBefore(icon, title || button.firstChild);
      }
      if (meta) {
        meta.textContent = count ? count[0] : '0';
        meta.classList.add('kliper-developer-object-tabs__count');
      }
      button.setAttribute('aria-label', nextLabel);
      button.setAttribute('title', nextLabel);
    });
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = window.setTimeout(polishTabs, 60);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  window.addEventListener('load', schedule);
  window.addEventListener('hashchange', schedule);
  document.addEventListener('click', function () { window.setTimeout(schedule, 120); }, true);
  new MutationObserver(schedule).observe(document.getElementById('root') || document.body, {
    childList: true,
    subtree: true
  });
})();
