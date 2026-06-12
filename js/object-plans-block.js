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

  function planSvg(type) {
    var rooms = {
      studio: '<rect x="17" y="16" width="40" height="72"></rect><path d="M17 42h40M38 42v46M17 67h21"></path>',
      one: '<rect x="12" y="14" width="76" height="72"></rect><path d="M12 43h76M45 14v72M45 60h43M25 43v25"></path>',
      two: '<rect x="11" y="13" width="78" height="76"></rect><path d="M11 42h34M45 13v76M45 48h44M66 13v35M66 66h23M25 42v47"></path>',
      three: '<rect x="13" y="13" width="76" height="76"></rect><path d="M13 40h76M42 13v76M42 63h47M65 13v27M65 63v26M24 40v28"></path>',
      four: '<rect x="10" y="12" width="80" height="78"></rect><path d="M10 38h80M10 64h80M38 12v78M63 12v52M63 64v26M24 38v26"></path>'
    };
    return '<svg class="kliper-plan-svg" viewBox="0 0 100 100" aria-hidden="true">' +
      '<g>' + (rooms[type] || rooms.studio) + '</g>' +
      '<path class="kliper-plan-door" d="M57 42c-8 0-14-6-14-14"></path>' +
      '</svg>';
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
    return house.plans.map(function (plan) {
      return '<article class="kliper-object-plan-card">' +
            '<div class="kliper-object-plan-card__media">' + planSvg(plan.type) + '</div>' +
            '<div class="kliper-object-plan-card__body">' +
              '<h3>' + plan.title + '</h3>' +
              '<p class="kliper-object-plan-card__area">' + plan.area + '</p>' +
              '<p class="kliper-object-plan-card__price">' + plan.price + '</p>' +
              '<p class="kliper-object-plan-card__note">' + plan.note + '</p>' +
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
        '<button type="button">Смотреть все планировки</button>' +
      '</div>' +
      renderHouseFilter() +
      '<div class="kliper-object-plans__grid">' +
        renderPlansGrid() +
      '</div>';
    section.addEventListener('click', handlePlansClick);
    return section;
  }

  function showHouseStory(house) {
    var oldStory = document.querySelector('.kliper-house-story');
    if (oldStory) oldStory.remove();

    var story = document.createElement('div');
    story.className = 'kliper-house-story';
    story.innerHTML =
      '<button class="kliper-house-story__backdrop" type="button" aria-label="Закрыть историю"></button>' +
      '<article class="kliper-house-story__card">' +
        '<button class="kliper-house-story__close" type="button" aria-label="Закрыть">×</button>' +
        '<div class="kliper-house-story__media" style="background-image:url(\'' + house.image + '\')">' +
          '<span>' + escapeHtml(house.name) + '</span>' +
        '</div>' +
        '<div class="kliper-house-story__body">' +
          '<p>История дома</p>' +
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

  function handlePlansClick(event) {
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

  function mountPlansBlock() {
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

  var attempts = 0;
  var timer = window.setInterval(function () {
    attempts += 1;
    mountPlansBlock();
    if (document.querySelector('.kliper-object-plans') || attempts > 40) {
      window.clearInterval(timer);
    }
  }, 150);
})();
