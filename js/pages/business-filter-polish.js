/*
  Перестраивает фильтр «Для бизнеса» в горизонтальную полосу
  dropdown-кнопок, как у Новостроек.
*/
(function businessFilterPolish() {
  'use strict';

  var DONE_ATTR = 'data-kliper-biz-polished';

  function polishFilter() {
    var sections = document.querySelectorAll('section');
    var filterSection = null;
    for (var i = 0; i < sections.length; i++) {
      var s = sections[i];
      if (s.className.indexOf('z-30') !== -1 &&
          s.textContent.indexOf('Формат бизнеса') !== -1 &&
          !s.getAttribute(DONE_ATTR)) {
        filterSection = s;
        break;
      }
    }
    if (!filterSection) return;
    filterSection.setAttribute(DONE_ATTR, '1');

    var rows = filterSection.children;
    if (rows.length < 4) return;

    // Row 0: Где (location buttons)
    // Row 1: Формат бизнеса (type pills)
    // Row 2: Sub-tags (Офисы, Парковка...)
    // Row 3: Параметры (Сделка, Площадь, Бюджет)

    // Restyle: flatten all rows into a single flex-wrap row
    filterSection.style.cssText = 'display:flex; flex-wrap:wrap; align-items:center; gap:8px; padding:14px 18px;';

    for (var r = 0; r < rows.length; r++) {
      var row = rows[r];
      row.style.cssText = 'display:contents;';

      // Hide row labels (Где, Формат бизнеса, Параметры)
      var labels = row.querySelectorAll('p, span');
      for (var l = 0; l < labels.length; l++) {
        var text = labels[l].textContent.trim();
        if (text === 'Где' || text === 'Формат бизнеса' || text === 'Параметры') {
          labels[l].style.display = 'none';
        }
      }

      // Restyle inner grid/flex containers
      var innerContainers = row.querySelectorAll('div');
      for (var c = 0; c < innerContainers.length; c++) {
        var container = innerContainers[c];
        if (container.parentElement === row) {
          container.style.cssText = 'display:flex; flex-wrap:wrap; gap:6px; align-items:center;';
        }
      }
    }

    // Style all buttons uniformly as dropdown-style pills
    var allBtns = filterSection.querySelectorAll('button');
    for (var b = 0; b < allBtns.length; b++) {
      var btn = allBtns[b];
      var isActive = btn.className.indexOf('bg-violet') !== -1;
      var isDark = btn.className.indexOf('bg-slate-900') !== -1 || btn.textContent.trim() === 'На карте';
      var isDropdown = btn.className.indexOf('justify-between') !== -1;

      if (isDark) {
        btn.style.cssText = 'display:inline-flex; align-items:center; gap:6px; padding:8px 14px; border-radius:12px; font-size:13px; font-weight:800; background:#1e293b; color:#fff; border:1px solid rgba(255,255,255,0.1); white-space:nowrap; cursor:pointer; transition:all 0.2s; height:40px;';
      } else if (isDropdown) {
        btn.style.cssText = 'display:inline-flex; align-items:center; justify-content:space-between; gap:6px; padding:8px 14px; border-radius:12px; font-size:13px; font-weight:800; background:#fff; color:#334155; border:1px solid #e2e8f0; white-space:nowrap; cursor:pointer; transition:all 0.2s; height:40px; min-width:120px;';
      } else if (isActive) {
        btn.style.cssText = 'display:inline-flex; align-items:center; padding:8px 14px; border-radius:12px; font-size:13px; font-weight:800; background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; border:none; white-space:nowrap; cursor:pointer; transition:all 0.2s; height:40px;';
      } else {
        btn.style.cssText = 'display:inline-flex; align-items:center; padding:8px 14px; border-radius:12px; font-size:13px; font-weight:800; background:#fff; color:#334155; border:1px solid #e2e8f0; white-space:nowrap; cursor:pointer; transition:all 0.2s; height:40px;';
      }
    }
  }

  function schedule() {
    setTimeout(polishFilter, 100);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }

  new MutationObserver(function () {
    schedule();
  }).observe(document.documentElement, { childList: true, subtree: true });
})();
