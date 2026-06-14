(function () {
  var activeHouse = 0;
  var houses = [
    {
      name: 'Дом 1',
      object: 'Речной Порт',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=180&q=80',
      status: 'строится',
      plans: [
        { title: 'Студия', area: '23 - 29 м²', price: 'от 4.2 до 5.1', note: 'млн ₽', type: 'studio' },
        { title: '1-комнатная', area: '32 - 45 м²', price: 'от 5.8 до 7.4', note: 'млн ₽', type: 'one' },
        { title: '2-комнатная', area: '49 - 65 м²', price: 'от 7.9 до 10.8', note: 'млн ₽', type: 'two' },
        { title: '3-комнатная', area: '66 - 90 м²', price: 'от 10.9 до 14.6', note: 'млн ₽', type: 'three' },
        { title: '4-комнатная', area: '91 - 130 м²', price: 'от 15.8 до 21.0', note: 'млн ₽', type: 'four' }
      ]
    },
    {
      name: 'Дом 2',
      object: 'Республики 205',
      image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=180&q=80',
      status: 'монолит готов',
      plans: [
        { title: 'Студия', area: '25 - 31 м²', price: 'от 4.5 до 5.4', note: 'млн ₽', type: 'studio' },
        { title: '1-комнатная', area: '36 - 48 м²', price: 'от 6.1 до 7.9', note: 'млн ₽', type: 'one' },
        { title: '2-комнатная', area: '52 - 70 м²', price: 'от 8.4 до 11.6', note: 'млн ₽', type: 'two' },
        { title: '3-комнатная', area: '74 - 96 м²', price: 'от 12.1 до 15.8', note: 'млн ₽', type: 'three' }
      ]
    },
    {
      name: 'Дом 3',
      object: 'Набережный',
      image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=180&q=80',
      status: 'фасады',
      plans: [
        { title: '1-комнатная', area: '34 - 44 м²', price: 'от 5.6 до 7.1', note: 'млн ₽', type: 'one' },
        { title: '2-комнатная', area: '50 - 67 м²', price: 'от 8.0 до 10.9', note: 'млн ₽', type: 'two' },
        { title: '3-комнатная', area: '69 - 88 м²', price: 'от 11.2 до 14.9', note: 'млн ₽', type: 'three' },
        { title: '4-комнатная', area: '96 - 128 м²', price: 'от 16.4 до 22.0', note: 'млн ₽', type: 'four' }
      ]
    },
    {
      name: 'Дом 4',
      object: 'Парк-квартал',
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=180&q=80',
      status: 'в продаже',
      plans: [
        { title: 'Студия', area: '21 - 27 м²', price: 'от 4.0 до 4.8', note: 'млн ₽', type: 'studio' },
        { title: '1-комнатная', area: '33 - 42 м²', price: 'от 5.5 до 6.8', note: 'млн ₽', type: 'one' },
        { title: '2-комнатная', area: '48 - 62 м²', price: 'от 7.6 до 9.9', note: 'млн ₽', type: 'two' }
      ]
    },
    {
      name: 'Дом 5',
      object: 'Семейный',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=180&q=80',
      status: 'двор готов',
      plans: [
        { title: '1-комнатная', area: '38 - 46 м²', price: 'от 6.3 до 7.6', note: 'млн ₽', type: 'one' },
        { title: '2-комнатная', area: '55 - 72 м²', price: 'от 8.9 до 12.4', note: 'млн ₽', type: 'two' },
        { title: '3-комнатная', area: '80 - 104 м²', price: 'от 13.8 до 18.2', note: 'млн ₽', type: 'three' }
      ]
    },
    {
      name: 'Дом 6',
      object: 'Башня у воды',
      image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=180&q=80',
      status: 'видовые этажи',
      plans: [
        { title: 'Студия', area: '28 - 34 м²', price: 'от 5.0 до 6.1', note: 'млн ₽', type: 'studio' },
        { title: '2-комнатная', area: '59 - 76 м²', price: 'от 10.2 до 13.7', note: 'млн ₽', type: 'two' },
        { title: '3-комнатная', area: '88 - 118 м²', price: 'от 16.5 до 23.4', note: 'млн ₽', type: 'three' }
      ]
    },
    {
      name: 'Дом 7',
      object: 'Клубный',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=180&q=80',
      status: 'скоро старт',
      plans: [
        { title: '2-комнатная', area: '64 - 82 м²', price: 'от 11.8 до 15.0', note: 'млн ₽', type: 'two' },
        { title: '3-комнатная', area: '90 - 122 м²', price: 'от 17.2 до 25.6', note: 'млн ₽', type: 'three' },
        { title: '4-комнатная', area: '118 - 154 м²', price: 'от 24.0 до 32.5', note: 'млн ₽', type: 'four' }
      ]
    }
  ];
  var planImages = [
    './assets/images/plans/plan-studio-1.png',
    './assets/images/plans/plan-1room-1.png',
    './assets/images/plans/plan-2room-wide.png',
    './assets/images/plans/plan-3room-1.png',
    './assets/images/plans/plan-2room-1.png',
    './assets/images/plans/plan-2room-2.png',
    './assets/images/plans/plan-2room-wide-2.png',
    './assets/images/plans/plan-1room-2.png',
    './assets/images/plans/plan-1room-terrace.png',
    './assets/images/plans/plan-2room-3.png'
  ];
  var imageCursor = 0;

  houses.forEach(function (house) {
    house.plans.forEach(function (plan) {
      plan.image = planImages[imageCursor % planImages.length];
      imageCursor += 1;
    });
  });

  function planSvg(type, plan, large) {
    var planMeta = plan || {};
    var badge = {
      studio: 'С',
      one: '1',
      two: '2',
      three: '3',
      four: '4'
    }[type] || '1';
    var layouts = {
      studio: '<rect class="kliper-plan-room" x="15" y="14" width="58" height="72" rx="2"></rect><rect class="kliper-plan-room kliper-plan-wet" x="73" y="15" width="25" height="31" rx="2"></rect><rect class="kliper-plan-room" x="73" y="48" width="25" height="38" rx="2"></rect><path class="kliper-plan-wall" d="M14 12h86v76H14zM73 13v75M73 46h27"></path><path class="kliper-plan-thin" d="M23 24h22v14H23zM24 58h30v18H24zM79 22h13M79 29h13M80 59h12v18H80z"></path><text class="kliper-plan-label" x="25" y="51">15.1</text><text class="kliper-plan-label" x="80" y="34">4.5</text>',
      one: '<rect class="kliper-plan-room" x="12" y="12" width="48" height="42" rx="2"></rect><rect class="kliper-plan-room" x="12" y="56" width="48" height="35" rx="2"></rect><rect class="kliper-plan-room" x="62" y="12" width="34" height="28" rx="2"></rect><rect class="kliper-plan-room kliper-plan-wet" x="62" y="42" width="34" height="49" rx="2"></rect><path class="kliper-plan-wall" d="M10 10h88v83H10zM60 10v83M10 55h50M60 40h38"></path><path class="kliper-plan-thin" d="M20 22h25v15H20zM21 66h28v15H21zM70 19h16v12H70zM70 55h18v21H70z"></path><text class="kliper-plan-label" x="25" y="48">17.0</text><text class="kliper-plan-label" x="23" y="86">12.4</text>',
      two: '<rect class="kliper-plan-room" x="10" y="11" width="38" height="35" rx="2"></rect><rect class="kliper-plan-room" x="50" y="11" width="45" height="35" rx="2"></rect><rect class="kliper-plan-room" x="10" y="49" width="42" height="42" rx="2"></rect><rect class="kliper-plan-room kliper-plan-wet" x="54" y="49" width="41" height="42" rx="2"></rect><path class="kliper-plan-wall" d="M8 9h89v84H8zM49 9v38M8 47h89M53 47v46"></path><path class="kliper-plan-thin" d="M18 21h19v14H18zM60 20h25v15H60zM20 61h22v19H20zM65 60h18v18H65z"></path><text class="kliper-plan-label" x="22" y="41">9.6</text><text class="kliper-plan-label" x="64" y="41">13.4</text><text class="kliper-plan-label" x="22" y="84">18.0</text>',
      three: '<rect class="kliper-plan-room" x="9" y="10" width="34" height="34" rx="2"></rect><rect class="kliper-plan-room" x="45" y="10" width="50" height="34" rx="2"></rect><rect class="kliper-plan-room" x="9" y="47" width="34" height="45" rx="2"></rect><rect class="kliper-plan-room" x="45" y="47" width="25" height="45" rx="2"></rect><rect class="kliper-plan-room kliper-plan-wet" x="72" y="47" width="23" height="45" rx="2"></rect><path class="kliper-plan-wall" d="M7 8h90v86H7zM44 8v86M7 45h90M71 45v49"></path><path class="kliper-plan-thin" d="M17 20h17v12H17zM55 19h25v15H55zM17 61h16v20H17zM51 60h14v20H51zM78 59h11v22H78z"></path><text class="kliper-plan-label" x="18" y="39">8.6</text><text class="kliper-plan-label" x="59" y="39">18.4</text><text class="kliper-plan-label" x="51" y="87">10.2</text>',
      four: '<rect class="kliper-plan-room" x="8" y="9" width="31" height="34" rx="2"></rect><rect class="kliper-plan-room" x="41" y="9" width="27" height="34" rx="2"></rect><rect class="kliper-plan-room" x="70" y="9" width="26" height="34" rx="2"></rect><rect class="kliper-plan-room" x="8" y="46" width="38" height="48" rx="2"></rect><rect class="kliper-plan-room" x="48" y="46" width="48" height="22" rx="2"></rect><rect class="kliper-plan-room kliper-plan-wet" x="48" y="70" width="48" height="24" rx="2"></rect><path class="kliper-plan-wall" d="M6 7h92v89H6zM40 7v38M69 7v38M6 45h92M47 45v51M47 69h51"></path><path class="kliper-plan-thin" d="M15 20h16v12H15zM47 19h14v13H47zM76 18h13v15H76zM17 59h20v22H17zM57 53h25v10H57zM58 77h28v10H58z"></path><text class="kliper-plan-label" x="17" y="39">10.4</text><text class="kliper-plan-label" x="53" y="39">9.2</text><text class="kliper-plan-label" x="75" y="39">8.8</text>'
    };
    return '<svg class="kliper-plan-svg' + (large ? ' kliper-plan-svg--large' : '') + '" viewBox="0 0 120 100" aria-hidden="true">' +
      '<rect class="kliper-plan-bg" x="0" y="0" width="120" height="100" rx="12"></rect>' +
      '<g transform="translate(10 3)">' + (layouts[type] || layouts.studio) + '</g>' +
      '<circle class="kliper-plan-accent" cx="87" cy="64" r="11"></circle>' +
      '<text class="kliper-plan-badge-text" x="87" y="68" text-anchor="middle">' + badge + '</text>' +
      '<text class="kliper-plan-area-label" x="87" y="84" text-anchor="middle">' + escapeHtml(planMeta.area || '') + '</text>' +
      '</svg>';
  }

  function planMedia(plan, large) {
    if (plan && plan.image) {
      return '<img class="kliper-plan-image' + (large ? ' kliper-plan-image--large' : '') + '" src="' + escapeHtml(plan.image) + '" alt="Планировка ' + escapeHtml(plan.title) + '" loading="lazy">';
    }

    return planSvg(plan.type, plan, large);
  }

  function storyImage(url) {
    return String(url || '').replace('w=180', 'w=1100').replace('q=80', 'q=86');
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderHouseFilter() {
    return '<div class="kliper-house-filter" role="tablist" aria-label="Выбор дома">' +
      houses.map(function (house, index) {
        var activeClass = index === activeHouse ? ' is-active' : '';
        return '<button class="kliper-house-chip' + activeClass + '" type="button" data-house-index="' + index + '" role="tab" aria-selected="' + (index === activeHouse ? 'true' : 'false') + '">' +
          '<span class="kliper-house-chip__story" data-house-story="' + index + '" style="background-image:url(\'' + house.image + '\')" aria-label="Открыть историю ' + escapeHtml(house.name) + '"></span>' +
          '<span class="kliper-house-chip__text">' +
            '<strong>' + escapeHtml(house.name) + '</strong>' +
            '<small>' + escapeHtml(house.object) + '</small>' +
          '</span>' +
        '</button>';
      }).join('') +
    '</div>';
  }

  function renderPlansGrid() {
    var house = houses[activeHouse] || houses[0];
    return house.plans.map(function (plan, index) {
      return '<article class="kliper-object-plan-card" role="button" tabindex="0" data-plan-index="' + index + '" aria-label="Открыть планировку ' + escapeHtml(plan.title) + ' крупно">' +
            '<div class="kliper-object-plan-card__media">' + planMedia(plan, false) + '<span class="kliper-object-plan-card__zoom">Увеличить</span></div>' +
            '<div class="kliper-object-plan-card__body">' +
              '<h3>' + escapeHtml(plan.title) + '</h3>' +
              '<p class="kliper-object-plan-card__area">' + escapeHtml(plan.area) + '</p>' +
              '<p class="kliper-object-plan-card__price">' + escapeHtml(plan.price) + '</p>' +
              '<p class="kliper-object-plan-card__note">' + escapeHtml(plan.note) + '</p>' +
              '<p class="kliper-object-plan-card__status">Планировки доступны</p>' +
            '</div>' +
          '</article>';
    }).join('');
  }

  function updatePlansBlock(section) {
    var grid = section.querySelector('.kliper-object-plans__grid');
    var filter = section.querySelector('.kliper-house-filter');
    var subtitle = section.querySelector('.kliper-object-plans__head p');
    if (grid) grid.innerHTML = renderPlansGrid();
    if (filter) filter.outerHTML = renderHouseFilter();
    if (subtitle) subtitle.textContent = houses[activeHouse].object + ' · ' + houses[activeHouse].status;
    section.setAttribute('data-active-house', houses[activeHouse].name);
  }

  function createBlock() {
    var section = document.createElement('section');
    section.className = 'kliper-object-plans';
    section.setAttribute('data-active-house', houses[activeHouse].name);
    section.innerHTML =
      '<div class="kliper-object-plans__head">' +
        '<div>' +
          '<h2>Проекты квартир и цены</h2>' +
          '<p>' + escapeHtml(houses[activeHouse].object) + ' · ' + escapeHtml(houses[activeHouse].status) + '</p>' +
        '</div>' +
        '<button type="button">Смотреть на сайте ЖК</button>' +
      '</div>' +
      renderHouseFilter() +
      '<div class="kliper-object-plans__grid">' +
        renderPlansGrid() +
      '</div>';
    section.addEventListener('click', handlePlansClick);
    section.addEventListener('keydown', handlePlansKeydown);
    return section;
  }

  function showHouseStory(house) {
    var oldStory = document.querySelector('.kliper-house-story');
    if (oldStory) oldStory.remove();

    var story = document.createElement('div');
    story.className = 'kliper-house-story';
    story.innerHTML =
      '<button class="kliper-house-story__backdrop" type="button" aria-label="Закрыть историю"></button>' +
      '<article class="kliper-house-story__card" style="background-image:url(\'' + storyImage(house.image) + '\')">' +
        '<div class="kliper-house-story__progress" aria-hidden="true"><span></span><span></span><span></span></div>' +
        '<button class="kliper-house-story__close" type="button" aria-label="Закрыть">×</button>' +
        '<div class="kliper-house-story__head">' +
          '<span class="kliper-house-story__logo" style="background-image:url(\'' + house.image + '\')"></span>' +
          '<span><strong>' + escapeHtml(house.name) + '</strong><small>' + escapeHtml(house.object) + '</small></span>' +
        '</div>' +
        '<button class="kliper-house-story__next" type="button" aria-label="Следующая история">›</button>' +
        '<div class="kliper-house-story__body">' +
          '<p>Дом проекта</p>' +
          '<h3>' + escapeHtml(house.object) + '</h3>' +
          '<span>' + escapeHtml(house.status) + ' · ' + house.plans.length + ' типа планировок</span>' +
        '</div>' +
      '</article>';
    document.body.appendChild(story);

    story.addEventListener('click', function (event) {
      if (event.target.closest('.kliper-house-story__close') || event.target.closest('.kliper-house-story__backdrop')) {
        story.remove();
      }
    });
  }

  function showPlanModal(plan) {
    if (!plan) return;

    var oldModal = document.querySelector('.kliper-plan-modal');
    if (oldModal) oldModal.remove();

    function closeModal() {
      modal.remove();
      document.body.classList.remove('kliper-plan-modal-open');
      document.removeEventListener('keydown', handleModalKeydown);
    }

    function handleModalKeydown(event) {
      if (event.key === 'Escape') {
        closeModal();
      }
    }

    var modal = document.createElement('div');
    modal.className = 'kliper-plan-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Просмотр планировки ' + plan.title);
    modal.innerHTML =
      '<button class="kliper-plan-modal__backdrop" type="button" aria-label="Закрыть планировку"></button>' +
      '<article class="kliper-plan-modal__card">' +
        '<button class="kliper-plan-modal__close" type="button" aria-label="Закрыть">×</button>' +
        '<div class="kliper-plan-modal__media">' + planMedia(plan, true) + '</div>' +
        '<div class="kliper-plan-modal__body">' +
          '<div>' +
            '<span>Планировка</span>' +
            '<h3>' + escapeHtml(plan.title) + '</h3>' +
          '</div>' +
          '<p>' + escapeHtml(plan.area) + ' · ' + escapeHtml(plan.price) + ' ' + escapeHtml(plan.note) + '</p>' +
        '</div>' +
      '</article>';
    document.body.appendChild(modal);
    document.body.classList.add('kliper-plan-modal-open');
    document.addEventListener('keydown', handleModalKeydown);

    modal.addEventListener('click', function (event) {
      if (event.target.closest('.kliper-plan-modal__close') || event.target.closest('.kliper-plan-modal__backdrop')) {
        closeModal();
      }
    });

    var closeButton = modal.querySelector('.kliper-plan-modal__close');
    if (closeButton) closeButton.focus();
  }

  function handlePlansClick(event) {
    var handledTap = event.target.closest('.kliper-house-filter[data-tap-handled="true"]');
    if (handledTap) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    var draggedFilter = event.target.closest('.kliper-house-filter[data-dragged="true"]');
    if (draggedFilter) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    var draggedGrid = event.target.closest('.kliper-object-plans__grid[data-dragged="true"]');
    if (draggedGrid) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    var planCard = event.target.closest('[data-plan-index]');
    if (planCard) {
      event.preventDefault();
      event.stopPropagation();
      var house = houses[activeHouse] || houses[0];
      showPlanModal(house.plans[Number(planCard.getAttribute('data-plan-index'))]);
      return;
    }

    var storyButton = event.target.closest('[data-house-story]');
    if (storyButton) {
      event.stopPropagation();
      showHouseStory(houses[Number(storyButton.getAttribute('data-house-story'))] || houses[0]);
      return;
    }

    var chip = event.target.closest('[data-house-index]');
    if (!chip) return;

    activeHouse = Number(chip.getAttribute('data-house-index')) || 0;
    updatePlansBlock(chip.closest('.kliper-object-plans'));
  }

  function handlePlansKeydown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    var planCard = event.target.closest('[data-plan-index]');
    if (planCard) {
      event.preventDefault();
      var house = houses[activeHouse] || houses[0];
      showPlanModal(house.plans[Number(planCard.getAttribute('data-plan-index'))]);
      return;
    }

    var chip = event.target.closest('[data-house-index]');
    if (!chip) return;

    event.preventDefault();
    activeHouse = Number(chip.getAttribute('data-house-index')) || 0;
    updatePlansBlock(chip.closest('.kliper-object-plans'));
  }

  var dragState = null;
  var dragThreshold = 18;

  function startFilterDrag(event) {
    var filter = event.target.closest('.kliper-house-filter, .kliper-object-plans__grid');
    if (!filter) return;

    dragState = {
      filter: filter,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: filter.scrollLeft,
      moved: false
    };
    filter.classList.add('is-dragging');
    filter.dataset.dragged = 'false';
    if (filter.setPointerCapture) {
      filter.setPointerCapture(event.pointerId);
    }
  }

  function moveFilterDrag(event) {
    if (!dragState) return;

    var delta = event.clientX - dragState.startX;
    var yDelta = event.clientY - dragState.startY;
    if (Math.abs(delta) > dragThreshold && Math.abs(delta) > Math.abs(yDelta)) {
      dragState.moved = true;
      dragState.filter.dataset.dragged = 'true';
      dragState.filter.scrollLeft = dragState.startScrollLeft - delta;
      event.preventDefault();
    }
  }

  function handleHouseTap(event, filter) {
    if (!filter || !filter.classList.contains('kliper-house-filter')) return;

    var target = document.elementFromPoint(event.clientX, event.clientY) || event.target;
    var storyButton = target.closest('[data-house-story]');
    var chip = target.closest('[data-house-index]');

    if (storyButton) {
      showHouseStory(houses[Number(storyButton.getAttribute('data-house-story'))] || houses[0]);
      filter.dataset.tapHandled = 'true';
    } else if (chip) {
      activeHouse = Number(chip.getAttribute('data-house-index')) || 0;
      updatePlansBlock(chip.closest('.kliper-object-plans'));
      filter.dataset.tapHandled = 'true';
    }

    if (filter.dataset.tapHandled === 'true') {
      window.setTimeout(function () {
        filter.dataset.tapHandled = 'false';
      }, 120);
    }
  }

  function stopFilterDrag(event) {
    if (!dragState) return;

    var filter = dragState.filter;
    filter.classList.remove('is-dragging');
    if (dragState.moved) {
      window.setTimeout(function () {
        if (filter.dataset.dragged === 'true') {
          filter.dataset.dragged = 'false';
        }
      }, 80);
    } else {
      filter.dataset.dragged = 'false';
      if (event && event.clientX != null) {
        handleHouseTap(event, filter);
      }
    }
    dragState = null;
  }

  function findStoriesBlock() {
    var headings = Array.prototype.slice.call(document.querySelectorAll('h2,h3'));
    var heading = headings.find(function (node) {
      return node.textContent && node.textContent.trim() === 'Сервисы и stories';
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

  function removePlansBlock() {
    var block = document.querySelector('.kliper-object-plans');
    if (block) block.remove();
  }

  function mountPlansBlock() {
    if (!isResidentialObjectPage()) {
      removePlansBlock();
      return;
    }
    if (document.querySelector('.kliper-object-plans')) return;
    var storiesBlock = findStoriesBlock();
    if (!storiesBlock || !storiesBlock.parentElement) return;
    storiesBlock.parentElement.insertBefore(createBlock(), storiesBlock);
  }

  function scheduleMount() {
    window.requestAnimationFrame(function () {
      mountPlansBlock();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleMount);
  } else {
    scheduleMount();
  }

  window.addEventListener('load', scheduleMount);
  document.addEventListener('click', function () {
    window.setTimeout(scheduleMount, 120);
  }, true);
  document.addEventListener('pointerdown', startFilterDrag, true);
  document.addEventListener('pointermove', moveFilterDrag, { capture: true, passive: false });
  document.addEventListener('pointerup', stopFilterDrag, true);
  document.addEventListener('pointercancel', stopFilterDrag, true);

  var attempts = 0;
  var timer = window.setInterval(function () {
    attempts += 1;
    mountPlansBlock();
    if (document.querySelector('.kliper-object-plans') || attempts > 40) {
      window.clearInterval(timer);
    }
  }, 150);
})();
