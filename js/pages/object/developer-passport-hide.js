(function () {
  var passportTitle = 'ПАСПОРТ ЗАСТРОЙЩИКА';
  var passportHeading = 'ЖК, дома и факты';
  var legacyHeadings = [
    'Короткие презентации',
    'Новости и предложения'
  ];
  var mounted = false;

  function normalize(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function getTitle() {
    return Array.prototype.slice.call(document.querySelectorAll('h1'))
      .map(function (node) { return normalize(node.textContent); })
      .find(Boolean) || '';
  }

  function isDeveloperPage() {
    var title = getTitle();
    if (!title || /^жк\s/i.test(title)) return false;
    var text = normalize(document.body.textContent).toLowerCase();
    return text.indexOf('застройщик') !== -1 ||
      text.indexOf('жк в базе') !== -1 ||
      text.indexOf('объекты застройщика') !== -1;
  }

  function hasPassportText(node) {
    var text = normalize(node && node.textContent).toLowerCase();
    return text.indexOf(passportTitle.toLowerCase()) !== -1 && text.indexOf(passportHeading.toLowerCase()) !== -1;
  }

  function scoreCandidate(node) {
    var rect = node.getBoundingClientRect ? node.getBoundingClientRect() : null;
    var text = normalize(node.textContent);
    return {
      node: node,
      area: rect ? rect.width * rect.height : Number.MAX_SAFE_INTEGER,
      height: rect ? rect.height : 0,
      width: rect ? rect.width : 0,
      textLength: text.length
    };
  }

  function findPassportBlock() {
    var root = document.getElementById('root');
    var marker = Array.prototype.slice.call(document.querySelectorAll('p,span,h2,h3')).find(function (node) {
      return normalize(node.textContent).toLowerCase() === passportTitle.toLowerCase();
    });

    if (marker) {
      var parent = marker.parentElement;
      while (parent && parent !== root && parent !== document.body) {
        var parentText = normalize(parent.textContent).toLowerCase();
        var parentRect = parent.getBoundingClientRect ? parent.getBoundingClientRect() : null;
        if (parentText.indexOf(passportHeading.toLowerCase()) !== -1 &&
            (parentText.indexOf('жк в базе') !== -1 || parentText.indexOf('объекты застройщика') !== -1) &&
            parentRect && parentRect.width > 260 && parentRect.height > 80) {
          return scoreCandidate(parent);
        }
        parent = parent.parentElement;
      }
    }

    var nodes = Array.prototype.slice.call(document.querySelectorAll('section, article, div'));

    return nodes
      .filter(function (node) {
        if (!hasPassportText(node)) return false;
        if (node === root || node === document.body || node === document.documentElement) return false;
        if (node.closest('.kliper-plan-modal, .kliper-gallery-modal, .kliper-map-modal, .kliper-aerial-modal')) return false;
        return true;
      })
      .map(scoreCandidate)
      .filter(function (item) {
        return item.width > 260 && item.height > 80;
      })
      .sort(function (a, b) {
        return a.area - b.area || a.textLength - b.textLength;
      })[0];
  }

  function hideDeveloperPassport() {
    var candidate = findPassportBlock();
    if (!candidate || !candidate.node) return false;

    var changed = false;
    var platformBadge = Array.prototype.slice.call(candidate.node.querySelectorAll('span,button')).find(function (node) {
      return normalize(node.textContent).toLowerCase() === 'единая карточка платформы';
    });
    if (platformBadge && !platformBadge.classList.contains('kliper-developer-passport-control-hidden')) {
      platformBadge.classList.add('kliper-developer-passport-control-hidden');
      changed = true;
    }

    var statsRow = Array.prototype.slice.call(candidate.node.querySelectorAll('div'))
      .filter(function (node) {
        var text = normalize(node.textContent).toLowerCase();
        return text.indexOf('жк в базе') !== -1 &&
          text.indexOf('активно') !== -1 &&
          text.indexOf('сдано в базе') !== -1;
      })
      .map(scoreCandidate)
      .sort(function (a, b) {
        return a.area - b.area || a.textLength - b.textLength;
      })[0];

    if (statsRow && statsRow.node && !statsRow.node.classList.contains('kliper-developer-passport-control-hidden')) {
      statsRow.node.classList.add('kliper-developer-passport-control-hidden');
      changed = true;
    }

    return changed;
  }

  function findBlockByHeading(label) {
    var heading = Array.prototype.slice.call(document.querySelectorAll('h2,h3')).find(function (node) {
      return normalize(node.textContent) === label;
    });
    if (!heading) return null;
    return heading.closest('section[class*="rounded"], div[class*="rounded"]') ||
      heading.closest('section') ||
      heading.parentElement;
  }

  function hideDeveloperLegacyBlocks() {
    if (!isDeveloperPage()) return false;

    var changed = false;
    legacyHeadings.map(findBlockByHeading).filter(Boolean).forEach(function (node) {
      if (node.closest('.kliper-developer-feed, .kliper-developer-section-tabs')) return;
      if (!node.classList.contains('kliper-developer-passport-control-hidden')) {
        node.classList.add('kliper-developer-passport-control-hidden');
        changed = true;
      }
    });

    return changed;
  }

  function scheduleHide() {
    window.requestAnimationFrame(function () {
      hideDeveloperPassport();
      hideDeveloperLegacyBlocks();
    });
  }

  function mountObserver() {
    if (mounted) return;
    mounted = true;
    scheduleHide();

    var root = document.getElementById('root') || document.body;
    var observer = new MutationObserver(function () {
      scheduleHide();
    });
    observer.observe(root, { childList: true, subtree: true });

    window.addEventListener('hashchange', scheduleHide);
    document.addEventListener('click', function () {
      window.setTimeout(scheduleHide, 120);
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountObserver);
  } else {
    mountObserver();
  }
})();
