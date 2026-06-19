(function () {
  var originalLabels = [
    'Вся информация об объекте',
    'Компании и сервисы внутри дома',
    'Предложения для жителей'
  ];

  var shortLabels = {
    'Вся информация об объекте': 'Об объекте',
    'Компании и сервисы внутри дома': 'Сервисы ЖК',
    'Предложения для жителей': 'Предложения'
  };

  var objectHeroFacts = ['7 домов', 'сдача 2026-2027', 'от 4,5 млн ₽', 'берег Туры', 'комфорт-класс'];
  var subscriberText = 'Персональные условия для будущих покупателей и удобный контроль хода строительства для владельцев квартир.';

  function isObjectPage() {
    var title = Array.prototype.slice.call(document.querySelectorAll('h1')).map(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim();
    }).find(Boolean) || '';
    return title.toLowerCase().indexOf('жк ') === 0;
  }

  function isLargeCardPage() {
    var title = Array.prototype.slice.call(document.querySelectorAll('h1')).map(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim();
    }).find(Boolean) || '';
    if (!title) return false;

    return ['Лента города', 'Лучшее в Тюмени', 'Мой район', 'Каталог', 'Новостройки', 'Застройщики', 'Готовые ЖК'].indexOf(title) === -1;
  }

  function findHeroContainer() {
    var h1 = Array.prototype.slice.call(document.querySelectorAll('h1')).find(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim();
    });
    if (!h1) return null;

    var node = h1;
    var candidates = [];
    while (node && node !== document.body) {
      var rect = node.getBoundingClientRect();
      var className = String(node.className || '');
      if (rect.width > 480 && rect.height > 150 && rect.height < 560 && (className.indexOf('overflow-hidden') !== -1 || className.indexOf('rounded-') !== -1)) {
        candidates.push(node);
      }
      node = node.parentElement;
    }

    candidates.sort(function (a, b) {
      return a.getBoundingClientRect().height - b.getBoundingClientRect().height;
    });
    return candidates[0] || null;
  }

  function standardizeHeroHeight() {
    Array.prototype.slice.call(document.querySelectorAll('.kliper-standard-card-hero')).forEach(function (node) {
      node.classList.remove('kliper-standard-card-hero');
    });

    if (!isLargeCardPage()) return;
    var hero = findHeroContainer();
    if (hero) hero.classList.add('kliper-standard-card-hero');
  }

  function findLabelNode(text) {
    return Array.prototype.slice.call(document.querySelectorAll('p,span')).find(function (node) {
      return (node.textContent || '').replace(/\s+/g, ' ').trim() === text;
    });
  }

  function replaceParagraphText(oldText, newText) {
    var node = Array.prototype.slice.call(document.querySelectorAll('p,span')).find(function (item) {
      return (item.textContent || '').replace(/\s+/g, ' ').trim() === oldText;
    });
    if (node) node.textContent = newText;
    return node;
  }

  function updateObjectHeroText() {
    if (!isObjectPage()) return;

    var summary = Array.prototype.slice.call(document.querySelectorAll('p,span')).find(function (item) {
      var text = (item.textContent || '').replace(/\s+/g, ' ').trim();
      return text === 'Все, что важно для жизни в ЖК Речной Порт: новости объекта, компании и сервисы внутри дома, предложения для жителей, аренда и полезные обновления.' ||
        text.indexOf('Квартал у берега Туры в Центральном районе') !== -1;
    });

    if (!summary) return;
    if (summary.parentElement && summary.parentElement.querySelector('.kliper-object-hero-facts')) return;
    summary.classList.add('kliper-object-hero-summary-hidden');

    var facts = document.createElement('div');
    facts.className = 'kliper-object-hero-facts';
    facts.innerHTML = objectHeroFacts.map(function (fact) {
      return '<span>' + fact + '</span>';
    }).join('');
    summary.insertAdjacentElement('afterend', facts);
  }

  function updateSubscriberText() {
    if (!isObjectPage()) return;
    replaceParagraphText(
      'Компании и сервисы внутри ЖК предлагают специальные условия для подписчиков. Новости и важные обновления — первыми.',
      subscriberText
    );
  }

  function sameGroup(nodes) {
    if (nodes.length !== originalLabels.length) return null;
    var cards = nodes.map(function (node) {
      return node.closest('.flex');
    });
    if (cards.some(function (card) { return !card; })) return null;
    var group = cards[0].parentElement;
    if (!group || !cards.every(function (card) { return card.parentElement === group; })) return null;
    return { group: group, cards: cards };
  }

  function compactHeroActions() {
    standardizeHeroHeight();
    if (!isObjectPage()) return;

    updateObjectHeroText();
    updateSubscriberText();

    var nodes = originalLabels.map(findLabelNode);
    if (nodes.some(function (node) { return !node; })) return;

    var result = sameGroup(nodes);
    if (!result || result.group.classList.contains('kliper-object-hero-actions')) return;

    result.group.classList.add('kliper-object-hero-actions');
    result.cards.forEach(function (card, index) {
      card.classList.add('kliper-object-hero-action');
      nodes[index].classList.add('kliper-object-hero-action__label');
      nodes[index].setAttribute('title', originalLabels[index]);
      nodes[index].textContent = shortLabels[originalLabels[index]];
    });
  }

  function schedule() {
    window.requestAnimationFrame(compactHeroActions);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  window.addEventListener('load', schedule);
  document.addEventListener('click', function () {
    window.setTimeout(schedule, 120);
  }, true);

  var observer = new MutationObserver(function () {
    window.clearTimeout(observer.timer);
    observer.timer = window.setTimeout(schedule, 80);
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
