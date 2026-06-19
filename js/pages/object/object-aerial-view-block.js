(function () {
  var dom = window.KLIPER_DOM || {};
  var aerialImage = 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1800&q=86';

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

  function showAerialModal() {
    var oldModal = document.querySelector('.kliper-aerial-modal');
    if (oldModal) oldModal.remove();

    var modal = document.createElement('div');
    modal.className = 'kliper-aerial-modal';
    modal.innerHTML =
      '<button class="kliper-aerial-modal__backdrop" type="button" aria-label="Закрыть вид сверху"></button>' +
      '<article class="kliper-aerial-modal__card" role="dialog" aria-modal="true" aria-label="Вид сверху">' +
        '<button class="kliper-aerial-modal__close" type="button" aria-label="Закрыть">×</button>' +
        '<div class="kliper-aerial-modal__scene" style="background-image:url(' + escapeHtml(aerialImage) + ')">' +
          '<div>' +
            '<p>3D-вид объекта</p>' +
            '<h3>Вид сверху</h3>' +
            '<span>Здесь появится интерактивная визуализация ЖК.</span>' +
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
      if (event.target.closest('.kliper-aerial-modal__backdrop') || event.target.closest('.kliper-aerial-modal__close')) {
        closeModal();
      }
    });
    document.addEventListener('keydown', handleKeydown);
  }

  function createBlock() {
    var section = document.createElement('section');
    section.className = 'kliper-aerial-view';
    section.innerHTML =
      '<div class="kliper-aerial-view__head">' +
        '<h2>Вид сверху</h2>' +
        '<p>Исследуйте ЖК с высоты птичьего полёта.</p>' +
      '</div>' +
      '<div class="kliper-aerial-view__preview" role="button" tabindex="0" aria-label="Открыть вид сверху">' +
        '<img src="' + escapeHtml(aerialImage) + '" alt="Вид сверху" loading="lazy">' +
        '<div class="kliper-aerial-view__overlay">' +
          '<span>3D-ВИД ОБЪЕКТА</span>' +
          '<strong>Вид сверху</strong>' +
        '</div>' +
      '</div>';

    var preview = section.querySelector('.kliper-aerial-view__preview');
    preview.addEventListener('click', function (event) {
      event.preventDefault();
      showAerialModal();
    });
    preview.addEventListener('keydown', function (event) {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      showAerialModal();
    });

    return section;
  }

  function removeBlock() {
    var block = document.querySelector('.kliper-aerial-view');
    if (block) block.remove();
  }

  function mountBlock() {
    if (!isResidentialObjectPage()) {
      removeBlock();
      return;
    }
    if (document.querySelector('.kliper-aerial-view')) return;

    var gallery = document.querySelector('.kliper-object-gallery');
    if (gallery && gallery.parentElement) {
      gallery.parentElement.insertBefore(createBlock(), gallery);
      return;
    }

    var plans = document.querySelector('.kliper-object-plans');
    if (plans && plans.parentElement) {
      plans.parentElement.insertBefore(createBlock(), plans);
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
    if (document.querySelector('.kliper-aerial-view') || attempts > 50) {
      window.clearInterval(timer);
    }
  }, 150);
})();
