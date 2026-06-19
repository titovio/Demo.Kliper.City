(function () {
  var timer = 0;

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function findReviewCard(heading) {
    var node = heading;
    for (var i = 0; i < 7 && node; i += 1) {
      var buttons = Array.prototype.slice.call(node.querySelectorAll('button')).map(function (button) {
        return normalize(button.textContent);
      });
      if (buttons.indexOf('Все рекомендации') !== -1 || buttons.indexOf('Все рецензии') !== -1) {
        return node;
      }
      node = node.parentElement;
    }
    return heading.parentElement;
  }

  function findReviewsList(card, heading) {
    var header = heading.parentElement;
    if (header && header.parentElement === card && header.nextElementSibling) {
      return header.nextElementSibling;
    }
    return heading.nextElementSibling;
  }

  function polishReviews() {
    var heading = Array.prototype.slice.call(document.querySelectorAll('h3')).find(function (node) {
      return normalize(node.textContent) === 'Почему советуют';
    });
    if (!heading) return;

    var card = findReviewCard(heading);
    if (!card) return;
    if (heading.parentElement && heading.parentElement !== card) {
      heading.parentElement.classList.remove('kliper-developer-reviews-card');
    }
    card.classList.add('kliper-developer-reviews-card');

    var label = Array.prototype.slice.call(card.children).find(function (node) {
      return normalize(node.textContent) === 'Рецензии';
    });
    if (label) label.classList.add('kliper-developer-reviews-card__label');

    var star = card.querySelector('svg.lucide-star');
    if (star) star.classList.add('kliper-developer-reviews-card__star');

    var list = findReviewsList(card, heading);
    if (!list) return;
    list.classList.add('kliper-developer-reviews-card__list');

    Array.prototype.forEach.call(list.children, function (review, index) {
      review.classList.add('kliper-developer-review');
      review.classList.toggle('is-green', index % 2 === 1);

      if (!review.querySelector('.kliper-developer-review__avatar')) {
        var avatar = document.createElement('span');
        avatar.className = 'kliper-developer-review__avatar';
        avatar.setAttribute('aria-hidden', 'true');
        review.insertAdjacentElement('afterbegin', avatar);
      }

      var head = review.querySelector('div');
      if (head) {
        head.classList.add('kliper-developer-review__head');
        var name = head.querySelector('p');
        var tone = head.querySelector('span');
        if (name) name.classList.add('kliper-developer-review__name');
        if (tone) tone.classList.add('kliper-developer-review__tone');
      }

      Array.prototype.forEach.call(review.children, function (node) {
        if (node.tagName === 'P') node.classList.add('kliper-developer-review__text');
      });
    });

    var button = Array.prototype.slice.call(card.querySelectorAll('button')).find(function (node) {
      var label = normalize(node.textContent);
      return label === 'Все рецензии' || label === 'Все рекомендации';
    });
    if (button) button.classList.add('kliper-developer-reviews-card__button');
  }

  function schedule() {
    window.clearTimeout(timer);
    timer = window.setTimeout(polishReviews, 60);
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
