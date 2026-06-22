(function () {
  'use strict';

  var VIEWS = {
    developers: 'developers',
    novostroyki: 'novostroyki',
    gotovye: 'gotovye',
    business: 'business'
  };

  var VIEW_LABELS = {
    developers: 'Застройщики',
    novostroyki: 'Новостройки',
    gotovye: 'Готовые ЖК',
    business: 'Для бизнеса'
  };

  function getView() {
    var hash = window.location.hash || '';
    var match = hash.match(/view=([a-z]+)/);
    if (match && VIEWS[match[1]]) return match[1];
    return 'developers';
  }

  function setView(view) {
    window.location.hash = 'view=' + view;
  }

  function render() {
    var view = getView();

    // Update pill active states — desktop
    var pills = document.querySelectorAll('.kliper-pill[data-view]');
    for (var i = 0; i < pills.length; i++) {
      if (pills[i].getAttribute('data-view') === view) {
        pills[i].classList.add('active');
      } else {
        pills[i].classList.remove('active');
      }
    }

    // Update pill active states — mobile
    var mobPills = document.querySelectorAll('.kliper-mob-pill[data-view]');
    for (var j = 0; j < mobPills.length; j++) {
      if (mobPills[j].getAttribute('data-view') === view) {
        mobPills[j].classList.add('active');
      } else {
        mobPills[j].classList.remove('active');
      }
    }

    // Render content
    var R = window.KLIPER_RENDER || {};
    if (view === 'developers' && R.developers) {
      R.developers('kliper-cards');
    } else if (view === 'novostroyki' && R.buildings) {
      R.buildings('kliper-cards', 'novostroyki');
    } else if (view === 'gotovye' && R.buildings) {
      R.buildings('kliper-cards', 'gotovye');
    } else if (view === 'business' && R.buildings) {
      R.buildings('kliper-cards', 'business');
    } else if (R.developers) {
      R.developers('kliper-cards');
    }
  }

  // Bind pill clicks
  function bindPills() {
    document.addEventListener('click', function (e) {
      var pill = e.target.closest('[data-view]');
      if (pill) {
        e.preventDefault();
        setView(pill.getAttribute('data-view'));
      }
    });
  }

  window.addEventListener('hashchange', render);

  function init() {
    bindPills();
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.KLIPER_ROUTER = {
    getView: getView,
    setView: setView,
    render: render,
    VIEWS: VIEWS,
    VIEW_LABELS: VIEW_LABELS
  };
})();
