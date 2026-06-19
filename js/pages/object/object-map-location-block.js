(function () {
  var dom = window.KLIPER_DOM || {};
  var previewImage = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1400&q=82';

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

  function showMapModal() {
    var oldModal = document.querySelector('.kliper-map-modal');
    if (oldModal) oldModal.remove();

    var modal = document.createElement('div');
    modal.className = 'kliper-map-modal';
    modal.innerHTML =
      '<button class="kliper-map-modal__backdrop" type="button" aria-label="Закрыть карту"></button>' +
      '<article class="kliper-map-modal__card" role="dialog" aria-modal="true" aria-label="Расположение на карте">' +
        '<button class="kliper-map-modal__close" type="button" aria-label="Закрыть">×</button>' +
        '<div class="kliper-map-modal__map">' +
          '<span class="kliper-map-modal__pin"></span>' +
          '<div>' +
            '<p>Карта объекта</p>' +
            '<h3>Расположение на карте</h3>' +
            '<span>Позже здесь подключим интерактивную карту, маршруты и инфраструктуру рядом с ЖК.</span>' +
          '</div>' +
        '</div>' +
      '</article>';
    document.body.appendChild(modal);

    function closeModal() {
      modal.remove();
      document.removeEventListener('keydown', handleKeydown);
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') closeModal();
    }

    modal.addEventListener('click', function (event) {
      if (event.target.closest('.kliper-map-modal__backdrop') || event.target.closest('.kliper-map-modal__close')) {
        closeModal();
      }
    });
    document.addEventListener('keydown', handleKeydown);
  }

  function createBlock() {
    var section = document.createElement('section');
    section.className = 'kliper-map-location';
    section.innerHTML =
      '<div class="kliper-map-location__head">' +
        '<h2>Расположение на карте</h2>' +
        '<p>Узнайте, где находится ЖК, посмотрите инфраструктуру и транспортную доступность.</p>' +
      '</div>' +
      '<div class="kliper-map-location__preview" role="button" tabindex="0" aria-label="Открыть карту">' +
        '<div class="kliper-map-location__map" aria-hidden="true"><span class="kliper-map-location__pin"></span></div>' +
        '<div class="kliper-map-location__aerial">' +
          '<img src="' + escapeHtml(previewImage) + '" alt="Инфраструктура рядом с ЖК" loading="lazy">' +
        '</div>' +
        '<div class="kliper-map-location__overlay">' +
          '<span>КАРТА ОБЪЕКТА</span>' +
          '<strong>Расположение на карте</strong>' +
        '</div>' +
      '</div>';

    var preview = section.querySelector('.kliper-map-location__preview');
    preview.addEventListener('click', function (event) {
      event.preventDefault();
      showMapModal();
    });
    preview.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      showMapModal();
    });

    return section;
  }

  function removeBlock() {
    var block = document.querySelector('.kliper-map-location');
    if (block) block.remove();
  }

  function layoutMapPair() {
    var map = document.querySelector('.kliper-map-location');
    var aerial = document.querySelector('.kliper-aerial-view');
    if (!map || !aerial || !map.parentElement || !aerial.parentElement) return;

    var wrapper = document.querySelector('.kliper-object-map-pair');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.className = 'kliper-object-map-pair';
      map.parentElement.insertBefore(wrapper, map);
    }

    if (map.parentElement !== wrapper) wrapper.appendChild(map);
    if (aerial.parentElement !== wrapper) wrapper.appendChild(aerial);
    if (wrapper.firstElementChild !== map) wrapper.insertBefore(map, aerial);
  }

  function mountBlock() {
    if (!isResidentialObjectPage()) {
      removeBlock();
      return;
    }
    if (document.querySelector('.kliper-map-location')) {
      layoutMapPair();
      return;
    }

    var aerial = document.querySelector('.kliper-aerial-view');
    if (aerial && aerial.parentElement) {
      aerial.parentElement.insertBefore(createBlock(), aerial.nextSibling);
      layoutMapPair();
      return;
    }

    var gallery = document.querySelector('.kliper-object-gallery');
    if (gallery && gallery.parentElement) {
      gallery.parentElement.insertBefore(createBlock(), gallery);
      layoutMapPair();
      return;
    }

    var plans = document.querySelector('.kliper-object-plans');
    if (plans && plans.parentElement) {
      plans.parentElement.insertBefore(createBlock(), plans);
      layoutMapPair();
    }
  }

  function scheduleMount() {
    window.requestAnimationFrame(mountBlock);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleMount);
  } else {
    scheduleMount();
  }

  window.addEventListener('load', scheduleMount);
  document.addEventListener('click', function () {
    window.setTimeout(scheduleMount, 140);
  }, true);

  var attempts = 0;
  var timer = window.setInterval(function () {
    attempts += 1;
    mountBlock();
    if (document.querySelector('.kliper-map-location') || attempts > 50) {
      window.clearInterval(timer);
    }
  }, 150);
})();
