(function () {
  var activeCategory = 'Общий вид';
  var dom = window.KLIPER_DOM || {};
  var categories = ['Общий вид', 'Двор и площадки', 'Вход и лифты', 'Отделка помещений'];
  var gallery = {
    'Общий вид': [
      {
        title: 'Фасады у реки',
        image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Вечерний двор',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Галерея первых этажей',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Интерьер лобби',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Квартира с отделкой',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=84'
      }
    ],
    'Двор и площадки': [
      {
        title: 'Тихий двор',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Зоны отдыха',
        image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Озеленение',
        image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Детская площадка',
        image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=900&q=84'
      }
    ],
    'Вход и лифты': [
      {
        title: 'Входная группа',
        image: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Холл',
        image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Лифтовая зона',
        image: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=900&q=84'
      }
    ],
    'Отделка помещений': [
      {
        title: 'Кухня-гостиная',
        image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Спальня',
        image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Гостиная',
        image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=84'
      },
      {
        title: 'Санузел',
        image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=84'
      }
    ]
  };

  function escapeHtml(value) {
    if (dom.escapeHtml) return dom.escapeHtml(value);
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function largeImage(url) {
    return String(url || '').replace('w=900', 'w=1600').replace('q=84', 'q=90');
  }

  function isResidentialObjectPage() {
    var title = Array.prototype.slice.call(document.querySelectorAll('h1')).map(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim();
    }).find(Boolean) || '';

    if (title.toLowerCase().indexOf('жк ') === 0) return true;
    return /новостройк|сданн/i.test(title) && (document.body.textContent || '').toLowerCase().indexOf('жк ') !== -1;
  }

  function galleryItems() {
    return gallery[activeCategory] || gallery['Общий вид'];
  }

  function allGalleryEntries() {
    var entries = [];
    categories.forEach(function (category) {
      (gallery[category] || []).forEach(function (item, index) {
        entries.push({
          category: category,
          index: index,
          item: item
        });
      });
    });
    return entries;
  }

  function galleryEntryIndex(category, index) {
    var entries = allGalleryEntries();
    var found = entries.findIndex(function (entry) {
      return entry.category === category && entry.index === index;
    });
    return found >= 0 ? found : 0;
  }

  function renderTabs() {
    return categories.map(function (category) {
      return '<button class="kliper-object-gallery__tab' + (category === activeCategory ? ' is-active' : '') + '" type="button" data-gallery-category="' + escapeHtml(category) + '">' +
        escapeHtml(category) +
      '</button>';
    }).join('');
  }

  function renderPhotos() {
    return galleryItems().map(function (item, index) {
      return '<button class="kliper-object-gallery__photo" type="button" data-gallery-index="' + index + '" aria-label="Открыть фото ' + escapeHtml(item.title) + '">' +
        '<img src="' + escapeHtml(item.image) + '" alt="' + escapeHtml(item.title) + '" loading="lazy">' +
        '<span>' + escapeHtml(item.title) + '</span>' +
      '</button>';
    }).join('');
  }

  function updateGallery(section) {
    var tabs = section.querySelector('.kliper-object-gallery__tabs');
    var track = section.querySelector('.kliper-object-gallery__track');
    if (tabs) tabs.innerHTML = renderTabs();
    if (track) track.innerHTML = renderPhotos();
    section.setAttribute('data-gallery-category', activeCategory);
    bindPhotoButtons(section);
  }

  function bindPhotoButtons(section) {
    Array.prototype.slice.call(section.querySelectorAll('.kliper-object-gallery__photo')).forEach(function (button) {
      if (button.dataset.galleryBound === '1') return;
      button.dataset.galleryBound = '1';
      button.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();
        showGalleryModal(Number(button.getAttribute('data-gallery-index')) || 0);
      });
    });
  }

  function createBlock() {
    var section = document.createElement('section');
    section.className = 'kliper-object-gallery';
    section.setAttribute('data-gallery-category', activeCategory);
    section.innerHTML =
      '<div class="kliper-object-gallery__head">' +
        '<h2>Галерея</h2>' +
      '</div>' +
      '<div class="kliper-object-gallery__tabs" role="tablist" aria-label="Категории галереи">' + renderTabs() + '</div>' +
      '<div class="kliper-object-gallery__viewport">' +
        '<button class="kliper-object-gallery__arrow kliper-object-gallery__arrow--prev" type="button" aria-label="Прокрутить галерею назад">‹</button>' +
        '<div class="kliper-object-gallery__track">' + renderPhotos() + '</div>' +
        '<button class="kliper-object-gallery__arrow kliper-object-gallery__arrow--next" type="button" aria-label="Прокрутить галерею вперед">›</button>' +
      '</div>';
    section.addEventListener('click', handleGalleryClick);
    bindPhotoButtons(section);
    return section;
  }

  function showGalleryModal(index) {
    var entries = allGalleryEntries();
    var currentIndex = galleryEntryIndex(activeCategory, Number(index) || 0);
    var entry = entries[currentIndex];
    if (!entry || !entry.item) return;
    var oldModal = document.querySelector('.kliper-gallery-modal');
    if (oldModal) oldModal.remove();

    var modal = document.createElement('div');
    modal.className = 'kliper-gallery-modal';
    modal.innerHTML =
      '<button class="kliper-gallery-modal__backdrop" type="button" aria-label="Закрыть галерею"></button>' +
      '<article class="kliper-gallery-modal__card" role="dialog" aria-modal="true" aria-label="' + escapeHtml(entry.item.title) + '">' +
        '<button class="kliper-gallery-modal__close" type="button" aria-label="Закрыть">×</button>' +
        '<button class="kliper-gallery-modal__nav kliper-gallery-modal__nav--prev" type="button" aria-label="Предыдущее фото">‹</button>' +
        '<div class="kliper-gallery-modal__media">' +
          '<img src="' + escapeHtml(largeImage(entry.item.image)) + '" alt="' + escapeHtml(entry.item.title) + '">' +
        '</div>' +
        '<button class="kliper-gallery-modal__nav kliper-gallery-modal__nav--next" type="button" aria-label="Следующее фото">›</button>' +
        '<div class="kliper-gallery-modal__caption">' +
          '<p>' + escapeHtml(entry.item.title) + '</p>' +
          '<span>' + escapeHtml(entry.category) + ' · ' + (currentIndex + 1) + ' / ' + entries.length + '</span>' +
        '</div>' +
      '</article>';
    document.body.appendChild(modal);

    function renderModal() {
      entry = entries[currentIndex];
      var item = entry.item;
      var card = modal.querySelector('.kliper-gallery-modal__card');
      var image = modal.querySelector('.kliper-gallery-modal__media img');
      var caption = modal.querySelector('.kliper-gallery-modal__caption p');
      var counter = modal.querySelector('.kliper-gallery-modal__caption span');
      if (card) card.setAttribute('aria-label', item.title);
      if (image) {
        image.src = largeImage(item.image);
        image.alt = item.title;
      }
      if (caption) caption.textContent = item.title;
      if (counter) counter.textContent = entry.category + ' · ' + (currentIndex + 1) + ' / ' + entries.length;
    }

    function showNext(direction) {
      currentIndex = (currentIndex + direction + entries.length) % entries.length;
      renderModal();
    }

    function closeModal() {
      modal.remove();
      document.removeEventListener('keydown', handleKeydown);
    }

    function handleKeydown(event) {
      if (event.key === 'Escape') closeModal();
      if (event.key === 'ArrowRight') showNext(1);
      if (event.key === 'ArrowLeft') showNext(-1);
    }

    modal.addEventListener('click', function (event) {
      if (event.target.closest('.kliper-gallery-modal__backdrop') || event.target.closest('.kliper-gallery-modal__close')) {
        closeModal();
        return;
      }
      if (event.target.closest('.kliper-gallery-modal__nav--next')) {
        showNext(1);
        return;
      }
      if (event.target.closest('.kliper-gallery-modal__nav--prev')) {
        showNext(-1);
      }
    });
    document.addEventListener('keydown', handleKeydown);
  }

  function handleGalleryClick(event) {
    if (event.kliperGalleryHandled) return;
    var section = event.currentTarget && event.currentTarget.classList && event.currentTarget.classList.contains('kliper-object-gallery')
      ? event.currentTarget
      : event.target.closest('.kliper-object-gallery');
    if (!section) return;
    var tab = event.target.closest('[data-gallery-category]');
    if (tab) {
      event.preventDefault();
      event.kliperGalleryHandled = true;
      activeCategory = tab.getAttribute('data-gallery-category') || activeCategory;
      updateGallery(section);
      return;
    }

    var arrow = event.target.closest('.kliper-object-gallery__arrow');
    if (arrow) {
      event.preventDefault();
      event.kliperGalleryHandled = true;
      var track = section.querySelector('.kliper-object-gallery__track');
      if (!track) return;
      var direction = arrow.classList.contains('kliper-object-gallery__arrow--prev') ? -1 : 1;
      track.scrollBy({ left: direction * Math.max(220, track.clientWidth * 0.72), behavior: 'smooth' });
      return;
    }

    var photo = event.target.closest('[data-gallery-index]');
    if (photo) {
      event.preventDefault();
      event.kliperGalleryHandled = true;
      showGalleryModal(Number(photo.getAttribute('data-gallery-index')) || 0);
    }
  }

  function handleDocumentGalleryClick(event) {
    if (!event.target.closest('.kliper-object-gallery')) return;
    handleGalleryClick(event);
  }

  function removeGalleryBlock() {
    var block = document.querySelector('.kliper-object-gallery');
    if (block) block.remove();
  }

  function mountGalleryBlock() {
    if (!isResidentialObjectPage()) {
      removeGalleryBlock();
      return;
    }
    if (document.querySelector('.kliper-object-gallery')) return;

    var plans = document.querySelector('.kliper-object-plans');
    if (plans && plans.parentElement) {
      plans.parentElement.insertBefore(createBlock(), plans);
      return;
    }

    var headings = Array.prototype.slice.call(document.querySelectorAll('h2,h3'));
    var storiesHeading = headings.find(function (node) {
      return node.textContent && node.textContent.trim() === 'Сервисы и stories';
    });
    var storiesBlock = storiesHeading && (storiesHeading.closest('section[class*="rounded"], div[class*="rounded"]') || storiesHeading.closest('section') || storiesHeading.parentElement);
    if (storiesBlock && storiesBlock.parentElement) {
      storiesBlock.parentElement.insertBefore(createBlock(), storiesBlock);
    }
  }

  function scheduleMount() {
    window.requestAnimationFrame(mountGalleryBlock);
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
  document.addEventListener('click', handleDocumentGalleryClick, true);

  var attempts = 0;
  var timer = window.setInterval(function () {
    attempts += 1;
    mountGalleryBlock();
    if (document.querySelector('.kliper-object-gallery') || attempts > 50) {
      window.clearInterval(timer);
    }
  }, 150);
})();
