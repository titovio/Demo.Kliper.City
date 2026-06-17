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
    var text = normalize(node && node.textContent);
    return text.indexOf(passportTitle) !== -1 && text.indexOf(passportHeading) !== -1;
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
        return item.width > 260 && item.height > 80 && item.textLength < 1200;
      })
      .sort(function (a, b) {
        return a.textLength - b.textLength || a.area - b.area;
      })[0];
  }

  function hideDeveloperPassport() {
    var candidate = findPassportBlock();
    if (!candidate || !candidate.node) return false;
    candidate.node.remove();
    return true;
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

  function removeDeveloperLegacyBlocks() {
    if (!isDeveloperPage()) return false;

    var removed = false;
    legacyHeadings.map(findBlockByHeading).filter(Boolean).forEach(function (node) {
      if (node.closest('.kliper-developer-feed, .kliper-developer-section-tabs')) return;
      node.remove();
      removed = true;
    });

    return removed;
  }

  function scheduleHide() {
    window.requestAnimationFrame(function () {
      hideDeveloperPassport();
      removeDeveloperLegacyBlocks();
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
