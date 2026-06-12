(function () {
  var storageKey = 'kliper-theme';
  var darkClass = 'kliper-dark-theme';

  function isDark() {
    return localStorage.getItem(storageKey) === 'dark';
  }

  function applyTheme(dark) {
    document.documentElement.classList.toggle(darkClass, dark);
    if (document.body) {
      document.body.classList.toggle(darkClass, dark);
    }
    var toggle = document.querySelector('.kliper-theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Включить светлую тему' : 'Включить темную тему');
      var iconName = dark ? 'sun' : 'moon';
      if (toggle.dataset.icon !== iconName) {
        toggle.dataset.icon = iconName;
        toggle.innerHTML = dark
          ? '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>'
          : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a6.7 6.7 0 0 0 8.8 8.8 8.2 8.2 0 1 1-8.8-8.8Z"></path></svg>';
      }
    }
  }

  function ensureToggle() {
    var profileButton = document.querySelector('button[aria-label="Моя страница"]');
    if (!profileButton || document.querySelector('.kliper-theme-toggle')) {
      applyTheme(isDark());
      return;
    }

    var notificationButton = document.querySelector('button[aria-label="Уведомления"]');
    if (notificationButton) {
      notificationButton.classList.add('kliper-notification-hidden');
      notificationButton.setAttribute('aria-hidden', 'true');
      notificationButton.tabIndex = -1;
    }

    var toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'kliper-theme-toggle';
    toggle.addEventListener('click', function () {
      var next = !isDark();
      localStorage.setItem(storageKey, next ? 'dark' : 'light');
      applyTheme(next);
    });

    profileButton.insertAdjacentElement('beforebegin', toggle);
    applyTheme(isDark());
  }

  applyTheme(isDark());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureToggle);
  } else {
    ensureToggle();
  }

  var attempts = 0;
  var retryTimer = setInterval(function () {
    attempts += 1;
    ensureToggle();
    if (document.querySelector('.kliper-theme-toggle') || attempts > 40) {
      clearInterval(retryTimer);
    }
  }, 125);
})();
