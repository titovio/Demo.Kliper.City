(function () {
  'use strict';

  var state = {
    tab: 'today',
    scope: 'yard'
  };

  var tabs = [
    ['today', 'Сегодня'],
    ['feed', 'Лента'],
    ['problems', 'Проблемы'],
    ['polls', 'Опросы'],
    ['lost', 'Находки и потери'],
    ['places', 'Места рядом']
  ];

  var scopes = [
    ['yard', 'Мой двор'],
    ['near', 'Рядом'],
    ['district', 'Район'],
    ['city', 'Город']
  ];

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function icon(label, tone) {
    return '<span class="kliper-yard-icon kliper-yard-icon--' + esc(tone || 'violet') + '">' + esc(label) + '</span>';
  }

  function badge(text, tone) {
    return '<span class="kliper-yard-badge' + (tone ? ' kliper-yard-badge--' + esc(tone) : '') + '">' + esc(text) + '</span>';
  }

  function tabButton(item) {
    return '<button class="kliper-yard-tab' + (state.tab === item[0] ? ' is-active' : '') + '" type="button" data-yard-tab="' + esc(item[0]) + '">' + esc(item[1]) + '</button>';
  }

  function scopeButton(item) {
    return '<button class="kliper-yard-scope__button' + (state.scope === item[0] ? ' is-active' : '') + '" type="button" data-yard-scope="' + esc(item[0]) + '">' + esc(item[1]) + '</button>';
  }

  function sideLine(mark, title, meta, count) {
    return '<div class="kliper-yard-side-line">' +
      '<span>' + esc(mark) + '</span><span>' + esc(title) + (meta ? '<small>' + esc(meta) + '</small>' : '') + '</span><strong>' + esc(count || '') + '</strong>' +
    '</div>';
  }

  function post(author, meta, title, text, mark, status, tone, comments) {
    return '<article class="kliper-yard-post">' +
      '<div class="kliper-yard-avatar">' + esc(mark || 'Ж') + '</div>' +
      '<div>' +
        '<h3>' + esc(title) + '</h3>' +
        '<p><strong>' + esc(author) + '</strong> · ' + esc(meta) + '</p>' +
        (text ? '<p>' + esc(text) + '</p>' : '') +
        '<div class="kliper-yard-meta">' + (status ? badge(status, tone) : '') + '<span>' + esc(comments || '3') + ' ответа</span></div>' +
      '</div>' +
      '<button class="kliper-yard-card__button" type="button">Поддержать</button>' +
    '</article>';
  }

  function stat(mark, title, number, note, tone) {
    return '<div class="kliper-yard-stat">' + icon(mark, tone) + '<div><h3>' + esc(title) + '</h3><strong>' + esc(number) + '</strong><p>' + esc(note) + '</p></div></div>';
  }

  function sideFor(tab) {
    if (tab === 'problems') {
      return '<aside class="kliper-yard-side-stack">' +
        panel('Как работает поддержка?', [
          sideLine('1', 'Сообщите о проблеме', 'Опишите и добавьте фото', ''),
          sideLine('2', 'Собираем поддержку', 'Чем больше соседей, тем выше приоритет', ''),
          sideLine('3', 'Решаем вместе', 'Следим за статусом', '')
        ], 'Подробнее') +
        panel('Топ проблем', [
          sideLine('!', 'Переполнены мусорные баки', '', '27'),
          sideLine('!', 'Не горит освещение', '', '21'),
          sideLine('!', 'Ямы и покрытия', '', '18'),
          sideLine('!', 'Сломанная площадка', '', '16')
        ], 'Смотреть все') +
        panel('Последние решённые', [
          sideLine('✓', 'Починили скамейку у подъезда', '', '2 дня'),
          sideLine('✓', 'Убрали свалку у контейнеров', '', '3 дня'),
          sideLine('✓', 'Отремонтировали освещение', '', '4 дня')
        ], 'Смотреть все') +
      '</aside>';
    }

    if (tab === 'polls') {
      return '<aside class="kliper-yard-side-stack">' +
        panel('Правила опросов', [
          sideLine('•', 'Опросы создаются для улучшения двора', '', ''),
          sideLine('•', 'Запрещены оскорбления и спам', '', ''),
          sideLine('•', 'Результаты могут быть опубликованы', '', '')
        ], 'Подробнее') +
        panel('Скоро завершатся', [
          sideLine('□', 'Нужны ли камеры на парковке?', 'До 28 мая', ''),
          sideLine('□', 'Дополнительное освещение?', 'До 25 мая', ''),
          sideLine('□', 'Оцените чистоту во дворе', 'До 22 мая', '')
        ], 'Смотреть все') +
        panel('Популярные темы', [
          sideLine('•', 'Благоустройство', '', '24'),
          sideLine('•', 'Безопасность', '', '18'),
          sideLine('•', 'Дети и площадки', '', '15')
        ], 'Смотреть все') +
      '</aside>';
    }

    if (tab === 'lost') {
      return '<aside class="kliper-yard-side-stack">' +
        panel('Публикуйте безопасно', [
          sideLine('•', 'Не указывайте квартиру и личные данные', '', ''),
          sideLine('•', 'Контакты откроются через платформу', '', ''),
          sideLine('•', 'Общайтесь только в чате Клипер.Сити', '', '')
        ], 'Подробнее') +
        panel('Потерянные животные', [
          sideLine('кот', 'Кошка Мурка', 'Чёрно-белая, красный ошейник', ''),
          sideLine('пёс', 'Собака Ричи', 'Йоркширский терьер', ''),
          sideLine('кот', 'Кот Барсик', 'Рыжий, пушистый', '')
        ], 'Смотреть все') +
        panel('Недавние находки', [
          sideLine('◌', 'Очки в чёрной оправе', 'Сегодня в 09:12', ''),
          sideLine('◌', 'Зонт складной чёрный', 'Вчера в 20:05', ''),
          sideLine('◌', 'Браслет серебряный', 'Вчера в 18:30', '')
        ], 'Смотреть все') +
      '</aside>';
    }

    if (tab === 'places') {
      return '<aside class="kliper-yard-side-stack">' +
        panel('Рядом по категориям', [
          sideLine('□', 'Магазины', '', '12'),
          sideLine('□', 'Кафе и еда', '', '9'),
          sideLine('□', 'Аптеки', '', '5'),
          sideLine('□', 'Услуги', '', '14'),
          sideLine('□', 'Для детей', '', '7')
        ], 'Смотреть всё') +
        panel('Советуют жители', [
          sideLine('★', 'Surf Coffee', 'Кафе и еда', '48'),
          sideLine('★', 'Пятёрочка', 'Магазины', '42'),
          sideLine('★', 'Аптека №1', 'Аптеки', '38')
        ], 'Смотреть всё') +
        panel('Новые рядом', [
          sideLine('+', 'Пункт выдачи Boxberry', '240 м · открыто', 'новое'),
          sideLine('+', 'Цветочная лавка', '260 м · открыто', 'новое')
        ], 'Смотреть всё') +
      '</aside>';
    }

    return '<aside class="kliper-yard-side-stack">' +
      panel('Как показываются авторы', [
        sideLine('•', 'Жители отображаются безопасно', 'без квартир и подъездов', ''),
        sideLine('•', 'Друзья видны по имени', 'остальные как соседи рядом', ''),
        sideLine('•', 'Контакты скрыты', 'связь через платформу', '')
      ], 'Подробнее') +
      panel(tab === 'feed' ? 'Популярное в ленте' : 'Активные сигналы', [
        sideLine('!', 'Сломан замок на калитке', '', '24'),
        sideLine('!', 'Шумные работы поздно вечером', '', '15'),
        sideLine('✓', 'Субботник во дворе', '', '12')
      ], 'Смотреть всё') +
      panel(tab === 'feed' ? 'Места рядом' : 'Новые рядом', [
        sideLine('□', 'Детская площадка', '', '2 мин'),
        sideLine('□', 'Набережная Речного Порта', '', '5 мин'),
        sideLine('□', 'Продуктовый магазин', '', '7 мин')
      ], 'Смотреть всё') +
    '</aside>';
  }

  function panel(title, lines, link) {
    return '<section class="kliper-yard-panel"><h3>' + esc(title) + '</h3><div class="kliper-yard-side-list">' + lines.join('') + '</div><button class="kliper-yard-link" type="button">' + esc(link || 'Подробнее') + '</button></section>';
  }

  function controls(filters, sort) {
    return '<div class="kliper-yard-row kliper-yard-row--between" style="margin-bottom:14px">' +
      '<div class="kliper-yard-row">' + filters.map(function (item, index) {
        return '<button class="kliper-yard-filter' + (index === 0 ? ' is-active' : '') + '" type="button">' + esc(item) + '</button>';
      }).join('') + '</div>' +
      (sort ? '<button class="kliper-yard-sort" type="button">' + esc(sort) + '</button>' : '') +
    '</div>';
  }

  function todaySection() {
    return '<section class="kliper-yard-section is-active" data-yard-section="today">' +
      '<div class="kliper-yard-today-grid">' +
        todayCard('!', 'Проблема', 'Сломан фонарь у детской площадки', '2 ч назад', '12', 'red') +
        todayCard('□', 'Находка', 'Ключи на связке у лавочек', '1 ч назад', '5', 'green') +
        todayCard('?', 'Опрос', 'Нужен ли шлагбаум во дворе?', '6 ч назад', '28', '') +
        todayCard('□', 'Событие', 'Субботник в нашем дворе', 'Завтра 10:00', '6', '') +
      '</div>' +
      '<div class="kliper-yard-card" style="margin-bottom:12px"><h3>Сообщить во двор</h3><div class="kliper-yard-report-grid" style="margin-top:12px">' +
        action('□', 'Нашёл') + action('?', 'Потерял') + action('!', 'Проблема') + action('i', 'Идея') + action('|', 'Опрос') + action('□', 'Событие') + action('?', 'Вопрос') +
      '</div></div>' +
      '<div class="kliper-yard-feed">' +
        post('Житель двора', '30 мин назад · у детской площадки', 'Сломан фонарь', 'Сегодня утром заметил, что не горит фонарь у детской площадки. Просьба починить.', 'Ж', 'Проблема', 'red', '3') +
        post('Сосед рядом', '1 ч назад · у лавочек', 'Нашёл ключи', 'Нашёл связку ключей с брелоком «Домик». Лежали на скамейке у лавочек.', 'С', 'Находка', 'green', '1') +
        post('Анна', '2 ч назад · рядом с набережной', 'Субботник в эту субботу', 'Давайте вместе сделаем двор чище и уютнее. Приходите в 10:00.', 'А', 'Событие', '', '8') +
      '</div>' +
    '</section>';
  }

  function todayCard(mark, kind, title, time, likes, tone) {
    return '<article class="kliper-yard-card">' + icon(mark, tone) + '<h3 style="margin-top:12px">' + esc(title) + '</h3><div class="kliper-yard-meta">' + badge(kind, tone) + '<span>' + esc(time) + '</span><span>' + esc(likes) + ' реакций</span></div></article>';
  }

  function action(mark, title) {
    return '<button class="kliper-yard-action" type="button">' + icon(mark) + '<span>' + esc(title) + '</span></button>';
  }

  function feedSection() {
    return '<section class="kliper-yard-section is-active" data-yard-section="feed">' +
      '<div class="kliper-yard-card" style="margin-bottom:12px"><h3>Создать запись</h3><div class="kliper-yard-report-grid" style="margin-top:12px">' +
        action('□', 'Нашёл') + action('?', 'Потерял') + action('!', 'Проблема') + action('i', 'Идея') + action('|', 'Опрос') + action('□', 'Событие') + action('?', 'Вопрос') +
      '</div></div>' +
      controls(['Все записи', 'Проблемы', 'Находки и потери', 'Обсуждения', 'События', 'Вопросы', 'Идеи'], 'Сначала новые') +
      '<div class="kliper-yard-feed">' +
        post('Житель двора', '15 мин назад · у детской площадки', 'Сломан замок на калитке', 'Калитка во двор не закрывается. Просьба починить, пока не случилось беды.', 'Ж', '', '', '3') +
        post('Сосед рядом', '1 час назад · у лавочек', 'Видели рыжего кота', 'Рыжий кот с белым пятном на груди. Может, чей-то потерялся?', 'С', '', '', '2') +
        post('Участник района', '2 часа назад · у детской площадки', 'Шумные работы в позднее время', 'Уже вторую ночь после 23:00 шумят на стройке. Дети не могут спать.', 'У', '', '', '5') +
        post('Анна', '3 часа назад · рядом с набережной', 'Субботник во дворе', 'Давайте вместе сделаем наш двор чище и уютнее. Присоединяйтесь в субботу.', 'А', '', '', '8') +
      '</div>' +
    '</section>';
  }

  function problemsSection() {
    return '<section class="kliper-yard-section is-active" data-yard-section="problems">' +
      '<div class="kliper-yard-stats" style="margin-bottom:14px">' +
        stat('!', 'Новых', '6', 'за последние 24 часа', 'red') +
        stat('^', 'Набирают поддержку', '14', 'требуют внимания', 'orange') +
        stat('⏱', 'Давно не решены', '9', 'более 30 дней', 'orange') +
        stat('✓', 'Решено', '18', 'за всё время', 'green') +
      '</div>' +
      controls(['Все', 'Новые', 'Набирают поддержку', 'Решённые'], 'Сначала новые') +
      '<div class="kliper-yard-feed">' +
        problem('Сломана скамейка у детской площадки', 'Детская площадка у дома №14', 'Новая', '2 часа назад', '3', 'red') +
        problem('Яма на тротуаре у входа во двор', 'У входа со стороны ул. Госпаровская', 'Набирает поддержку', '5 часов назад', '7', 'orange') +
        problem('Не горит фонарь у парковки', 'Парковка за домом №12', 'Новая', '6 часов назад', '2', 'red') +
        problem('Переполнены мусорные баки', 'Площадка у дома №16', 'Набирает поддержку', '8 часов назад', '11', 'orange') +
        problem('Повреждено покрытие у подъезда', 'Подъезд 2, дом №10', 'Давно не решено', '3 дня назад', '4', 'orange') +
        problem('Сломана детская горка', 'Детская площадка за домом №18', 'Давно не решено', '5 дней назад', '6', 'orange') +
      '</div>' +
    '</section>';
  }

  function problem(title, place, status, time, comments, tone) {
    return '<article class="kliper-yard-post">' +
      icon(tone === 'red' ? '!' : '^', tone) +
      '<div><h3>' + esc(title) + '</h3><p>' + esc(place) + '</p><div class="kliper-yard-meta">' + badge(status, tone) + '<span>' + esc(time) + '</span><span>' + esc(comments) + ' ответа</span></div></div>' +
      '<div class="kliper-yard-row"><button class="kliper-yard-card__button" type="button">Меня тоже касается</button><button class="kliper-yard-card__button" type="button">Добавить фото</button></div>' +
    '</article>';
  }

  function pollsSection() {
    return '<section class="kliper-yard-section is-active" data-yard-section="polls">' +
      controls(['Создать опрос', 'Благоустройство', 'События во дворе', 'Безопасность', 'Дети и площадки', 'Чистота и порядок', 'Другая тема'], 'Сначала новые') +
      '<div class="kliper-yard-polls">' +
        poll('Нужны ли камеры на парковке?', ['Да, обязательно|54', 'Желательно|28', 'Нет, не нужны|12', 'Затрудняюсь ответить|6'], '126 голосов', 'До 28 мая') +
        poll('Какой праздник провести во дворе летом?', ['День соседей|34', 'Детский праздник|30', 'Кино под открытым небом|24', 'Спортивный день|12'], '98 голосов', 'До 3 июня') +
        poll('Нужна ли зона для выгула собак во дворе?', ['Да, очень нужна|62', 'Скорее да|22', 'Скорее нет|10', 'Нет, не нужна|6'], '153 голоса', 'До 31 мая') +
        poll('Какое озеленение вы хотите видеть во дворе?', ['Больше деревьев|45', 'Кустарники и изгороди|30', 'Цветники и клумбы|15', 'Газоны и лужайки|10'], '112 голосов', 'До 27 мая') +
      '</div>' +
    '</section>';
  }

  function poll(title, rows, votes, date) {
    return '<article class="kliper-yard-poll"><h3>' + esc(title) + '</h3><div class="kliper-yard-poll-options">' +
      rows.map(function (row) {
        var parts = row.split('|');
        return '<div class="kliper-yard-poll-option"><div><span>' + esc(parts[0]) + '</span><div class="kliper-yard-poll-bar"><span style="width:' + esc(parts[1]) + '%"></span></div></div><strong>' + esc(parts[1]) + '%</strong></div>';
      }).join('') +
      '</div><div class="kliper-yard-row kliper-yard-row--between"><p>' + esc(votes) + ' · ' + esc(date) + '</p><button class="kliper-yard-card__button" type="button">Проголосовать</button></div></article>';
  }

  function lostSection() {
    return '<section class="kliper-yard-section is-active" data-yard-section="lost">' +
      '<div class="kliper-yard-hero-grid" style="margin-bottom:14px">' +
        '<article class="kliper-yard-card kliper-yard-card--green">' + icon('□', 'green') + '<h3 style="margin-top:12px">Нашёл вещь</h3><p>Опишите находку, место и время. Мы опубликуем пост безопасно.</p><button class="kliper-yard-card__button" type="button" style="margin-top:12px">Опубликовать находку</button></article>' +
        '<article class="kliper-yard-card kliper-yard-card--red">' + icon('?', 'red') + '<h3 style="margin-top:12px">Потерял вещь</h3><p>Расскажите, что и где потеряли. Мы поможем найти.</p><button class="kliper-yard-card__button" type="button" style="margin-top:12px">Опубликовать потерю</button></article>' +
      '</div>' +
      controls(['Все', 'Найдено', 'Потеряно', 'Животные', 'Вещи', 'Завершено'], 'Сначала новые') +
      '<div class="kliper-yard-feed">' +
        lostItem('Ключ с брелком от машины', 'у детской площадки · сегодня в 11:32', 'Найдено', 'green') +
        lostItem('Школьный рюкзак', 'около входа в магазин · сегодня в 10:15', 'Найдено', 'green') +
        lostItem('Кот в ошейнике', 'во дворе у лавочек · вчера в 22:48', 'Потеряно', 'red') +
        lostItem('Наушники в белом чехле', 'на набережной · вчера в 19:20', 'Найдено', 'green') +
      '</div>' +
    '</section>';
  }

  function lostItem(title, meta, status, tone) {
    return '<article class="kliper-yard-post">' + icon(status === 'Найдено' ? '□' : '?', tone) + '<div><h3>' + esc(title) + '</h3><p>' + esc(meta) + '</p><div class="kliper-yard-meta">' + badge(status, tone) + '<span>Автор скрыт</span></div></div><button class="kliper-yard-card__button" type="button">Открыть</button></article>';
  }

  function placesSection() {
    var img = './assets/districts/tyumen-district-cover.svg';
    return '<section class="kliper-yard-section is-active" data-yard-section="places">' +
      controls(['300 м', '500 м', '1 км', 'Район'], '') +
      controls(['Все', 'Магазины', 'Кафе и еда', 'Аптеки', 'Услуги', 'Для детей', 'Транспорт'], '') +
      '<div class="kliper-yard-places">' +
        place(img, 'Пятёрочка', 'Магазины', 'ул. Госпаровская, 12', '150 м · открыто до 23:00') +
        place(img, 'Surf Coffee', 'Кафе и еда', 'ул. Госпаровская, 9', '180 м · открыто до 22:00') +
        place(img, 'Аптека №1', 'Аптеки', 'ул. Мира, 12', '220 м · открыто до 21:00') +
        place(img, 'Чисто дома', 'Услуги', 'ул. Госпаровская, 15', '240 м · открыто до 20:00') +
        place(img, 'Детская площадка', 'Для детей', 'ул. Госпаровская, 8', '260 м · открыто круглосуточно') +
        place(img, 'Остановка Речной порт', 'Транспорт', 'ул. Госпаровская', '280 м · каждый день') +
      '</div>' +
    '</section>';
  }

  function place(img, title, kind, address, meta) {
    return '<article class="kliper-yard-place"><img src="' + esc(img) + '" alt=""><div><h3>' + esc(title) + '</h3><p>' + esc(kind) + '</p><p>' + esc(address) + '</p><div class="kliper-yard-meta"><span>' + esc(meta) + '</span><span>34 жителя рекомендуют</span></div></div><button class="kliper-yard-card__button" type="button">Открыть карточку</button></article>';
  }

  function bodyFor(tab) {
    if (tab === 'feed') return feedSection();
    if (tab === 'problems') return problemsSection();
    if (tab === 'polls') return pollsSection();
    if (tab === 'lost') return lostSection();
    if (tab === 'places') return placesSection();
    return todaySection();
  }

  function render() {
    return '<div class="kliper-my-yard__head">' +
      '<div><h1 class="kliper-my-yard__title">' + (state.tab === 'places' ? 'Места рядом' : 'Мой двор') + '</h1>' +
        '<p class="kliper-my-yard__place">Двор у Речного порта · Центральный район</p>' +
        '<div class="kliper-my-yard__safe">Публичная зона: не указывайте квартиры, подъезды, коды и личные данные</div></div>' +
      '<div class="kliper-yard-scope" aria-label="Охват">' + scopes.map(scopeButton).join('') + '</div>' +
      '<button class="kliper-yard-boost" type="button"><span class="kliper-yard-boost__icon">◎</span>Расширить охват</button>' +
    '</div>' +
    '<nav class="kliper-yard-tabs" aria-label="Разделы двора">' + tabs.map(tabButton).join('') + '</nav>' +
    '<div class="kliper-yard-layout">' +
      '<main class="kliper-yard-main">' + bodyFor(state.tab) + '</main>' +
      sideFor(state.tab) +
    '</div>';
  }

  function normalizeText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function findOldDistrictSection() {
    var main = document.querySelector('main');
    if (!main) return null;
    var sections = Array.prototype.slice.call(main.children).filter(function (node) {
      return node.tagName === 'SECTION' || node.tagName === 'DIV';
    });
    return sections.find(function (node) {
      if (node.hasAttribute('data-kliper-my-yard-source')) return true;
      var text = normalizeText(node.textContent);
      return (text.indexOf('Лента района') !== -1 && text.indexOf('Карта района') !== -1) ||
        (text.indexOf('Мой район') !== -1 && text.indexOf('Изменить район') !== -1);
    }) || null;
  }

  function mount() {
    var section = findOldDistrictSection();
    if (!section) return;
    var mountNode = Array.prototype.find.call(section.children, function (child) {
      return child.classList && child.classList.contains('kliper-my-yard__mount');
    });
    if (!mountNode) {
      mountNode = document.createElement('div');
      mountNode.className = 'kliper-my-yard__mount';
      mountNode.setAttribute('data-kliper-my-yard-mounted', 'true');
      section.appendChild(mountNode);
    }
    if (mountNode.getAttribute('data-yard-active-tab') === state.tab &&
        mountNode.getAttribute('data-yard-active-scope') === state.scope &&
        section.getAttribute('data-yard-active-tab') === state.tab &&
        section.getAttribute('data-yard-active-scope') === state.scope) {
      return;
    }
    section.setAttribute('data-kliper-my-yard-source', 'true');
    section.setAttribute('data-yard-active-tab', state.tab);
    section.setAttribute('data-yard-active-scope', state.scope);
    section.classList.add('kliper-my-yard', 'kliper-my-yard-source');
    mountNode.setAttribute('data-yard-active-tab', state.tab);
    mountNode.setAttribute('data-yard-active-scope', state.scope);
    mountNode.innerHTML = render();
    Array.prototype.forEach.call(section.children, function (child) {
      if (child === mountNode) return;
      child.setAttribute('aria-hidden', 'true');
      child.setAttribute('inert', '');
    });
  }

  function renameVisibleNavigation() {
    Array.prototype.forEach.call(document.querySelectorAll('button, a, h1'), function (node) {
      if (normalizeText(node.textContent) === 'Мой район') node.textContent = 'Мой двор';
    });
  }

  document.addEventListener('click', function (event) {
    var tabButton = event.target.closest('[data-yard-tab]');
    if (tabButton) {
      state.tab = tabButton.getAttribute('data-yard-tab') || 'today';
      mount();
      return;
    }

    var scopeButton = event.target.closest('[data-yard-scope]');
    if (scopeButton) {
      state.scope = scopeButton.getAttribute('data-yard-scope') || 'yard';
      mount();
    }
  });

  function scheduleMount() {
    window.requestAnimationFrame(function () {
      renameVisibleNavigation();
      mount();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleMount);
  } else {
    scheduleMount();
  }

  var observer = new MutationObserver(function () {
    scheduleMount();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
})();
